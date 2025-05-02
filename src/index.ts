import Resolver from '@forge/resolver';
import api, { route } from '@forge/api';

const resolver = new Resolver();

resolver.define('getContext', (req) => {
    console.log('Context:', req.context); 
    return {
      moduleKey: req.context.moduleKey,
      extensionContext: req.context.extension
    };
  });
  
  resolver.define('getAllIssues', async ({ context, payload }) => {
    const { projectKey } = payload;
    if (!projectKey) throw new Error('Missing projectKey in payload');
  
    let startAt = 0;
    const maxResults = 100;
    let allIssues: any[] = [];
  
    try {
      while (true) {
        const res = await api.asApp().requestJira(
          route`/rest/api/3/search?jql=project=${projectKey}&startAt=${startAt}&maxResults=${maxResults}`
        );
        const data = await res.json();
        if (!data.issues) throw new Error('No issues or permission denied.');
        allIssues = allIssues.concat(data.issues);
        if (data.issues.length < maxResults) break;
        startAt += maxResults;
      }
  
      return {
        total: allIssues.length,
        issues: allIssues.map(issue => ({
          key: issue.key,
          summary: issue.fields.summary,
          created: issue.fields.created, 
        })),
      };
    } catch (error) {
      console.error('Error fetching issues:', error);
      throw error;
    }
  });
  
  resolver.define('resolver', async ({ context, payload }) => {
    const { route } = context.extension; 
  
    if (route === '/page1') {
      return { view: 'globalPage1' };
    } else if (route === '/page2') {
      return { view: 'globalPage2' };
    }
  
    return { view: 'globalPage1' }; 
  });
  
export const handler = resolver.getDefinitions();


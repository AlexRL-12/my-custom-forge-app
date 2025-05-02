import React, { useEffect, useState } from 'react';
import { Text } from '@forge/react';
import { invoke, view } from '@forge/bridge';
import '@atlaskit/css-reset';

type Issue = {
  key: string;
  summary: string;
  created: string;
};

const App: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectKey, setProjectKey] = useState<string | null>(null);
  const [jiraHost, setJiraHost] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const pageSize = 5;

  const fetchIssues = (projKey: string, currentPage: number) => {
    setLoading(true);
    invoke<{ issues: Issue[]; total: number }>('getAllIssues', {
      projectKey: projKey,
      page: currentPage,
      pageSize,
    })
      .then((res) => {
        setIssues(res.issues);
        setTotal(res.total);
      })
      .catch((err) => {
        console.error('Error fetching issues:', err);
        setIssues([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    view.getContext().then((context) => {
      const key = context.extension?.project?.key;
      const host = context.siteUrl;
      if (key && host) {
        setProjectKey(key);
        setJiraHost(host);
        fetchIssues(key, 0);
      } else {
        console.error('Missing projectKey or host URL in context');
        setLoading(false);
      }
    });
  }, []);

  const handlePrev = () => {
    if (projectKey && page > 0) {
      const newPage = page - 1;
      setPage(newPage);
      fetchIssues(projectKey, newPage);
    }
  };

  const handleNext = () => {
    if (projectKey && (page + 1) * pageSize < total) {
      const newPage = page + 1;
      setPage(newPage);
      fetchIssues(projectKey, newPage);
    }
  };

  return (
    <>
      <Text>Issues in Project {projectKey ? `(${projectKey})` : ''}:</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : issues.length === 0 ? (
        <Text>No issues to display</Text>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1em' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Issue Key</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Summary</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Created At</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue, index) => (
                <tr key={`row-${index}-${issue.key}`}>
                  <td style={{ padding: '0.5em 0' }}>
                    <a href={`${jiraHost}/browse/${issue.key}`} target="_blank" rel="noopener noreferrer">
                      {issue.key}
                    </a>
                  </td>
                  <td style={{ padding: '0.5em 0' }}>{issue.summary}</td>
                  <td style={{ padding: '0.5em 0' }}>
                    {new Date(issue.created).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '1em', display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={handlePrev} disabled={page === 0}>
              Previous
            </button>
            <Text>
              Page {page + 1} of {Math.ceil(total / pageSize)}
            </Text>
            <button onClick={handleNext} disabled={(page + 1) * pageSize >= total}>
              Next
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default App;

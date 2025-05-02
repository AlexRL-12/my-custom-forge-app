# Forge test App

This project contains a Forge app written in TypeScript and React that displays `page 1 and page 2` in a Jira global page, `1 project page` and `1 admin page`.

See [developer.atlassian.com/platform/forge/](https://developer.atlassian.com/platform/forge) for documentation and tutorials explaining Forge.

## Requirements

See [Set up Forge](https://developer.atlassian.com/platform/forge/set-up-forge/) for instructions to get set up.

## Quick start
- Install top-level dependencies:
```
npm install
```

- Install dependencies (inside of the `static/global-pages` , `static/admin-page` and `static/project-page` directories) --> One by one:
```
npm install
```


## After that:


- Build the app (inside of the `static/global-pages` , `static/admin-page` and `static/project-page` directories) --> One by one:
```
npm run build
```

- Deploy the app by running in root directory `my-custom-forge-app`:
```
forge deploy
```

- Install the app in an Atlassian site by running (in root directory `my-custom-forge-app`):
```
forge install
```

### Notes
- Use the `forge deploy` command when you want to persist code changes.
- Use the `forge install` command when you want to install the app on a new site.
- Once the app is installed on a site, the site picks up the new app changes you deploy without needing to rerun the install command.

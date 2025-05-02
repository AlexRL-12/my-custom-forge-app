// App.tsx
import React from 'react';
import { useRoutes } from 'react-router-dom';
import Page1 from './pages/page1';
import Page2 from './pages/page2';

const App: React.FC = () => {
  const routing = useRoutes([
    { path: '/page-1', element: <Page1 /> },
    { path: '/page-2', element: <Page2 /> },
    { path: '*', element: <Page1 /> },
  ]);

  return <div className="app-container">{routing}</div>;
};

export default App;

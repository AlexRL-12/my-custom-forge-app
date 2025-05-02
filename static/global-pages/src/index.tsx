// index.tsx
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Router } from 'react-router-dom';
import App from './App';
import '@atlaskit/css-reset';
import './App.css';
import { view } from '@forge/bridge';
import type { History } from 'history';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const RootWithHistory: React.FC = () => {
  const [history, setHistory] = useState<History | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let unlisten: () => void;

    view.createHistory().then((forgeHistory) => {
      const typedHistory = forgeHistory as unknown as History;

      // listen() triggers re-render automatically through setReady
      unlisten = typedHistory.listen(() => {
        setReady((prev) => !prev); // trigger re-render when location changes
      });

      setHistory(typedHistory);
      setReady(true);
    });

    return () => {
      if (unlisten) unlisten();
    };
  }, []);

  if (!history) return <div>Loading...</div>;

  return (
    <Router navigator={history} location={history.location}>
      <App />
    </Router>
  );
};

root.render(
  <React.StrictMode>
    <RootWithHistory />
  </React.StrictMode>
);

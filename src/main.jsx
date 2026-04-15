import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import './styles/tokens.css';
import './styles/global.css';

// Minimal pathname-based routing — avoids adding react-router just to
// host a second world. Vite's dev server falls back to index.html for
// unknown routes, so /projects and /projects/ both resolve here.
const path = window.location.pathname.replace(/\/+$/, '');
const isProjects = path === '/projects';

const Root = isProjects ? ProjectsPage : App;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);

import { createRoot } from 'react-dom/client';
import React, { StrictMode } from 'react';
import App from './App';
import './index.css';

// Ensure React is available globally to prevent multiple instances
if (typeof window !== 'undefined') {
  (window as any).__REACT__ = React;
  (window as any).__REACT_DOM__ = { createRoot };
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Root element not found');

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
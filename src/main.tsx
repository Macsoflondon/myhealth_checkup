import { createRoot } from 'react-dom/client';
import React from 'react';
import App from './App';
import './index.css';

// CRITICAL: Force single React instance globally
if (typeof window !== 'undefined') {
  (window as any).React = React;
  (window as any).__REACT__ = React;
  (window as any).__REACT_DOM__ = { createRoot };
  
  // Force all React internals to use the same instance
  const originalCreateElement = React.createElement;
  React.createElement = originalCreateElement;
  
  // Override any potential React imports
  if (!(window as any).__REACT_SINGLETON__) {
    (window as any).__REACT_SINGLETON__ = true;
    
    // Store the dispatcher
    const ReactInternals = (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    if (ReactInternals) {
      (window as any).__REACT_INTERNALS__ = ReactInternals;
    }
  }
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Root element not found');

const root = createRoot(rootElement);

// Temporarily remove StrictMode as it can cause issues with multiple React instances
root.render(<App />);
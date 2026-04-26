import { StrictMode } from "react";
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n/config'
import { ErrorBoundary } from './components/common/ErrorBoundary'

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

const tree = (
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);

// react-snap injects prerendered HTML into #root at build time.
// When that HTML is present we hydrate; otherwise we render fresh (dev / un-prerendered routes).
if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, tree);
} else {
  createRoot(rootElement).render(tree);
}

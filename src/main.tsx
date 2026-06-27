import { StrictMode } from "react";
import { createRoot, hydrateRoot } from 'react-dom/client'
// Brand typography — self-hosted via @fontsource (no render-blocking CDN)
import '@fontsource/montserrat/400.css'
import '@fontsource/montserrat/500.css'
import '@fontsource/montserrat/600.css'
import '@fontsource/montserrat/700.css'
import '@fontsource/montserrat/800.css'
import '@fontsource/dm-sans/400.css'
import '@fontsource/dm-sans/500.css'
import '@fontsource/dm-sans/700.css'
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

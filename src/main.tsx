import { StrictMode } from "react";
import { createRoot } from 'react-dom/client'
import OptimizedApp from './components/OptimizedApp.tsx'
import './index.css'
import './i18n/config'

// Performance measurement
const startTime = performance.now();

// Optimize font loading
const preloadFonts = () => {
  const fontLink = document.createElement('link');
  fontLink.rel = 'preconnect';
  fontLink.href = 'https://fonts.googleapis.com';
  fontLink.crossOrigin = 'anonymous';
  document.head.appendChild(fontLink);

  const fontLink2 = document.createElement('link');
  fontLink2.rel = 'preconnect';
  fontLink2.href = 'https://fonts.gstatic.com';
  fontLink2.crossOrigin = 'anonymous';
  document.head.appendChild(fontLink2);
};

preloadFonts();

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

const root = createRoot(rootElement);

// Add performance observer for app loading
if ('PerformanceObserver' in window) {
  const observer = new PerformanceObserver((list) => {
    const endTime = performance.now();
    console.log(`App initialized in ${endTime - startTime}ms`);
  });
  observer.observe({ entryTypes: ['navigation'] });
}

root.render(
  <StrictMode>
    <OptimizedApp />
  </StrictMode>
);

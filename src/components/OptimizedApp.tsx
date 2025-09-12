import { lazy, Suspense, useEffect } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PWAFeatures } from "@/components/PWAFeatures";
import { usePerformanceOptimization } from "@/hooks/usePerformanceOptimization";
import { useMobileOptimization } from "@/hooks/useMobileOptimization";
import { Loader2 } from "lucide-react";

// Optimized loading component with skeleton
const OptimizedLoadingSpinner = ({ message = "Loading..." }: { message?: string }) => (
  <div className="flex items-center justify-center min-h-screen bg-slate-50">
    <div className="text-center">
      <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-health-primary" />
      <p className="text-muted-foreground text-lg font-medium">{message}</p>
      <div className="mt-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-48 mx-auto"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-32 mx-auto"></div>
      </div>
    </div>
  </div>
);

// Lazy load the main App component for code splitting
const LazyApp = lazy(() => import("@/App"));

export default function OptimizedApp() {
  // Apply performance and mobile optimizations
  usePerformanceOptimization();
  useMobileOptimization();
  
  useEffect(() => {
    // Add critical meta tags for performance and mobile
    const addCriticalMetas = () => {
      // Ensure proper charset
      let charsetMeta = document.querySelector('meta[charset]');
      if (!charsetMeta) {
        charsetMeta = document.createElement('meta');
        charsetMeta.setAttribute('charset', 'utf-8');
        document.head.insertBefore(charsetMeta, document.head.firstChild);
      }

      // Add theme color for mobile browsers
      let themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (!themeColorMeta) {
        themeColorMeta = document.createElement('meta');
        themeColorMeta.setAttribute('name', 'theme-color');
        themeColorMeta.setAttribute('content', '#081129');
        document.head.appendChild(themeColorMeta);
      }

      // Add apple touch icon
      let appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');
      if (!appleTouchIcon) {
        appleTouchIcon = document.createElement('link');
        appleTouchIcon.setAttribute('rel', 'apple-touch-icon');
        appleTouchIcon.setAttribute('href', '/logo.png');
        document.head.appendChild(appleTouchIcon);
      }

      // Add manifest link
      let manifestLink = document.querySelector('link[rel="manifest"]');
      if (!manifestLink) {
        manifestLink = document.createElement('link');
        manifestLink.setAttribute('rel', 'manifest');
        manifestLink.setAttribute('href', '/manifest.json');
        document.head.appendChild(manifestLink);
      }
    };

    addCriticalMetas();

    // Preload critical routes
    const preloadRoutes = () => {
      const criticalRoutes = ['/compare', '/search', '/tests'];
      criticalRoutes.forEach(route => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        document.head.appendChild(link);
      });
    };

    // Delay non-critical preloads
    setTimeout(preloadRoutes, 2000);
  }, []);

  return (
    <ErrorBoundary>
      <PWAFeatures />
      <Suspense fallback={<OptimizedLoadingSpinner message="Loading myhealthcheckup..." />}>
        <LazyApp />
      </Suspense>
    </ErrorBoundary>
  );
}
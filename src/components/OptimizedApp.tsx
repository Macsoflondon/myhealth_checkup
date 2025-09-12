import { lazy, Suspense, useEffect } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PWAFeatures } from "@/components/PWAFeatures";
import { useAdvancedPerformance } from "@/hooks/useAdvancedPerformance";
import { useMobileOptimization } from "@/hooks/useMobileOptimization";
import { Loader2 } from "lucide-react";

// Optimized loading component with skeleton
const OptimizedLoadingSpinner = ({ message = "Loading..." }: { message?: string }) => (
  <div className="flex items-center justify-center min-h-screen bg-slate-50">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-health-primary" />
      <p className="text-muted-foreground text-base font-medium">{message}</p>
      <div className="mt-4 space-y-2">
        <div className="h-3 bg-gray-200 rounded animate-pulse w-32 mx-auto"></div>
        <div className="h-3 bg-gray-200 rounded animate-pulse w-24 mx-auto"></div>
      </div>
    </div>
  </div>
);

// Lazy load the main App component for code splitting
const LazyApp = lazy(() => import("@/App"));

export default function OptimizedApp() {
  // Apply advanced performance and mobile optimizations
  const { getPerformanceMetrics } = useAdvancedPerformance();
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
        themeColorMeta.setAttribute('content', '#e70d69');
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

    // Preload critical routes with throttling
    const preloadRoutes = () => {
      // Only preload if not on slow connection
      const connection = (navigator as any)?.connection;
      if (connection && ['slow-2g', '2g'].includes(connection.effectiveType)) {
        return;
      }

      const criticalRoutes = ['/compare', '/search', '/mens-health', '/womens-health'];
      criticalRoutes.forEach((route, index) => {
        setTimeout(() => {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = route;
          document.head.appendChild(link);
        }, index * 500);
      });
    };

    // Delay non-critical preloads based on page load
    const timeout = window.innerWidth <= 768 ? 3000 : 2000;
    setTimeout(preloadRoutes, timeout);

    // Log performance metrics after app loads
    setTimeout(() => {
      const metrics = getPerformanceMetrics();
      if (Object.keys(metrics).length > 0) {
        console.log('Performance Metrics:', metrics);
      }
    }, 5000);
  }, [getPerformanceMetrics]);

  return (
    <ErrorBoundary>
      <PWAFeatures />
      <Suspense fallback={<OptimizedLoadingSpinner message="Loading My Health Checkup..." />}>
        <LazyApp />
      </Suspense>
    </ErrorBoundary>
  );
}
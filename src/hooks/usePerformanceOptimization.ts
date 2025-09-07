import { useEffect, useCallback } from "react";

// Performance optimization hook
export function usePerformanceOptimization() {
  
  // Preload critical resources
  const preloadCriticalResources = useCallback(() => {
    // Preload critical images
    const criticalImages = [
      '/lovable-uploads/b3d139bc-e5b4-4c1e-ab5f-fc110e1d2ed5.png',
      '/lovable-uploads/8ac32e6c-38cb-4fbc-a56b-b3f36b7b8d57.png'
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });

    // Preload critical fonts
    const criticalFonts = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
    ];

    criticalFonts.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = href;
      document.head.appendChild(link);
    });
  }, []);

  // Optimize viewport meta tag
  const optimizeViewport = useCallback(() => {
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.setAttribute('name', 'viewport');
      document.head.appendChild(viewportMeta);
    }
    viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes');
  }, []);

  // Add performance observer for Core Web Vitals
  const observePerformance = useCallback(() => {
    if ('PerformanceObserver' in window) {
      try {
        // Observe LCP
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            console.log('LCP:', lastEntry.startTime);
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // Observe FID
        const fidObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach(entry => {
            const fidEntry = entry as any; // Type assertion for FID entry
            console.log('FID:', fidEntry.processingStart - fidEntry.startTime);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Observe CLS
        const clsObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach(entry => {
            const clsEntry = entry as any; // Type assertion for CLS entry
            if (!clsEntry.hadRecentInput) {
              console.log('CLS:', clsEntry.value);
            }
          });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        console.warn('Performance Observer not supported:', error);
      }
    }
  }, []);

  // Clean up unused resources
  const cleanupResources = useCallback(() => {
    return () => {
      // Clear any cached data older than 10 minutes
      if (typeof Storage !== 'undefined') {
        const now = Date.now();
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith('cache_')) {
            try {
              const item = JSON.parse(localStorage.getItem(key) || '{}');
              if (item.timestamp && now - item.timestamp > 10 * 60 * 1000) {
                localStorage.removeItem(key);
              }
            } catch (error) {
              localStorage.removeItem(key!);
            }
          }
        }
      }
    };
  }, []);

  useEffect(() => {
    preloadCriticalResources();
    optimizeViewport();
    observePerformance();
    
    const cleanup = cleanupResources();
    return cleanup;
  }, [preloadCriticalResources, optimizeViewport, observePerformance, cleanupResources]);
}
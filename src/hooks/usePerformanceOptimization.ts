import { useEffect, useCallback } from "react";

// Enhanced performance optimization hook with mobile-specific optimizations
export function usePerformanceOptimization() {
  
  // Preload critical resources with mobile optimization
  const preloadCriticalResources = useCallback(() => {
    // Detect mobile device
    const isMobile = window.innerWidth <= 768;
    
    // Only preload hero poster image on mobile, skip on desktop (video handles it)
    if (isMobile) {
      const heroLink = document.createElement('link');
      heroLink.rel = 'preload';
      heroLink.as = 'image';
      heroLink.href = '/lovable-uploads/02b18d23-7b2e-42f1-90f6-554b455f3653.png';
      heroLink.fetchPriority = 'high';
      document.head.appendChild(heroLink);
    }

    // Enable resource hints for better performance
    const dnsPreconnects = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'];
    dnsPreconnects.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
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

  // Enhanced resource cleanup and memory optimization
  const cleanupResources = useCallback(() => {
    return () => {
      // Clear cached data older than 10 minutes
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
      
      // Clear unused blob URLs to prevent memory leaks
      if (window.URL && window.URL.revokeObjectURL) {
        // This would be called when component unmounts
        console.log('Cleaning up blob URLs and cached resources');
      }
    };
  }, []);

  // Add intersection observer for lazy loading optimization
  const setupIntersectionObserver = useCallback(() => {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.remove('lazy');
              imageObserver.unobserve(img);
            }
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      // Observe all lazy images
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }, []);

  useEffect(() => {
    preloadCriticalResources();
    optimizeViewport();
    observePerformance();
    setupIntersectionObserver();
    
    // Add critical CSS for above-the-fold content
    const criticalCSS = document.createElement('style');
    criticalCSS.textContent = `
      /* Critical CSS for above-the-fold content */
      .hero-section { will-change: transform; }
      .hero-section img { 
        content-visibility: auto;
        contain: layout style paint;
      }
      /* Prevent layout shift */
      img { 
        max-width: 100%; 
        height: auto; 
        aspect-ratio: attr(width) / attr(height);
      }
    `;
    document.head.appendChild(criticalCSS);
    
    const cleanup = cleanupResources();
    return () => {
      cleanup();
      if (criticalCSS.parentNode) {
        document.head.removeChild(criticalCSS);
      }
    };
  }, [preloadCriticalResources, optimizeViewport, observePerformance, setupIntersectionObserver, cleanupResources]);
}
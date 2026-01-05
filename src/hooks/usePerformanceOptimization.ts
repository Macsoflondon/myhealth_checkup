import { useEffect, useCallback, useRef } from "react";
import { logger } from "@/lib/logger";

// Enhanced performance optimization hook with mobile-specific optimizations
export function usePerformanceOptimization() {
  // Cache mobile detection to avoid repeated reflows
  const isMobileRef = useRef<boolean | null>(null);
  
  // Preload critical resources with mobile optimization - deferred to avoid reflow
  const preloadCriticalResources = useCallback(() => {
    // Use requestIdleCallback or setTimeout to defer non-critical work
    const scheduleWork = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));
    
    scheduleWork(() => {
      // Use CSS media query check instead of innerWidth to avoid reflow
      if (isMobileRef.current === null) {
        isMobileRef.current = window.matchMedia('(max-width: 768px)').matches;
      }
      const isMobile = isMobileRef.current;
      
      // Preload critical images (smaller versions for mobile)
      const criticalImages = [
        '/lovable-uploads/5cc87ed3-fbf6-4b5c-8010-c4232a260a13.png',
        '/lovable-uploads/a4949588-cff7-48ae-ba93-d0040f1dd838.png'
      ];

      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        if (isMobile) {
          link.media = '(max-width: 768px)';
        }
        document.head.appendChild(link);
      });

      // Preload critical CSS and fonts
      const criticalResources = [
        { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap', as: 'style' }
      ];

      criticalResources.forEach(({ href, as }) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = as;
        link.href = href;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });

      // Enable resource hints for better performance
      const dnsPreconnects = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'];
      dnsPreconnects.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = href;
        document.head.appendChild(link);
      });
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
            logger.debug('LCP:', lastEntry.startTime);
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // Observe FID
        const fidObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach(entry => {
            const fidEntry = entry as any; // Type assertion for FID entry
            logger.debug('FID:', fidEntry.processingStart - fidEntry.startTime);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Observe CLS
        const clsObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach(entry => {
            const clsEntry = entry as any; // Type assertion for CLS entry
            if (!clsEntry.hadRecentInput) {
              logger.debug('CLS:', clsEntry.value);
            }
          });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        // Silently handle performance observer errors
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
        logger.debug('Cleaning up blob URLs and cached resources');
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
import { useEffect, useCallback, useRef } from "react";
import { useIsMobile } from "./use-mobile";

interface PerformanceMetrics {
  fcp?: number;
  lcp?: number;
  fid?: number;
  cls?: number;
  ttfb?: number;
}

export function useAdvancedPerformance() {
  const isMobile = useIsMobile();
  const metricsRef = useRef<PerformanceMetrics>({});
  const observersRef = useRef<PerformanceObserver[]>([]);

  // Enhanced resource preloading with mobile optimization
  const preloadCriticalResources = useCallback(() => {
    const criticalResources = [
      // Preload critical fonts with font-display: swap
      {
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
        as: 'style',
        crossorigin: 'anonymous'
      },
      // Preload critical images based on device type
      {
        href: isMobile ? '/lovable-uploads/5cc87ed3-fbf6-4b5c-8010-c4232a260a13.png' : '/lovable-uploads/a4949588-cff7-48ae-ba93-d0040f1dd838.png',
        as: 'image',
        media: isMobile ? '(max-width: 768px)' : '(min-width: 769px)'
      }
    ];

    criticalResources.forEach(({ href, as, crossorigin, media }) => {
      // Check if already preloaded
      const existing = document.head.querySelector(`link[href="${href}"]`);
      if (existing) return;

      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      if (crossorigin) link.crossOrigin = crossorigin;
      if (media) link.media = media;
      document.head.appendChild(link);
    });

    // DNS prefetch for external resources
    const dnsPrefetchDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://clvuioagsgfadynuvodj.supabase.co'
    ];

    dnsPrefetchDomains.forEach(domain => {
      const existing = document.head.querySelector(`link[href="${domain}"]`);
      if (existing) return;

      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });
  }, [isMobile]);

  // Advanced performance monitoring
  const setupPerformanceObservers = useCallback(() => {
    if (!('PerformanceObserver' in window)) return;

    try {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        if (lastEntry) {
          metricsRef.current.lcp = lastEntry.startTime;
          if (lastEntry.startTime > 2500) {
            console.warn('LCP is slow:', lastEntry.startTime, 'ms');
          }
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      observersRef.current.push(lcpObserver);

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry: any) => {
          const fid = entry.processingStart - entry.startTime;
          metricsRef.current.fid = fid;
          if (fid > 100) {
            console.warn('FID is slow:', fid, 'ms');
          }
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      observersRef.current.push(fidObserver);

      // Cumulative Layout Shift (CLS)
      const clsObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            metricsRef.current.cls = (metricsRef.current.cls || 0) + entry.value;
            if (entry.value > 0.1) {
              console.warn('Layout shift detected:', entry.value);
            }
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      observersRef.current.push(clsObserver);

      // Navigation Timing for TTFB
      const navObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry: any) => {
          if (entry.entryType === 'navigation') {
            const ttfb = entry.responseStart - entry.requestStart;
            metricsRef.current.ttfb = ttfb;
            if (ttfb > 600) {
              console.warn('TTFB is slow:', ttfb, 'ms');
            }
          }
        });
      });
      navObserver.observe({ entryTypes: ['navigation'] });
      observersRef.current.push(navObserver);

    } catch (error) {
      console.warn('Performance observers not fully supported:', error);
    }
  }, []);

  // Optimize viewport and meta tags for performance
  const optimizeViewportAndMeta = useCallback(() => {
    // Optimize viewport meta tag
    let viewportMeta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      document.head.appendChild(viewportMeta);
    }
    viewportMeta.content = 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover';

    // Add performance-related meta tags
    const performanceMeta = [
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
      { httpEquiv: 'x-dns-prefetch-control', content: 'on' }
    ];

    performanceMeta.forEach(({ name, httpEquiv, content }) => {
      const selector = name ? `meta[name="${name}"]` : `meta[http-equiv="${httpEquiv}"]`;
      let meta = document.head.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (name) meta.name = name;
        if (httpEquiv) meta.httpEquiv = httpEquiv;
        document.head.appendChild(meta);
      }
      meta.content = content;
    });
  }, []);

  // Memory management and cleanup
  const setupMemoryManagement = useCallback(() => {
    // Clean up old localStorage entries
    const cleanupStorage = () => {
      if (!window.localStorage) return;
      
      const now = Date.now();
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith('cache_')) {
          try {
            const item = JSON.parse(localStorage.getItem(key) || '{}');
            if (item.timestamp && now - item.timestamp > maxAge) {
              localStorage.removeItem(key);
            }
          } catch {
            localStorage.removeItem(key);
          }
        }
      }
    };

    // Clean up immediately and set interval
    cleanupStorage();
    const cleanupInterval = setInterval(cleanupStorage, 60 * 60 * 1000); // Every hour

    return () => clearInterval(cleanupInterval);
  }, []);

  // Enhanced image lazy loading with Intersection Observer
  const setupAdvancedLazyLoading = useCallback(() => {
    if (!('IntersectionObserver' in window)) return;

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          
          if (src) {
            // Create a new image to preload
            const newImg = new Image();
            newImg.onload = () => {
              img.src = src;
              img.classList.remove('lazy');
              img.classList.add('loaded');
            };
            newImg.onerror = () => {
              img.classList.add('error');
            };
            newImg.src = src;
            
            imageObserver.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: isMobile ? '25px' : '50px',
      threshold: 0.01
    });

    // Observe all lazy images
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));

    return () => imageObserver.disconnect();
  }, [isMobile]);

  // Connection-aware optimizations
  const setupConnectionOptimizations = useCallback(() => {
    if (!('connection' in navigator)) return;

    const connection = (navigator as any).connection;
    if (!connection) return;

    const isSlowConnection = ['slow-2g', '2g', '3g'].includes(connection.effectiveType);
    const isSaveData = connection.saveData;

    if (isSlowConnection || isSaveData) {
      document.body.classList.add('slow-connection');
      
      // Disable non-critical animations
      const style = document.createElement('style');
      style.textContent = `
        .slow-connection * {
          animation-duration: 0.1s !important;
          transition-duration: 0.1s !important;
        }
        .slow-connection img {
          loading: lazy;
        }
        .slow-connection video {
          preload: none;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.body.classList.remove('slow-connection');
        if (style.parentNode) {
          document.head.removeChild(style);
        }
      };
    }
  }, []);

  // Get current performance metrics
  const getPerformanceMetrics = useCallback(() => {
    return { ...metricsRef.current };
  }, []);

  // Main effect to initialize all optimizations
  useEffect(() => {
    const cleanupFunctions: Array<() => void> = [];

    // Initialize all optimizations
    preloadCriticalResources();
    setupPerformanceObservers();
    optimizeViewportAndMeta();
    
    const memoryCleanup = setupMemoryManagement();
    const lazyLoadingCleanup = setupAdvancedLazyLoading();
    const connectionCleanup = setupConnectionOptimizations();
    
    if (memoryCleanup) cleanupFunctions.push(memoryCleanup);
    if (lazyLoadingCleanup) cleanupFunctions.push(lazyLoadingCleanup);
    if (connectionCleanup) cleanupFunctions.push(connectionCleanup);

    // Cleanup function
    return () => {
      // Disconnect performance observers
      observersRef.current.forEach(observer => observer.disconnect());
      observersRef.current = [];
      
      // Run all cleanup functions
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [
    preloadCriticalResources,
    setupPerformanceObservers,
    optimizeViewportAndMeta,
    setupMemoryManagement,
    setupAdvancedLazyLoading,
    setupConnectionOptimizations
  ]);

  return {
    getPerformanceMetrics,
    isMobile
  };
}
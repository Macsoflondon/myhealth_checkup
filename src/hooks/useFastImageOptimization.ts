import { useState, useEffect, useCallback, useRef } from "react";

interface ImageOptimizationOptions {
  src: string;
  placeholder?: string;
  priority?: boolean;
  maxRetries?: number;
  timeout?: number;
  onLoad?: () => void;
  onError?: () => void;
}

interface ImageState {
  src: string;
  isLoading: boolean;
  hasError: boolean;
  isIntersecting: boolean;
}

export function useFastImageOptimization({
  src,
  placeholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150'%3E%3Crect width='200' height='150' fill='%23f3f4f6'/%3E%3C/svg%3E",
  priority = false,
  maxRetries = 2,
  timeout = 8000,
  onLoad,
  onError
}: ImageOptimizationOptions) {
  const [state, setState] = useState<ImageState>({
    src: placeholder,
    isLoading: !priority,
    hasError: false,
    isIntersecting: false
  });
  
  const retryCountRef = useRef(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const imgElementRef = useRef<HTMLImageElement | null>(null);

  // Optimize image loading with retries and timeout
  const loadImage = useCallback(async (imageSrc: string) => {
    if (!imageSrc || imageSrc === placeholder) return;

    setState(prev => ({ ...prev, isLoading: true, hasError: false }));

    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      
      // Set up timeout
      timeoutRef.current = setTimeout(() => {
        reject(new Error('Image load timeout'));
      }, timeout);

      // Handle successful load
      img.onload = () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        // Validate image dimensions
        if (img.naturalWidth > 0 && img.naturalHeight > 0) {
          setState(prev => ({
            ...prev,
            src: imageSrc,
            isLoading: false,
            hasError: false
          }));
          onLoad?.();
          resolve();
        } else {
          reject(new Error('Invalid image dimensions'));
        }
      };

      // Handle error
      img.onerror = () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        reject(new Error('Image failed to load'));
      };

      // Optimize loading attributes
      img.decoding = priority ? 'sync' : 'async';
      img.loading = priority ? 'eager' : 'lazy';
      
      // Start loading
      img.src = imageSrc;
    });
  }, [placeholder, priority, timeout, onLoad]);

  // Load with retry logic
  const loadWithRetry = useCallback(async (imageSrc: string) => {
    try {
      await loadImage(imageSrc);
      retryCountRef.current = 0;
    } catch (error) {
      // Silently handle image load retries in production
      
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        // Exponential backoff
        const delay = Math.min(1000 * Math.pow(2, retryCountRef.current - 1), 5000);
        setTimeout(() => loadWithRetry(imageSrc), delay);
      } else {
        setState(prev => ({ ...prev, hasError: true, isLoading: false }));
        onError?.();
      }
    }
  }, [loadImage, maxRetries, onError]);

  // Set up intersection observer for lazy loading
  const setupIntersectionObserver = useCallback((element: HTMLImageElement) => {
    if (priority || !element) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setState(prev => ({ ...prev, isIntersecting: true }));
            loadWithRetry(src);
            observerRef.current?.unobserve(element);
          }
        });
      },
      {
        rootMargin: '25px 0px',
        threshold: 0.01
      }
    );

    observerRef.current.observe(element);
  }, [priority, src, loadWithRetry]);

  // Initialize image loading
  useEffect(() => {
    if (priority) {
      loadWithRetry(src);
    }
  }, [priority, src, loadWithRetry]);

  // Set up ref handler for intersection observer
  const setRef = useCallback((element: HTMLImageElement | null) => {
    imgElementRef.current = element;
    if (element && !priority && !state.isIntersecting) {
      setupIntersectionObserver(element);
    }
  }, [priority, state.isIntersecting, setupIntersectionObserver]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Prefetch next image in sequence (for image carousels/galleries)
  const prefetchNext = useCallback((nextSrc: string) => {
    if (!nextSrc) return;
    
    // Only prefetch on fast connections
    const connection = (navigator as any)?.connection;
    if (connection && ['slow-2g', '2g'].includes(connection.effectiveType)) {
      return;
    }

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'image';
    link.href = nextSrc;
    document.head.appendChild(link);
    
    // Clean up prefetch link after a delay
    setTimeout(() => {
      if (link.parentNode) {
        document.head.removeChild(link);
      }
    }, 30000);
  }, []);

  return {
    ...state,
    setRef,
    prefetchNext,
    retry: () => {
      retryCountRef.current = 0;
      loadWithRetry(src);
    }
  };
}
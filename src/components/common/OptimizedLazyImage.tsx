import React, { memo, useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OptimizedLazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
}

export const OptimizedLazyImage = memo(({ 
  src, 
  alt, 
  placeholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3C/svg%3E", 
  className, 
  priority = false,
  quality = 75,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  ...props 
}: OptimizedLazyImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(placeholder);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Cache mobile detection using matchMedia to avoid reflow
  const isMobileRef = useRef<boolean | null>(null);
  
  // Optimize image URL based on device capabilities - avoiding reflow
  const getOptimizedSrc = (originalSrc: string) => {
    if (!originalSrc || originalSrc.startsWith('data:')) return originalSrc;
    
    // Use matchMedia instead of innerWidth to avoid forced reflow
    if (isMobileRef.current === null) {
      isMobileRef.current = window.matchMedia('(max-width: 768px)').matches;
    }
    
    // If it's already optimized or a local file, return as-is
    if (originalSrc.includes('?') || originalSrc.startsWith('/')) {
      return originalSrc;
    }
    
    return originalSrc;
  };

  // Preload image with optimizations
  const preloadImage = (src: string) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      
      // Set appropriate decoding mode
      img.decoding = priority ? 'sync' : 'async';
      
      // Handle load success
      img.onload = () => {
        // Verify image loaded successfully
        if (img.naturalWidth > 0 && img.naturalHeight > 0) {
          resolve();
        } else {
          reject(new Error('Invalid image dimensions'));
        }
      };
      
      // Handle load error
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      // Start loading
      img.src = src;
      
      // Timeout for slow connections
      const timeout = setTimeout(() => {
        reject(new Error('Image load timeout'));
      }, 10000);
      
      img.onload = () => {
        clearTimeout(timeout);
        if (img.naturalWidth > 0 && img.naturalHeight > 0) {
          resolve();
        } else {
          reject(new Error('Invalid image dimensions'));
        }
      };
    });
  };

  // Load image when in viewport
  const loadImage = async () => {
    if (!src || src === placeholder) return;
    
    const optimizedSrc = getOptimizedSrc(src);
    
    try {
      await preloadImage(optimizedSrc);
      setImageSrc(optimizedSrc);
      setIsLoading(false);
      setHasError(false);
      } catch (error) {
        // Silently handle image load errors in production
        setHasError(true);
      setIsLoading(false);
    }
  };

  // Set up intersection observer for lazy loading
  useEffect(() => {
    if (priority) {
      // Load immediately for priority images
      loadImage();
      return;
    }

    const img = imgRef.current;
    if (!img) return;

    // Create intersection observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            loadImage();
            observerRef.current?.unobserve(img);
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01
      }
    );

    // Start observing
    observerRef.current.observe(img);

    return () => {
      if (observerRef.current && img) {
        observerRef.current.unobserve(img);
      }
    };
  }, [src, priority]);

  // Clean up observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        sizes={sizes}
        className={cn(
          "w-full h-auto transition-opacity duration-300 ease-out gpu-acceleration",
          isLoading && !priority ? "opacity-0" : "opacity-100",
          hasError ? "opacity-50 bg-muted" : "",
          className
        )}
        onLoad={() => {
          setIsLoading(false);
          // Remove will-change after animation
          setTimeout(() => {
            imgRef.current?.classList.add('animation-complete');
          }, 300);
        }}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        {...props}
      />
      
      {/* Loading skeleton */}
      {isLoading && !priority && (
        <div className="absolute inset-0 bg-muted animate-pulse rounded" />
      )}
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-sm">
          <span>Image unavailable</span>
        </div>
      )}
    </div>
  );
});

OptimizedLazyImage.displayName = "OptimizedLazyImage";
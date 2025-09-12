import React, { memo, useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface FastLazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export const FastLazyImage = memo(({ 
  src, 
  alt, 
  placeholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280'%3ELoading...%3C/text%3E%3C/svg%3E", 
  className, 
  priority = false,
  onLoad,
  onError,
  ...props 
}: FastLazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(priority ? src : placeholder);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    setCurrentSrc(placeholder);
    onError?.();
  }, [onError, placeholder]);

  const loadImage = useCallback(() => {
    if (currentSrc === src) return;
    
    const img = new Image();
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoaded(true);
      onLoad?.();
    };
    img.onerror = () => {
      setHasError(true);
      onError?.();
    };
    img.src = src;
  }, [src, currentSrc, onLoad, onError]);

  useEffect(() => {
    if (priority) {
      loadImage();
      return;
    }

    const img = imgRef.current;
    if (!img) return;

    // Use Intersection Observer for lazy loading
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
        rootMargin: '25px',
        threshold: 0.01
      }
    );

    observerRef.current.observe(img);

    return () => {
      if (observerRef.current && img) {
        observerRef.current.unobserve(img);
      }
    };
  }, [priority, loadImage]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <img
      ref={imgRef}
      src={currentSrc}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      className={cn(
        "transition-opacity duration-300 ease-out",
        isLoaded && !hasError ? "opacity-100" : "opacity-90",
        hasError ? "opacity-50" : "",
        className
      )}
      onLoad={handleLoad}
      onError={handleError}
      {...props}
    />
  );
});

FastLazyImage.displayName = "FastLazyImage";
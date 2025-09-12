import { useState, useEffect, useCallback } from "react";

interface UseOptimizedImageProps {
  src: string;
  placeholder?: string;
  quality?: number;
}

interface UseOptimizedImageReturn {
  imageSrc: string;
  isLoading: boolean;
  hasError: boolean;
}

export function useOptimizedImage({ 
  src, 
  placeholder = "/placeholder.svg" 
}: UseOptimizedImageProps): UseOptimizedImageReturn {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Optimize image loading based on device capabilities
  const loadImage = useCallback(async (imageSrc: string) => {
    return new Promise<string>((resolve, reject) => {
      const img = new Image();
      
      // Set appropriate loading strategy based on connection
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        if (connection?.effectiveType && ['slow-2g', '2g'].includes(connection.effectiveType)) {
          // For slow connections, use a smaller timeout
          setTimeout(() => reject(new Error('Loading timeout for slow connection')), 5000);
        }
      }

      img.onload = () => {
        // Check if image dimensions are reasonable
        if (img.naturalWidth > 0 && img.naturalHeight > 0) {
          resolve(imageSrc);
        } else {
          reject(new Error('Invalid image dimensions'));
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      // Add cache control for better performance
      img.crossOrigin = 'anonymous';
      img.decoding = 'async';
      img.src = imageSrc;
    });
  }, []);

  useEffect(() => {
    if (!src) {
      setImageSrc(placeholder);
      setIsLoading(false);
      return;
    }

    let isCancelled = false;
    
    // Check if image is already cached
    const cachedImage = sessionStorage.getItem(`img_cache_${src}`);
    if (cachedImage) {
      setImageSrc(src);
      setIsLoading(false);
      setHasError(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    // Immediate load for critical images
    const immediateLoad = async () => {
      try {
        await loadImage(src);
        if (!isCancelled) {
          setImageSrc(src);
          setIsLoading(false);
          // Cache successful loads
          sessionStorage.setItem(`img_cache_${src}`, 'loaded');
        }
      } catch (error) {
        if (!isCancelled) {
          console.warn('Failed to load image:', src, error);
          setImageSrc(placeholder);
          setHasError(true);
          setIsLoading(false);
        }
      }
    };

    immediateLoad();

    return () => {
      isCancelled = true;
    };
  }, [src, placeholder, loadImage]);

  return { imageSrc, isLoading, hasError };
}
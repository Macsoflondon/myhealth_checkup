import { useState, useEffect } from "react";

interface UseOptimizedImageProps {
  src: string;
  placeholder?: string;
  quality?: number;
}

export function useOptimizedImage({ src, placeholder = "/placeholder.svg" }: UseOptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src) {
      setImageSrc(placeholder);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
    
    img.onerror = () => {
      setImageSrc(placeholder);
      setIsLoading(false);
      setHasError(true);
    };
    
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, placeholder]);

  return { imageSrc, isLoading, hasError };
}
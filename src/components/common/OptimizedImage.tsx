import { useState, useEffect } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
}

/**
 * Generates responsive srcset for different screen densities
 */
function generateDensitySrcSet(src: string): string {
  // For now, return single source - can be extended with actual resized images
  return `${src} 1x, ${src} 2x`;
}

/**
 * Preload critical images in the document head
 */
export function preloadImage(src: string, asWebP: boolean = true) {
  if (typeof document === 'undefined') return;
  
  const existingLink = document.querySelector(`link[href="${src}"]`);
  if (existingLink) return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  if (asWebP) {
    link.type = 'image/webp';
  }
  document.head.appendChild(link);
}

export function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  className = "",
  loading = "lazy",
  priority = false,
  placeholder = "empty"
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Check if WebP version exists (assumes WebP images are named with .webp extension)
  const webpSrc = src.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  const hasWebP = src.match(/\.(png|jpg|jpeg)$/i);
  
  // Preload priority images
  useEffect(() => {
    if (priority && hasWebP) {
      preloadImage(webpSrc, true);
    }
  }, [priority, webpSrc, hasWebP]);

  const handleLoad = () => setIsLoaded(true);
  const handleError = () => setHasError(true);

  // Placeholder styles for blur effect
  const placeholderStyles = placeholder === 'blur' && !isLoaded
    ? 'blur-sm scale-105'
    : '';

  // Error state
  if (hasError) {
    return (
      <div 
        className={`bg-muted flex items-center justify-center ${className}`}
        style={{ width, height }}
        role="img"
        aria-label={alt}
      >
        <span className="text-muted-foreground text-xs">Image unavailable</span>
      </div>
    );
  }

  if (!hasWebP) {
    // If already WebP or other format, just use regular img
    return (
      <img 
        src={src} 
        alt={alt} 
        width={width} 
        height={height}
        loading={priority ? "eager" : loading}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        onLoad={handleLoad}
        onError={handleError}
        className={`${className} ${placeholderStyles} transition-all duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
    );
  }

  return (
    <picture>
      <source 
        type="image/webp" 
        srcSet={generateDensitySrcSet(webpSrc)}
        sizes={sizes}
      />
      <source
        srcSet={generateDensitySrcSet(src)}
        sizes={sizes}
      />
      <img 
        src={src} 
        alt={alt} 
        width={width} 
        height={height}
        loading={priority ? "eager" : loading}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        onLoad={handleLoad}
        onError={handleError}
        className={`${className} ${placeholderStyles} transition-all duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        sizes={sizes}
      />
    </picture>
  );
}

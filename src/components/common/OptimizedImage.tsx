interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height,
  sizes = "100vw",
  className = "",
  loading = "lazy"
}: OptimizedImageProps) {
  // Check if WebP version exists (assumes WebP images are named with .webp extension)
  const webpSrc = src.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  const hasWebP = src.match(/\.(png|jpg|jpeg)$/i);
  
  if (!hasWebP) {
    // If already WebP or other format, just use regular img
    return (
      <img 
        src={src} 
        alt={alt} 
        width={width} 
        height={height}
        loading={loading}
        decoding="async"
        className={className}
      />
    );
  }

  return (
    <picture>
      <source 
        type="image/webp" 
        srcSet={webpSrc}
        sizes={sizes}
      />
      <img 
        src={src} 
        alt={alt} 
        width={width} 
        height={height}
        loading={loading}
        decoding="async"
        className={className}
      />
    </picture>
  );
}

import { useState } from "react";

interface ResponsiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  sizes?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

/**
 * Generates WebP srcset with multiple densities for responsive images
 * Supports 1x, 2x, and 3x pixel densities for retina displays
 */
function generateSrcSet(src: string): { webpSrcSet: string; fallbackSrcSet: string; webpSrc: string } {
  const basePath = src.replace(/\.(png|jpg|jpeg|webp)$/i, '');
  const extension = src.match(/\.(png|jpg|jpeg|webp)$/i)?.[0] || '.png';
  const isWebP = extension.toLowerCase() === '.webp';
  
  // For WebP source
  const webpSrc = isWebP ? src : `${basePath}.webp`;
  
  // Generate srcset for different densities
  // Since we have single files, we use width descriptors for responsive sizing
  const webpSrcSet = webpSrc;
  const fallbackSrcSet = src;
  
  return { webpSrcSet, fallbackSrcSet, webpSrc };
}

export function ResponsiveImage({ 
  src, 
  alt, 
  width, 
  height,
  className = "",
  loading = "lazy",
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  objectFit = "cover"
}: ResponsiveImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const hasWebPSupport = src.match(/\.(png|jpg|jpeg)$/i);
  const { webpSrc } = generateSrcSet(src);
  
  const objectFitClass = {
    contain: 'object-contain',
    cover: 'object-cover',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down'
  }[objectFit];

  const handleLoad = () => setIsLoaded(true);
  const handleError = () => setHasError(true);

  // Base image styles with loading state
  const imageStyles = `
    ${objectFitClass}
    ${className}
    ${!isLoaded ? 'opacity-0' : 'opacity-100'}
    transition-opacity duration-300
  `.trim();

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

  // If no WebP support needed (already WebP or unsupported format)
  if (!hasWebPSupport) {
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
        className={imageStyles}
      />
    );
  }

  return (
    <picture>
      {/* WebP format for modern browsers */}
      <source 
        type="image/webp" 
        srcSet={webpSrc}
        sizes={sizes}
      />
      {/* Fallback for older browsers */}
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
        className={imageStyles}
        sizes={sizes}
      />
    </picture>
  );
}

/**
 * Hero background image component optimized for full-width backgrounds
 * Uses eager loading and high priority for above-the-fold content
 */
interface HeroBackgroundProps {
  src: string;
  webpSrc?: string;
  alt?: string;
  className?: string;
  overlayClassName?: string;
}

export function HeroBackground({
  src,
  webpSrc,
  alt = "",
  className = "",
  overlayClassName = ""
}: HeroBackgroundProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  const finalWebpSrc = webpSrc || src.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  const hasWebPVersion = src.match(/\.(png|jpg|jpeg)$/i);

  return (
    <div className={`absolute inset-0 z-0 ${className}`}>
      <picture>
        {hasWebPVersion && (
          <source 
            srcSet={`
              ${finalWebpSrc} 1x,
              ${finalWebpSrc} 2x
            `}
            type="image/webp"
            media="(min-width: 1px)"
          />
        )}
        <source 
          srcSet={`
            ${src} 1x,
            ${src} 2x
          `}
          media="(min-width: 1px)"
        />
        <img 
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          onLoad={() => setIsLoaded(true)}
        />
      </picture>
      {overlayClassName && <div className={`absolute inset-0 ${overlayClassName}`} />}
    </div>
  );
}

/**
 * Partner/Logo image component optimized for small images
 * Uses lazy loading and contains object-fit for logos
 */
interface PartnerLogoProps {
  src: string;
  alt: string;
  className?: string;
}

export function PartnerLogo({
  src,
  alt,
  className = ""
}: PartnerLogoProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const webpSrc = src.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  const hasWebPVersion = src.match(/\.(png|jpg|jpeg)$/i);

  if (hasError) {
    return (
      <div className={`bg-muted rounded flex items-center justify-center ${className}`}>
        <span className="text-muted-foreground text-[10px]">{alt.charAt(0)}</span>
      </div>
    );
  }

  return (
    <picture>
      {hasWebPVersion && (
        <source 
          srcSet={webpSrc}
          type="image/webp"
        />
      )}
      <img 
        src={src}
        alt={alt}
        className={`object-contain transition-all duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
    </picture>
  );
}

import { useState, useMemo } from "react";

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

// Standard breakpoints for responsive images
const IMAGE_BREAKPOINTS = [640, 1024, 1920] as const;

/**
 * Generates responsive srcset with multiple sizes for bandwidth optimization
 * Provides 640px, 1024px, and 1920px variants with WebP support
 */
function generateResponsiveSrcSet(src: string): { 
  webpSrcSet: string; 
  fallbackSrcSet: string; 
  webpSrc: string;
  sizes: string;
} {
  const basePath = src.replace(/\.(png|jpg|jpeg|webp)$/i, '');
  const extension = src.match(/\.(png|jpg|jpeg|webp)$/i)?.[0] || '.png';
  const isWebP = extension.toLowerCase() === '.webp';
  
  // For WebP source - use original as base
  const webpSrc = isWebP ? src : `${basePath}.webp`;
  
  // Generate srcset with width descriptors for responsive sizing
  // Format: "image-640.webp 640w, image-1024.webp 1024w, image-1920.webp 1920w"
  const webpSrcSet = IMAGE_BREAKPOINTS
    .map(width => `${basePath}-${width}.webp ${width}w`)
    .join(', ');
  
  const fallbackSrcSet = IMAGE_BREAKPOINTS
    .map(width => `${basePath}-${width}${extension} ${width}w`)
    .join(', ');
  
  // Default responsive sizes attribute for optimal loading
  const sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";
  
  return { webpSrcSet, fallbackSrcSet, webpSrc, sizes };
}

/**
 * Generates srcset for provider logos with optimized small sizes
 * Uses 48px, 96px, 192px for logos (retina support)
 */
function generateLogoSrcSet(src: string): string {
  const basePath = src.replace(/\.(png|jpg|jpeg|webp|svg)$/i, '');
  const extension = src.match(/\.(png|jpg|jpeg|webp|svg)$/i)?.[0] || '.png';
  
  // For SVGs, no srcset needed
  if (extension.toLowerCase() === '.svg') return src;
  
  return [48, 96, 192]
    .map(size => `${basePath}-${size}${extension} ${size}w`)
    .join(', ');
}

export function ResponsiveImage({ 
  src, 
  alt, 
  width, 
  height,
  className = "",
  loading = "lazy",
  priority = false,
  sizes: customSizes,
  objectFit = "cover"
}: ResponsiveImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const hasWebPSupport = src.match(/\.(png|jpg|jpeg)$/i);
  const { webpSrc, webpSrcSet, fallbackSrcSet, sizes: defaultSizes } = useMemo(
    () => generateResponsiveSrcSet(src),
    [src]
  );
  
  const sizes = customSizes || defaultSizes;
  
  const objectFitClass = {
    contain: 'object-contain',
    cover: 'object-cover',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down'
  }[objectFit];

  const handleLoad = () => setIsLoaded(true);
  const handleError = () => setHasError(true);

  // Base image styles with loading state and smooth fade-in
  const imageStyles = `
    ${objectFitClass}
    ${className}
    ${!isLoaded ? 'opacity-0 scale-[1.02]' : 'opacity-100 scale-100'}
    transition-all duration-500 ease-out
    will-change-opacity
  `.trim();

  if (hasError) {
    return (
      <div 
        className={`bg-muted flex items-center justify-center rounded ${className}`}
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
        // @ts-ignore - fetchpriority is valid HTML attribute
        fetchpriority={priority ? "high" : "auto"}
        onLoad={handleLoad}
        onError={handleError}
        className={imageStyles}
      />
    );
  }

  return (
    <picture>
      {/* WebP format with responsive srcset for modern browsers */}
      <source 
        type="image/webp" 
        srcSet={webpSrcSet}
        sizes={sizes}
      />
      {/* Fallback with responsive srcset */}
      <source
        srcSet={fallbackSrcSet}
        sizes={sizes}
      />
      {/* Base fallback image */}
      <img 
        src={src} 
        alt={alt} 
        width={width} 
        height={height}
        loading={priority ? "eager" : loading}
        decoding={priority ? "sync" : "async"}
        // @ts-ignore - fetchpriority is valid HTML attribute
        fetchpriority={priority ? "high" : "auto"}
        onLoad={handleLoad}
        onError={handleError}
        className={imageStyles}
        sizes={sizes}
      />
    </picture>
  );
}

/**
 * Optimized provider logo component with automatic srcset generation
 * Uses smaller image sizes optimized for logo display (48-192px)
 */
interface ProviderLogoOptimizedProps {
  src: string;
  alt: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ProviderLogoOptimized({
  src,
  alt,
  className = "",
  size = 'md'
}: ProviderLogoOptimizedProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const sizeClasses = {
    sm: 'h-8 w-auto max-w-[80px]',
    md: 'h-12 w-auto max-w-[120px]',
    lg: 'h-16 w-auto max-w-[160px]'
  };
  
  const srcSet = useMemo(() => generateLogoSrcSet(src), [src]);
  const isSvg = src.toLowerCase().endsWith('.svg');

  if (hasError) {
    return (
      <div className={`bg-muted rounded flex items-center justify-center ${sizeClasses[size]} ${className}`}>
        <span className="text-muted-foreground text-[10px]">{alt.charAt(0)}</span>
      </div>
    );
  }

  return (
    <img 
      src={src}
      srcSet={isSvg ? undefined : srcSet}
      sizes={isSvg ? undefined : "(max-width: 640px) 48px, (max-width: 1024px) 96px, 192px"}
      alt={alt}
      className={`
        object-contain 
        ${sizeClasses[size]}
        ${className}
        ${!isLoaded ? 'opacity-0' : 'opacity-100'}
        transition-opacity duration-300
        filter grayscale hover:grayscale-0
      `}
      loading="lazy"
      decoding="async"
      onLoad={() => setIsLoaded(true)}
      onError={() => setHasError(true)}
    />
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
          // @ts-ignore - fetchpriority is valid HTML attribute
          fetchpriority="high"
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

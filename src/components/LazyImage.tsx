import React, { memo } from "react";
import { cn } from "@/lib/utils";
import { useOptimizedImage } from "@/hooks/useOptimizedImage";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  priority?: boolean;
}

export const LazyImage = memo(({ 
  src, 
  alt, 
  placeholder = "/placeholder.svg", 
  className, 
  priority = false,
  ...props 
}: LazyImageProps) => {
  const { imageSrc, isLoading, hasError } = useOptimizedImage({ src, placeholder });

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <img
        src={imageSrc}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          hasError ? "opacity-50" : "",
          className
        )}
        {...props}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse rounded" />
      )}
    </div>
  );
});

LazyImage.displayName = "LazyImage";
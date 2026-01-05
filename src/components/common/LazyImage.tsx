import React, { memo } from "react";
import { cn } from "@/lib/utils";
import { useFastImageOptimization } from "@/hooks/useFastImageOptimization";

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
  placeholder, 
  className, 
  priority = false,
  ...props 
}: LazyImageProps) => {
  const { 
    src: currentSrc, 
    isLoading, 
    hasError, 
    setRef 
  } = useFastImageOptimization({ 
    src, 
    placeholder, 
    priority 
  });

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <img
        ref={setRef}
        src={currentSrc}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        className={cn(
          "w-full h-auto transition-opacity duration-300 gpu-acceleration",
          !isLoading && !hasError ? "opacity-100" : "opacity-90",
          hasError ? "opacity-50" : "",
          className
        )}
        {...props}
      />
      {isLoading && !priority && (
        <div className="absolute inset-0 bg-muted animate-pulse rounded" />
      )}
    </div>
  );
});

LazyImage.displayName = "LazyImage";
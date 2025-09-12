import React, { memo, useCallback } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PerformanceOptimizedButtonProps extends ButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  debounceMs?: number;
  children?: React.ReactNode;
}

export const PerformanceOptimizedButton = memo(({
  onClick,
  debounceMs = 300,
  className,
  children,
  ...props
}: PerformanceOptimizedButtonProps) => {
  // Debounced click handler to prevent rapid clicks
  const debouncedOnClick = useCallback(
    debounce((event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
    }, debounceMs),
    [onClick, debounceMs]
  );

  return (
    <Button
      onClick={debouncedOnClick}
      className={cn(
        "gpu-acceleration tap-highlight-transparent select-none-mobile",
        "transition-transform duration-150 active:scale-98",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
});

// Debounce utility function
function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

PerformanceOptimizedButton.displayName = "PerformanceOptimizedButton";
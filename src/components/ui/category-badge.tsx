import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface CategoryBadgeProps {
  category: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * CategoryBadge - Displays category labels with a consistent gradient style
 * Uses the turquoise-to-pink gradient for all categories
 */
export function CategoryBadge({ category, className, children }: CategoryBadgeProps) {
  return (
    <Badge 
      variant="gradient"
      className={cn("font-semibold", className)}
    >
      {children || category}
    </Badge>
  );
}

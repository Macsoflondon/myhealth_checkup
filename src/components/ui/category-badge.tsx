import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Category color mapping using brand colors
const categoryColorMap: Record<string, "turquoise" | "pink" | "navy" | "gradient"> = {
  // Primary health categories - Turquoise
  'blood-tests': 'turquoise',
  'general-health': 'turquoise',
  'heart-health': 'turquoise',
  'thyroid': 'turquoise',
  'liver-health': 'turquoise',
  'kidney-health': 'turquoise',
  
  // Women's/Fertility/Hormones - Pink
  'hormones': 'pink',
  'womens-health': 'pink',
  'fertility': 'pink',
  'sexual-health': 'pink',
  'mens-health': 'pink',
  
  // Serious/Critical - Navy
  'cancer-screening': 'navy',
  'diabetes': 'navy',
  'allergy-testing': 'navy',
  
  // Premium/Comprehensive - Gradient
  'vitamins': 'gradient',
  'wellness': 'gradient',
  'longevity': 'gradient',
};

interface CategoryBadgeProps {
  category: string;
  className?: string;
  children?: React.ReactNode;
}

export function CategoryBadge({ category, className, children }: CategoryBadgeProps) {
  // Normalize category ID (remove spaces, lowercase, handle variations)
  const normalizedCategory = category
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-')
    .replace(/[()]/g, '');
  
  // Get color variant, default to turquoise
  const variant = categoryColorMap[normalizedCategory] || 'turquoise';
  
  return (
    <Badge 
      variant={variant}
      className={cn("font-semibold", className)}
    >
      {children || category}
    </Badge>
  );
}

export { categoryColorMap };

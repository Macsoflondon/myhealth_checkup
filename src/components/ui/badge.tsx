import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border-0 px-4 h-8 text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 hover:scale-105",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:shadow-md",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:shadow-md",
        destructive:
          "bg-error text-error-foreground shadow-sm hover:shadow-md",
        outline: "border-2 border-tertiary text-tertiary bg-transparent hover:bg-tertiary hover:text-white",
        success: "bg-primary-container text-primary-on-container shadow-sm hover:shadow-md",
        warning: "bg-[hsl(38_92%_50%)] text-white shadow-sm hover:shadow-md",
        gradient: "bg-gradient-to-r from-primary to-secondary text-white shadow-sm hover:shadow-md",
        // Category-specific variants using brand colors
        turquoise: "bg-[hsl(187_72%_48%)] text-white shadow-sm hover:shadow-md hover:bg-[hsl(187_72%_40%)]",
        pink: "bg-[hsl(335_89%_48%)] text-white shadow-sm hover:shadow-md hover:bg-[hsl(335_89%_40%)]",
        navy: "bg-[hsl(224_67%_10%)] text-white shadow-sm hover:shadow-md hover:bg-[hsl(224_67%_15%)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

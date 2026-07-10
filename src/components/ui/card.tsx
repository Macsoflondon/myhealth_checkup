import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Phase 3 — Unified Card + Surface System
 *
 * Variants:
 *  - surface     Default flat surface, subtle border, no elevation.
 *  - elevated    Raised surface with e1 → hover e3 lift.
 *  - outlined    Border-led, no shadow. For dense grids.
 *  - glass       Backdrop-blur translucent surface (used sparingly).
 *  - interactive Elevated + cursor + stronger lift on hover/focus.
 *
 * Hover: -2px translate + shadow e1 → e3 (Apple/Linear-style).
 * Respects prefers-reduced-motion via `transition-all` duration tokens.
 * Legacy `interactive` boolean prop still works (mapped to variant).
 */
const cardVariants = cva(
  "rounded-lg bg-card text-card-foreground transition-all duration-standard ease-emphasized",
  {
    variants: {
      variant: {
        surface: "border border-border/60 shadow-none hover:shadow-e1 hover:-translate-y-0.5",
        elevated: "border border-border/40 shadow-e1 hover:shadow-e3 hover:-translate-y-0.5",
        outlined: "border border-border shadow-none hover:border-border/80",
        glass:
          "border border-white/20 bg-white/60 backdrop-blur-xl shadow-e1 hover:shadow-e2 hover:-translate-y-0.5 supports-[not(backdrop-filter:blur(0))]:bg-white/95",
        interactive:
          "border border-border/40 shadow-e1 cursor-pointer hover:shadow-e3 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:translate-y-0 active:shadow-e2",
      },
      padded: {
        true: "p-6",
        false: "",
      },
    },
    defaultVariants: {
      variant: "elevated",
      padded: false,
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /** @deprecated Use variant="interactive" */
  interactive?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padded, interactive, ...props }, ref) => {
    const resolved = interactive ? "interactive" : variant
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant: resolved, padded, className }))}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-2 p-6", className)} {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants }

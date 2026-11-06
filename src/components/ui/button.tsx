import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Button — Phase 2 design system primitive.
 *
 * Seven canonical variants (Apple/Linear/Stripe-inspired):
 *  - primary      (default): solid navy, high contrast
 *  - secondary   : soft surface, low-contrast on light bg
 *  - tertiary    : outline (formerly `outline`)
 *  - ghost       : transparent, hover surface
 *  - link        : inline text link
 *  - destructive : error-toned solid
 *  - plain       : no colours; className supplies them (brand CTAs, links)
 *
 * Sizes: sm (36px), default (44px) and lg (52px) are the only sizes pages
 * should use. Do not override height, padding or font size in className.
 *
 * Legacy aliases (`outline`, `gradient`, `shimmer`, `brandPill`, `skeuomorphic`)
 * remain accepted for back-compat and now map to canonical variants so existing
 * pages keep working. Prefer the canonical names in new code.
 *
 * Motion: scale + elevation on hover using design tokens. No ripple (removed
 * in Phase 2 for a cleaner, premium feel). Respects prefers-reduced-motion
 * via the global CSS layer.
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md max-sm:min-h-11 max-sm:min-w-11",
    "font-medium select-none",
    "transition-[transform,box-shadow,background-color,color,border-color]",
    "duration-standard ease-emphasized",
    "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-e1 hover:shadow-e3 hover:-translate-y-[1px] active:translate-y-0 active:shadow-e1",
        secondary:
          "bg-secondary text-secondary-foreground shadow-e1 hover:shadow-e2 hover:-translate-y-[1px] active:translate-y-0",
        tertiary:
          "border border-primary/20 bg-transparent text-primary hover:bg-primary/5 hover:border-primary/40 active:bg-primary/10",
        ghost:
          "bg-transparent text-primary hover:bg-primary/8 active:bg-primary/12",
        link: "h-auto p-0 text-primary underline-offset-4 hover:underline focus-visible:ring-offset-0",
        destructive:
          "bg-error text-error-foreground shadow-e1 hover:shadow-e3 hover:-translate-y-[1px] active:translate-y-0 active:shadow-e1",
        // No colours of its own: for brand-coloured buttons and links that
        // set background, text and border through className but take their
        // size from this file.
        plain: "",

        // Legacy aliases — kept for back-compat, mapped to canonical styles.
        default:
          "bg-primary text-primary-foreground shadow-e1 hover:shadow-e3 hover:-translate-y-[1px] active:translate-y-0 active:shadow-e1",
        outline:
          "border border-primary/20 bg-transparent text-primary hover:bg-primary/5 hover:border-primary/40 active:bg-primary/10",
        gradient:
          "bg-gradient-to-r from-primary to-secondary text-white shadow-e1 hover:shadow-e3 hover:-translate-y-[1px] active:translate-y-0",
        shimmer:
          "bg-primary text-primary-foreground shadow-e1 hover:shadow-e3 hover:-translate-y-[1px] active:translate-y-0",
        brandPill:
          "rounded-pill bg-primary text-primary-foreground shadow-e1 hover:shadow-e3 hover:-translate-y-[1px] active:translate-y-0",
        skeuomorphic:
          "bg-primary text-primary-foreground shadow-e2 hover:shadow-e4 hover:-translate-y-[1px] active:translate-y-0 active:shadow-e1",
      },
      // The single source of button sizes. Pages set colour, radius and
      // weight through className and must not override height, padding or
      // font size. default and lg meet the 44px touch target; sm is for
      // dense desktop toolbars only, and the base class lifts every size to
      // a 44px minimum below 640px so phone touch targets hold regardless.
      //   sm      36px tall, 14px text
      //   default 44px tall, 16px text
      //   lg      52px tall, 16px text
      size: {
        sm: "h-9 px-3 text-sm [&_svg]:size-4",
        default: "h-11 px-5 text-base [&_svg]:size-4",
        lg: "h-13 px-8 text-base [&_svg]:size-5",
        xl: "h-14 px-8 text-base [&_svg]:size-5",
        icon: "h-11 w-11 [&_svg]:size-4",
        "icon-sm": "h-9 w-9 [&_svg]:size-4",
        "icon-lg": "h-13 w-13 [&_svg]:size-5",

        // Legacy aliases of the sizes above.
        md: "h-11 px-5 text-base [&_svg]:size-4",
        providerCta: "h-13 px-8 text-base [&_svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "state-layer relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium overflow-hidden border-2 border-[#081129] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-all duration-300 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:relative [&_svg]:z-10",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-elevation-2 hover:shadow-elevation-4 hover:scale-105 active:shadow-elevation-1 active:scale-95",
        destructive:
          "bg-error text-error-foreground shadow-elevation-2 hover:shadow-elevation-4 hover:scale-105 active:shadow-elevation-1 active:scale-95",
        outline:
          "border-2 border-tertiary bg-transparent text-tertiary hover:bg-tertiary hover:text-white hover:scale-105 active:scale-95",
        secondary:
          "bg-secondary text-secondary-foreground shadow-elevation-2 hover:shadow-elevation-4 hover:scale-105 active:shadow-elevation-1 active:scale-95",
        ghost: "text-primary hover:bg-primary/10 hover:scale-105 active:scale-95",
        link: "text-primary underline-offset-4 hover:underline hover:scale-105 active:scale-95",
        gradient: "bg-gradient-to-r from-primary to-secondary text-white shadow-elevation-2 hover:shadow-elevation-4 hover:scale-105 active:scale-95",
        shimmer: "btn-shimmer text-white shadow-elevation-2 hover:shadow-elevation-4 hover:scale-105 active:scale-95",
      },
      size: {
        default: "h-12 px-8 py-2",
        sm: "h-9 px-3",
        lg: "h-14 px-10",
        providerCta: "h-14",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, onClick, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Defer ripple effect to next frame to avoid forced reflow
      requestAnimationFrame(() => {
        const button = e.currentTarget;
        if (!button) return;
        
        // Batch read: get all layout info first
        const rect = button.getBoundingClientRect();
        const rippleSize = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - rippleSize / 2;
        const y = e.clientY - rect.top - rippleSize / 2;
        const existingRipple = button.querySelector('.ripple-effect');

        // Batch write: perform all DOM mutations together
        if (existingRipple) {
          existingRipple.remove();
        }
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `width: ${rippleSize}px; height: ${rippleSize}px; left: ${x}px; top: ${y}px;`;
        ripple.classList.add('ripple-effect');
        button.appendChild(ripple);

        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
      
      onClick?.(e);
    };
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={asChild ? onClick : handleClick}
        {...props}
      >
        <span className="relative z-10 text-primary-foreground">{children}</span>
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

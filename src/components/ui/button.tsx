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
        brandPill: "rounded-full border-tertiary bg-primary text-primary-foreground shadow-elevation-2 hover:bg-secondary hover:shadow-elevation-4 hover:scale-105 active:shadow-elevation-1 active:scale-95",
        skeuomorphic:
          "rounded-xl border border-white/40 text-white font-semibold tracking-wide " +
          "bg-[linear-gradient(180deg,#3ad7ea_0%,#22c0d4_45%,#1aa7ba_100%)] " +
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.55),inset_0_-2px_0_rgba(0,0,0,0.18),0_6px_14px_-4px_rgba(8,17,41,0.45),0_2px_4px_rgba(8,17,41,0.25)] " +
          "hover:bg-[linear-gradient(180deg,#4ee0f2_0%,#26ccdf_45%,#1eb0c4_100%)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.65),inset_0_-2px_0_rgba(0,0,0,0.2),0_10px_20px_-6px_rgba(8,17,41,0.5),0_3px_6px_rgba(8,17,41,0.3)] hover:-translate-y-0.5 " +
          "active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.2)] active:translate-y-0.5",
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
        <span className="relative z-10">{children}</span>
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-all [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-elevation-2 hover:shadow-elevation-4 active:shadow-elevation-1 hover:bg-primary/92 active:bg-primary/88",
        destructive:
          "bg-error text-error-foreground shadow-elevation-2 hover:shadow-elevation-4 active:shadow-elevation-1 hover:bg-error/92 active:bg-error/88",
        outline:
          "border border-tertiary bg-transparent text-tertiary hover:bg-tertiary/8 active:bg-tertiary/12",
        secondary:
          "bg-secondary text-secondary-foreground shadow-elevation-2 hover:shadow-elevation-4 active:shadow-elevation-1 hover:bg-secondary/92 active:bg-secondary/88",
        ghost: "text-primary hover:bg-primary/8 active:bg-primary/12",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-8 py-2",
        sm: "h-9 px-3",
        lg: "h-14 px-10",
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
  ({ className, variant, size, asChild = false, onClick, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Create ripple effect
      const button = e.currentTarget;
      const ripple = document.createElement('span');
      const rect = button.getBoundingClientRect();
      const rippleSize = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - rippleSize / 2;
      const y = e.clientY - rect.top - rippleSize / 2;

      ripple.style.width = ripple.style.height = `${rippleSize}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.classList.add('ripple-effect');

      const existingRipple = button.querySelector('.ripple-effect');
      if (existingRipple) {
        existingRipple.remove();
      }

      button.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
      
      onClick?.(e);
    };
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={asChild ? onClick : handleClick}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

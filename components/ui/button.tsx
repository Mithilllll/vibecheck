"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-150 focus-ring disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-bg-base hover:bg-accent-muted active:scale-[0.98] shadow-[0_0_0_1px_rgba(163,230,53,0.3)] hover:shadow-[0_0_0_1px_rgba(163,230,53,0.5),0_8px_24px_-12px_rgba(163,230,53,0.4)]",
        secondary:
          "bg-bg-elevated text-text-primary border border-border-default hover:border-border-strong hover:bg-bg-subtle",
        ghost:
          "text-text-secondary hover:text-text-primary hover:bg-bg-elevated",
        outline:
          "border border-border-default text-text-primary hover:border-accent/50 hover:bg-accent-subtle",
        danger:
          "bg-danger/10 text-danger border border-danger/20 hover:bg-danger/15",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, children, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{ className?: string }>;
      return React.cloneElement(child, {
        className: cn(buttonVariants({ variant, size }), child.props.className, className),
      });
    }
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

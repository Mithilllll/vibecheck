"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type ?? "text"}
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-lg border border-border-default bg-bg-elevated px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted",
          "transition-colors duration-150",
          "hover:border-border-strong",
          "focus-visible:outline-none focus-visible:border-accent/50 focus-visible:ring-2 focus-visible:ring-accent/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "file:border-0 file:bg-transparent file:text-sm file:text-text-secondary",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

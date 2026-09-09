"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-[88px] w-full rounded-lg border border-border-default bg-bg-elevated px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted",
          "transition-colors duration-150 resize-y",
          "hover:border-border-strong",
          "focus-visible:outline-none focus-visible:border-accent/50 focus-visible:ring-2 focus-visible:ring-accent/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

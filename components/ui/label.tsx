"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "block text-sm font-medium text-text-primary mb-1.5",
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="text-accent ml-0.5">*</span>}
      </label>
    );
  }
);
Label.displayName = "Label";

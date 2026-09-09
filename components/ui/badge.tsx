import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium tracking-tight",
  {
    variants: {
      variant: {
        default:
          "bg-bg-elevated text-text-secondary border border-border-subtle",
        accent:
          "bg-accent-subtle text-accent border border-accent/20",
        success:
          "bg-success/10 text-success border border-success/20",
        warn:
          "bg-warn/10 text-warn border border-warn/20",
        danger:
          "bg-danger/10 text-danger border border-danger/20",
        outline:
          "border border-border-default text-text-secondary",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}

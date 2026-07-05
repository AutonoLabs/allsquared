import * as React from "react";
import { cn } from "@/lib/utils";

type MD3CardVariant = "elevated" | "filled" | "outlined";

interface MD3CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: MD3CardVariant;
}

const variantStyles: Record<MD3CardVariant, string> = {
  elevated:
    "bg-[var(--md-sys-color-surface-container-low)] shadow-[var(--md-sys-elevation-1)] hover:shadow-[var(--md-sys-elevation-2)] border-none",
  filled:
    "bg-[var(--md-sys-color-surface-container-highest)] border-none",
  outlined:
    "bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)]",
};

export function MD3Card({
  variant = "elevated",
  className,
  children,
  ...props
}: MD3CardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--md-sys-shape-large)] transition-shadow duration-200",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function MD3CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  );
}

export function MD3CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-6 pt-6 pb-0", className)} {...props}>
      {children}
    </div>
  );
}

export function MD3CardActions({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center gap-2 px-6 pb-6 pt-4", className)} {...props}>
      {children}
    </div>
  );
}

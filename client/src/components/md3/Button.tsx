import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

type MD3ButtonVariant = "filled" | "outlined" | "text" | "elevated" | "tonal";
type MD3ButtonSize = "default" | "sm" | "lg";

interface MD3ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: MD3ButtonVariant;
  size?: MD3ButtonSize;
  icon?: React.ReactNode;
  asChild?: boolean;
}

const variantStyles: Record<MD3ButtonVariant, string> = {
  filled:
    "bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] shadow-[var(--md-sys-elevation-0)] hover:shadow-[var(--md-sys-elevation-1)]",
  outlined:
    "bg-transparent text-[var(--md-sys-color-primary)] border border-[var(--md-sys-color-outline)] hover:bg-[var(--md-sys-color-primary)]/[0.08]",
  text:
    "bg-transparent text-[var(--md-sys-color-primary)]",
  elevated:
    "bg-[var(--md-sys-color-surface-container-low)] text-[var(--md-sys-color-primary)] shadow-[var(--md-sys-elevation-1)] hover:shadow-[var(--md-sys-elevation-2)]",
  tonal:
    "bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] hover:shadow-[var(--md-sys-elevation-1)]",
};

const sizeStyles: Record<MD3ButtonSize, string> = {
  default: "h-10 px-6 text-sm",
  sm: "h-8 px-4 text-xs",
  lg: "h-12 px-8 text-base",
};

export function MD3Button({
  variant = "filled",
  size = "default",
  icon,
  className,
  children,
  asChild = false,
  ...props
}: MD3ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(
        // Base
        "relative inline-flex items-center justify-center gap-2 overflow-hidden isolate",
        "rounded-[var(--md-sys-shape-extra-large)] font-medium",
        "tracking-[0.006em] transition-all duration-200",
        "outline-none focus-visible:ring-2 focus-visible:ring-[var(--md-sys-color-primary)]",
        "disabled:opacity-[0.38] disabled:pointer-events-none",
        // State layer
        "before:absolute before:inset-0 before:rounded-[inherit] before:opacity-0 before:bg-current before:pointer-events-none before:transition-opacity before:duration-200",
        "hover:before:opacity-[0.08] active:before:opacity-[0.12]",
        // Variant + size
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0 [&_svg]:size-[18px]">{icon}</span>}
      {children}
    </Comp>
  );
}

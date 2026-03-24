import * as React from "react";
import { cn } from "@/lib/utils";

type MD3FABSize = "small" | "default" | "large";
type MD3FABColor = "primary" | "surface" | "secondary" | "tertiary";

interface MD3FABProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  size?: MD3FABSize;
  color?: MD3FABColor;
  label?: string;
}

const sizeStyles: Record<MD3FABSize, string> = {
  small: "h-10 w-10 rounded-[var(--md-sys-shape-medium)] [&_svg]:size-6",
  default: "h-14 w-14 rounded-[var(--md-sys-shape-large)] [&_svg]:size-6",
  large: "h-24 w-24 rounded-[var(--md-sys-shape-extra-large)] [&_svg]:size-9",
};

const colorStyles: Record<MD3FABColor, string> = {
  primary:
    "bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)]",
  surface:
    "bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-primary)]",
  secondary:
    "bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)]",
  tertiary:
    "bg-[var(--md-sys-color-tertiary-container)] text-[var(--md-sys-color-on-tertiary-container)]",
};

export function MD3FAB({
  icon,
  size = "default",
  color = "primary",
  label,
  className,
  ...props
}: MD3FABProps) {
  const isExtended = !!label;

  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center gap-3 overflow-hidden isolate",
        "shadow-[var(--md-sys-elevation-3)] hover:shadow-[var(--md-sys-elevation-4)]",
        "transition-all duration-200",
        "outline-none focus-visible:ring-2 focus-visible:ring-[var(--md-sys-color-primary)]",
        // State layer
        "before:absolute before:inset-0 before:rounded-[inherit] before:opacity-0 before:bg-current before:pointer-events-none before:transition-opacity",
        "hover:before:opacity-[0.08] active:before:opacity-[0.12]",
        colorStyles[color],
        isExtended
          ? "h-14 rounded-[var(--md-sys-shape-large)] px-4 w-auto [&_svg]:size-6"
          : sizeStyles[size],
        className
      )}
      {...props}
    >
      {icon}
      {label && (
        <span className="text-sm font-medium tracking-[0.006em] pr-2">
          {label}
        </span>
      )}
    </button>
  );
}

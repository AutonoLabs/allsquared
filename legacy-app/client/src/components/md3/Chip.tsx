import * as React from "react";
import { cn } from "@/lib/utils";

type MD3ChipVariant = "assist" | "filter" | "input" | "suggestion";

interface MD3ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: MD3ChipVariant;
  icon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  selected?: boolean;
  elevated?: boolean;
}

export function MD3Chip({
  variant = "assist",
  icon,
  trailingIcon,
  selected = false,
  elevated = false,
  className,
  children,
  ...props
}: MD3ChipProps) {
  const isFilter = variant === "filter";

  return (
    <button
      className={cn(
        "relative inline-flex h-8 items-center gap-2 overflow-hidden isolate",
        "rounded-[var(--md-sys-shape-small)] px-4 text-sm font-medium",
        "tracking-[0.006em] transition-all duration-200",
        "outline-none focus-visible:ring-2 focus-visible:ring-[var(--md-sys-color-primary)]",
        // State layer
        "before:absolute before:inset-0 before:rounded-[inherit] before:opacity-0 before:bg-current before:pointer-events-none before:transition-opacity",
        "hover:before:opacity-[0.08] active:before:opacity-[0.12]",
        // Styling based on selection & variant
        selected
          ? "bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] border-none"
          : cn(
              "border border-[var(--md-sys-color-outline)] text-[var(--md-sys-color-on-surface-variant)]",
              elevated && "shadow-[var(--md-sys-elevation-1)] border-none bg-[var(--md-sys-color-surface-container-low)]"
            ),
        icon && "pl-2",
        trailingIcon && "pr-2",
        className
      )}
      {...props}
    >
      {icon && <span className="[&_svg]:size-[18px]">{icon}</span>}
      {isFilter && selected && !icon && (
        <svg className="size-[18px]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
      )}
      {children}
      {trailingIcon && <span className="[&_svg]:size-[18px]">{trailingIcon}</span>}
    </button>
  );
}

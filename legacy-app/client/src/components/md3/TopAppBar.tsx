import * as React from "react";
import { cn } from "@/lib/utils";

type MD3TopAppBarVariant = "center-aligned" | "small" | "medium" | "large";

interface MD3TopAppBarProps {
  variant?: MD3TopAppBarVariant;
  title: string;
  leadingIcon?: React.ReactNode;
  trailingIcons?: React.ReactNode[];
  className?: string;
  elevated?: boolean;
}

export function MD3TopAppBar({
  variant = "small",
  title,
  leadingIcon,
  trailingIcons,
  className,
  elevated = false,
}: MD3TopAppBarProps) {
  const isTall = variant === "medium" || variant === "large";

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full",
        "bg-[var(--md-sys-color-surface)]",
        elevated && "shadow-[var(--md-sys-elevation-2)]",
        "transition-shadow duration-200",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center gap-1 px-1",
          isTall ? "h-16" : "h-16"
        )}
      >
        {leadingIcon && (
          <button className="flex h-12 w-12 items-center justify-center rounded-[var(--md-sys-shape-full)] text-[var(--md-sys-color-on-surface)] hover:bg-[var(--md-sys-color-on-surface)]/[0.08] transition-colors">
            {leadingIcon}
          </button>
        )}

        {!isTall && (
          <h1
            className={cn(
              "flex-1 truncate px-3 text-[var(--md-sys-color-on-surface)]",
              variant === "center-aligned"
                ? "text-center text-lg font-medium"
                : "text-lg font-medium"
            )}
          >
            {title}
          </h1>
        )}

        {isTall && <div className="flex-1" />}

        {trailingIcons && (
          <div className="flex items-center">
            {trailingIcons.map((icon, i) => (
              <button
                key={i}
                className="flex h-12 w-12 items-center justify-center rounded-[var(--md-sys-shape-full)] text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-on-surface)]/[0.08] transition-colors"
              >
                {icon}
              </button>
            ))}
          </div>
        )}
      </div>

      {isTall && (
        <div
          className={cn(
            "px-4 pb-6",
            variant === "medium" ? "pt-0" : "pt-2"
          )}
        >
          <h1
            className={cn(
              "text-[var(--md-sys-color-on-surface)]",
              variant === "medium"
                ? "text-[1.75rem] leading-9 font-medium"
                : "text-[2.25rem] leading-[2.75rem] font-medium"
            )}
          >
            {title}
          </h1>
        </div>
      )}
    </header>
  );
}

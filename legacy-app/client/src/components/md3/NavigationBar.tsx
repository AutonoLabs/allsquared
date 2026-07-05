import * as React from "react";
import { cn } from "@/lib/utils";

interface NavigationBarItem {
  icon: React.ReactNode;
  label: string;
  value: string;
  badge?: number;
}

interface MD3NavigationBarProps {
  items: NavigationBarItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function MD3NavigationBar({ items, value, onChange, className }: MD3NavigationBarProps) {
  return (
    <nav
      className={cn(
        "flex items-stretch justify-around",
        "bg-[var(--md-sys-color-surface-container)] shadow-[var(--md-sys-elevation-2)]",
        "h-20 w-full",
        className
      )}
    >
      {items.map((item) => {
        const active = value === item.value;
        return (
          <button
            key={item.value}
            onClick={() => onChange(item.value)}
            className={cn(
              "relative flex flex-1 flex-col items-center justify-center gap-1 pt-3 pb-4",
              "outline-none transition-colors duration-200",
              "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--md-sys-color-primary)]"
            )}
          >
            <div
              className={cn(
                "relative flex h-8 w-16 items-center justify-center rounded-[var(--md-sys-shape-full)]",
                "transition-all duration-200",
                active
                  ? "bg-[var(--md-sys-color-secondary-container)]"
                  : "hover:bg-[var(--md-sys-color-on-surface)]/[0.08]"
              )}
            >
              <span
                className={cn(
                  "[&_svg]:size-6 transition-colors",
                  active
                    ? "text-[var(--md-sys-color-on-secondary-container)]"
                    : "text-[var(--md-sys-color-on-surface-variant)]"
                )}
              >
                {item.icon}
              </span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-0.5 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--md-sys-color-error)] px-1 text-[10px] font-medium text-[var(--md-sys-color-on-error)]">
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}
            </div>
            <span
              className={cn(
                "text-xs font-medium tracking-[0.031em]",
                active
                  ? "text-[var(--md-sys-color-on-surface)]"
                  : "text-[var(--md-sys-color-on-surface-variant)]"
              )}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

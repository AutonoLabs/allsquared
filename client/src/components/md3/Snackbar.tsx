import * as React from "react";
import { cn } from "@/lib/utils";

interface MD3SnackbarProps {
  open: boolean;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
  duration?: number;
  className?: string;
}

export function MD3Snackbar({
  open,
  message,
  action,
  onClose,
  duration = 4000,
  className,
}: MD3SnackbarProps) {
  React.useEffect(() => {
    if (!open || !onClose) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [open, onClose, duration]);

  if (!open) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed bottom-6 left-1/2 z-50 -translate-x-1/2",
        "flex items-center gap-2 min-w-[288px] max-w-[560px]",
        "rounded-[var(--md-sys-shape-extra-small)] bg-[var(--md-sys-color-inverse-surface)]",
        "px-4 py-3.5 shadow-[var(--md-sys-elevation-3)]",
        "animate-in slide-in-from-bottom-4 fade-in-0 duration-200",
        className
      )}
    >
      <span className="flex-1 text-sm text-[var(--md-sys-color-inverse-on-surface)]">
        {message}
      </span>
      {action && (
        <button
          onClick={action.onClick}
          className="shrink-0 text-sm font-medium text-[var(--md-sys-color-inverse-primary)] hover:opacity-80 transition-opacity"
        >
          {action.label}
        </button>
      )}
      {onClose && !action && (
        <button
          onClick={onClose}
          className="shrink-0 p-1 text-[var(--md-sys-color-inverse-on-surface)] hover:opacity-80 transition-opacity"
          aria-label="Dismiss"
        >
          <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      )}
    </div>
  );
}

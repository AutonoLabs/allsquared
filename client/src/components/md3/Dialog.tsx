import * as React from "react";
import { cn } from "@/lib/utils";

interface MD3DialogProps {
  open: boolean;
  onClose: () => void;
  icon?: React.ReactNode;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function MD3Dialog({
  open,
  onClose,
  icon,
  title,
  children,
  actions,
  className,
}: MD3DialogProps) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      {/* Scrim */}
      <div
        className="absolute inset-0 bg-[var(--md-sys-color-scrim)]/[0.32]"
        onClick={onClose}
      />

      {/* Dialog surface */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative w-full max-w-[560px] max-h-[calc(100vh-48px)] overflow-auto",
          "rounded-[var(--md-sys-shape-extra-large)] bg-[var(--md-sys-color-surface-container-high)]",
          "shadow-[var(--md-sys-elevation-3)] p-6",
          "animate-in fade-in-0 zoom-in-95 duration-200",
          className
        )}
      >
        {icon && (
          <div className="mb-4 flex justify-center text-[var(--md-sys-color-secondary)] [&_svg]:size-6">
            {icon}
          </div>
        )}

        {title && (
          <h2
            className={cn(
              "text-[var(--md-sys-color-on-surface)] text-2xl font-medium",
              icon ? "text-center mb-4" : "mb-4"
            )}
          >
            {title}
          </h2>
        )}

        <div className="text-[var(--md-sys-color-on-surface-variant)] text-sm leading-5">
          {children}
        </div>

        {actions && (
          <div className="mt-6 flex items-center justify-end gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

import * as React from "react";
import { cn } from "@/lib/utils";

type MD3TextFieldVariant = "outlined" | "filled";

interface MD3TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: MD3TextFieldVariant;
  label?: string;
  supportingText?: string;
  error?: boolean;
  errorText?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

export function MD3TextField({
  variant = "outlined",
  label,
  supportingText,
  error = false,
  errorText,
  leadingIcon,
  trailingIcon,
  className,
  id,
  ...props
}: MD3TextFieldProps) {
  const [focused, setFocused] = React.useState(false);
  const [hasValue, setHasValue] = React.useState(!!props.value || !!props.defaultValue);
  const inputId = id || React.useId();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const floated = focused || hasValue;
  const activeColor = error
    ? "var(--md-sys-color-error)"
    : "var(--md-sys-color-primary)";

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "relative flex items-center",
          variant === "filled"
            ? "bg-[var(--md-sys-color-surface-container-highest)] rounded-t-[var(--md-sys-shape-extra-small)] border-b-2"
            : "rounded-[var(--md-sys-shape-extra-small)] border",
          error
            ? "border-[var(--md-sys-color-error)]"
            : focused
              ? "border-[var(--md-sys-color-primary)]"
              : "border-[var(--md-sys-color-outline)]",
          variant === "filled" && !focused && !error && "border-b-[var(--md-sys-color-on-surface-variant)]"
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {leadingIcon && (
          <span className="pl-3 text-[var(--md-sys-color-on-surface-variant)] [&_svg]:size-5">
            {leadingIcon}
          </span>
        )}
        <div className="relative flex-1 min-w-0">
          {label && (
            <label
              htmlFor={inputId}
              className={cn(
                "absolute left-4 transition-all duration-200 pointer-events-none",
                "text-[var(--md-sys-color-on-surface-variant)]",
                floated
                  ? "-top-2.5 text-xs px-1 bg-[var(--md-sys-color-surface)]"
                  : "top-1/2 -translate-y-1/2 text-base",
                focused && !error && "text-[var(--md-sys-color-primary)]",
                error && "text-[var(--md-sys-color-error)]",
                variant === "filled" && floated && "bg-transparent"
              )}
              style={floated ? { color: activeColor } : undefined}
            >
              {label}
            </label>
          )}
          <input
            ref={inputRef}
            id={inputId}
            className={cn(
              "w-full bg-transparent px-4 py-4 text-base text-[var(--md-sys-color-on-surface)]",
              "outline-none placeholder:text-[var(--md-sys-color-on-surface-variant)]/60",
              label && "pt-5 pb-2"
            )}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              setHasValue(!!e.target.value);
              props.onBlur?.(e);
            }}
            onChange={(e) => {
              setHasValue(!!e.target.value);
              props.onChange?.(e);
            }}
            {...props}
          />
        </div>
        {trailingIcon && (
          <span className="pr-3 text-[var(--md-sys-color-on-surface-variant)] [&_svg]:size-5">
            {trailingIcon}
          </span>
        )}
      </div>
      {(supportingText || errorText) && (
        <p
          className={cn(
            "mt-1 px-4 text-xs",
            error
              ? "text-[var(--md-sys-color-error)]"
              : "text-[var(--md-sys-color-on-surface-variant)]"
          )}
        >
          {error ? errorText : supportingText}
        </p>
      )}
    </div>
  );
}

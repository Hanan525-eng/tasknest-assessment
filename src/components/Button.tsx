
// src/components/Button.tsx
import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

/**
 * Button
 * -----------------------------------------------------------------------
 * Reusable button with variant/size support, built on top of the design
 * tokens defined in index.css (--color-primary, --color-danger, etc.)
 * instead of hardcoded hex values.
 * -----------------------------------------------------------------------
 */

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium " +
  "transition-colors duration-150 focus-visible:outline focus-visible:outline-2 " +
  "focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-(--color-primary) text-white hover:brightness-110 " +
    "focus-visible:outline-(--color-primary)",
  secondary:
    "bg-(--color-surface) text-(--color-text) border border-(--color-border) " +
    "hover:bg-(--color-background) focus-visible:outline-(--color-primary)",
  danger:
    "bg-(--color-danger) text-white hover:brightness-110 " +
    "focus-visible:outline-(--color-danger)",
  ghost:
    "bg-transparent text-(--color-text) hover:bg-(--color-background) " +
    "focus-visible:outline-(--color-primary)",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "text-sm px-3 py-1.5",
  md: "text-sm px-4 py-2.5",
  lg: "text-base px-5 py-3",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      className = "",
      children,
      ...rest
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        aria-busy={isLoading}
        {...rest}
      >
        {isLoading && (
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
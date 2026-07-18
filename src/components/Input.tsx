// src/components/Input.tsx

import { forwardRef, useId } from "react";
import type { InputHTMLAttributes } from "react";

/**
 * Input
 * -----------------------------------------------------------------------
 * Reusable text input with a bound <label>, optional error message, and
 * forwardRef support so it plugs directly into react-hook-form's
 * `register()` without a wrapper.
 * -----------------------------------------------------------------------
 */

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  /** Keeps the label accessible to screen readers but visually hidden — useful for search bars where a visible label would be redundant with the placeholder. */
  hideLabel?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hideLabel = false, id, className = "", ...rest }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className={hideLabel ? "sr-only" : "text-sm font-medium text-(--color-text)"}
        >
          {label}
        </label>

        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={
            "rounded-sm border px-3 py-2.5 text-sm text-(--color-text) " +
            "bg-(--color-surface) placeholder:text-(--color-text-muted) " +
            "focus:outline-2 focus:outline-offset-1 " +
            (error
              ? "border-(--color-danger) focus:outline-(--color-danger)"
              : "border-(--color-border) focus:outline-(--color-primary)") +
            ` ${className}`
          }
          {...rest}
        />

        {error && (
          <p id={errorId} role="alert" className="text-xs text-(--color-danger)">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";


// src/components/Input.tsx

import { forwardRef, useId, useState } from "react";
import type { InputHTMLAttributes } from "react";

/**
 * Input
 * -----------------------------------------------------------------------
 * Reusable text input with a bound <label>, optional error message, and
 * forwardRef support so it plugs directly into react-hook-form's
 * `register()` without a wrapper.
 *
 * When type="password" is passed, a show/hide toggle button is rendered
 * automatically inside the field (no extra prop needed).
 * -----------------------------------------------------------------------
 */

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M17.94 17.94A10.94 10.94 0 0112 19c-7 0-11-7-11-7a20.3 20.3 0 015.06-5.94M9.9 4.24A9.96 9.96 0 0112 4c7 0 11 7 11 7a20.32 20.32 0 01-2.32 3.34M14.12 14.12a3 3 0 11-4.24-4.24"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path d="M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, type = "text", className = "", ...rest }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    const isPassword = type === "password";
    const [showPassword, setShowPassword] = useState(false);
    const actualType = isPassword && showPassword ? "text" : type;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-(--color-text)"
        >
          {label}
        </label>

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={actualType}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            className={
              "w-full rounded-sm border px-3 py-2.5 text-sm text-(--color-text) " +
              "bg-(--color-surface) placeholder:text-(--color-text-muted) " +
              "focus:outline-2 focus:outline-offset-1 " +
              "disabled:opacity-50 disabled:cursor-not-allowed " +
              (isPassword ? "pe-10 " : "") +
              (error
                ? "border-(--color-danger) focus:outline-(--color-danger)"
                : "border-(--color-border) focus:outline-(--color-primary)") +
              ` ${className}`
            }
            {...rest}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              tabIndex={-1}
              className="absolute inset-y-0 end-0 flex items-center px-3 text-(--color-text-muted) hover:text-(--color-primary)"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          )}
        </div>

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
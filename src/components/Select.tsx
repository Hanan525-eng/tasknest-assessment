//  src/components/Select.tsx

import { forwardRef, useId } from "react";
import type { SelectHTMLAttributes } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  hideLabel?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, hideLabel = false, id, className = "", ...rest }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={selectId}
          className={hideLabel ? "sr-only" : "text-sm font-medium text-(--color-text)"}
        >
          {label}
        </label>

        <select
          ref={ref}
          id={selectId}
          aria-invalid={Boolean(error)}
          className={
            "rounded-sm border px-3 py-2.5 text-sm text-(--color-text) " +
            "bg-(--color-surface) focus:outline-2 focus:outline-offset-1 " +
            (error
              ? "border-(--color-danger) focus:outline-(--color-danger)"
              : "border-(--color-border) focus:outline-(--color-primary)") +
            ` ${className}`
          }
          {...rest}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {error && <p role="alert" className="text-xs text-(--color-danger)">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
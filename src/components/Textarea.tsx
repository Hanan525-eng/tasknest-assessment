// src/components/Textarea.tsx

import { forwardRef, useId } from "react";
import type { TextareaHTMLAttributes } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, id, className = "", ...rest }, ref) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={textareaId} className="text-sm font-medium text-(--color-text)">
          {label}
        </label>

        <textarea
          ref={ref}
          id={textareaId}
          rows={3}
          aria-invalid={Boolean(error)}
          className={
            "rounded-sm border px-3 py-2.5 text-sm text-(--color-text) " +
            "bg-(--color-surface) placeholder:text-(--color-text-muted) resize-none " +
            "focus:outline-2 focus:outline-offset-1 " +
            (error
              ? "border-(--color-danger) focus:outline-(--color-danger)"
              : "border-(--color-border) focus:outline-(--color-primary)") +
            ` ${className}`
          }
          {...rest}
        />

        {error && <p role="alert" className="text-xs text-(--color-danger)">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
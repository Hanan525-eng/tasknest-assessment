// src/components/Badge.tsx


import type { HTMLAttributes } from "react";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "primary";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  /** Shows a small colored dot before the label, matching the badge's color. */
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-(--color-background) text-(--color-text-muted)",
  success: "bg-(--color-success)/10 text-(--color-success)",
  warning: "bg-(--color-warning)/10 text-(--color-warning)",
  danger: "bg-(--color-danger)/10 text-(--color-danger)",
  primary: "bg-(--color-primary)/10 text-(--color-primary)",
};

export function Badge({
  variant = "default",
  dot = false,
  className = "",
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={
        "inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-xs font-medium " +
        variantStyles[variant] +
        ` ${className}`
      }
      {...rest}
    >
      {dot && (
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-current"
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
} 


// src/components/Badge.tsx

import type { HTMLAttributes } from "react";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "primary";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
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
  className = "",
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={
        "inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium " +
        variantStyles[variant] +
        ` ${className}`
      }
      {...rest}
    >
      {children}
    </span>
  );
}
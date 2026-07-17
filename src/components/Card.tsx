// // src/components/Card.tsx

import type { HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export function Card({
  interactive = false,
  className = "",
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={
        "rounded-md border border-(--color-border) bg-(--color-surface) p-4 shadow-[var(--shadow-sm)] " +
        (interactive
          ? "cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] "
          : "") +
        className
      }
      {...rest}
    >
      {children}
    </div>
  );
}



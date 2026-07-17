// src/components/EmptyState.tsx

import type { ReactNode } from "react";

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-(--color-border) py-16 text-center">
      <p className="text-sm font-medium text-(--color-text)">{title}</p>
      {description && (
        <p className="text-sm text-(--color-text-muted)">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
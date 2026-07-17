// src/components/Skeleton.tsx

import type { HTMLAttributes } from "react";

export function Skeleton({ className = "", ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-sm bg-(--color-border) ${className}`}
      aria-hidden="true"
      {...rest}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-md border border-(--color-border) bg-(--color-surface) p-4">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}
//  src/features/tasks/components/KanbanColumn.tsx

import { useDroppable } from "@dnd-kit/core";
import type { ReactNode } from "react";

export interface KanbanColumnProps {
  id: string;
  title: string;
  children: ReactNode;
}

export function KanbanColumn({ id, title, children }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={
        "flex min-h-[220px] flex-1 flex-col gap-3 rounded-md border p-3 transition-colors " +
        (isOver
          ? "border-(--color-primary) bg-(--color-primary)/5"
          : "border-(--color-border) bg-(--color-background)")
      }
    >
      <h3 className="text-sm font-semibold text-(--color-text)">{title}</h3>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
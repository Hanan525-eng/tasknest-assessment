//  src/features/tasks/components/KanbanTaskCard.tsx

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useTranslation } from "react-i18next";
import { Pencil, Trash2 } from "lucide-react";

import { Card } from "../../../components/Card";
import { Badge } from "../../../components/Badge";
import type { Task, TaskPriority } from "../../../types/task.types";

const priorityVariant: Record<TaskPriority, "default" | "warning" | "danger"> = {
  low: "default",
  medium: "warning",
  high: "danger",
};

const priorityTranslationKey: Record<TaskPriority, string> = {
  low: "task.priority.low",
  medium: "task.priority.medium",
  high: "task.priority.high",
};

export interface KanbanTaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function KanbanTaskCard({ task, onEdit, onDelete }: KanbanTaskCardProps) {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-medium text-(--color-text)">{task.title}</h4>

          {/* Drag handle: only this element is draggable, so Edit/Delete stay clickable. */}
          <button
            type="button"
            aria-label="Drag to change status"
            className="shrink-0 cursor-grab touch-none rounded-sm px-1 text-(--color-text-muted) active:cursor-grabbing"
            {...listeners}
            {...attributes}
          >
            ⠿
          </button>
        </div>

        <Badge variant={priorityVariant[task.priority]} dot className="w-fit">
          {t(priorityTranslationKey[task.priority])}
        </Badge>

        {task.dueDate && (
          <p className="text-xs text-(--color-text-muted)">
            {t("task.due", { date: task.dueDate })}
          </p>
        )}

        <div className="mt-1 flex justify-end gap-1">
          <button
            type="button"
            title={t("common.edit")}
            aria-label={t("common.edit")}
            onClick={() => onEdit(task)}
            className="rounded-sm p-1 text-(--color-text-muted) hover:bg-(--color-background) hover:text-(--color-text)"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            title={t("common.delete")}
            aria-label={t("common.delete")}
            onClick={() => onDelete(task)}
            className="rounded-sm p-1 text-(--color-text-muted) hover:bg-(--color-danger)/10 hover:text-(--color-danger)"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </Card>
    </div>
  );
}


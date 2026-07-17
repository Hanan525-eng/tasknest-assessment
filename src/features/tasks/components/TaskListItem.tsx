//  src/features/tasks/components/TaskListItem.tsx

import { Card } from "../../../components/Card";
import { Badge } from "../../../components/Badge";
import { Select } from "../../../components/Select";
import { Button } from "../../../components/Button";
import {
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  TASK_PRIORITY_LABELS,
} from "../../../constants/task.constants";
import type { Task, TaskStatus, TaskPriority } from "../../../types/task.types";

export interface TaskListItemProps {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const priorityVariant: Record<TaskPriority, "default" | "warning" | "danger"> = {
  low: "default",
  medium: "warning",
  high: "danger",
};

export function TaskListItem({ task, onStatusChange, onEdit, onDelete }: TaskListItemProps) {
  return (
    <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <h3 className="font-medium text-(--color-text)">{task.title}</h3>
          <Badge variant={priorityVariant[task.priority]}>
            {TASK_PRIORITY_LABELS[task.priority]}
          </Badge>
        </div>

        {task.description && (
          <p className="line-clamp-1 text-sm text-(--color-text-muted)">{task.description}</p>
        )}

        {task.dueDate && (
          <p className="mt-1 text-xs text-(--color-text-muted)">Due {task.dueDate}</p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Select
          label="Status"
          hideLabel
          className="w-40"
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
          options={TASK_STATUSES.map((status) => ({
            value: status,
            label: TASK_STATUS_LABELS[status],
          }))}
          aria-label="Task status"
        />

        <Button type="button" variant="ghost" size="sm" onClick={() => onEdit(task)}>
          Edit
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => onDelete(task)}>
          Delete
        </Button>
      </div>
    </Card>
  );
}
//  src/features/tasks/components/KanbanBoard.tsx

import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { useTranslation } from "react-i18next";

import { KanbanColumn } from "./KanbanColumn";
import { KanbanTaskCard } from "./KanbanTaskCard";
import { TASK_STATUSES } from "../../../constants/task.constants";
import type { Task, TaskStatus } from "../../../types/task.types";

const statusTranslationKey: Record<TaskStatus, string> = {
  todo: "task.status.todo",
  "in-progress": "task.status.inProgress",
  done: "task.status.done",
};

export interface KanbanBoardProps {
  tasks: Task[];
  onStatusChange: (id: string, status: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function KanbanBoard({ tasks, onStatusChange, onEdit, onDelete }: KanbanBoardProps) {
  const { t } = useTranslation();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const newStatus = over.id as TaskStatus;
    const task = tasks.find((t) => t.id === active.id);

    if (task && task.status !== newStatus) {
      onStatusChange(task.id, newStatus);
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex flex-col gap-4 sm:flex-row">
        {TASK_STATUSES.map((status) => (
          <KanbanColumn key={status} id={status} title={t(statusTranslationKey[status])}>
            {tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <KanbanTaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
              ))}
          </KanbanColumn>
        ))}
      </div>
    </DndContext>
  );
}
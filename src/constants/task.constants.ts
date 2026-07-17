//  src/constants/task.constants.ts

import type { TaskStatus, TaskPriority } from "../types/task.types";

export const TASK_STATUSES = ["todo", "in-progress", "done"] as const;

export const TASK_PRIORITIES = ["low", "medium", "high"] as const;

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To Do",
  "in-progress": "In Progress",
  done: "Done",
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};
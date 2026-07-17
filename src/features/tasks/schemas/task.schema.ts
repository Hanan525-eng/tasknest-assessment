import { z } from "zod";
import { TASK_STATUSES, TASK_PRIORITIES } from "../../../constants/task.constants";

export const taskSchema = z.object({
  title: z.string().min(1, "validation.taskTitle.required"),
  description: z.string().max(500, "validation.description.maxLength"),
  status: z.enum(TASK_STATUSES),
  priority: z.enum(TASK_PRIORITIES),
  dueDate: z.string().min(1, "validation.dueDate.required"),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
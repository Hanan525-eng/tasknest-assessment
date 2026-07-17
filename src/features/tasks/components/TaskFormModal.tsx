
// src/features/tasks/components/TaskFormModal.tsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Modal } from "../../../components/Modal";
import { Input } from "../../../components/Input";
import { Textarea } from "../../../components/Textarea";
import { Select } from "../../../components/Select";
import { Button } from "../../../components/Button";
import {
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  TASK_PRIORITIES,
  TASK_PRIORITY_LABELS,
} from "../../../constants/task.constants";
import { taskSchema, type TaskFormValues } from "../schemas/task.schema";
import type { Task } from "../../../types/task.types";

export interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormValues) => void;
  initialTask?: Task | null;
}

export function TaskFormModal({ isOpen, onClose, onSubmit, initialTask }: TaskFormModalProps) {
  const isEditing = Boolean(initialTask);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      dueDate: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        title: initialTask?.title ?? "",
        description: initialTask?.description ?? "",
        status: initialTask?.status ?? "todo",
        priority: initialTask?.priority ?? "medium",
        dueDate: initialTask?.dueDate ?? "",
      });
    }
  }, [isOpen, initialTask, reset]);

  const handleFormSubmit = (data: TaskFormValues) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Edit task" : "New task"}>
      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="flex flex-col gap-4">
        <Input label="Title" error={errors.title?.message} {...register("title")} />

        <Textarea
          label="Description"
          error={errors.description?.message}
          {...register("description")}
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Status"
            error={errors.status?.message}
            options={TASK_STATUSES.map((s) => ({ value: s, label: TASK_STATUS_LABELS[s] }))}
            {...register("status")}
          />

          <Select
            label="Priority"
            error={errors.priority?.message}
            options={TASK_PRIORITIES.map((p) => ({ value: p, label: TASK_PRIORITY_LABELS[p] }))}
            {...register("priority")}
          />
        </div>

        <Input type="date" label="Due date" error={errors.dueDate?.message} {...register("dueDate")} />

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{isEditing ? "Save changes" : "Create task"}</Button>
        </div>
      </form>
    </Modal>
  );
}
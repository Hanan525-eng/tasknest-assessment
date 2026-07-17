
// src/features/tasks/components/TaskFormModal.tsx


import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

import { Modal } from "../../../components/Modal";
import { Input } from "../../../components/Input";
import { Textarea } from "../../../components/Textarea";
import { Select } from "../../../components/Select";
import { Button } from "../../../components/Button";
import { TASK_STATUSES, TASK_PRIORITIES } from "../../../constants/task.constants";
import { taskSchema, type TaskFormValues } from "../schemas/task.schema";
import type { Task, TaskStatus, TaskPriority } from "../../../types/task.types";

export interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormValues) => void;
  initialTask?: Task | null;
}

const statusTranslationKey: Record<TaskStatus, string> = {
  todo: "task.status.todo",
  "in-progress": "task.status.inProgress",
  done: "task.status.done",
};

const priorityTranslationKey: Record<TaskPriority, string> = {
  low: "task.priority.low",
  medium: "task.priority.medium",
  high: "task.priority.high",
};

export function TaskFormModal({ isOpen, onClose, onSubmit, initialTask }: TaskFormModalProps) {
  const { t } = useTranslation();
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? t("task.form.editTitle") : t("task.form.createTitle")}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="flex flex-col gap-4">
        <Input
          label={t("task.form.titleLabel")}
          error={errors.title?.message ? t(errors.title.message) : undefined}
          {...register("title")}
        />

        <Textarea
          label={t("task.form.descriptionLabel")}
          error={errors.description?.message ? t(errors.description.message) : undefined}
          {...register("description")}
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            label={t("task.form.statusLabel")}
            error={errors.status?.message ? t(errors.status.message) : undefined}
            options={TASK_STATUSES.map((s) => ({ value: s, label: t(statusTranslationKey[s]) }))}
            {...register("status")}
          />

          <Select
            label={t("task.form.priorityLabel")}
            error={errors.priority?.message ? t(errors.priority.message) : undefined}
            options={TASK_PRIORITIES.map((p) => ({ value: p, label: t(priorityTranslationKey[p]) }))}
            {...register("priority")}
          />
        </div>

        <Input
          type="date"
          label={t("task.form.dueDateLabel")}
          error={errors.dueDate?.message ? t(errors.dueDate.message) : undefined}
          {...register("dueDate")}
        />

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button type="submit">
            {isEditing ? t("task.form.save") : t("task.form.create")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}


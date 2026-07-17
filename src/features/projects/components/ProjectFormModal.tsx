// src/features/projects/components/ProjectFormModal.tsx

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

import { Modal } from "../../../components/Modal";
import { Input } from "../../../components/Input";
import { Textarea } from "../../../components/Textarea";
import { Button } from "../../../components/Button";
import { PROJECT_COLORS } from "../../../constants/project.constants";
import { projectSchema, type ProjectFormValues } from "../schemas/project.schema";
import type { Project } from "../../../types/project.types";

export interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormValues) => void;
  initialProject?: Project | null;
}

export function ProjectFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialProject,
}: ProjectFormModalProps) {
  const { t } = useTranslation();
  const isEditing = Boolean(initialProject);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: { name: "", description: "", color: PROJECT_COLORS[0] },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: initialProject?.name ?? "",
        description: initialProject?.description ?? "",
        color: initialProject?.color ?? PROJECT_COLORS[0],
      });
    }
  }, [isOpen, initialProject, reset]);

  const selectedColor = watch("color");

  const handleFormSubmit = (data: ProjectFormValues) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? t("project.form.editTitle") : t("project.form.createTitle")}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="flex flex-col gap-4">
        <Input
          label={t("project.form.nameLabel")}
          error={errors.name?.message ? t(errors.name.message) : undefined}
          {...register("name")}
        />

        <Textarea
          label={t("project.form.descriptionLabel")}
          error={errors.description?.message ? t(errors.description.message) : undefined}
          {...register("description")}
        />

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-(--color-text)">
            {t("project.form.colorLabel")}
          </span>
          <div className="flex gap-2">
            {PROJECT_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                aria-label={`Select color ${color}`}
                aria-pressed={selectedColor === color}
                onClick={() => setValue("color", color, { shouldValidate: true })}
                className={
                  "h-7 w-7 rounded-full outline-offset-2 " +
                  (selectedColor === color ? "outline-2 outline-(--color-text)" : "")
                }
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          {errors.color?.message && (
            <p role="alert" className="text-xs text-(--color-danger)">
              {t(errors.color.message)}
            </p>
          )}
        </div>

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button type="submit">
            {isEditing ? t("project.form.save") : t("project.form.create")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}


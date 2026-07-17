// src/features/projects/components/ProjectFormModal.tsx

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Edit project" : "New project"}>
      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="flex flex-col gap-4">
        <Input label="Project name" error={errors.name?.message} {...register("name")} />

        <Textarea
          label="Description"
          error={errors.description?.message}
          {...register("description")}
        />

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-(--color-text)">Color</span>
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
              {errors.color.message}
            </p>
          )}
        </div>

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{isEditing ? "Save changes" : "Create project"}</Button>
        </div>
      </form>
    </Modal>
  );
}
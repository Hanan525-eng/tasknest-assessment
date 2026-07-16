// src/features/projects/components/ProjectModal.tsx

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Modal } from "../../../components/Modal";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import { projectSchema, type ProjectFormValues } from "../schemas/project.schema";
import type { Project } from "../../../types/project.types";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormValues) => void;
  initialData?: Project | null;
  isLoading?: boolean;
}

const COLORS = [
  "#2563eb", // blue
  "#7c3aed", // purple
  "#dc2626", // red
  "#16a34a", // green
  "#d97706", // amber
  "#db2777", // pink
  "#0891b2", // cyan
  "#4f46e5", // indigo
];

export function ProjectModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: ProjectModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      color: COLORS[0],
    },
  });

  const selectedColor = watch("color");

  useEffect(() => {
    if (isOpen && initialData) {
      reset({
        name: initialData.name,
        description: initialData.description || "",
        color: initialData.color,
      });
    } else if (isOpen) {
      reset({
        name: "",
        description: "",
        color: COLORS[0],
      });
    }
  }, [isOpen, initialData, reset]);

  const isEdit = Boolean(initialData);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Project" : "Create New Project"}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input
          label="Project Name"
          placeholder="My Awesome Project"
          error={errors.name?.message}
          {...register("name")}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--color-text)]">Project Color</label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((color) => (
              <label key={color} className="cursor-pointer">
                <input
                  type="radio"
                  value={color}
                  className="sr-only"
                  {...register("color")}
                />
                <div
                  className={`h-8 w-8 rounded-full border-2 transition-all ${
                    selectedColor === color
                      ? "border-[var(--color-text)] ring-2 ring-offset-2 ring-[var(--color-primary)]"
                      : "border-transparent hover:scale-110"
                  }`}
                  style={{ backgroundColor: color }}
                />
              </label>
            ))}
          </div>
          {errors.color && (
            <p className="text-xs text-[var(--color-danger)]">{errors.color.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className="text-sm font-medium text-[var(--color-text)]">
            Description
          </label>
          <textarea
            id="description"
            className="w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-2 focus:outline-[var(--color-primary)]"
            placeholder="What's this project about?"
            rows={3}
            {...register("description")}
          />
          {errors.description && (
            <p className="text-xs text-[var(--color-danger)]">{errors.description.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading} disabled={!isDirty || !isValid}>
            {isEdit ? "Save Changes" : "Create Project"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
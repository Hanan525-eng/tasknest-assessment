// src/features/projects/components/ProjectModal.tsx

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Modal } from "../../../components/Modal";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import type { Project } from "../../../types/project.types";

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9a-f]{6}$/i, "Invalid color format"),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => void;
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
  } = useForm<ProjectFormData>({
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

  const isEdit = !!initialData;

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
          <label className="text-sm font-medium text-gray-700">Project Color</label>
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
                      ? "border-gray-900 ring-2 ring-offset-2"
                      : "border-transparent hover:scale-110"
                  }`}
                  style={{ backgroundColor: color }}
                />
              </label>
            ))}
          </div>
          {errors.color && (
            <p className="text-xs text-red-500">{errors.color.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className="text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:outline-blue-600"
            placeholder="What's this project about?"
            rows={3}
            {...register("description")}
          />
          {errors.description && (
            <p className="text-xs text-red-500">{errors.description.message}</p>
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
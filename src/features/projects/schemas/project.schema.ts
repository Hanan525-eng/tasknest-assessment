// src/features/projects/schemas/project.schema.ts

import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(1, "validation.projectName.required"),
  description: z.string().max(300, "validation.description.maxLength"),
  color: z.string().min(1, "validation.color.required"),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
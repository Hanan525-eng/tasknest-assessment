import { z } from "zod";

export const projectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "validation.project.name.min")
    .max(50, "validation.project.name.max"),

  description: z
    .string()
    .trim()
    .max(300, "validation.project.description.max")
    .optional()
    .or(z.literal("")),

  color: z
    .string()
    .optional(),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
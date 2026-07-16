// src/features/auth/schemas/login.schema.ts

import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "validation.email.required")
    .email("validation.email.invalid"),
  password: z
    .string()
    .min(1, "validation.password.required")
    .min(6, "validation.password.minLength"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
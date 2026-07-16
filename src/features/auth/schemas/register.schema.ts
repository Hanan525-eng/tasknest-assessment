// src/features/auth/schemas/register.schema.ts

import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(1, "validation.name.required"),
    email: z
      .string()
      .min(1, "validation.email.required")
      .email("validation.email.invalid"),
    password: z
      .string()
      .min(1, "validation.password.required")
      .min(6, "validation.password.minLength"),
    confirmPassword: z.string().min(1, "validation.confirmPassword.required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "validation.confirmPassword.mismatch",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
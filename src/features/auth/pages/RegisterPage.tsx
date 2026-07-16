// src/features/auth/pages/RegisterPage.tsx

import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button, Input } from "../../../components";
import { useAuthStore } from "../../../stores/auth.store";
import {
  registerSchema,
  type RegisterFormValues,
} from "../schemas/register.schema";

/**
 * RegisterPage
 * -----------------------------------------------------------------------
 * Validation messages currently return translation keys from Zod.
 * They will be translated later when react-i18next is integrated.
 * -----------------------------------------------------------------------
 */

function RegisterPage() {
  const navigate = useNavigate();

  const {
    register: registerUser,
    status,
    error,
    clearError,
  } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    if (status === "authenticated") {
      navigate("/dashboard", { replace: true });
    }
  }, [status, navigate]);

  const onSubmit = (data: RegisterFormValues) => {
    clearError();
    registerUser(data);
  };

  const isLoading = status === "loading";

  return (
    <div className="flex min-h-screen items-center justify-center bg-(--color-background) px-4">
      <div
        className="
          w-full
          max-w-md
          rounded-(--radius-lg)
          border
          border-(--color-border)
          bg-(--color-surface)
          p-8
          shadow-(--shadow-md)
        "
      >
        <h1 className="mb-2 text-2xl font-semibold text-(--color-text)">
          Create your account
        </h1>

        <p className="mb-6 text-sm text-(--color-text-muted)">
          Start organizing your projects and tasks.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-4"
        >
          <Input
            label="Full name"
            type="text"
            autoComplete="name"
            error={errors.name?.message}
            {...register("name")}
          />

          <Input
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="Password"
            type="password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />

          <Input
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          {error && (
            <div
              role="alert"
              className="
                rounded-(--radius-sm)
                border
                border-(--color-danger)
                bg-red-50
                px-3
                py-2
                text-sm
                text-(--color-danger)
              "
            >
              {error === "EMAIL_ALREADY_EXISTS"
                ? "An account with this email already exists."
                : "Something went wrong. Please try again."}
            </div>
          )}

          <Button
            type="submit"
            isLoading={isLoading}
            className="mt-2 w-full"
          >
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-(--color-text-muted)">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="font-medium text-(--color-primary) hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
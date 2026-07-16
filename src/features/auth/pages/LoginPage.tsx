

// src/features/auth/pages/LoginPage.tsx

import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button, Input } from "../../../components";
import { useAuthStore } from "../../../stores/auth.store";
import {
  loginSchema,
  type LoginFormValues,
} from "../schemas/login.schema";

/**
 * LoginPage
 * -----------------------------------------------------------------------
 * NOTE:
 * Validation messages currently return translation keys from Zod.
 * They will be translated later when react-i18next is integrated.
 * -----------------------------------------------------------------------
 */

function LoginPage() {
  const navigate = useNavigate();

  const { login, status, error, clearError } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (status === "authenticated") {
      navigate("/dashboard", { replace: true });
    }
  }, [status, navigate]);

  const onSubmit = (data: LoginFormValues) => {
    clearError();
    login(data);
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
          Log in to TaskNest
        </h1>

        <p className="mb-6 text-sm text-(--color-text-muted)">
          Manage your projects and tasks in one place.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-4"
        >
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
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
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
              {error === "INVALID_CREDENTIALS"
                ? "Invalid email or password."
                : "Something went wrong. Please try again."}
            </div>
          )}

          <Button
            type="submit"
            isLoading={isLoading}
            className="mt-2 w-full"
          >
            Log in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-(--color-text-muted)">
          Don&apos;t have an account?{" "}
          <Link
            to="/auth/register"
            className="font-medium text-(--color-primary) hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;

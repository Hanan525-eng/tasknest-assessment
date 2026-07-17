// src/features/auth/pages/LoginPage.tsx

import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button, Input } from "../../../components";
import { AuthLayout } from "../../../components/AuthLayout";
import { useAuthStore } from "../../../stores/auth.store";
import { loginSchema, type LoginFormValues } from "../schemas/login.schema";

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
    <AuthLayout>
      <h1 className="mb-1 text-3xl font-bold text-[var(--color-text)]">Welcome Back!</h1>
      <p className="mb-8 text-sm text-[var(--color-text-muted)]">
        Please enter your login details below
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />

        {error && (
          <div
            role="alert"
            className="rounded-[var(--radius-sm)] border border-[var(--color-danger)] bg-red-50 px-3 py-2 text-sm text-[var(--color-danger)]"
          >
            {error === "INVALID_CREDENTIALS"
              ? "Invalid email or password."
              : "Something went wrong. Please try again."}
          </div>
        )}

        <Button type="submit" isLoading={isLoading} className="mt-2 w-full">
          Sign in
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-[var(--color-text-muted)]">
        Don&apos;t have an account?{" "}
        <Link to="/auth/register" className="font-medium text-[var(--color-primary)] hover:underline">
          Sign Up
        </Link>
      </p>
    </AuthLayout>
  );
}

export default LoginPage;



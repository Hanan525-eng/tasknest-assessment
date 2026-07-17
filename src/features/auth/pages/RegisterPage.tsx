// src/features/auth/pages/RegisterPage.tsx

import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button, Input } from "../../../components";
import { AuthLayout } from "../../../components/AuthLayout";
import { useAuthStore } from "../../../stores/auth.store";
import { registerSchema, type RegisterFormValues } from "../schemas/register.schema";

/**
 * RegisterPage
 * -----------------------------------------------------------------------
 * Validation messages currently return translation keys from Zod.
 * They will be translated later when react-i18next is integrated.
 * -----------------------------------------------------------------------
 */

function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser, status, error, clearError } = useAuthStore();

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
    <AuthLayout caption="Create an account to start organizing your projects and tasks.">
      <h1 className="mb-1 text-3xl font-bold text-[var(--color-text)]">Create Account</h1>
      <p className="mb-8 text-sm text-[var(--color-text-muted)]">
        Fill in your details to get started
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <Input
          label="Full name"
          type="text"
          placeholder="Enter your full name"
          autoComplete="name"
          error={errors.name?.message}
          {...register("name")}
        />

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
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />

        <Input
          label="Confirm password"
          type="password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        {error && (
          <div
            role="alert"
            className="rounded-[var(--radius-sm)] border border-[var(--color-danger)] bg-red-50 px-3 py-2 text-sm text-[var(--color-danger)]"
          >
            {error === "EMAIL_ALREADY_EXISTS"
              ? "An account with this email already exists."
              : "Something went wrong. Please try again."}
          </div>
        )}

        <Button type="submit" isLoading={isLoading} className="mt-2 w-full">
          Create account
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-[var(--color-text-muted)]">
        Already have an account?{" "}
        <Link to="/auth/login" className="font-medium text-[var(--color-primary)] hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}

export default RegisterPage;


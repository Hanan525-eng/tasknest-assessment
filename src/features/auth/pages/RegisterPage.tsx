// // src/features/auth/pages/RegisterPage.tsx


// src/features/auth/pages/RegisterPage.tsx

import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
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
  const { t } = useTranslation();
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
    <div className="w-full max-w-sm rounded-md bg-(--color-surface) p-8 shadow-[var(--shadow-md)]">
      <h1 className="mb-1 text-2xl font-semibold text-(--color-text)">
        {t("auth.register.title")}
      </h1>
      <p className="mb-6 text-sm text-(--color-text-muted)">
        {t("auth.register.subtitle")}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <Input
          type="text"
          label={t("auth.register.nameLabel")}
          autoComplete="name"
          error={errors.name?.message ? t(errors.name.message) : undefined}
          {...register("name")}
        />

        <Input
          type="email"
          label={t("auth.register.emailLabel")}
          autoComplete="email"
          error={errors.email?.message ? t(errors.email.message) : undefined}
          {...register("email")}
        />

        <Input
          type="password"
          label={t("auth.register.passwordLabel")}
          autoComplete="new-password"
          error={errors.password?.message ? t(errors.password.message) : undefined}
          {...register("password")}
        />

        <Input
          type="password"
          label={t("auth.register.confirmPasswordLabel")}
          autoComplete="new-password"
          error={errors.confirmPassword?.message ? t(errors.confirmPassword.message) : undefined}
          {...register("confirmPassword")}
        />

        {error && (
          <p role="alert" className="text-sm text-(--color-danger)">
            {error === "EMAIL_ALREADY_EXISTS"
              ? t("auth.register.emailExists")
              : t("auth.register.genericError")}
          </p>
        )}

        <Button type="submit" isLoading={isLoading} className="mt-2 w-full">
          {t("auth.register.submit")}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-(--color-text-muted)">
        {t("auth.register.haveAccount")}{" "}
        <Link to="/auth/login" className="font-medium text-(--color-primary) hover:underline">
          {t("auth.register.logIn")}
        </Link>
      </p>
    </div>
  );
}

export default RegisterPage;


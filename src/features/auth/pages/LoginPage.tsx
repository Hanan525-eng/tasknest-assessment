// src/features/auth/pages/LoginPage.tsx

// src/features/auth/pages/LoginPage.tsx

import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
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
  const { t } = useTranslation();
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
    <div className="w-full max-w-sm rounded-md bg-(--color-surface) p-8 shadow-[var(--shadow-md)]">
      <h1 className="mb-1 text-2xl font-semibold text-(--color-text)">
        {t("auth.login.title")}
      </h1>
      <p className="mb-6 text-sm text-(--color-text-muted)">
        {t("auth.login.subtitle")}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <Input
          type="email"
          label={t("auth.login.emailLabel")}
          autoComplete="email"
          error={errors.email?.message ? t(errors.email.message) : undefined}
          {...register("email")}
        />

        <Input
          type="password"
          label={t("auth.login.passwordLabel")}
          autoComplete="current-password"
          error={errors.password?.message ? t(errors.password.message) : undefined}
          {...register("password")}
        />

        {error && (
          <p role="alert" className="text-sm text-(--color-danger)">
            {error === "INVALID_CREDENTIALS"
              ? t("auth.login.invalidCredentials")
              : t("auth.login.genericError")}
          </p>
        )}

        <Button type="submit" isLoading={isLoading} className="mt-2 w-full">
          {t("auth.login.submit")}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-(--color-text-muted)">
        {t("auth.login.noAccount")}{" "}
        <Link to="/auth/register" className="font-medium text-(--color-primary) hover:underline">
          {t("auth.login.createOne")}
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;


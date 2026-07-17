// src/layouts/DashboardLayout.tsx

import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../stores/auth.store";
import { Button } from "../components/Button";
import { LanguageToggle } from "../components/LanguageToggle";

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-(--color-background)">
      <header className="flex items-center justify-between border-b border-(--color-border) bg-(--color-surface) px-8 py-4">
        <div>
          <p className="font-semibold text-(--color-text)">TaskNest</p>
          {user && (
            <p className="text-xs text-(--color-text-muted)">
              {t("dashboard.loggedInAs", { name: user.name, email: user.email })}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Button variant="secondary" onClick={logout}>
            {t("common.logOut")}
          </Button>
        </div>
      </header>

      <main className="p-8">{children}</main>
    </div>
  );
}
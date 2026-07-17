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
      <header className="flex flex-col gap-3 border-b border-(--color-border) bg-(--color-surface) px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-(--color-text-muted)">
            TaskNest
          </p>
          {user && (
            <>
              <p className="truncate font-semibold text-(--color-text)">
                {t("dashboard.welcomeBack", { name: user.name })}
              </p>
              <p className="truncate text-xs text-(--color-text-muted)">{user.email}</p>
            </>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <LanguageToggle />
          <Button variant="secondary" onClick={logout}>
            {t("common.logOut")}
          </Button>
        </div>
      </header>

      <main className="p-4 sm:p-8">{children}</main>
    </div>
  );
}






// import type { ReactNode } from "react";
// import { useTranslation } from "react-i18next";
// import { useAuthStore } from "../stores/auth.store";
// import { Button } from "../components/Button";
// import { LanguageToggle } from "../components/LanguageToggle";

// export function DashboardLayout({ children }: { children: ReactNode }) {
//   const { t } = useTranslation();
//   const { user, logout } = useAuthStore();

//   return (
//     <div className="min-h-screen bg-(--color-background)">
//       <header className="flex items-center justify-between border-b border-(--color-border) bg-(--color-surface) px-8 py-4">
//         <div>
//           <p className="font-semibold text-(--color-text)">TaskNest</p>
//           {user && (
//             <p className="text-xs text-(--color-text-muted)">
//               {t("dashboard.loggedInAs", { name: user.name, email: user.email })}
//             </p>
//           )}
//         </div>

//         <div className="flex items-center gap-3">
//           <LanguageToggle />
//           <Button variant="secondary" onClick={logout}>
//             {t("common.logOut")}
//           </Button>
//         </div>
//       </header>

//       <main className="p-8">{children}</main>
//     </div>
//   );
// }
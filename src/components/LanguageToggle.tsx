//  src/components/LanguageToggle.tsx

import { useTranslation } from "react-i18next";

export function LanguageToggle() {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const next = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(next);
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="rounded-sm border border-(--color-border) px-3 py-1.5 text-sm font-medium text-(--color-text) hover:bg-(--color-background)"
      aria-label="Toggle language"
    >
      {i18n.language === "ar" ? t("language.english") : t("language.arabic")}
    </button>
  );
}
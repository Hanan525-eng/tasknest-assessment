// src/i18n/config.ts

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import ar from "./locales/ar.json";

const LANGUAGE_STORAGE_KEY = "tasknest_language";

const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
const initialLanguage = storedLanguage === "ar" ? "ar" : "en";

function applyDocumentDirection(language: string): void {
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = language;
}

applyDocumentDirection(initialLanguage);

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: initialLanguage,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (language) => {
  applyDocumentDirection(language);
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
});

export default i18n;
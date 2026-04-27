import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { LANGUAGES, TRANSLATIONS, type LanguageCode } from "./translations";

type I18nContextValue = {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  languages: typeof LANGUAGES;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "lang";

const normalizeLang = (value: string | null | undefined): LanguageCode => {
  const v = (value || "").toLowerCase();
  if (v === "en" || v === "hi" || v === "mr" || v === "gu" || v === "bn" || v === "ta" || v === "te") return v;
  return "en";
};

const interpolate = (template: string, vars?: Record<string, string | number>) => {
  if (!vars) return template;
  return template.replace(/\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g, (_m, k) => {
    const v = vars[k];
    return v === undefined || v === null ? "" : String(v);
  });
};

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, _setLang] = useState<LanguageCode>(() => {
    try {
      return normalizeLang(localStorage.getItem(STORAGE_KEY));
    } catch {
      return "en";
    }
  });

  const setLang = useCallback((next: LanguageCode) => {
    _setLang(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore storage failures
    }
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const table = TRANSLATIONS[lang] || TRANSLATIONS.en;
      const fallback = TRANSLATIONS.en;
      const raw = table[key] ?? fallback[key] ?? key;
      return interpolate(raw, vars);
    },
    [lang]
  );

  const value = useMemo<I18nContextValue>(
    () => ({ lang, setLang, t, languages: LANGUAGES }),
    [lang, setLang, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
};

"use client";

import * as React from "react";
import {
  resumeData,
  uiText,
  type Language,
  type ResumeData,
  type UiText,
} from "@/lib/resume-data";

interface LanguageContextValue {
  language: Language;
  data: ResumeData;
  ui: UiText;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = React.createContext<LanguageContextValue | null>(null);

/**
 * Global language state.
 *
 * Every page load intentionally starts in English — the user's choice is
 * session-only and is NOT persisted across visits (per product decision:
 * "打开网站时默认是英文"). Switching is instant and requires no refresh.
 *
 * The initial state is "en" on both server and client, so the first client
 * render always matches the server-rendered HTML (no hydration mismatch).
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = React.useState<Language>("en");

  React.useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  }, [language]);

  const value = React.useMemo<LanguageContextValue>(
    () => ({
      language,
      data: resumeData[language],
      ui: uiText[language],
      setLanguage,
      toggleLanguage: () => setLanguage(language === "en" ? "zh" : "en"),
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = React.useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

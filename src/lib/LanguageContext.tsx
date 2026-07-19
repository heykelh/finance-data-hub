"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { fr } from "./i18n/fr";
import { en } from "./i18n/en";
import type { Translations } from "./i18n/fr";

type Language = "fr" | "en";

type LanguageContextType = {
  lang: Language;
  t: Translations;
  toggleLang: () => void;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "fr",
  t: fr,
  toggleLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("fr");

  const toggleLang = () => setLang(prev => prev === "fr" ? "en" : "fr");

  const t = lang === "fr" ? fr : en;

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}

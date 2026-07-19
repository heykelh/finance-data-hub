"use client";

import { useLang } from "@/lib/LanguageContext";
import { T } from "@/lib/theme";

export default function LanguageToggle() {
  const { lang, toggleLang } = useLang();

  return (
    <button
      onClick={toggleLang}
      title={lang === "fr" ? "Switch to English" : "Passer en français"}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 12px",
        borderRadius: 8,
        border: `1px solid ${lang === "en" ? T.blueBorder : T.cardBorder}`,
        background: lang === "en" ? T.blueSoft : T.cardBg,
        cursor: "pointer",
        transition: "all 0.2s",
      }}
    >
      <span style={{ fontSize: 14 }}>{lang === "fr" ? "🇬🇧" : "🇫🇷"}</span>
      <span style={{
        fontSize: 12,
        fontWeight: 700,
        color: lang === "en" ? T.blue : T.textSecondary,
        fontFamily: "'Kanit', sans-serif",
        letterSpacing: "0.05em",
      }}>
        {lang === "fr" ? "EN" : "FR"}
      </span>
    </button>
  );
}

"use client";

import { usePathname } from "next/navigation";
import { T, badge } from "@/lib/theme";
import PhaseSelector from "./PhaseSelector";
import LanguageToggle from "./LanguageToggle";
import { useResponsive } from "@/lib/useResponsive";
import { useLang } from "@/lib/LanguageContext";
import { useProjectStore } from "@/lib/useProjectState";
import { TIMELINE } from "@/lib/timeline";

const btnStyle: React.CSSProperties = {
  width: 32, height: 32, borderRadius: 8,
  border: `1px solid ${T.cardBorder}`,
  background: T.cardBg,
  display: "flex", alignItems: "center",
  justifyContent: "center", cursor: "pointer",
};

export default function TopBar() {
  const path = usePathname();
  const { t } = useLang();
  const { isMobile, isTablet } = useResponsive();
  const { currentPhase } = useProjectStore();
  const isNarrow = isMobile || isTablet;

  const PAGE_TITLES: Record<string, { title: string; desc: string }> = {
    "/":              t.topbar.overview,
    "/diagnostic":    t.topbar.diagnostic,
    "/gouvernance":   t.topbar.gouvernance,
    "/catalog":       t.topbar.catalog,
    "/qualite":       t.topbar.qualite,
    "/lineage":       t.topbar.lineage,
    "/ia-governance": t.topbar.ia,
    "/comex":         t.topbar.comex,
  };

  const meta = PAGE_TITLES[path] ?? { title: "FinanceDataHub", desc: "" };

  return (
    <>
      <header style={{
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: isNarrow ? "0 12px 0 60px" : "0 28px",
        background: T.topbarBg,
        borderBottom: `1px solid ${T.cardBorder}`,
        flexShrink: 0,
        gap: 12,
      }}>
        {/* Titre */}
        <div style={{ minWidth: 0, flexShrink: 1 }}>
          <h1 style={{ fontSize: isNarrow ? 13 : 15, fontWeight: 700, color: T.textPrimary, fontFamily: "'Kanit', sans-serif", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {meta.title}
          </h1>
          {!isMobile && (
            <p style={{ fontSize: 11, color: T.textMuted, fontFamily: "'Kanit', sans-serif", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {meta.desc}
            </p>
          )}
        </div>

        {/* Phase selector — desktop */}
        {!isNarrow && (
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <PhaseSelector />
          </div>
        )}

        {/* Indicateur phase active + actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 20, background: T.blueSoft, border: `1px solid ${T.blueBorder}` }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.blue }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: T.blue, fontFamily: "'Kanit', sans-serif", whiteSpace: "nowrap" }}>
                {t.common.phase} {currentPhase} · {TIMELINE[currentPhase - 1]?.label}
              </span>
            </div>
          )}
          <LanguageToggle />
          <span style={badge(T.blueSoft, T.blue, T.blueBorder)}>2026</span>
        </div>
      </header>

      {/* Sélecteur de phase sur mobile */}
      {isMobile && (
        <div style={{ padding: "8px 12px 8px 60px", background: "#f7f8fc", borderBottom: `1px solid ${T.cardBorder}`, overflowX: "auto", flexShrink: 0 }}>
          <PhaseSelector />
        </div>
      )}
    </>
  );
}

"use client";

import { usePathname } from "next/navigation";
import { T, badge } from "@/lib/theme";
import { Bell, Settings, Calendar } from "lucide-react";

const PAGE_TITLES: Record<string, { title: string; desc: string }> = {
  "/":              { title: "Vue d'ensemble",       desc: "Dashboard exécutif — Programme Gouvernance Data & IA · FrontierBank" },
  "/diagnostic":    { title: "Diagnostic Maturité",  desc: "Évaluation DAMA-DMBOK · Niveaux actuels vs cibles stratégiques" },
  "/gouvernance":   { title: "Framework Gouvernance",desc: "Rôles · Politiques · Matrice RACI" },
  "/catalog":       { title: "Data Catalog",         desc: "Glossaire métier · Référentiels · Métadonnées" },
  "/qualite":       { title: "Data Quality",         desc: "KPIs qualité · Conformité BCBS 239 · Plans de remédiation" },
  "/lineage":       { title: "Data Lineage",         desc: "Traçabilité des flux de données · Données critiques" },
  "/ia-governance": { title: "IA Governance",        desc: "Registre modèles · Classification EU AI Act · Model Risk" },
  "/comex":         { title: "Rapport Comex",        desc: "Synthèse exécutive · Tableau de bord Direction Générale" },
};

const btnStyle: React.CSSProperties = {
  width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.cardBorder}`,
  background: T.cardBg, display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer",
};

export default function TopBar() {
  const path = usePathname();
  const meta = PAGE_TITLES[path] ?? { title: "FinanceDataHub", desc: "" };

  return (
    <header style={{
      height: 56, display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 28px", background: T.topbarBg, borderBottom: `1px solid ${T.cardBorder}`,
      flexShrink: 0,
    }}>
      <div>
        <h1 style={{ fontSize: 15, fontWeight: 700, color: T.textPrimary, fontFamily: "'Kanit', sans-serif", margin: 0 }}>
          {meta.title}
        </h1>
        <p style={{ fontSize: 11, color: T.textMuted, fontFamily: "'Kanit', sans-serif", margin: 0 }}>{meta.desc}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 8, background: T.cardBg, border: `1px solid ${T.cardBorder}` }}>
          <Calendar size={12} color={T.textMuted} />
          <span style={{ fontSize: 12, fontWeight: 500, color: T.textSecondary, fontFamily: "'Kanit', sans-serif" }}>30 Avril 2026</span>
        </div>
        <span style={badge(T.blueSoft, T.blue, T.blueBorder)}>v1.0</span>
        <button style={btnStyle}><Bell size={13} color={T.textMuted} /></button>
        <button style={btnStyle}><Settings size={13} color={T.textMuted} /></button>
      </div>
    </header>
  );
}
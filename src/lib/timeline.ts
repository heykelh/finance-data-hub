// src/lib/timeline.ts
// État complet du projet à chaque fin de phase

export type PhaseState = {
  phase: number;
  label: string;
  period: string;
  status: "done" | "in_progress" | "planned";

  // Maturité par domaine (id → score)
  maturity: Record<string, number>;

  // BCBS 239 (id → status)
  bcbs: Record<number, "compliant" | "partial" | "non_compliant">;

  // KPIs qualité mensuels
  kpis: { month: string; completeness: number; accuracy: number; freshness: number; consistency: number }[];

  // Modèles IA (id → status)
  aiModels: Record<string, "validated" | "in_review" | "pending">;

  // Résumé narratif
  narrative: string;

  // Chiffres clés
  stats: {
    bcbsCompliant: number;
    avgMaturity: number;
    avgQuality: number;
    aiValidated: number;
  };
};

export const TIMELINE: PhaseState[] = [
  // ── Phase 1 — Diagnostic & Cadrage ────────────────────────────────────────
  {
    phase: 1,
    label: "Diagnostic & Cadrage",
    period: "Jan – Fév 2026",
    status: "done",
    narrative: "État des lieux initial. Aucun cadre de gouvernance formalisé. Les données critiques ne sont pas identifiées. Le programme démarre.",
    maturity: {
      dg: 1.0, dq: 1.2, dm: 1.5, dc: 0.5, dl: 0.5, ia: 0.3, sec: 2.0, cult: 0.8
    },
    bcbs: {
      1: "non_compliant", 2: "non_compliant", 3: "non_compliant", 4: "non_compliant",
      5: "partial",       6: "non_compliant", 7: "partial",       8: "non_compliant",
      9: "non_compliant", 10: "non_compliant",11: "partial",      12: "non_compliant",
      13: "non_compliant",14: "non_compliant",
    },
    kpis: [
      { month: "Jan", completeness: 64, accuracy: 61, freshness: 74, consistency: 57 },
      { month: "Fév", completeness: 65, accuracy: 62, freshness: 75, consistency: 58 },
    ],
    aiModels: { m01: "pending", m02: "pending", m03: "pending", m04: "pending", m05: "pending" },
    stats: { bcbsCompliant: 0, avgMaturity: 1.0, avgQuality: 64, aiValidated: 0 },
  },

  // ── Phase 2 — Framework Gouvernance ───────────────────────────────────────
  {
    phase: 2,
    label: "Framework Gouvernance",
    period: "Fév – Mar 2026",
    status: "done",
    narrative: "Les rôles Data Owner / Steward sont formalisés. La Charte de Gouvernance est signée. Le Comité DG tient sa première réunion. La conformité BCBS 239 progresse sur les principes organisationnels.",
    maturity: {
      dg: 2.8, dq: 1.5, dm: 2.0, dc: 0.8, dl: 0.8, ia: 0.5, sec: 2.4, cult: 1.2
    },
    bcbs: {
      1: "compliant",     2: "partial",       3: "non_compliant", 4: "non_compliant",
      5: "compliant",     6: "partial",       7: "compliant",     8: "non_compliant",
      9: "partial",       10: "non_compliant",11: "compliant",    12: "non_compliant",
      13: "non_compliant",14: "partial",
    },
    kpis: [
      { month: "Jan", completeness: 64, accuracy: 61, freshness: 74, consistency: 57 },
      { month: "Fév", completeness: 65, accuracy: 62, freshness: 75, consistency: 58 },
      { month: "Mar", completeness: 68, accuracy: 64, freshness: 77, consistency: 61 },
    ],
    aiModels: { m01: "pending", m02: "pending", m03: "pending", m04: "pending", m05: "in_review" },
    stats: { bcbsCompliant: 4, avgMaturity: 1.5, avgQuality: 68, aiValidated: 0 },
  },

  // ── Phase 3 — Data Catalog & Qualité (EN COURS) ───────────────────────────
  {
    phase: 3,
    label: "Data Catalog & Qualité",
    period: "Mar – Mai 2026",
    status: "in_progress",
    narrative: "Déploiement de Collibra en cours. Le glossaire métier atteint 120 termes. Les KPIs qualité progressent grâce aux contrôles dbt. La conformité BCBS 239 s'améliore sur les dimensions qualité et complétude.",
    maturity: {
      dg: 2.1, dq: 1.8, dm: 2.5, dc: 1.2, dl: 1.0, ia: 0.8, sec: 2.8, cult: 1.5
    },
    bcbs: {
      1: "partial",       2: "partial",       3: "non_compliant", 4: "partial",
      5: "compliant",     6: "partial",       7: "compliant",     8: "non_compliant",
      9: "partial",       10: "non_compliant",11: "compliant",    12: "partial",
      13: "non_compliant",14: "partial",
    },
    kpis: [
      { month: "Oct", completeness: 72, accuracy: 68, freshness: 81, consistency: 64 },
      { month: "Nov", completeness: 74, accuracy: 70, freshness: 82, consistency: 67 },
      { month: "Dec", completeness: 76, accuracy: 71, freshness: 83, consistency: 69 },
      { month: "Jan", completeness: 79, accuracy: 73, freshness: 85, consistency: 72 },
      { month: "Fév", completeness: 81, accuracy: 76, freshness: 86, consistency: 75 },
      { month: "Mar", completeness: 83, accuracy: 79, freshness: 87, consistency: 78 },
      { month: "Avr", completeness: 86, accuracy: 82, freshness: 89, consistency: 81 },
    ],
    aiModels: { m01: "in_review", m02: "in_review", m03: "validated", m04: "pending", m05: "validated" },
    stats: { bcbsCompliant: 4, avgMaturity: 1.7, avgQuality: 82, aiValidated: 2 },
  },

  // ── Phase 4 — Data Lineage & MDM ──────────────────────────────────────────
  {
    phase: 4,
    label: "Data Lineage & MDM",
    period: "Mai – Jul 2026",
    status: "planned",
    narrative: "Le data lineage des 14 données critiques BCBS 239 est tracé. Le MDM clients est déployé — la cohérence des données maîtres bondit de +15 points. Les principes BCBS sur l'exactitude et la réconciliation deviennent conformes.",
    maturity: {
      dg: 2.8, dq: 2.9, dm: 3.2, dc: 2.4, dl: 3.2, ia: 1.2, sec: 3.1, cult: 2.0
    },
    bcbs: {
      1: "compliant",     2: "compliant",     3: "partial",       4: "compliant",
      5: "compliant",     6: "compliant",     7: "compliant",     8: "partial",
      9: "compliant",     10: "partial",      11: "compliant",    12: "compliant",
      13: "partial",      14: "compliant",
    },
    kpis: [
      { month: "Jan", completeness: 79, accuracy: 73, freshness: 85, consistency: 72 },
      { month: "Fév", completeness: 81, accuracy: 76, freshness: 86, consistency: 75 },
      { month: "Mar", completeness: 83, accuracy: 79, freshness: 87, consistency: 78 },
      { month: "Avr", completeness: 86, accuracy: 82, freshness: 89, consistency: 81 },
      { month: "Mai", completeness: 88, accuracy: 85, freshness: 90, consistency: 88 },
      { month: "Jun", completeness: 90, accuracy: 87, freshness: 91, consistency: 91 },
      { month: "Jul", completeness: 91, accuracy: 88, freshness: 92, consistency: 93 },
    ],
    aiModels: { m01: "validated", m02: "in_review", m03: "validated", m04: "in_review", m05: "validated" },
    stats: { bcbsCompliant: 10, avgMaturity: 2.6, avgQuality: 91, aiValidated: 3 },
  },

  // ── Phase 5 — IA Governance ───────────────────────────────────────────────
  {
    phase: 5,
    label: "IA Governance",
    period: "Jul – Sep 2026",
    status: "planned",
    narrative: "Le registre des modèles IA est complet. Tous les modèles sont classifiés EU AI Act. Le process de validation est opérationnel. Les principes BCBS 239 sur les risques agrégés sont conformes.",
    maturity: {
      dg: 3.5, dq: 3.4, dm: 3.6, dc: 3.2, dl: 3.8, ia: 3.5, sec: 3.6, cult: 2.6
    },
    bcbs: {
      1: "compliant", 2: "compliant", 3: "compliant",     4: "compliant",
      5: "compliant", 6: "compliant", 7: "compliant",     8: "compliant",
      9: "compliant", 10: "partial",  11: "compliant",    12: "compliant",
      13: "compliant",14: "compliant",
    },
    kpis: [
      { month: "Mar", completeness: 83, accuracy: 79, freshness: 87, consistency: 78 },
      { month: "Avr", completeness: 86, accuracy: 82, freshness: 89, consistency: 81 },
      { month: "Mai", completeness: 88, accuracy: 85, freshness: 90, consistency: 88 },
      { month: "Jun", completeness: 90, accuracy: 87, freshness: 91, consistency: 91 },
      { month: "Jul", completeness: 91, accuracy: 88, freshness: 92, consistency: 93 },
      { month: "Aoû", completeness: 92, accuracy: 90, freshness: 93, consistency: 94 },
      { month: "Sep", completeness: 93, accuracy: 91, freshness: 94, consistency: 94 },
    ],
    aiModels: { m01: "validated", m02: "validated", m03: "validated", m04: "validated", m05: "validated" },
    stats: { bcbsCompliant: 13, avgMaturity: 3.4, avgQuality: 93, aiValidated: 5 },
  },

  // ── Phase 6 — Acculturation & Scale ──────────────────────────────────────
  {
    phase: 6,
    label: "Acculturation & Scale",
    period: "Sep – Déc 2026",
    status: "planned",
    narrative: "Programme de formation Data Literacy déployé pour 400 collaborateurs. Communauté de 45 Data Stewards active. BCBS 239 : conformité 100%. FrontierBank atteint le niveau 4 (Géré) sur la majorité des domaines.",
    maturity: {
      dg: 4.2, dq: 4.0, dm: 4.1, dc: 3.8, dl: 4.0, ia: 4.0, sec: 4.2, cult: 3.8
    },
    bcbs: {
      1: "compliant", 2: "compliant", 3: "compliant", 4: "compliant",
      5: "compliant", 6: "compliant", 7: "compliant", 8: "compliant",
      9: "compliant", 10: "compliant",11: "compliant",12: "compliant",
      13: "compliant",14: "compliant",
    },
    kpis: [
      { month: "Jun", completeness: 90, accuracy: 87, freshness: 91, consistency: 91 },
      { month: "Jul", completeness: 91, accuracy: 88, freshness: 92, consistency: 93 },
      { month: "Aoû", completeness: 92, accuracy: 90, freshness: 93, consistency: 94 },
      { month: "Sep", completeness: 93, accuracy: 91, freshness: 94, consistency: 94 },
      { month: "Oct", completeness: 94, accuracy: 92, freshness: 95, consistency: 95 },
      { month: "Nov", completeness: 95, accuracy: 93, freshness: 95, consistency: 96 },
      { month: "Déc", completeness: 96, accuracy: 94, freshness: 96, consistency: 96 },
    ],
    aiModels: { m01: "validated", m02: "validated", m03: "validated", m04: "validated", m05: "validated" },
    stats: { bcbsCompliant: 14, avgMaturity: 4.0, avgQuality: 95, aiValidated: 5 },
  },
];
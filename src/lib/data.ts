// src/lib/data.ts
export const PROJECT_META = {
  client: "FrontierBank",
  consultant: "Heykel HACHICHE",
  title: "Programme de Gouvernance Data & IA",
  subtitle: "BCBS 239 · DAMA-DMBOK · EU AI Act",
  version: "v1.0 — Avril 2026",
  status: "En cours",
};

export const MATURITY_DOMAINS = [
  { id: "dg",  label: "Data Governance",      score: 2.1, target: 4.0, color: "#3b82f6" },
  { id: "dq",  label: "Data Quality",         score: 1.8, target: 4.5, color: "#10b981" },
  { id: "dm",  label: "Data Management",      score: 2.5, target: 4.0, color: "#a78bfa" },
  { id: "dc",  label: "Data Catalog",         score: 1.2, target: 4.0, color: "#f59e0b" },
  { id: "dl",  label: "Data Lineage",         score: 1.0, target: 3.5, color: "#f97316" },
  { id: "ia",  label: "IA Governance",        score: 0.8, target: 3.5, color: "#ef4444" },
  { id: "sec", label: "Data Security",        score: 2.8, target: 4.5, color: "#06b6d4" },
  { id: "cult",label: "Data Culture",         score: 1.5, target: 4.0, color: "#ec4899" },
];

export const BCBS_PRINCIPLES = [
  { id: 1,  title: "Gouvernance et infrastructure", status: "partial",  gap: "Rôles DG non formalisés" },
  { id: 2,  title: "Architecture data", status: "partial", gap: "Data lineage incomplet sur données critiques" },
  { id: 3,  title: "Exactitude et intégrité", status: "non_compliant", gap: "Taux d'erreur > 5% sur 3 référentiels" },
  { id: 4,  title: "Complétude", status: "partial", gap: "15% de champs critiques non renseignés" },
  { id: 5,  title: "Actualité", status: "compliant", gap: null },
  { id: 6,  title: "Conformité", status: "partial", gap: "Audit trail non systématique" },
  { id: 7,  title: "Disponibilité", status: "compliant", gap: null },
  { id: 8,  title: "Reporting ad hoc", status: "non_compliant", gap: "Production manuelle, délais > 48h" },
  { id: 9,  title: "Supervision", status: "partial", gap: "Comité DG non opérationnel" },
  { id: 10, title: "Remédiation", status: "non_compliant", gap: "Aucun process de remédiation formalisé" },
  { id: 11, title: "Distribution automatique", status: "compliant", gap: null },
  { id: 12, title: "Exactitude réconciliation", status: "partial", gap: "Rapprochements manuels Finance/Risques" },
  { id: 13, title: "Capacités risque agrégé", status: "non_compliant", gap: "Silos entre Risk et Finance" },
  { id: 14, title: "Reporting risques", status: "partial", gap: "Format non standardisé entre entités" },
];

export const KPI_DATA = [
  { month: "Oct",  completeness: 72, accuracy: 68, freshness: 81, consistency: 64 },
  { month: "Nov",  completeness: 74, accuracy: 70, freshness: 82, consistency: 67 },
  { month: "Dec",  completeness: 76, accuracy: 71, freshness: 83, consistency: 69 },
  { month: "Jan",  completeness: 79, accuracy: 73, freshness: 85, consistency: 72 },
  { month: "Fev",  completeness: 81, accuracy: 76, freshness: 86, consistency: 75 },
  { month: "Mar",  completeness: 83, accuracy: 79, freshness: 87, consistency: 78 },
  { month: "Avr",  completeness: 86, accuracy: 82, freshness: 89, consistency: 81 },
];

export const AI_MODELS = [
  {
    id: "m01", name: "CreditScoring v3.2", domain: "Risque Crédit",
    risk_level: "high", eu_ai_act_class: "High Risk",
    status: "validated", accuracy: 87.3, drift: 1.2,
    last_audit: "2026-03-15", next_review: "2026-06-15",
    owner: "Direction Risques",
  },
  {
    id: "m02", name: "FraudDetector v1.8", domain: "Conformité",
    risk_level: "high", eu_ai_act_class: "High Risk",
    status: "in_review", accuracy: 92.1, drift: 3.7,
    last_audit: "2026-02-01", next_review: "2026-05-01",
    owner: "Direction Conformité",
  },
  {
    id: "m03", name: "ChurnPredictor v2.1", domain: "Marketing",
    risk_level: "medium", eu_ai_act_class: "Limited Risk",
    status: "validated", accuracy: 79.4, drift: 0.8,
    last_audit: "2026-04-01", next_review: "2026-10-01",
    owner: "Direction Marketing",
  },
  {
    id: "m04", name: "LiquidityForecast v1.0", domain: "Finance",
    risk_level: "high", eu_ai_act_class: "High Risk",
    status: "pending", accuracy: 84.6, drift: 2.1,
    last_audit: null, next_review: "2026-05-30",
    owner: "Direction Finance",
  },
  {
    id: "m05", name: "DocClassifier v4.0", domain: "Ops",
    risk_level: "low", eu_ai_act_class: "Minimal Risk",
    status: "validated", accuracy: 95.2, drift: 0.3,
    last_audit: "2026-04-10", next_review: "2026-10-10",
    owner: "Direction Opérations",
  },
];

export const ROADMAP = [
  { phase: 1, label: "Diagnostic & Cadrage",     start: "Jan 2026", end: "Fev 2026", status: "done",        items: ["Audit BCBS 239", "Diagnostic maturité", "Cartographie acteurs", "Note de cadrage Comex"] },
  { phase: 2, label: "Framework Gouvernance",     start: "Fev 2026", end: "Mar 2026", status: "done",        items: ["Politiques data", "Rôles & RACI", "Charte DG", "Comité de gouvernance"] },
  { phase: 3, label: "Data Catalog & Qualité",    start: "Mar 2026", end: "Mai 2026", status: "in_progress", items: ["Déploiement Collibra", "Glossaire métier", "KPIs qualité", "Dashboard pilotage"] },
  { phase: 4, label: "Data Lineage & MDM",        start: "Mai 2026", end: "Jul 2026", status: "planned",     items: ["Lineage données critiques", "MDM clients/produits", "Réconciliation Finance/Risques"] },
  { phase: 5, label: "IA Governance",             start: "Jul 2026", end: "Sep 2026", status: "planned",     items: ["Registre modèles IA", "Classification EU AI Act", "Process de validation", "Monitoring drift"] },
  { phase: 6, label: "Acculturation & Scale",     start: "Sep 2026", end: "Dec 2026", status: "planned",     items: ["Programme de formation", "Communauté Data Stewards", "Reporting régulateur", "Bilan annuel Comex"] },
];

export const RACI_DATA = {
  roles: ["CDO", "Data Owner", "Data Steward", "IT/DSI", "Conformité", "Métiers"],
  activities: [
    { name: "Définir la politique data",            raci: ["R", "C", "I", "I", "C", "I"] },
    { name: "Valider les données critiques",         raci: ["A", "R", "C", "I", "C", "I"] },
    { name: "Saisir et maintenir les données",       raci: ["I", "A", "R", "I", "I", "C"] },
    { name: "Déployer le data catalog",              raci: ["A", "C", "C", "R", "I", "I"] },
    { name: "Contrôler la qualité des données",      raci: ["I", "A", "R", "C", "I", "C"] },
    { name: "Assurer la conformité RGPD",            raci: ["C", "C", "I", "C", "R", "I"] },
    { name: "Valider les modèles IA",                raci: ["A", "C", "I", "C", "R", "I"] },
    { name: "Former les équipes data",               raci: ["R", "C", "C", "I", "I", "A"] },
    { name: "Animer le comité de gouvernance",       raci: ["R", "A", "C", "I", "C", "I"] },
    { name: "Produire les reportings BCBS 239",      raci: ["A", "C", "R", "C", "C", "I"] },
  ]
};
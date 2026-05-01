"use client";

import { useProjectStore } from "@/lib/useProjectState";
import { useResponsive } from "@/lib/useResponsive";
import { T, badge, card } from "@/lib/theme";
import {
  Brain, ShieldCheck, AlertTriangle, CheckCircle2,
  XCircle, Clock, TrendingUp, TrendingDown, Minus,
  Info, ArrowRight, Eye, Zap, FileText, Activity
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, BarChart, Bar, Cell
} from "recharts";

// ── classification EU AI Act ──────────────────────────────────────────────────
const EU_AI_CLASSES = [
  {
    level: "Risque Inacceptable",
    color: "#7c2d12", bg: "#fff7ed", border: "#fed7aa",
    desc: "Systèmes interdits par l'EU AI Act. Manipulation cognitive, notation sociale, surveillance biométrique en temps réel.",
    exemples: ["Notation sociale des citoyens", "Manipulation subliminale", "Reconnaissance faciale temps réel (espace public)"],
    applicable: false,
  },
  {
    level: "Risque Élevé",
    color: T.red, bg: T.redSoft, border: T.redBorder,
    desc: "Systèmes à fort impact sur des décisions critiques. Exigences strictes : documentation, audit, supervision humaine.",
    exemples: ["Scoring crédit", "Détection de fraude", "Prévisions de liquidité"],
    applicable: true,
    obligations: ["Documentation technique complète", "Évaluation de conformité", "Supervision humaine obligatoire", "Registre et notification autorités", "Tests de robustesse"],
  },
  {
    level: "Risque Limité",
    color: T.amber, bg: T.amberSoft, border: T.amberBorder,
    desc: "Systèmes avec obligations de transparence. L'utilisateur doit savoir qu'il interagit avec une IA.",
    exemples: ["Chatbots clients", "Prédiction de churn", "Recommandations produits"],
    applicable: true,
    obligations: ["Information de l'utilisateur", "Transparence sur l'IA", "Documentation basique"],
  },
  {
    level: "Risque Minimal",
    color: T.green, bg: T.greenSoft, border: T.greenBorder,
    desc: "Systèmes à faible impact. Pas d'obligations spécifiques au-delà des bonnes pratiques.",
    exemples: ["Classification de documents", "Filtres spam", "Tri automatique"],
    applicable: true,
    obligations: ["Bonnes pratiques IA", "Documentation interne"],
  },
];

// ── modèles IA détaillés ──────────────────────────────────────────────────────
const AI_MODELS_DETAIL = [
  {
    id: "m01",
    name: "CreditScoring v3.2",
    domain: "Risque Crédit",
    description: "Modèle de scoring crédit utilisé pour l'octroi de prêts retail et corporate. Prédit la probabilité de défaut à 12 mois.",
    eu_ai_class: "Risque Élevé",
    algo: "XGBoost + Ensemble",
    training_data: "5,2M dossiers (2018–2025)",
    features: 147,
    retrain_freq: "Trimestriel",
    drift_threshold: 3.0,
    impact: "Décisions d'octroi de crédit · 2 400 dossiers/mois",
    human_oversight: true,
    doc_complete: true,
  },
  {
    id: "m02",
    name: "FraudDetector v1.8",
    domain: "Conformité",
    description: "Détection de transactions frauduleuses en temps quasi-réel sur les flux de paiement.",
    eu_ai_class: "Risque Élevé",
    algo: "Isolation Forest + LSTM",
    training_data: "18M transactions (2020–2025)",
    features: 89,
    retrain_freq: "Mensuel",
    drift_threshold: 2.5,
    impact: "Blocage transactions suspectes · 45 000 transactions/jour",
    human_oversight: true,
    doc_complete: false,
  },
  {
    id: "m03",
    name: "ChurnPredictor v2.1",
    domain: "Marketing",
    description: "Prédiction de l'attrition clients sur un horizon de 90 jours pour ciblage des campagnes de rétention.",
    eu_ai_class: "Risque Limité",
    algo: "Random Forest + Logistic Regression",
    training_data: "890K clients (2022–2025)",
    features: 64,
    retrain_freq: "Bimestriel",
    drift_threshold: 5.0,
    impact: "Campagnes rétention · 12 000 clients ciblés/mois",
    human_oversight: false,
    doc_complete: true,
  },
  {
    id: "m04",
    name: "LiquidityForecast v1.0",
    domain: "Finance",
    description: "Prévision des besoins de liquidité à 30 et 90 jours pour optimiser la gestion du bilan.",
    eu_ai_class: "Risque Élevé",
    algo: "Prophet + ARIMA Hybride",
    training_data: "8 ans de données historiques",
    features: 42,
    retrain_freq: "Hebdomadaire",
    drift_threshold: 2.0,
    impact: "Décisions de trésorerie · Gestion du ratio LCR",
    human_oversight: true,
    doc_complete: false,
  },
  {
    id: "m05",
    name: "DocClassifier v4.0",
    domain: "Opérations",
    description: "Classification automatique des documents entrants (contrats, KYC, justificatifs) pour routing intelligent.",
    eu_ai_class: "Risque Minimal",
    algo: "BERT Fine-tuned",
    training_data: "2,1M documents labelisés",
    features: null,
    retrain_freq: "Annuel",
    drift_threshold: 8.0,
    impact: "Traitement automatique · 8 000 documents/jour",
    human_oversight: false,
    doc_complete: true,
  },
];

// ── données de drift par modèle ───────────────────────────────────────────────
const DRIFT_HISTORY: Record<string, { month: string; drift: number; threshold: number }[]> = {
  m01: [
    { month: "Oct", drift: 0.8, threshold: 3.0 },
    { month: "Nov", drift: 1.1, threshold: 3.0 },
    { month: "Dec", drift: 1.4, threshold: 3.0 },
    { month: "Jan", drift: 1.0, threshold: 3.0 },
    { month: "Fév", drift: 1.2, threshold: 3.0 },
    { month: "Mar", drift: 1.2, threshold: 3.0 },
    { month: "Avr", drift: 1.2, threshold: 3.0 },
  ],
  m02: [
    { month: "Oct", drift: 1.8, threshold: 2.5 },
    { month: "Nov", drift: 2.1, threshold: 2.5 },
    { month: "Dec", drift: 2.8, threshold: 2.5 },
    { month: "Jan", drift: 3.1, threshold: 2.5 },
    { month: "Fév", drift: 3.5, threshold: 2.5 },
    { month: "Mar", drift: 3.9, threshold: 2.5 },
    { month: "Avr", drift: 3.7, threshold: 2.5 },
  ],
  m03: [
    { month: "Oct", drift: 0.5, threshold: 5.0 },
    { month: "Nov", drift: 0.6, threshold: 5.0 },
    { month: "Dec", drift: 0.7, threshold: 5.0 },
    { month: "Jan", drift: 0.9, threshold: 5.0 },
    { month: "Fév", drift: 0.8, threshold: 5.0 },
    { month: "Mar", drift: 0.8, threshold: 5.0 },
    { month: "Avr", drift: 0.8, threshold: 5.0 },
  ],
  m04: [
    { month: "Oct", drift: 1.2, threshold: 2.0 },
    { month: "Nov", drift: 1.5, threshold: 2.0 },
    { month: "Dec", drift: 1.8, threshold: 2.0 },
    { month: "Jan", drift: 2.2, threshold: 2.0 },
    { month: "Fév", drift: 2.1, threshold: 2.0 },
    { month: "Mar", drift: 2.1, threshold: 2.0 },
    { month: "Avr", drift: 2.1, threshold: 2.0 },
  ],
  m05: [
    { month: "Oct", drift: 0.2, threshold: 8.0 },
    { month: "Nov", drift: 0.2, threshold: 8.0 },
    { month: "Dec", drift: 0.3, threshold: 8.0 },
    { month: "Jan", drift: 0.3, threshold: 8.0 },
    { month: "Fév", drift: 0.3, threshold: 8.0 },
    { month: "Mar", drift: 0.3, threshold: 8.0 },
    { month: "Avr", drift: 0.3, threshold: 8.0 },
  ],
};

// ── accuracy par phase ────────────────────────────────────────────────────────
const ACCURACY_BY_PHASE: Record<number, Record<string, number>> = {
  1: { m01: 84.1, m02: 89.3, m03: 76.2, m04: 81.0, m05: 93.8 },
  2: { m01: 85.5, m02: 90.1, m03: 77.8, m04: 82.4, m05: 94.2 },
  3: { m01: 87.3, m02: 92.1, m03: 79.4, m04: 84.6, m05: 95.2 },
  4: { m01: 89.1, m02: 93.4, m03: 81.2, m04: 86.8, m05: 95.8 },
  5: { m01: 91.2, m02: 94.8, m03: 83.6, m04: 88.9, m05: 96.1 },
  6: { m01: 92.4, m02: 95.6, m03: 85.1, m04: 90.2, m05: 96.4 },
};

// ── statuts par phase ─────────────────────────────────────────────────────────
const STATUS_BY_PHASE: Record<number, Record<string, "validated" | "in_review" | "pending">> = {
  1: { m01: "pending",   m02: "pending",   m03: "pending",   m04: "pending",   m05: "pending"   },
  2: { m01: "pending",   m02: "pending",   m03: "pending",   m04: "pending",   m05: "in_review" },
  3: { m01: "in_review", m02: "in_review", m03: "validated", m04: "pending",   m05: "validated" },
  4: { m01: "validated", m02: "in_review", m03: "validated", m04: "in_review", m05: "validated" },
  5: { m01: "validated", m02: "validated", m03: "validated", m04: "validated", m05: "validated" },
  6: { m01: "validated", m02: "validated", m03: "validated", m04: "validated", m05: "validated" },
};

// ── config statuts ────────────────────────────────────────────────────────────
const STATUS_CFG = {
  validated: { label: "Validé",     color: T.green,  bg: T.greenSoft,  border: T.greenBorder,  Icon: CheckCircle2  },
  in_review: { label: "En review",  color: T.amber,  bg: T.amberSoft,  border: T.amberBorder,  Icon: Clock         },
  pending:   { label: "En attente", color: T.slate,  bg: T.slateSoft,  border: T.slateBorder,  Icon: AlertTriangle },
};

const CLASS_CFG: Record<string, { color: string; bg: string; border: string }> = {
  "Risque Élevé":   { color: T.red,    bg: T.redSoft,    border: T.redBorder    },
  "Risque Limité":  { color: T.amber,  bg: T.amberSoft,  border: T.amberBorder  },
  "Risque Minimal": { color: T.green,  bg: T.greenSoft,  border: T.greenBorder  },
};

// ── process de validation ─────────────────────────────────────────────────────
const VALIDATION_STEPS = [
  { id: 1, label: "Inventaire & Classification",  desc: "Identifier le modèle, le classifier EU AI Act, nommer un responsable",           phase_start: 1 },
  { id: 2, label: "Documentation Technique",      desc: "Rédiger la fiche technique : données, algo, features, limites, biais potentiels", phase_start: 2 },
  { id: 3, label: "Évaluation de Performance",    desc: "Mesurer accuracy, précision, rappel, fairness sur données de test indépendantes", phase_start: 3 },
  { id: 4, label: "Test de Robustesse & Biais",   desc: "Vérifier la stabilité sur données adversariales et tester les biais démographiques", phase_start: 4 },
  { id: 5, label: "Validation Conformité",        desc: "Revue par l'équipe Conformité : check EU AI Act, RGPD, supervision humaine",      phase_start: 5 },
  { id: 6, label: "Déploiement & Monitoring",     desc: "Mise en production avec monitoring du drift, alertes automatiques, revues périodiques", phase_start: 5 },
];

// ── tooltip ───────────────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 8, padding: "10px 14px", boxShadow: "0 4px 16px rgba(30,42,58,0.10)", fontFamily: "'Kanit', sans-serif" }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: T.textPrimary, marginBottom: 6 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ fontSize: 12, color: p.color, margin: "2px 0" }}>
          {p.name} : <strong>{p.value}{typeof p.value === "number" && p.value > 10 ? "%" : ""}</strong>
        </p>
      ))}
    </div>
  );
};

// ── page ─────────────────────────────────────────────────────────────────────
export default function IAGovernancePage() {
  const { state } = useProjectStore();
  const { cols, pad } = useResponsive();

  const currentStatuses  = STATUS_BY_PHASE[state.phase];
  const currentAccuracy  = ACCURACY_BY_PHASE[state.phase];

  const validated  = Object.values(currentStatuses).filter(s => s === "validated").length;
  const inReview   = Object.values(currentStatuses).filter(s => s === "in_review").length;
  const pending    = Object.values(currentStatuses).filter(s => s === "pending").length;

  const highRisk = AI_MODELS_DETAIL.filter(m => m.eu_ai_class === "Risque Élevé").length;

  // Modèle sélectionné pour le drift chart — celui en review ou le premier
  const focusModel = AI_MODELS_DETAIL.find(m => currentStatuses[m.id] === "in_review") ?? AI_MODELS_DETAIL[0];

  const accuracyBarData = AI_MODELS_DETAIL.map(m => ({
    name: m.name.split(" ")[0],
    accuracy: currentAccuracy[m.id],
    fill: currentStatuses[m.id] === "validated" ? T.green : currentStatuses[m.id] === "in_review" ? T.amber : T.slate,
  }));

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24, padding: pad }}>

      {/* ── Bandeau ── */}
      <div style={{ background: T.heroGrad, borderRadius: 14, padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(147,197,253,0.9)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10, fontFamily: "'Kanit', sans-serif" }}>
              FrontierBank · IA Governance · Phase {state.phase}
            </p>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#f0f4ff", marginBottom: 8, fontFamily: "'Kanit', sans-serif" }}>
              Gouvernance des Modèles IA
            </h2>
            <p style={{ fontSize: 13, color: "rgba(191,219,254,0.85)", fontFamily: "'Kanit', sans-serif" }}>
              Registre des modèles · Classification EU AI Act · Model Risk · Drift Monitoring · {state.period}
            </p>
            <p style={{ fontSize: 12, color: "rgba(147,197,253,0.8)", marginTop: 8, fontStyle: "italic", fontFamily: "'Kanit', sans-serif", maxWidth: 560 }}>
              {state.narrative}
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
            {[
              { v: `${validated}/5`,  l: "Modèles validés"      },
              { v: `${highRisk}`,     l: "Risque élevé EU AI Act" },
            ].map(x => (
              <div key={x.l} style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "16px 22px", textAlign: "center" }}>
                <p style={{ fontSize: 26, fontWeight: 800, color: "#f0f4ff", marginBottom: 2, fontFamily: "'Kanit', sans-serif" }}>{x.v}</p>
                <p style={{ fontSize: 11, color: "rgba(147,197,253,0.8)", fontFamily: "'Kanit', sans-serif" }}>{x.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── KPIs registre ── */}
      <div style={{ display: "grid", gridTemplateColumns: cols(4, 2, 1), gap: 16 }}>
        {[
          { Icon: CheckCircle2, iconBg: T.greenSoft,  iconColor: T.green,
            value: `${validated}/5`, label: "Modèles validés", sub: "Conformes EU AI Act · Documentation complète",
            badgeTxt: validated === 5 ? "Complet" : "En cours", badgeBg: validated === 5 ? T.greenSoft : T.amberSoft, badgeColor: validated === 5 ? T.green : T.amber, badgeBorder: validated === 5 ? T.greenBorder : T.amberBorder },
          { Icon: Clock, iconBg: T.amberSoft, iconColor: T.amber,
            value: `${inReview}`, label: "En cours de review", sub: "Validation conformité · Revue documentation",
            badgeTxt: inReview > 0 ? "Action requise" : "RAS", badgeBg: inReview > 0 ? T.amberSoft : T.greenSoft, badgeColor: inReview > 0 ? T.amber : T.green, badgeBorder: inReview > 0 ? T.amberBorder : T.greenBorder },
          { Icon: AlertTriangle, iconBg: T.redSoft, iconColor: T.red,
            value: `${highRisk}`, label: "Modèles Risque Élevé", sub: "Obligations strictes EU AI Act",
            badgeTxt: "EU AI Act", badgeBg: T.redSoft, badgeColor: T.red, badgeBorder: T.redBorder },
          { Icon: Activity, iconBg: T.purpleSoft, iconColor: T.purple,
            value: `${AI_MODELS_DETAIL.filter(m => currentStatuses[m.id] === "in_review" && DRIFT_HISTORY[m.id]?.slice(-1)[0]?.drift > AI_MODELS_DETAIL.find(md => md.id === m.id)?.drift_threshold!).length}`,
            label: "Alertes Drift actives", sub: "Modèles dépassant le seuil de drift",
            badgeTxt: "Monitoring", badgeBg: T.purpleSoft, badgeColor: T.purple, badgeBorder: T.purpleBorder },
        ].map(({ Icon, iconBg, iconColor, value, label, sub, badgeTxt, badgeBg, badgeColor, badgeBorder }) => (
          <div key={label} style={card()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={17} color={iconColor} />
              </div>
              <span style={badge(badgeBg, badgeColor, badgeBorder)}>{badgeTxt}</span>
            </div>
            <p style={{ fontSize: 28, fontWeight: 800, color: T.textPrimary, marginBottom: 4, fontFamily: "'Kanit', sans-serif" }}>{value}</p>
            <p style={{ fontSize: 12, fontWeight: 600, color: T.textSecondary, marginBottom: 4, fontFamily: "'Kanit', sans-serif" }}>{label}</p>
            <p style={{ fontSize: 11, color: T.textMuted, fontFamily: "'Kanit', sans-serif" }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Classification EU AI Act ── */}
      <div style={card()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.textPrimary, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'Kanit', sans-serif" }}>
              Référentiel EU AI Act — Niveaux de Risque
            </p>
            <p style={{ fontSize: 12, color: T.textMuted, marginTop: 3, fontFamily: "'Kanit', sans-serif" }}>
              Classification applicable à FrontierBank · Règlement (UE) 2024/1689 · Entrée en vigueur 2025–2026
            </p>
          </div>
          <span style={badge(T.purpleSoft, T.purple, T.purpleBorder)}>EU AI Act</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: cols(4, 2, 1), gap: 14 }}>
          {EU_AI_CLASSES.map(cls => (
            <div key={cls.level} style={{
              border: `1px solid ${cls.border}`,
              borderRadius: 12, padding: 18,
              background: cls.bg,
              opacity: cls.applicable ? 1 : 0.6,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: cls.color, flexShrink: 0 }} />
                <p style={{ fontSize: 12, fontWeight: 700, color: cls.color, fontFamily: "'Kanit', sans-serif', margin: 0" }}>
                  {cls.level}
                </p>
              </div>
              <p style={{ fontSize: 11, color: T.textSecondary, lineHeight: 1.6, marginBottom: 10, fontFamily: "'Kanit', sans-serif" }}>
                {cls.desc}
              </p>
              <div style={{ marginBottom: 10 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5, fontFamily: "'Kanit', sans-serif" }}>
                  Exemples FrontierBank
                </p>
                {cls.exemples.map((e, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 5, marginBottom: 3 }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: cls.color, marginTop: 5, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: T.textSecondary, lineHeight: 1.4, fontFamily: "'Kanit', sans-serif" }}>{e}</span>
                  </div>
                ))}
              </div>
              {"obligations" in cls && cls.obligations && (
                <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: 8, padding: "8px 10px" }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5, fontFamily: "'Kanit', sans-serif" }}>
                    Obligations
                  </p>
                  {cls.obligations.map((o, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 5, marginBottom: 3 }}>
                      <CheckCircle2 size={10} color={cls.color} style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontSize: 11, color: T.textSecondary, lineHeight: 1.4, fontFamily: "'Kanit', sans-serif" }}>{o}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Registre des modèles ── */}
      <div style={card()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.textPrimary, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'Kanit', sans-serif" }}>
              Registre des Modèles IA — FrontierBank
            </p>
            <p style={{ fontSize: 12, color: T.textMuted, marginTop: 3, fontFamily: "'Kanit', sans-serif" }}>
              {AI_MODELS_DETAIL.length} modèles enregistrés · Statuts mis à jour Phase {state.phase} · {state.period}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={badge(T.greenSoft, T.green, T.greenBorder)}>{validated} validés</span>
            <span style={badge(T.amberSoft, T.amber, T.amberBorder)}>{inReview} en review</span>
            <span style={badge(T.slateSoft, T.slate, T.slateBorder)}>{pending} en attente</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {AI_MODELS_DETAIL.map(model => {
            const status    = currentStatuses[model.id];
            const accuracy  = currentAccuracy[model.id];
            const sCfg      = STATUS_CFG[status];
            const cCfg      = CLASS_CFG[model.eu_ai_class] ?? CLASS_CFG["Risque Minimal"];
            const driftData = DRIFT_HISTORY[model.id];
            const lastDrift = driftData[driftData.length - 1].drift;
            const driftAlert = lastDrift > model.drift_threshold;
            const StatusIcon = sCfg.Icon;

            return (
              <div key={model.id} style={{
                border: `1px solid ${driftAlert ? T.redBorder : T.cardBorder}`,
                borderRadius: 12, overflow: "hidden",
                transition: "border-color 0.3s",
              }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 20px", background: driftAlert ? T.redSoft : "#f9fafd", borderBottom: `1px solid ${T.cardBorder}` }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: cCfg.bg, border: `1px solid ${cCfg.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Brain size={18} color={cCfg.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: T.textPrimary, margin: 0, fontFamily: "'Kanit', sans-serif" }}>
                        {model.name}
                      </p>
                      {driftAlert && <span style={badge(T.redSoft, T.red, T.redBorder)}>⚠ Drift Alert</span>}
                    </div>
                    <p style={{ fontSize: 12, color: T.textMuted, margin: 0, fontFamily: "'Kanit', sans-serif" }}>
                      {model.domain} · {model.algo} · {model.description}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                    <span style={badge(cCfg.bg, cCfg.color, cCfg.border)}>{model.eu_ai_class}</span>
                    <span style={badge(sCfg.bg, sCfg.color, sCfg.border)}>
                      <StatusIcon size={11} style={{ marginRight: 4 }} />
                      {sCfg.label}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div style={{ display: "grid", gridTemplateColumns: cols(3, 1, 1), gap: 0 }}>

                  {/* Infos techniques */}
                  <div style={{ padding: "14px 20px", borderRight: `1px solid ${T.cardBorder}` }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10, fontFamily: "'Kanit', sans-serif" }}>
                      Caractéristiques
                    </p>
                    {[
                      { l: "Données d'entraînement", v: model.training_data },
                      { l: "Features",               v: model.features ? `${model.features} variables` : "NLP (embeddings)" },
                      { l: "Réentraînement",         v: model.retrain_freq },
                      { l: "Impact métier",          v: model.impact },
                    ].map(row => (
                      <div key={row.l} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 11, color: T.textMuted, fontFamily: "'Kanit', sans-serif", minWidth: 130, flexShrink: 0 }}>{row.l}</span>
                        <span style={{ fontSize: 11, color: T.textPrimary, fontFamily: "'Kanit', sans-serif", fontWeight: 500 }}>{row.v}</span>
                      </div>
                    ))}
                  </div>

                  {/* Performance */}
                  <div style={{ padding: "14px 20px", borderRight: `1px solid ${T.cardBorder}` }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10, fontFamily: "'Kanit', sans-serif" }}>
                      Performance · Phase {state.phase}
                    </p>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 10 }}>
                      <span style={{ fontSize: 32, fontWeight: 800, color: accuracy >= 90 ? T.green : accuracy >= 80 ? T.amber : T.red, fontFamily: "'Kanit', sans-serif" }}>
                        {accuracy}%
                      </span>
                      <span style={{ fontSize: 12, color: T.textMuted, fontFamily: "'Kanit', sans-serif" }}>accuracy</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 99, background: T.slateSoft, marginBottom: 8, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${accuracy}%`, borderRadius: 99, background: accuracy >= 90 ? T.green : accuracy >= 80 ? T.amber : T.red, transition: "width 0.8s ease" }} />
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <span style={badge(model.human_oversight ? T.greenSoft : T.amberSoft, model.human_oversight ? T.green : T.amber, model.human_oversight ? T.greenBorder : T.amberBorder)}>
                        {model.human_oversight ? "Supervision humaine ✓" : "Auto"}
                      </span>
                      <span style={badge(model.doc_complete ? T.greenSoft : T.redSoft, model.doc_complete ? T.green : T.red, model.doc_complete ? T.greenBorder : T.redBorder)}>
                        {model.doc_complete ? "Doc complète ✓" : "Doc incomplète"}
                      </span>
                    </div>
                  </div>

                  {/* Drift monitoring */}
                  <div style={{ padding: "14px 20px" }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6, fontFamily: "'Kanit', sans-serif" }}>
                      Drift monitoring · Seuil : {model.drift_threshold}%
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 22, fontWeight: 800, color: driftAlert ? T.red : T.green, fontFamily: "'Kanit', sans-serif" }}>
                        {lastDrift}%
                      </span>
                      {driftAlert
                        ? <span style={badge(T.redSoft, T.red, T.redBorder)}>⚠ Seuil dépassé</span>
                        : <span style={badge(T.greenSoft, T.green, T.greenBorder)}>OK</span>
                      }
                    </div>
                    <ResponsiveContainer width="100%" height={70}>
                      <LineChart data={driftData} margin={{ top: 2, right: 4, bottom: 2, left: 4 }}>
                        <Line dataKey="drift" stroke={driftAlert ? T.red : T.blue} strokeWidth={2} dot={false} />
                        <Line dataKey="threshold" stroke={T.slate} strokeWidth={1} strokeDasharray="4 4" dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                    <p style={{ fontSize: 10, color: T.textMuted, fontFamily: "'Kanit', sans-serif", marginTop: 2 }}>
                      — drift actuel &nbsp;- - seuil d'alerte
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Accuracy comparatif ── */}
      <div style={card()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.textPrimary, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'Kanit', sans-serif" }}>
              Performance Comparée des Modèles
            </p>
            <p style={{ fontSize: 12, color: T.textMuted, marginTop: 3, fontFamily: "'Kanit', sans-serif" }}>
              Accuracy par modèle à la Phase {state.phase} — progression grâce aux réentraînements et à la meilleure qualité des données
            </p>
          </div>
          <span style={badge(T.blueSoft, T.blue, T.blueBorder)}>Phase {state.phase}</span>
        </div>
        <div style={{ background: "#f4f6fb", borderRadius: 10, padding: "16px 8px 8px", border: `1px solid ${T.cardBorder}` }}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={accuracyBarData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }} barCategoryGap="40%">
              <CartesianGrid stroke={T.cardBorder} strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: T.textSecondary, fontSize: 12, fontFamily: "Kanit" }} axisLine={false} tickLine={false} />
              <YAxis domain={[70, 100]} tick={{ fill: T.textMuted, fontSize: 12, fontFamily: "Kanit" }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="accuracy" radius={[6,6,0,0]} name="Accuracy">
                {accuracyBarData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: T.amberSoft, border: `1px solid ${T.amberBorder}`, borderRadius: 8, padding: "10px 14px", display: "flex", gap: 8, marginTop: 14 }}>
          <Info size={14} color={T.amber} style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12, color: "#78350f", lineHeight: 1.7, fontFamily: "'Kanit', sans-serif" }}>
            <strong>Insight :</strong> La progression de l'accuracy entre les phases est directement liée à l'amélioration de la qualité des données d'entraînement
            (Data Quality Phase 3) et au déploiement du MDM (Phase 4) qui réduit les incohérences dans les données clients.
          </p>
        </div>
      </div>

      {/* ── Process de validation ── */}
      <div style={card()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.textPrimary, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'Kanit', sans-serif" }}>
              Process de Validation des Modèles IA
            </p>
            <p style={{ fontSize: 12, color: T.textMuted, marginTop: 3, fontFamily: "'Kanit', sans-serif" }}>
              6 étapes obligatoires avant tout déploiement en production — conformité EU AI Act
            </p>
          </div>
          <span style={badge(
            state.phase >= 5 ? T.greenSoft : T.amberSoft,
            state.phase >= 5 ? T.green : T.amber,
            state.phase >= 5 ? T.greenBorder : T.amberBorder,
          )}>
            {VALIDATION_STEPS.filter(s => state.phase >= s.phase_start).length}/6 étapes actives
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {VALIDATION_STEPS.map((step, i) => {
            const active = state.phase >= step.phase_start;
            const isNew  = state.phase === step.phase_start;
            return (
              <div key={step.id} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                {/* Numéro + ligne verticale */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: active ? T.blue : T.slateSoft,
                    border: `2px solid ${active ? T.blue : T.slateBorder}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.4s",
                  }}>
                    {active
                      ? <CheckCircle2 size={16} color="white" />
                      : <span style={{ fontSize: 12, fontWeight: 700, color: T.textMuted, fontFamily: "'Kanit', sans-serif" }}>{step.id}</span>
                    }
                  </div>
                  {i < VALIDATION_STEPS.length - 1 && (
                    <div style={{ width: 2, height: 24, background: active ? T.blue : T.slateBorder, marginTop: 4, transition: "background 0.4s" }} />
                  )}
                </div>

                {/* Contenu */}
                <div style={{
                  flex: 1, padding: "8px 16px", borderRadius: 10, marginBottom: 8,
                  background: active ? (isNew ? T.blueSoft : T.cardBg) : "#fafbfc",
                  border: `1px solid ${active ? (isNew ? T.blueBorder : T.cardBorder) : T.slateBorder}`,
                  opacity: active ? 1 : 0.5,
                  transition: "all 0.4s",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: active ? T.textPrimary : T.textMuted, margin: 0, fontFamily: "'Kanit', sans-serif" }}>
                      {step.label}
                    </p>
                    {isNew && <span style={badge(T.blueSoft, T.blue, T.blueBorder)}>Nouveau · Ph.{step.phase_start}</span>}
                    {!active && <span style={badge(T.slateSoft, T.slate, T.slateBorder)}>Phase {step.phase_start}</span>}
                  </div>
                  <p style={{ fontSize: 12, color: active ? T.textSecondary : T.textMuted, margin: 0, fontFamily: "'Kanit', sans-serif", lineHeight: 1.6 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
"use client";

import { useProjectStore } from "@/lib/useProjectState";
import { T, badge, card } from "@/lib/theme";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, BarChart, Bar, Cell,
  RadialBarChart, RadialBar
} from "recharts";
import {
  CheckCircle2, AlertTriangle, XCircle, TrendingUp,
  TrendingDown, Minus, Info, ArrowRight, Zap, Target
} from "lucide-react";
import { BCBS_PRINCIPLES } from "@/lib/data";

// ── config dimensions qualité ─────────────────────────────────────────────────
const DQ_DIMENSIONS = [
  {
    id: "completeness", label: "Complétude", key: "completeness" as const,
    color: T.blue, icon: "📋",
    desc: "Proportion de champs renseignés sur les champs attendus",
    target: 95,
    seuil_ok: 90, seuil_warn: 80,
    bcbs: [4],
    remediation: "Identifier les sources de données manquantes et mettre en place des alertes de non-alimentation",
  },
  {
    id: "accuracy", label: "Exactitude", key: "accuracy" as const,
    color: T.green, icon: "✓",
    desc: "Taux de données conformes à la réalité ou à une source de référence",
    target: 95,
    seuil_ok: 88, seuil_warn: 75,
    bcbs: [3, 12],
    remediation: "Rapprocher les données avec les sources certifiées et corriger les règles de transformation",
  },
  {
    id: "freshness", label: "Fraîcheur", key: "freshness" as const,
    color: T.purple, icon: "⏱",
    desc: "Délai entre la création d'une donnée et sa disponibilité dans les systèmes",
    target: 95,
    seuil_ok: 88, seuil_warn: 78,
    bcbs: [5, 8],
    remediation: "Automatiser les pipelines de données et réduire les traitements batch manuels",
  },
  {
    id: "consistency", label: "Cohérence", key: "consistency" as const,
    color: T.amber, icon: "🔗",
    desc: "Absence de contradictions entre les données présentes dans différents systèmes",
    target: 95,
    seuil_ok: 85, seuil_warn: 75,
    bcbs: [12, 13],
    remediation: "Déployer le MDM pour unifier les référentiels clients et produits entre systèmes",
  },
];

// ── données détaillées par domaine métier ─────────────────────────────────────
const DOMAIN_SCORES = [
  { domain: "Finance",     completeness: 91, accuracy: 88, freshness: 94, consistency: 82 },
  { domain: "Risques",     completeness: 88, accuracy: 85, freshness: 90, consistency: 78 },
  { domain: "Clients",     completeness: 84, accuracy: 79, freshness: 87, consistency: 71 },
  { domain: "Conformité",  completeness: 93, accuracy: 90, freshness: 91, consistency: 85 },
  { domain: "Opérations",  completeness: 80, accuracy: 76, freshness: 85, consistency: 74 },
  { domain: "Trésorerie",  completeness: 89, accuracy: 86, freshness: 92, consistency: 83 },
];

// ── plans de remédiation ──────────────────────────────────────────────────────
const REMEDIATION_PLANS = [
  {
    id: "r1", priority: "haute" as const, dimension: "Cohérence",
    domaine: "Données Clients", effort: "4 mois", impact: "Élevé",
    action: "Déploiement MDM Clients — unification des référentiels entre CRM, Core Banking et Risk",
    kpi_avant: 71, kpi_apres: 91, phase_start: 4,
    etapes: [
      "Audit des doublons clients (15 000 doublons identifiés)",
      "Définition des règles de golden record",
      "Déploiement Semarchy MDM en Phase 4",
      "Réconciliation Core Banking ↔ CRM",
    ],
  },
  {
    id: "r2", priority: "haute" as const, dimension: "Exactitude",
    domaine: "Données Risques", effort: "3 mois", impact: "Élevé",
    action: "Contrôles de qualité automatisés sur les indicateurs de risque (LCR, NSFR, VaR)",
    kpi_avant: 85, kpi_apres: 94, phase_start: 3,
    etapes: [
      "Implémenter tests dbt sur les 14 données critiques BCBS 239",
      "Mettre en place alertes qualité en temps réel",
      "Corriger les règles de calcul du ratio LCR",
      "Valider avec la Direction des Risques",
    ],
  },
  {
    id: "r3", priority: "moyenne" as const, dimension: "Complétude",
    domaine: "Données Opérations", effort: "2 mois", impact: "Moyen",
    action: "Automatisation de l'alimentation des tables opérationnelles via pipeline Airflow",
    kpi_avant: 80, kpi_apres: 92, phase_start: 3,
    etapes: [
      "Identifier les 12 tables sous-alimentées",
      "Créer les pipelines d'ingestion automatisés",
      "Mettre en place monitoring d'alimentation",
      "Valider avec les équipes opérations",
    ],
  },
  {
    id: "r4", priority: "moyenne" as const, dimension: "Fraîcheur",
    domaine: "Reporting ad hoc", effort: "2 mois", impact: "Moyen",
    action: "Remplacement des extractions manuelles par des flux automatisés temps réel",
    kpi_avant: 85, kpi_apres: 96, phase_start: 4,
    etapes: [
      "Cartographier les 8 reportings manuels BCBS 239",
      "Migrer vers des pipelines Snowflake + dbt",
      "Mettre en place orchestration Airflow",
      "Réduire le délai de production < 4h",
    ],
  },
];

const PRIORITY_CFG = {
  haute:   { color: T.red,   bg: T.redSoft,   border: T.redBorder,   label: "Haute"   },
  moyenne: { color: T.amber, bg: T.amberSoft, border: T.amberBorder, label: "Moyenne" },
  faible:  { color: T.blue,  bg: T.blueSoft,  border: T.blueBorder,  label: "Faible"  },
};

// ── tooltip ───────────────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 8, padding: "10px 14px", boxShadow: "0 4px 16px rgba(30,42,58,0.10)", fontFamily: "'Kanit', sans-serif" }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: T.textPrimary, marginBottom: 6 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ fontSize: 12, color: p.color, margin: "2px 0" }}>
          {p.name} : <strong>{p.value}%</strong>
        </p>
      ))}
    </div>
  );
};

// Statut dynamique d'un plan selon la phase courante
function getPlanStatus(phaseStart: number, currentPhase: number): {
  label: string;
  color: string;
  bg: string;
  border: string;
  pct: number;
} {
  if (currentPhase < phaseStart - 1) {
    return { label: "Non démarré", color: T.slate,  bg: T.slateSoft,  border: T.slateBorder, pct: 0   };
  }
  if (currentPhase === phaseStart - 1) {
    return { label: "Planifié",    color: T.blue,   bg: T.blueSoft,   border: T.blueBorder,  pct: 15  };
  }
  if (currentPhase === phaseStart) {
    return { label: "En cours",    color: T.amber,  bg: T.amberSoft,  border: T.amberBorder, pct: 55  };
  }
  if (currentPhase === phaseStart + 1) {
    return { label: "Finalisé",    color: T.indigo, bg: T.indigoSoft, border: T.indigoBorder,pct: 90  };
  }
  return   { label: "Terminé ✓",  color: T.green,  bg: T.greenSoft,  border: T.greenBorder, pct: 100 };
}

// ── jauge circulaire simple ───────────────────────────────────────────────────
function ScoreGauge({ value, color, target }: { value: number; color: string; target: number }) {
  const status = value >= target * 0.95 ? "ok" : value >= target * 0.85 ? "warn" : "bad";
  const statusColor = status === "ok" ? T.green : status === "warn" ? T.amber : T.red;
  return (
    <div style={{ position: "relative", width: 80, height: 80 }}>
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="32" fill="none" stroke={T.slateSoft} strokeWidth="8" />
        <circle cx="40" cy="40" r="32" fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${(value / 100) * 201} 201`}
          strokeLinecap="round"
          transform="rotate(-90 40 40)"
          style={{ transition: "stroke-dasharray 0.8s ease" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 16, fontWeight: 800, color: statusColor, fontFamily: "'Kanit', sans-serif", lineHeight: 1 }}>{value}%</span>
      </div>
    </div>
  );
}

// ── trend icon ────────────────────────────────────────────────────────────────
function TrendIcon({ current, prev }: { current: number; prev: number }) {
  const diff = current - prev;
  if (diff > 0)  return <div style={{ display: "flex", alignItems: "center", gap: 3, color: T.green }}><TrendingUp size={13} /><span style={{ fontSize: 11, fontWeight: 600, fontFamily: "'Kanit', sans-serif" }}>+{diff}pts</span></div>;
  if (diff < 0)  return <div style={{ display: "flex", alignItems: "center", gap: 3, color: T.red }}><TrendingDown size={13} /><span style={{ fontSize: 11, fontWeight: 600, fontFamily: "'Kanit', sans-serif" }}>{diff}pts</span></div>;
  return <div style={{ display: "flex", alignItems: "center", gap: 3, color: T.slate }}><Minus size={13} /><span style={{ fontSize: 11, fontFamily: "'Kanit', sans-serif" }}>stable</span></div>;
}

// ── page ─────────────────────────────────────────────────────────────────────
export default function QualitePage() {
  const { state, bcbsPrinciples } = useProjectStore();

  // Scores dynamiques selon phase
  const phaseMultiplier = { 1: 0.78, 2: 0.84, 3: 1.0, 4: 1.10, 5: 1.14, 6: 1.17 }[state.phase] ?? 1;
  const lastKpi  = state.kpis[state.kpis.length - 1];
  const firstKpi = state.kpis[0];

  const avgCurrent = Math.round((lastKpi.completeness + lastKpi.accuracy + lastKpi.freshness + lastKpi.consistency) / 4);
  const avgFirst   = Math.round((firstKpi.completeness + firstKpi.accuracy + firstKpi.freshness + firstKpi.consistency) / 4);
  const progression = avgCurrent - avgFirst;

  // Scores domaines ajustés à la phase
  const domainData = DOMAIN_SCORES.map(d => ({
    ...d,
    completeness: Math.min(99, Math.round(d.completeness * phaseMultiplier)),
    accuracy:     Math.min(99, Math.round(d.accuracy     * phaseMultiplier)),
    freshness:    Math.min(99, Math.round(d.freshness    * phaseMultiplier)),
    consistency:  Math.min(99, Math.round(d.consistency  * phaseMultiplier)),
  }));

  // BCBS impactés par qualité
  const qualityBcbs = bcbsPrinciples.filter(p => [3,4,5,6,8,12,13].includes(p.id));

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>

      {/* ── Bandeau ── */}
      <div style={{ background: T.heroGrad, borderRadius: 14, padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(147,197,253,0.9)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10, fontFamily: "'Kanit', sans-serif" }}>
              FrontierBank · Data Quality · Phase {state.phase}
            </p>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#f0f4ff", marginBottom: 8, fontFamily: "'Kanit', sans-serif" }}>
              Pilotage de la Qualité des Données
            </h2>
            <p style={{ fontSize: 13, color: "rgba(191,219,254,0.85)", fontFamily: "'Kanit', sans-serif" }}>
              4 dimensions qualité · Conformité BCBS 239 · Plans de remédiation · {state.period}
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
            {[
              { v: `${avgCurrent}%`,   l: "Score qualité moyen" },
              { v: `+${progression}pts`, l: "Progression" },
            ].map(x => (
              <div key={x.l} style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "16px 22px", textAlign: "center" }}>
                <p style={{ fontSize: 26, fontWeight: 800, color: "#f0f4ff", marginBottom: 2, fontFamily: "'Kanit', sans-serif" }}>{x.v}</p>
                <p style={{ fontSize: 11, color: "rgba(147,197,253,0.8)", fontFamily: "'Kanit', sans-serif" }}>{x.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4 jauges dimensions ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {DQ_DIMENSIONS.map(dim => {
          const current = lastKpi[dim.key];
          const prev    = state.kpis.length > 1 ? state.kpis[state.kpis.length - 2][dim.key] : current;
          const statusOk = current >= dim.seuil_ok;
          const statusWarn = current >= dim.seuil_warn && current < dim.seuil_ok;

          return (
            <div key={dim.id} style={{ ...card(), padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary, fontFamily: "'Kanit', sans-serif", margin: 0 }}>{dim.label}</p>
                  <p style={{ fontSize: 11, color: T.textMuted, fontFamily: "'Kanit', sans-serif", margin: "2px 0 0" }}>Cible : {dim.target}%</p>
                </div>
                <span style={badge(
                  statusOk ? T.greenSoft : statusWarn ? T.amberSoft : T.redSoft,
                  statusOk ? T.green : statusWarn ? T.amber : T.red,
                  statusOk ? T.greenBorder : statusWarn ? T.amberBorder : T.redBorder,
                )}>
                  {statusOk ? "OK" : statusWarn ? "Attention" : "Critique"}
                </span>
              </div>

              {/* Jauge */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                <ScoreGauge value={current} color={dim.color} target={dim.target} />
              </div>

              {/* Trend */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
                <TrendIcon current={current} prev={prev} />
              </div>

              {/* Description */}
              <p style={{ fontSize: 11, color: T.textMuted, textAlign: "center", lineHeight: 1.5, fontFamily: "'Kanit', sans-serif" }}>
                {dim.desc}
              </p>

              {/* BCBS liés */}
              <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 10 }}>
                {dim.bcbs.map(b => (
                  <span key={b} style={badge(T.purpleSoft, T.purple, T.purpleBorder)}>BCBS #{b}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Évolution temporelle ── */}
      <div style={card()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.textPrimary, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'Kanit', sans-serif" }}>
              Évolution Temporelle des KPIs Qualité
            </p>
            <p style={{ fontSize: 12, color: T.textMuted, marginTop: 3, fontFamily: "'Kanit', sans-serif" }}>
              Progression mensuelle des 4 dimensions — Phase {state.phase} · {state.period}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={badge(T.greenSoft, T.green, T.greenBorder)}>+{progression} pts</span>
            <span style={badge(T.blueSoft, T.blue, T.blueBorder)}>Phase {state.phase}</span>
          </div>
        </div>
        <div style={{ background: "#f4f6fb", borderRadius: 10, padding: "16px 16px 8px", border: `1px solid ${T.cardBorder}` }}>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={state.kpis} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
              <CartesianGrid stroke={T.cardBorder} strokeDasharray="5 5" />
              <XAxis dataKey="month" tick={{ fill: T.textMuted, fontSize: 12, fontFamily: "Kanit" }} axisLine={false} tickLine={false} />
              <YAxis domain={[55, 100]} tick={{ fill: T.textMuted, fontSize: 12, fontFamily: "Kanit" }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: T.textMuted, fontFamily: "Kanit", paddingTop: 12 }} />
              <Line dataKey="completeness" stroke={T.blue}   strokeWidth={2.5} dot={{ fill: T.blue,   r: 3 }} name="Complétude" />
              <Line dataKey="accuracy"     stroke={T.green}  strokeWidth={2.5} dot={{ fill: T.green,  r: 3 }} name="Exactitude" />
              <Line dataKey="freshness"    stroke={T.purple} strokeWidth={2.5} dot={{ fill: T.purple, r: 3 }} name="Fraîcheur"  />
              <Line dataKey="consistency"  stroke={T.amber}  strokeWidth={2.5} dot={{ fill: T.amber,  r: 3 }} name="Cohérence"  />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: T.amberSoft, border: `1px solid ${T.amberBorder}`, borderRadius: 8, padding: "10px 14px", display: "flex", gap: 8, marginTop: 14 }}>
          <Info size={14} color={T.amber} style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12, color: "#78350f", lineHeight: 1.7, fontFamily: "'Kanit', sans-serif" }}>
            <strong>Lecture :</strong>{" "}
            {state.phase <= 2 && "Baseline établie. Les données sont collectées manuellement — les processus de contrôle qualité ne sont pas encore automatisés."}
            {state.phase === 3 && "La Cohérence (ligne orange) reste le point faible car le MDM n'est pas encore déployé. Les autres dimensions progressent grâce aux contrôles dbt mis en place."}
            {state.phase === 4 && "Le déploiement MDM Phase 4 fait bondir la Cohérence de +12 points. C'est le levier le plus impactant du programme sur la qualité."}
            {state.phase >= 5 && "Toutes les dimensions dépassent 90%. Les processus sont automatisés et la culture qualité est ancrée dans les équipes."}
          </p>
        </div>
      </div>

      {/* ── Heatmap par domaine métier ── */}
      <div style={card()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.textPrimary, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'Kanit', sans-serif" }}>
              Qualité par Domaine Métier
            </p>
            <p style={{ fontSize: 12, color: T.textMuted, marginTop: 3, fontFamily: "'Kanit', sans-serif" }}>
              Score des 4 dimensions pour chaque direction métier de FrontierBank
            </p>
          </div>
          <span style={badge(T.slateSoft, T.slate, T.slateBorder)}>6 domaines</span>
        </div>

        {/* Table heatmap */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 6px", fontFamily: "'Kanit', sans-serif" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "8px 16px", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Domaine</th>
                {DQ_DIMENSIONS.map(d => (
                  <th key={d.id} style={{ textAlign: "center", padding: "8px 12px", fontSize: 11, fontWeight: 700, color: d.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {d.label}
                  </th>
                ))}
                <th style={{ textAlign: "center", padding: "8px 12px", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Moyenne</th>
              </tr>
            </thead>
            <tbody>
              {domainData.map(row => {
                const avg = Math.round((row.completeness + row.accuracy + row.freshness + row.consistency) / 4);
                return (
                  <tr key={row.domain}>
                    <td style={{ padding: "10px 16px", background: "#f9fafd", borderRadius: "10px 0 0 10px", border: `1px solid ${T.cardBorder}`, borderRight: "none" }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: T.textPrimary }}>{row.domain}</span>
                    </td>
                    {[row.completeness, row.accuracy, row.freshness, row.consistency].map((val, i) => {
                      const dim = DQ_DIMENSIONS[i];
                      const bg  = val >= dim.seuil_ok ? "#ecfdf5" : val >= dim.seuil_warn ? "#fffbeb" : "#fef2f2";
                      const clr = val >= dim.seuil_ok ? T.green   : val >= dim.seuil_warn ? T.amber   : T.red;
                      return (
                        <td key={i} style={{ padding: "10px 12px", background: bg, textAlign: "center", border: `1px solid ${T.cardBorder}`, borderLeft: "none", borderRight: "none" }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: clr, fontFamily: "'Kanit', sans-serif" }}>{val}%</span>
                        </td>
                      );
                    })}
                    <td style={{ padding: "10px 16px", background: "#f9fafd", borderRadius: "0 10px 10px 0", border: `1px solid ${T.cardBorder}`, borderLeft: "none", textAlign: "center" }}>
                      <span style={{
                        fontSize: 13, fontWeight: 800, fontFamily: "'Kanit', sans-serif",
                        color: avg >= 90 ? T.green : avg >= 80 ? T.amber : T.red,
                      }}>{avg}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Légende */}
        <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
          {[
            { color: T.green, bg: "#ecfdf5", label: "Bon (≥ seuil objectif)" },
            { color: T.amber, bg: "#fffbeb", label: "Attention (zone de vigilance)" },
            { color: T.red,   bg: "#fef2f2", label: "Critique (action requise)" },
          ].map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, background: l.bg, border: `1px solid ${l.color}44` }} />
              <span style={{ fontSize: 11, color: T.textMuted, fontFamily: "'Kanit', sans-serif" }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bar chart par domaine ── */}
      <div style={card()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.textPrimary, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'Kanit', sans-serif" }}>
              Score Moyen par Domaine Métier
            </p>
            <p style={{ fontSize: 12, color: T.textMuted, marginTop: 3, fontFamily: "'Kanit', sans-serif" }}>
              Vue consolidée de la maturité qualité data par direction
            </p>
          </div>
        </div>
        <div style={{ background: "#f4f6fb", borderRadius: 10, padding: "16px 8px 8px", border: `1px solid ${T.cardBorder}` }}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={domainData.map(d => ({
              name: d.domain,
              score: Math.round((d.completeness + d.accuracy + d.freshness + d.consistency) / 4),
            }))} margin={{ top: 5, right: 20, bottom: 5, left: 0 }} barCategoryGap="40%">
              <CartesianGrid stroke={T.cardBorder} strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: T.textSecondary, fontSize: 12, fontFamily: "Kanit" }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fill: T.textMuted, fontSize: 12, fontFamily: "Kanit" }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="score" radius={[6,6,0,0]} name="Score moyen">
                {domainData.map((d, i) => {
                  const avg = Math.round((d.completeness + d.accuracy + d.freshness + d.consistency) / 4);
                  return <Cell key={i} fill={avg >= 88 ? T.green : avg >= 80 ? T.blue : T.amber} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── BCBS 239 — principes qualité ── */}
      <div style={card()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.textPrimary, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'Kanit', sans-serif" }}>
              Impact Qualité sur la Conformité BCBS 239
            </p>
            <p style={{ fontSize: 12, color: T.textMuted, marginTop: 3, fontFamily: "'Kanit', sans-serif" }}>
              Les 7 principes BCBS 239 directement liés à la qualité des données
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={badge(T.greenSoft, T.green, T.greenBorder)}>{qualityBcbs.filter(p => p.status === "compliant").length} conformes</span>
            <span style={badge(T.redSoft,   T.red,   T.redBorder)}  >{qualityBcbs.filter(p => p.status !== "compliant").length} à traiter</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {qualityBcbs.map(p => {
            const cfg = {
              compliant:     { Icon: CheckCircle2,  color: T.green, bg: T.greenSoft, border: T.greenBorder, label: "Conforme"     },
              partial:       { Icon: AlertTriangle, color: T.amber, bg: T.amberSoft, border: T.amberBorder, label: "Partiel"      },
              non_compliant: { Icon: XCircle,       color: T.red,   bg: T.redSoft,   border: T.redBorder,   label: "Non conforme" },
            }[p.status];
            const { Icon } = cfg;
            const dim = DQ_DIMENSIONS.find(d => d.bcbs.includes(p.id));
            return (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: cfg.color, fontFamily: "monospace", width: 20, textAlign: "center", flexShrink: 0 }}>{p.id}</span>
                <Icon size={14} color={cfg.color} style={{ flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: T.textPrimary, margin: 0, fontFamily: "'Kanit', sans-serif" }}>{p.title}</p>
                  {p.gap && <p style={{ fontSize: 11, color: T.textMuted, margin: 0, fontFamily: "'Kanit', sans-serif" }}>{p.gap}</p>}
                </div>
                {dim && <span style={badge(T.slateSoft, T.slate, T.slateBorder)}>→ {dim.label}</span>}
                <span style={{ fontSize: 11, fontWeight: 600, color: cfg.color, background: "white", border: `1px solid ${cfg.border}`, borderRadius: 9999, padding: "2px 10px", flexShrink: 0, fontFamily: "'Kanit', sans-serif" }}>
                  {cfg.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Plans de remédiation ── */}
<div style={card()}>
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
    <div>
      <p style={{ fontSize: 11, fontWeight: 700, color: T.textPrimary, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'Kanit', sans-serif" }}>
        Plans de Remédiation Data Quality
      </p>
      <p style={{ fontSize: 12, color: T.textMuted, marginTop: 3, fontFamily: "'Kanit', sans-serif" }}>
        Actions correctives priorisées — avancement en temps réel selon la phase du programme
      </p>
    </div>
    <div style={{ display: "flex", gap: 8 }}>
      <span style={badge(T.greenSoft,  T.green,  T.greenBorder)}>
        {REMEDIATION_PLANS.filter(p => getPlanStatus(p.phase_start, state.phase).pct === 100).length} terminés
      </span>
      <span style={badge(T.amberSoft,  T.amber,  T.amberBorder)}>
        {REMEDIATION_PLANS.filter(p => { const s = getPlanStatus(p.phase_start, state.phase); return s.pct > 0 && s.pct < 100; }).length} en cours
      </span>
      <span style={badge(T.slateSoft,  T.slate,  T.slateBorder)}>
        {REMEDIATION_PLANS.filter(p => getPlanStatus(p.phase_start, state.phase).pct === 0).length} non démarrés
      </span>
    </div>
  </div>

  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
    {REMEDIATION_PLANS.map(plan => {
      const pCfg   = PRIORITY_CFG[plan.priority];
      const status = getPlanStatus(plan.phase_start, state.phase);
      const gain   = plan.kpi_apres - plan.kpi_avant;

      // KPI "avant" affiché selon phase
      const kpiActuel = status.pct === 100
        ? plan.kpi_apres
        : status.pct === 0
          ? plan.kpi_avant
          : Math.round(plan.kpi_avant + (gain * status.pct) / 100);

      return (
        <div key={plan.id} style={{
          border: `1px solid ${status.border}`,
          borderRadius: 12, overflow: "hidden",
          opacity: status.pct === 0 ? 0.6 : 1,
          transition: "opacity 0.3s",
        }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", background: status.bg, borderBottom: `1px solid ${status.border}` }}>

            {/* Badges priorité + statut */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
              <span style={badge(pCfg.bg, pCfg.color, pCfg.border)}>Priorité {pCfg.label}</span>
              <span style={badge(status.bg, status.color, status.border)}>{status.label}</span>
            </div>

            {/* Titre + meta */}
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary, margin: 0, fontFamily: "'Kanit', sans-serif" }}>
                {plan.action}
              </p>
              <p style={{ fontSize: 11, color: T.textMuted, margin: "3px 0 0", fontFamily: "'Kanit', sans-serif" }}>
                Dimension : <strong style={{ color: T.textSecondary }}>{plan.dimension}</strong>
                &nbsp;·&nbsp;Domaine : <strong style={{ color: T.textSecondary }}>{plan.domaine}</strong>
                &nbsp;·&nbsp;Effort : <strong style={{ color: T.textSecondary }}>{plan.effort}</strong>
                &nbsp;·&nbsp;Démarrage : <strong style={{ color: status.color }}>Phase {plan.phase_start}</strong>
              </p>

              {/* Barre de progression */}
              <div style={{ marginTop: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 10, color: T.textMuted, fontFamily: "'Kanit', sans-serif" }}>Avancement</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: status.color, fontFamily: "'Kanit', sans-serif" }}>{status.pct}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 99, background: "rgba(255,255,255,0.6)", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 99,
                    width: `${status.pct}%`,
                    background: status.color,
                    transition: "width 0.8s ease",
                  }} />
                </div>
              </div>
            </div>

            {/* KPIs avant / actuel / cible */}
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
              <div style={{ textAlign: "center", padding: "6px 12px", background: "rgba(255,255,255,0.7)", border: `1px solid ${T.redBorder}`, borderRadius: 8 }}>
                <p style={{ fontSize: 15, fontWeight: 800, color: T.red,   margin: 0, fontFamily: "'Kanit', sans-serif" }}>{plan.kpi_avant}%</p>
                <p style={{ fontSize: 10, color: T.textMuted, margin: 0, fontFamily: "'Kanit', sans-serif" }}>baseline</p>
              </div>
              <div style={{ textAlign: "center", padding: "6px 12px", background: "rgba(255,255,255,0.7)", border: `1px solid ${status.border}`, borderRadius: 8 }}>
                <p style={{ fontSize: 15, fontWeight: 800, color: status.color, margin: 0, fontFamily: "'Kanit', sans-serif" }}>{kpiActuel}%</p>
                <p style={{ fontSize: 10, color: T.textMuted, margin: 0, fontFamily: "'Kanit', sans-serif" }}>actuel</p>
              </div>
              <ArrowRight size={14} color={T.textMuted} />
              <div style={{ textAlign: "center", padding: "6px 12px", background: "rgba(255,255,255,0.7)", border: `1px solid ${T.greenBorder}`, borderRadius: 8 }}>
                <p style={{ fontSize: 15, fontWeight: 800, color: T.green, margin: 0, fontFamily: "'Kanit', sans-serif" }}>{plan.kpi_apres}%</p>
                <p style={{ fontSize: 10, color: T.textMuted, margin: 0, fontFamily: "'Kanit', sans-serif" }}>objectif</p>
              </div>
              <div style={{ textAlign: "center", padding: "6px 12px", background: "rgba(255,255,255,0.7)", border: `1px solid ${T.purpleBorder}`, borderRadius: 8 }}>
                <p style={{ fontSize: 15, fontWeight: 800, color: T.purple, margin: 0, fontFamily: "'Kanit', sans-serif" }}>+{gain}pts</p>
                <p style={{ fontSize: 10, color: T.textMuted, margin: 0, fontFamily: "'Kanit', sans-serif" }}>gain</p>
              </div>
            </div>
          </div>

          {/* Étapes — grisées si non démarré */}
          <div style={{ padding: "12px 20px 14px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, background: T.cardBg }}>
            {plan.etapes.map((e, i) => {
              // Étape "faite" si pct dépasse le seuil de l'étape
              const etapeDone = status.pct >= (i + 1) * 25;
              const etapeActive = !etapeDone && status.pct >= i * 25 && status.pct > 0;
              return (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: 8,
                  padding: "8px 10px",
                  background: etapeDone ? T.greenSoft : etapeActive ? T.blueSoft : T.cardBg,
                  border: `1px solid ${etapeDone ? T.greenBorder : etapeActive ? T.blueBorder : T.cardBorder}`,
                  borderRadius: 8,
                  transition: "all 0.3s",
                }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%", flexShrink: 0, marginTop: 1,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: etapeDone ? T.green : etapeActive ? T.blue : T.slateSoft,
                    border: `1px solid ${etapeDone ? T.green : etapeActive ? T.blue : T.slateBorder}`,
                  }}>
                    {etapeDone
                      ? <CheckCircle2 size={11} color="white" />
                      : <span style={{ fontSize: 10, fontWeight: 700, color: etapeActive ? "white" : T.textMuted, fontFamily: "'Kanit', sans-serif" }}>{i+1}</span>
                    }
                  </div>
                  <span style={{ fontSize: 11, color: etapeDone ? "#065f46" : etapeActive ? T.blue : T.textMuted, lineHeight: 1.5, fontFamily: "'Kanit', sans-serif" }}>
                    {e}
                  </span>
                </div>
              );
            })}
          </div>

        </div>
      );
    })}
  </div>
</div>

    </div>
  );
}
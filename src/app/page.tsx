"use client";

import { MATURITY_DOMAINS, KPI_DATA, ROADMAP, BCBS_PRINCIPLES } from "@/lib/data";
import { T, badge, card } from "@/lib/theme";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from "recharts";
import { TrendingUp, AlertTriangle, CheckCircle2, ShieldCheck, Brain, Activity, Info } from "lucide-react";

// ── data ─────────────────────────────────────────────────────────────────────
const compliant    = BCBS_PRINCIPLES.filter(p => p.status === "compliant").length;
const partial      = BCBS_PRINCIPLES.filter(p => p.status === "partial").length;
const nonCompliant = BCBS_PRINCIPLES.filter(p => p.status === "non_compliant").length;
const avgMaturity  = (MATURITY_DOMAINS.reduce((a, d) => a + d.score, 0) / MATURITY_DOMAINS.length).toFixed(1);

const radarData = MATURITY_DOMAINS.map(d => ({
  domain: d.label.replace("Data ", ""),
  Actuel: d.score,
  Cible:  d.target,
}));

const ROAD_STATUS = {
  done:        { label: "Terminé",  color: T.green,  bg: T.greenSoft,  border: T.greenBorder },
  in_progress: { label: "En cours", color: T.blue,   bg: T.blueSoft,   border: T.blueBorder  },
  planned:     { label: "Planifié", color: T.slate,  bg: T.slateSoft,  border: T.slateBorder },
};

// ── styles ────────────────────────────────────────────────────────────────────
const S = {
  page:  { maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column" as const, gap: 24 },
  card:  card(),
  row4:  { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 },
  row6:  { display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14 },
  title: { fontSize: 11, fontWeight: 700, color: T.textPrimary, textTransform: "uppercase" as const, letterSpacing: "0.07em", fontFamily: "'Kanit', sans-serif" },
  sub:   { fontSize: 12, color: T.textMuted, marginTop: 3, fontFamily: "'Kanit', sans-serif" },
  insight: (bg: string, border: string, color: string): React.CSSProperties => ({
    background: bg, border: `1px solid ${border}`, borderRadius: 8,
    padding: "10px 14px", display: "flex", gap: 8, marginTop: 14,
  }),
};

// ── tooltip recharts ──────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: T.cardBg, border: `1px solid ${T.cardBorder}`,
      borderRadius: 8, padding: "10px 14px",
      boxShadow: "0 4px 16px rgba(30,42,58,0.10)",
      fontFamily: "'Kanit', sans-serif",
    }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: T.textPrimary, marginBottom: 6 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ fontSize: 12, color: p.color, margin: "2px 0" }}>
          {p.name} : <strong>{p.value}{p.value < 10 ? " / 5" : "%"}</strong>
        </p>
      ))}
    </div>
  );
};

// ── section header ────────────────────────────────────────────────────────────
function SectionHeader({ title, sub, right }: { title: string; sub: string; right?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
      <div>
        <p style={S.title}>{title}</p>
        <p style={S.sub}>{sub}</p>
      </div>
      {right}
    </div>
  );
}

// ── page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  return (
    <div style={S.page}>

      {/* ── Bandeau mission ── */}
      <div style={{ background: T.heroGrad, borderRadius: 14, padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
          <div>
            <p style={{
              fontSize: 10, fontWeight: 700, color: "rgba(147,197,253,0.9)",
              letterSpacing: "0.1em", textTransform: "uppercase",
              marginBottom: 10, fontFamily: "'Kanit', sans-serif"
            }}>
              Programme en cours · FrontierBank
            </p>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#f0f4ff", marginBottom: 10, fontFamily: "'Kanit', sans-serif", lineHeight: 1.2 }}>
              Gouvernance Data & IA<br />
              <span style={{ color: "#93c5fd" }}>BCBS 239 · DAMA-DMBOK · EU AI Act</span>
            </h2>
            <p style={{ fontSize: 13, color: "rgba(191,219,254,0.85)", fontFamily: "'Kanit', sans-serif" }}>
              Mission de conseil · Phase 3/6 · Déploiement Data Catalog & Qualité · Mars – Mai 2026
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
            {[
              { v: "Phase 3", l: "sur 6 phases" },
              { v: "50%",     l: "avancement"   },
            ].map(x => (
              <div key={x.l} style={{
                background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 12, padding: "16px 22px", textAlign: "center",
              }}>
                <p style={{ fontSize: 26, fontWeight: 800, color: "#f0f4ff", marginBottom: 2, fontFamily: "'Kanit', sans-serif" }}>{x.v}</p>
                <p style={{ fontSize: 11, color: "rgba(147,197,253,0.8)", fontFamily: "'Kanit', sans-serif" }}>{x.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4 KPI cards ── */}
      <div style={S.row4}>
        {[
          {
            Icon: Activity,    iconBg: T.blueSoft,   iconColor: T.blue,
            value: `${avgMaturity}/5`, label: "Maturité Data globale",
            sub: "Score moyen sur 8 domaines DAMA-DMBOK",
            badgeTxt: "Niveau initial", badgeBg: T.amberSoft, badgeColor: T.amber, badgeBorder: T.amberBorder,
          },
          {
            Icon: ShieldCheck, iconBg: T.greenSoft,  iconColor: T.green,
            value: `${compliant}/14`,  label: "Principes BCBS 239 conformes",
            sub: `${compliant} conformes · ${partial} partiels · ${nonCompliant} non conformes`,
            badgeTxt: "Remédiation", badgeBg: T.redSoft, badgeColor: T.red, badgeBorder: T.redBorder,
          },
          {
            Icon: TrendingUp,  iconBg: T.blueSoft,   iconColor: T.blue,
            value: "82%",              label: "KPI Qualité moyen",
            sub: "Complétude · Exactitude · Fraîcheur · Cohérence",
            badgeTxt: "+18 pts / 6 mois", badgeBg: T.greenSoft, badgeColor: T.green, badgeBorder: T.greenBorder,
          },
          {
            Icon: Brain,       iconBg: T.purpleSoft, iconColor: T.purple,
            value: "5",                label: "Modèles IA enregistrés",
            sub: "2 validés · 2 en review · 1 en attente",
            badgeTxt: "EU AI Act", badgeBg: T.purpleSoft, badgeColor: T.purple, badgeBorder: T.purpleBorder,
          },
        ].map(({ Icon, iconBg, iconColor, value, label, sub, badgeTxt, badgeBg, badgeColor, badgeBorder }) => (
          <div key={label} style={S.card}>
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

      {/* ── Radar maturité ── */}
      <div style={S.card}>
        <SectionHeader
          title="Radar de Maturité Data"
          sub="Positionnement actuel de FrontierBank vs. cible DAMA-DMBOK sur 8 domaines — Score sur 5"
          right={<span style={badge(T.slateSoft, T.slate, T.slateBorder)}>8 domaines</span>}
        />
        <div style={{ background: "#f4f6fb", borderRadius: 10, padding: "16px 0", border: `1px solid ${T.cardBorder}` }}>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radarData} margin={{ top: 20, right: 50, bottom: 20, left: 50 }}>
              <PolarGrid stroke={T.cardBorder} />
              <PolarAngleAxis dataKey="domain" tick={{ fill: T.textSecondary, fontSize: 12, fontFamily: "Kanit" }} />
              <Radar name="Cible"  dataKey="Cible"  stroke={T.slateBorder} strokeWidth={1.5} fill={T.slateSoft}  fillOpacity={0.8} />
              <Radar name="Actuel" dataKey="Actuel" stroke={T.blue}        strokeWidth={2}   fill={T.blue}        fillOpacity={0.2} />
              <Legend wrapperStyle={{ fontSize: 12, color: T.textMuted, fontFamily: "Kanit" }} />
              <Tooltip content={<ChartTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div style={S.insight(T.amberSoft, T.amberBorder, T.amber)}>
          <Info size={14} color={T.amber} style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12, color: "#78350f", lineHeight: 1.7, fontFamily: "'Kanit', sans-serif" }}>
            <strong>Lecture :</strong> La zone bleue représente le niveau actuel de FrontierBank. L'écart avec la zone grise (cible)
            identifie les chantiers prioritaires. Les domaines <strong>Data Lineage (1.0/5)</strong> et{" "}
            <strong>IA Governance (0.8/5)</strong> sont les plus critiques et feront l'objet des Phases 4 et 5 du programme.
          </p>
        </div>
      </div>

      {/* ── KPI évolution ── */}
      <div style={S.card}>
        <SectionHeader
          title="Évolution des KPIs Qualité des Données"
          sub="Progression mensuelle des 4 dimensions qualité depuis le lancement du programme (oct. 2025 → avr. 2026) — en %"
          right={<span style={badge(T.greenSoft, T.green, T.greenBorder)}>Tendance positive</span>}
        />
        <div style={{ background: "#f4f6fb", borderRadius: 10, padding: "16px 16px 8px", border: `1px solid ${T.cardBorder}` }}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={KPI_DATA} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
              <CartesianGrid stroke={T.cardBorder} strokeDasharray="5 5" />
              <XAxis dataKey="month" tick={{ fill: T.textMuted, fontSize: 12, fontFamily: "Kanit" }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fill: T.textMuted, fontSize: 12, fontFamily: "Kanit" }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: T.textMuted, fontFamily: "Kanit", paddingTop: 12 }} />
              <Line dataKey="completeness" stroke={T.blue}   strokeWidth={2.5} dot={false} name="Complétude" />
              <Line dataKey="accuracy"     stroke={T.green}  strokeWidth={2.5} dot={false} name="Exactitude" />
              <Line dataKey="freshness"    stroke={T.purple} strokeWidth={2.5} dot={false} name="Fraîcheur"  />
              <Line dataKey="consistency"  stroke={T.amber}  strokeWidth={2.5} dot={false} name="Cohérence"  />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={S.insight(T.greenSoft, T.greenBorder, T.green)}>
          <Info size={14} color={T.green} style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12, color: "#065f46", lineHeight: 1.7, fontFamily: "'Kanit', sans-serif" }}>
            <strong>Insight :</strong> La Cohérence reste le point faible à <strong>81%</strong> en avril 2026, directement liée à l'absence
            de MDM sur les données clients — chantier prévu en <strong>Phase 4 (mai 2026)</strong>. La Fraîcheur progresse le plus
            rapidement grâce aux pipelines automatisés déployés en Phase 2.
          </p>
        </div>
      </div>

      {/* ── Feuille de route ── */}
      <div style={S.card}>
        <SectionHeader
          title="Feuille de Route du Programme"
          sub="6 phases de transformation · Jan 2026 – Déc 2026 · Pilotée par le CDO et le cabinet de conseil"
          right={<span style={badge(T.blueSoft, T.blue, T.blueBorder)}>Phase 3 active</span>}
        />
        <div style={S.row6}>
          {ROADMAP.map(r => {
            const s = ROAD_STATUS[r.status as keyof typeof ROAD_STATUS];
            return (
              <div key={r.phase} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 12, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: s.color, fontFamily: "'Kanit', sans-serif" }}>
                    Phase {r.phase}
                  </span>
                  <span style={{
                    fontSize: 10, fontWeight: 600, color: s.color,
                    background: T.cardBg, border: `1px solid ${s.border}`,
                    borderRadius: 9999, padding: "2px 8px", fontFamily: "'Kanit', sans-serif",
                  }}>
                    {s.label}
                  </span>
                </div>
                <p style={{ fontSize: 12, fontWeight: 700, color: T.textPrimary, marginBottom: 4, lineHeight: 1.3, fontFamily: "'Kanit', sans-serif" }}>
                  {r.label}
                </p>
                <p style={{ fontSize: 11, color: T.textMuted, marginBottom: 10, fontFamily: "'Kanit', sans-serif" }}>
                  {r.start} → {r.end}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {r.items.slice(0, 3).map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                      <div style={{ width: 4, height: 4, borderRadius: "50%", background: s.color, marginTop: 5, flexShrink: 0 }} />
                      <span style={{ fontSize: 11, color: T.textSecondary, lineHeight: 1.4, fontFamily: "'Kanit', sans-serif" }}>{item}</span>
                    </div>
                  ))}
                  {r.items.length > 3 && (
                    <p style={{ fontSize: 11, color: T.textMuted, fontFamily: "'Kanit', sans-serif" }}>
                      +{r.items.length - 3} livrables
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── BCBS 239 ── */}
      <div style={S.card}>
        <SectionHeader
          title="Conformité BCBS 239"
          sub="Évaluation des 14 principes du Comité de Bâle sur l'agrégation des données de risque et le reporting réglementaire"
          right={
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <span style={badge(T.greenSoft,  T.green,  T.greenBorder)} >{compliant} conformes</span>
              <span style={badge(T.amberSoft,  T.amber,  T.amberBorder)} >{partial} partiels</span>
              <span style={badge(T.redSoft,    T.red,    T.redBorder)}   >{nonCompliant} non conf.</span>
            </div>
          }
        />

        {/* Barre de progression */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", borderRadius: 99, overflow: "hidden", height: 8, background: T.slateSoft, marginBottom: 8 }}>
            <div style={{ width: `${(compliant/14)*100}%`,    background: T.green, transition: "width 0.6s" }} />
            <div style={{ width: `${(partial/14)*100}%`,      background: T.amber }} />
            <div style={{ width: `${(nonCompliant/14)*100}%`, background: T.red   }} />
          </div>
          <p style={{ fontSize: 12, color: T.textMuted, fontFamily: "'Kanit', sans-serif" }}>
            Taux de conformité global :&nbsp;
            <strong style={{ color: T.textPrimary }}>{Math.round((compliant/14)*100)}%</strong>
            &nbsp;·&nbsp;Cible fin 2026 :&nbsp;
            <strong style={{ color: T.textPrimary }}>100%</strong>
          </p>
        </div>

        {/* Grille 2 colonnes */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {BCBS_PRINCIPLES.map(p => {
            const cfg = {
              compliant:     { Icon: CheckCircle2, color: T.green,  bg: T.greenSoft,  border: T.greenBorder,  label: "Conforme"      },
              partial:       { Icon: AlertTriangle, color: T.amber, bg: T.amberSoft,  border: T.amberBorder,  label: "Partiel"       },
              non_compliant: { Icon: AlertTriangle, color: T.red,   bg: T.redSoft,    border: T.redBorder,    label: "Non conforme"  },
            }[p.status];
            const { Icon } = cfg;
            return (
              <div key={p.id} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 16px", borderRadius: 10,
                background: cfg.bg, border: `1px solid ${cfg.border}`,
              }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: cfg.color, fontFamily: "monospace", width: 20, textAlign: "center", flexShrink: 0 }}>
                  {p.id}
                </span>
                <Icon size={13} color={cfg.color} style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: T.textPrimary, margin: 0, fontFamily: "'Kanit', sans-serif" }}>{p.title}</p>
                  {p.gap && <p style={{ fontSize: 11, color: T.textMuted, margin: 0, fontFamily: "'Kanit', sans-serif" }}>{p.gap}</p>}
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 600, color: cfg.color,
                  background: T.cardBg, border: `1px solid ${cfg.border}`,
                  borderRadius: 9999, padding: "2px 9px", flexShrink: 0,
                  fontFamily: "'Kanit', sans-serif",
                }}>
                  {cfg.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
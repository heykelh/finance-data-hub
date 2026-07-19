"use client";

import { useProjectStore } from "@/lib/useProjectState";
import { useLang } from "@/lib/LanguageContext";
import { T, badge, card } from "@/lib/theme";
import { ROADMAP } from "@/lib/data";
import { useResponsive } from "@/lib/useResponsive";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from "recharts";
import {
  TrendingUp, AlertTriangle, CheckCircle2, ShieldCheck,
  Brain, Activity, Info, Users, FileText, Database,
  GitBranch, Award, LayoutGrid
} from "lucide-react";

const ROAD_STATUS = {
  done:        { color: T.green,  bg: T.greenSoft,  border: T.greenBorder  },
  in_progress: { color: T.blue,   bg: T.blueSoft,   border: T.blueBorder   },
  planned:     { color: T.slate,  bg: T.slateSoft,  border: T.slateBorder  },
};

const PHASE_PCT: Record<number, string> = { 1: "8%", 2: "25%", 3: "50%", 4: "67%", 5: "83%", 6: "100%" };

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 8, padding: "10px 14px", boxShadow: "0 4px 16px rgba(30,42,58,0.10)", fontFamily: "'Kanit', sans-serif" }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: T.textPrimary, marginBottom: 6 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ fontSize: 12, color: p.color, margin: "2px 0" }}>
          {p.name} : <strong>{p.value}{p.value < 10 ? " / 5" : "%"}</strong>
        </p>
      ))}
    </div>
  );
};

function SectionHeader({ title, sub, right }: { title: string; sub: string; right?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, color: T.textPrimary, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'Kanit', sans-serif" }}>{title}</p>
        <p style={{ fontSize: 12, color: T.textMuted, marginTop: 3, fontFamily: "'Kanit', sans-serif" }}>{sub}</p>
      </div>
      {right}
    </div>
  );
}

export default function DashboardPage() {
  const { state, maturityDomains, bcbsPrinciples, aiModels } = useProjectStore();
  const { t } = useLang();
  const { cols, pad, isMobile } = useResponsive();

  const compliant    = bcbsPrinciples.filter(p => p.status === "compliant").length;
  const partial      = bcbsPrinciples.filter(p => p.status === "partial").length;
  const nonCompliant = bcbsPrinciples.filter(p => p.status === "non_compliant").length;
  const avgMaturity  = (maturityDomains.reduce((a, d) => a + d.score, 0) / maturityDomains.length).toFixed(1);
  const pct          = PHASE_PCT[state.phase];

  const radarData = maturityDomains.map(d => ({
    domain: d.label.replace("Data ", ""),
    Actuel: +d.score.toFixed(1),
    Cible:  d.target,
  }));

  const S = {
    page:  { maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column" as const, gap: 24, padding: pad },
    card:  card(),
    row4:  { display: "grid", gridTemplateColumns: cols(4, 2, 1), gap: 16 },
    row6:  { display: "grid", gridTemplateColumns: cols(6, 3, 2), gap: 14 },
    row2:  { display: "grid", gridTemplateColumns: cols(2, 1, 1), gap: 24 },
    row3:  { display: "grid", gridTemplateColumns: cols(3, 1, 1), gap: 16 },
    title: { fontSize: 11, fontWeight: 700, color: T.textPrimary, textTransform: "uppercase" as const, letterSpacing: "0.07em", fontFamily: "'Kanit', sans-serif" },
    sub:   { fontSize: 12, color: T.textMuted, marginTop: 3, fontFamily: "'Kanit', sans-serif" },
    insight: (bg: string, border: string): React.CSSProperties => ({
      background: bg, border: `1px solid ${border}`, borderRadius: 8,
      padding: "10px 14px", display: "flex", gap: 8, marginTop: 14,
    }),
  };

  // Données "Ce qui a été fait"
  const DONE_BY_PHASE: Record<number, { titre: string; detail: string; color: string; icon: any }[]> = {
    1: [
      { titre: t.lang === "fr" ? "Diagnostic de maturité réalisé" : "Maturity assessment completed",         detail: t.lang === "fr" ? "Entretiens menés avec 6 directions. Score de maturité initial établi à 1.0/5. Identification des 14 données critiques BCBS 239 non tracées." : "Interviews conducted with 6 business units. Initial maturity score set at 1.0/5. 14 untraced BCBS 239 critical data assets identified.", color: T.blue, icon: Activity },
      { titre: t.lang === "fr" ? "Cartographie AS-IS des systèmes" : "AS-IS system mapping",                 detail: t.lang === "fr" ? "Inventaire des 5 systèmes sources (T24, Murex, SAP, Salesforce, Bloomberg). Flux ETL identifiés mais non documentés. 0% de lineage." : "Inventory of 5 source systems (T24, Murex, SAP, Salesforce, Bloomberg). ETL flows identified but undocumented. 0% lineage coverage.", color: T.purple, icon: GitBranch },
      { titre: t.lang === "fr" ? "Note de cadrage Comex" : "Board scoping note",                             detail: t.lang === "fr" ? "Présentation du diagnostic à la Direction Générale. Validation du programme 12 mois et du budget de 2,4M€. Nomination du CDO." : "Diagnostic presented to Senior Management. 12-month programme and €2.4M budget approved. CDO appointed.", color: T.green, icon: FileText },
    ],
    2: [
      { titre: t.lang === "fr" ? "Rôles data formalisés" : "Data roles formalised",                         detail: t.lang === "fr" ? "CDO nommé. 6 Data Owners désignés (un par direction). 6 Data Stewards recrutés. Charte de Gouvernance Data signée par le Comex." : "CDO appointed. 6 Data Owners designated (one per unit). 6 Data Stewards recruited. Data Governance Charter signed by the Board.", color: T.blue, icon: Users },
      { titre: t.lang === "fr" ? "Comité de Gouvernance lancé" : "Governance Committee launched",            detail: t.lang === "fr" ? "1ère réunion mensuelle tenue. Ordre du jour type défini. Reporting KPIs data instauré. 4 principes BCBS 239 passent conformes." : "1st monthly meeting held. Standard agenda defined. Data KPI reporting established. 4 BCBS 239 principles become compliant.", color: T.green, icon: ShieldCheck },
      { titre: t.lang === "fr" ? "Politiques data rédigées" : "Data policies drafted",                       detail: t.lang === "fr" ? "Politique de Gouvernance v2.1, Standard de Classification v1.0 et Politique RGPD v2.0 validées et diffusées aux 6 directions." : "Governance Policy v2.1, Classification Standard v1.0 and GDPR Policy v2.0 validated and distributed to all 6 business units.", color: T.amber, icon: FileText },
    ],
    3: [
      { titre: t.lang === "fr" ? "Collibra déployé" : "Collibra deployed",                                   detail: t.lang === "fr" ? "Data catalog opérationnel. 120 termes métier certifiés dans le glossaire. Scan automatique des 2 400 tables Snowflake configuré." : "Data catalog operational. 120 business terms certified in the glossary. Automatic scan of 2,400 Snowflake tables configured.", color: T.blue, icon: Database },
      { titre: t.lang === "fr" ? "Contrôles qualité automatisés" : "Automated quality controls",             detail: t.lang === "fr" ? "1 200 tests dbt et Great Expectations déployés sur les données critiques. KPI qualité moyen passe de 64% à 82% en 6 mois." : "1,200 dbt and Great Expectations tests deployed on critical data. Average quality KPI rises from 64% to 82% in 6 months.", color: T.green, icon: TrendingUp },
      { titre: t.lang === "fr" ? "DWH Snowflake opérationnel" : "Snowflake DWH operational",                 detail: t.lang === "fr" ? "Architecture gold/silver/raw déployée. 12 datasets certifiés. Premiers dashboards Power BI Risk et Finance alimentés par le DWH." : "Gold/silver/raw architecture deployed. 12 certified datasets. First Risk and Finance Power BI dashboards fed by the DWH.", color: T.purple, icon: Database },
    ],
    4: [
      { titre: t.lang === "fr" ? "MDM Semarchy déployé" : "Semarchy MDM deployed",                           detail: t.lang === "fr" ? "3,1M clients dédupliqués. Golden record unifié entre CRM, Core Banking et Risques. Cohérence données Clients : 71% → 91%." : "3.1M customers deduplicated. Golden record unified across CRM, Core Banking and Risk. Customer data consistency: 71% → 91%.", color: T.green, icon: Database },
      { titre: t.lang === "fr" ? "Lineage BCBS 239 complet" : "Complete BCBS 239 lineage",                   detail: t.lang === "fr" ? "14 données critiques tracées de bout en bout (source → régulateur). Pipeline COREP/FINREP automatisé vers la BCE. Délai : 48h → 4h." : "14 critical data assets traced end-to-end (source → regulator). COREP/FINREP pipeline automated to ECB. Delay: 48h → 4h.", color: T.blue, icon: GitBranch },
      { titre: t.lang === "fr" ? "10/14 principes BCBS conformes" : "10/14 BCBS principles compliant",       detail: t.lang === "fr" ? "Validation par l'équipe Conformité. Rapport BCBS 239 signé et transmis à la BCE. Inspection dans 6 mois abordée avec confiance." : "Validated by the Compliance team. BCBS 239 report signed and submitted to ECB. Upcoming inspection in 6 months approached with confidence.", color: T.amber, icon: ShieldCheck },
    ],
    5: [
      { titre: t.lang === "fr" ? "Registre IA complet" : "Complete AI registry",                             detail: t.lang === "fr" ? "5 modèles inventoriés, classifiés EU AI Act et documentés. 3 modèles Risque Élevé avec supervision humaine obligatoire activée." : "5 models inventoried, EU AI Act classified and documented. 3 High Risk models with mandatory human oversight activated.", color: T.purple, icon: Brain },
      { titre: t.lang === "fr" ? "Monitoring drift opérationnel" : "Drift monitoring operational",           detail: t.lang === "fr" ? "Alertes automatiques configurées sur les 5 modèles. FraudDetector identifié en drift critique (3.7% > seuil 2.5%) → réentraînement lancé." : "Automatic alerts configured on all 5 models. FraudDetector identified in critical drift (3.7% > 2.5% threshold) → retraining launched.", color: T.red, icon: Activity },
      { titre: t.lang === "fr" ? "13/14 principes BCBS conformes" : "13/14 BCBS principles compliant",       detail: t.lang === "fr" ? "Quasi-conformité atteinte. Accuracy moyenne des modèles IA : 83% → 93% grâce à la meilleure qualité des données d'entraînement." : "Near-compliance achieved. Average AI model accuracy: 83% → 93% thanks to improved training data quality.", color: T.green, icon: TrendingUp },
    ],
    6: [
      { titre: t.lang === "fr" ? "BCBS 239 : 14/14 conformes" : "BCBS 239: 14/14 compliant",               detail: t.lang === "fr" ? "Conformité totale validée lors de l'inspection BCE. Zéro finding majeur. FrontierBank peut reconstituer tout indicateur de risque en < 2h." : "Full compliance validated at ECB inspection. Zero major findings. FrontierBank can reconstruct any risk indicator in < 2h.", color: T.green, icon: ShieldCheck },
      { titre: t.lang === "fr" ? "400 collaborateurs formés" : "400 employees trained",                      detail: t.lang === "fr" ? "Programme Data Literacy déployé sur toutes les directions. 45 Data Stewards formés et autonomes. Culture data ancrée dans l'organisation." : "Data Literacy programme deployed across all business units. 45 Data Stewards trained and autonomous. Data culture embedded in the organisation.", color: T.blue, icon: Users },
      { titre: t.lang === "fr" ? "Maturité data : 4.0/5" : "Data maturity: 4.0/5",                         detail: t.lang === "fr" ? "Niveau Géré atteint sur 6/8 domaines. Programme clôturé avec succès. ROI estimé à 3,2x sur 3 ans. FrontierBank est autonome sur la gouvernance data." : "Managed level reached on 6/8 domains. Programme successfully closed. Estimated ROI of 3.2x over 3 years. FrontierBank is autonomous on data governance.", color: T.amber, icon: Award },
    ],
  };

  const doneItems = DONE_BY_PHASE[state.phase] ?? [];

  // Badges KPI dynamiques
  const maturityBadge = () => {
    const v = parseFloat(avgMaturity);
    if (v < 2) return { txt: t.dashboard.maturity_initial,  bg: T.amberSoft,  color: T.amber,  border: T.amberBorder  };
    if (v < 3) return { txt: t.dashboard.maturity_progress, bg: T.blueSoft,   color: T.blue,   border: T.blueBorder   };
    if (v < 4) return { txt: t.dashboard.maturity_defined,  bg: T.blueSoft,   color: T.blue,   border: T.blueBorder   };
    return              { txt: t.dashboard.maturity_managed, bg: T.greenSoft,  color: T.green,  border: T.greenBorder  };
  };
  const bcbsBadge = () => {
    if (compliant < 4)  return { txt: t.common.critical,     bg: T.redSoft,   color: T.red,   border: T.redBorder   };
    if (compliant < 10) return { txt: t.common.in_progress,  bg: T.amberSoft, color: T.amber, border: T.amberBorder };
    if (compliant < 14) return { txt: "Presque",             bg: T.greenSoft, color: T.green, border: T.greenBorder };
    return                     { txt: t.common.compliant,    bg: T.greenSoft, color: T.green, border: T.greenBorder };
  };
  const qualityBadge = () => {
    const q = state.stats.avgQuality;
    if (q >= 90) return { txt: t.dashboard.objective_reached, bg: T.greenSoft, color: T.green, border: T.greenBorder };
    if (q >= 80) return { txt: t.dashboard.maturity_progress, bg: T.blueSoft,  color: T.blue,  border: T.blueBorder  };
    return               { txt: t.dashboard.to_improve,       bg: T.amberSoft, color: T.amber, border: T.amberBorder };
  };

  const mb = maturityBadge();
  const bb = bcbsBadge();
  const qb = qualityBadge();

  return (
    <div style={S.page}>

      {/* ── Bandeau hero ── */}
      <div style={{ background: T.heroGrad, borderRadius: 14, padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(147,197,253,0.9)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10, fontFamily: "'Kanit', sans-serif" }}>
              {t.dashboard.programme_label}
            </p>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#f0f4ff", marginBottom: 8, fontFamily: "'Kanit', sans-serif", lineHeight: 1.2 }}>
              {t.dashboard.hero_title}<br />
              <span style={{ color: "#93c5fd" }}>{t.dashboard.hero_subtitle}</span>
            </h2>
            <p style={{ fontSize: 13, color: "rgba(191,219,254,0.85)", fontFamily: "'Kanit', sans-serif" }}>
              {t.dashboard.hero_desc
                .replace("{phase}", String(state.phase))
                .replace("{label}", state.label)
                .replace("{period}", state.period)}
            </p>
            <p style={{ fontSize: 12, color: "rgba(147,197,253,0.8)", marginTop: 8, fontStyle: "italic", fontFamily: "'Kanit', sans-serif", maxWidth: 560 }}>
              {state.narrative}
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
            {[
              { v: `${t.common.phase} ${state.phase}`, l: t.common.on_6_phases },
              { v: pct,                                 l: t.common.progress    },
            ].map(x => (
              <div key={x.l} style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "16px 22px", textAlign: "center" }}>
                <p style={{ fontSize: 26, fontWeight: 800, color: "#f0f4ff", marginBottom: 2, fontFamily: "'Kanit', sans-serif" }}>{x.v}</p>
                <p style={{ fontSize: 11, color: "rgba(147,197,253,0.8)", fontFamily: "'Kanit', sans-serif" }}>{x.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bloc mission ── */}
      <div style={{ ...card(), padding: 0, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: cols(3, 1, 1) }}>

          {/* Contexte */}
          <div style={{ padding: 24, borderRight: isMobile ? "none" : `1px solid ${T.cardBorder}`, borderBottom: isMobile ? `1px solid ${T.cardBorder}` : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: T.blueSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FileText size={15} color={T.blue} />
              </div>
              <p style={{ fontSize: 11, fontWeight: 700, color: T.blue, textTransform: "uppercase", letterSpacing: "0.07em", margin: 0, fontFamily: "'Kanit', sans-serif" }}>
                {t.dashboard.mission_title}
              </p>
            </div>
            <p style={{ fontSize: 13, color: T.textPrimary, fontWeight: 600, marginBottom: 8, fontFamily: "'Kanit', sans-serif", lineHeight: 1.4 }}>
              {t.dashboard.mission_client}
            </p>
            <p style={{ fontSize: 12, color: T.textSecondary, lineHeight: 1.7, margin: 0, fontFamily: "'Kanit', sans-serif" }}>
              {t.dashboard.mission_desc}
            </p>
          </div>

          {/* Rôle consultant */}
          <div style={{ padding: 24, borderRight: isMobile ? "none" : `1px solid ${T.cardBorder}`, borderBottom: isMobile ? `1px solid ${T.cardBorder}` : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: T.greenSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Users size={15} color={T.green} />
              </div>
              <p style={{ fontSize: 11, fontWeight: 700, color: T.green, textTransform: "uppercase", letterSpacing: "0.07em", margin: 0, fontFamily: "'Kanit', sans-serif" }}>
                {t.dashboard.consultant_title}
              </p>
            </div>
            <p style={{ fontSize: 13, color: T.textPrimary, fontWeight: 600, marginBottom: 8, fontFamily: "'Kanit', sans-serif", lineHeight: 1.4 }}>
              {t.dashboard.consultant_name}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {t.dashboard.consultant_actions.map((action, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: T.green, marginTop: 6, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: T.textSecondary, lineHeight: 1.5, fontFamily: "'Kanit', sans-serif" }}>{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ce que couvre le site */}
          <div style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: T.purpleSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <LayoutGrid size={15} color={T.purple} />
              </div>
              <p style={{ fontSize: 11, fontWeight: 700, color: T.purple, textTransform: "uppercase", letterSpacing: "0.07em", margin: 0, fontFamily: "'Kanit', sans-serif" }}>
                {t.dashboard.site_covers_title}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {t.dashboard.site_covers.map((item, i) => {
                const colors = [T.blue, T.indigo, T.amber, T.green, T.purple, T.red, T.slate];
                return (
                  <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: colors[i], flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: T.textPrimary, fontFamily: "'Kanit', sans-serif", minWidth: 90 }}>{item.label}</span>
                    <span style={{ fontSize: 11, color: T.textMuted, fontFamily: "'Kanit', sans-serif" }}>{item.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Ce qui a été fait ── */}
      <div style={S.card}>
        <SectionHeader
          title={t.dashboard.done_title}
          sub={t.dashboard.done_sub}
          right={<span style={badge(T.blueSoft, T.blue, T.blueBorder)}>{t.common.phase} {state.phase} · {state.label}</span>}
        />
        <div style={S.row3}>
          {doneItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} style={{ background: "#f9fafd", border: `1px solid ${T.cardBorder}`, borderRadius: 12, padding: 18, borderTop: `3px solid ${item.color}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: `${item.color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={15} color={item.color} />
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary, margin: 0, fontFamily: "'Kanit', sans-serif", lineHeight: 1.3 }}>
                    {item.titre}
                  </p>
                </div>
                <p style={{ fontSize: 12, color: T.textSecondary, lineHeight: 1.7, margin: 0, fontFamily: "'Kanit', sans-serif" }}>
                  {item.detail}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 4 KPI cards ── */}
      <div style={S.row4}>
        {[
          { Icon: Activity,    iconBg: T.blueSoft,   iconColor: T.blue,
            value: `${avgMaturity}/5`, label: t.dashboard.kpi_maturity, sub: t.dashboard.kpi_maturity_sub,
            badgeBg: mb.bg, badgeColor: mb.color, badgeBorder: mb.border, badgeTxt: mb.txt },
          { Icon: ShieldCheck, iconBg: T.greenSoft,  iconColor: T.green,
            value: `${compliant}/14`, label: t.dashboard.kpi_bcbs,
            sub: `${compliant} ${t.common.compliant} · ${partial} ${t.common.partial} · ${nonCompliant} ${t.common.non_compliant}`,
            badgeBg: bb.bg, badgeColor: bb.color, badgeBorder: bb.border, badgeTxt: bb.txt },
          { Icon: TrendingUp,  iconBg: T.blueSoft,   iconColor: T.blue,
            value: `${state.stats.avgQuality}%`, label: t.dashboard.kpi_quality, sub: t.dashboard.kpi_quality_sub,
            badgeBg: qb.bg, badgeColor: qb.color, badgeBorder: qb.border, badgeTxt: qb.txt },
          { Icon: Brain,       iconBg: T.purpleSoft, iconColor: T.purple,
            value: `${state.stats.aiValidated}/5`, label: t.dashboard.kpi_ai,
            sub: `${aiModels.filter(m => m.status === "in_review").length} ${t.common.in_review} · ${aiModels.filter(m => m.status === "pending").length} ${t.common.pending}`,
            badgeBg: T.purpleSoft, badgeColor: T.purple, badgeBorder: T.purpleBorder, badgeTxt: "EU AI Act" },
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
          title={t.dashboard.radar_title}
          sub={t.dashboard.radar_sub}
          right={<span style={badge(T.slateSoft, T.slate, T.slateBorder)}>8 {t.common.domain}s</span>}
        />
        <div style={{ background: "#f4f6fb", borderRadius: 10, padding: "16px 0", border: `1px solid ${T.cardBorder}` }}>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radarData} margin={{ top: 20, right: 50, bottom: 20, left: 50 }}>
              <PolarGrid stroke={T.cardBorder} />
              <PolarAngleAxis dataKey="domain" tick={{ fill: T.textSecondary, fontSize: 12, fontFamily: "Kanit" }} />
              <Radar name={t.common.target}  dataKey="Cible"  stroke={T.slateBorder} strokeWidth={1.5} fill={T.slateSoft}  fillOpacity={0.8} />
              <Radar name={t.common.current} dataKey="Actuel" stroke={T.blue}        strokeWidth={2}   fill={T.blue}        fillOpacity={0.2} />
              <Legend wrapperStyle={{ fontSize: 12, color: T.textMuted, fontFamily: "Kanit" }} />
              <Tooltip content={<ChartTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div style={S.insight(T.amberSoft, T.amberBorder)}>
          <Info size={14} color={T.amber} style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12, color: "#78350f", lineHeight: 1.7, fontFamily: "'Kanit', sans-serif" }}>
            <strong>{t.common.reading} :</strong>{" "}
            {t.dashboard.radar_insight.replace("{phase}", String(state.phase))}
            {state.phase < 4 && t.dashboard.radar_insight_critical}
            {state.phase >= 4 && state.phase < 6 && t.dashboard.radar_insight_progress}
            {state.phase === 6 && t.dashboard.radar_insight_done}
          </p>
        </div>
      </div>

      {/* ── KPI évolution ── */}
      <div style={S.card}>
        <SectionHeader
          title={t.dashboard.kpi_chart_title}
          sub={t.dashboard.kpi_chart_sub}
          right={<span style={badge(T.greenSoft, T.green, T.greenBorder)}>{t.dashboard.kpi_trend_badge}</span>}
        />
        <div style={{ background: "#f4f6fb", borderRadius: 10, padding: "16px 16px 8px", border: `1px solid ${T.cardBorder}` }}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={state.kpis} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
              <CartesianGrid stroke={T.cardBorder} strokeDasharray="5 5" />
              <XAxis dataKey="month" tick={{ fill: T.textMuted, fontSize: 12, fontFamily: "Kanit" }} axisLine={false} tickLine={false} />
              <YAxis domain={[55, 100]} tick={{ fill: T.textMuted, fontSize: 12, fontFamily: "Kanit" }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: T.textMuted, fontFamily: "Kanit", paddingTop: 12 }} />
              <Line dataKey="completeness" stroke={T.blue}   strokeWidth={2.5} dot={false} name={t.qualite.dim_completeness.label} />
              <Line dataKey="accuracy"     stroke={T.green}  strokeWidth={2.5} dot={false} name={t.qualite.dim_accuracy.label}     />
              <Line dataKey="freshness"    stroke={T.purple} strokeWidth={2.5} dot={false} name={t.qualite.dim_freshness.label}    />
              <Line dataKey="consistency"  stroke={T.amber}  strokeWidth={2.5} dot={false} name={t.qualite.dim_consistency.label}  />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={S.insight(T.greenSoft, T.greenBorder)}>
          <Info size={14} color={T.green} style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12, color: "#065f46", lineHeight: 1.7, fontFamily: "'Kanit', sans-serif" }}>
            <strong>{t.common.insight} Phase {state.phase} :</strong>{" "}
            {state.phase <= 2 && t.qualite.insight_p1}
            {state.phase === 3 && t.qualite.insight_p3}
            {state.phase === 4 && t.qualite.insight_p4}
            {state.phase === 5 && t.qualite.insight_p5}
            {state.phase === 6 && t.qualite.insight_p6}
          </p>
        </div>
      </div>

      {/* ── Feuille de route ── */}
      <div style={S.card}>
        <SectionHeader
          title={t.dashboard.roadmap_title}
          sub={t.dashboard.roadmap_sub}
          right={<span style={badge(T.blueSoft, T.blue, T.blueBorder)}>{t.common.phase} {state.phase} {t.common.active}</span>}
        />
        <div style={S.row6}>
          {ROADMAP.map((r, idx) => {
            const phaseState = idx + 1 < state.phase ? "done" : idx + 1 === state.phase ? "in_progress" : "planned";
            const s = ROAD_STATUS[phaseState];
            const statusLabel = phaseState === "done" ? t.common.done : phaseState === "in_progress" ? t.common.in_progress : t.common.planned;
            return (
              <div key={r.phase} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 12, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: s.color, fontFamily: "'Kanit', sans-serif" }}>{t.common.phase} {r.phase}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, color: s.color, background: T.cardBg, border: `1px solid ${s.border}`, borderRadius: 9999, padding: "2px 8px", fontFamily: "'Kanit', sans-serif" }}>
                    {statusLabel}
                  </span>
                </div>
                <p style={{ fontSize: 12, fontWeight: 700, color: T.textPrimary, marginBottom: 4, lineHeight: 1.3, fontFamily: "'Kanit', sans-serif" }}>{r.label}</p>
                <p style={{ fontSize: 11, color: T.textMuted, marginBottom: 10, fontFamily: "'Kanit', sans-serif" }}>{r.start} → {r.end}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {r.items.slice(0, 3).map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                      <div style={{ width: 4, height: 4, borderRadius: "50%", background: s.color, marginTop: 5, flexShrink: 0 }} />
                      <span style={{ fontSize: 11, color: T.textSecondary, lineHeight: 1.4, fontFamily: "'Kanit', sans-serif" }}>{item}</span>
                    </div>
                  ))}
                  {r.items.length > 3 && <p style={{ fontSize: 11, color: T.textMuted, fontFamily: "'Kanit', sans-serif" }}>+{r.items.length - 3} {t.common.see_more}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── BCBS 239 ── */}
      <div style={S.card}>
        <SectionHeader
          title={t.dashboard.bcbs_title}
          sub={t.dashboard.bcbs_sub}
          right={
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <span style={badge(T.greenSoft, T.green, T.greenBorder)}>{compliant} {t.common.compliant}</span>
              <span style={badge(T.amberSoft, T.amber, T.amberBorder)}>{partial} {t.common.partial}</span>
              <span style={badge(T.redSoft,   T.red,   T.redBorder)}  >{nonCompliant} {t.common.non_compliant}</span>
            </div>
          }
        />
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", borderRadius: 99, overflow: "hidden", height: 8, background: T.slateSoft, marginBottom: 8 }}>
            <div style={{ width: `${(compliant/14)*100}%`,    background: T.green, transition: "width 0.8s ease" }} />
            <div style={{ width: `${(partial/14)*100}%`,      background: T.amber, transition: "width 0.8s ease" }} />
            <div style={{ width: `${(nonCompliant/14)*100}%`, background: T.red,   transition: "width 0.8s ease" }} />
          </div>
          <p style={{ fontSize: 12, color: T.textMuted, fontFamily: "'Kanit', sans-serif" }}>
            {t.dashboard.bcbs_rate} : <strong style={{ color: T.textPrimary }}>{Math.round((compliant/14)*100)}%</strong>
            &nbsp;·&nbsp;{t.dashboard.bcbs_target} : <strong style={{ color: T.textPrimary }}>100%</strong>
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: cols(2, 1, 1), gap: 8 }}>
          {bcbsPrinciples.map(p => {
            const cfgMap = {
              compliant:     { Icon: CheckCircle2,  color: T.green, bg: T.greenSoft, border: T.greenBorder, label: t.common.compliant     },
              partial:       { Icon: AlertTriangle, color: T.amber, bg: T.amberSoft, border: T.amberBorder, label: t.common.partial       },
              non_compliant: { Icon: AlertTriangle, color: T.red,   bg: T.redSoft,   border: T.redBorder,   label: t.common.non_compliant },
            };
            const cfg = cfgMap[p.status as keyof typeof cfgMap];
            const { Icon } = cfg;
            return (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10, background: cfg.bg, border: `1px solid ${cfg.border}`, transition: "all 0.4s ease" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: cfg.color, fontFamily: "monospace", width: 20, textAlign: "center", flexShrink: 0 }}>{p.id}</span>
                <Icon size={13} color={cfg.color} style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: T.textPrimary, margin: 0, fontFamily: "'Kanit', sans-serif" }}>{p.title}</p>
                  {p.gap && <p style={{ fontSize: 11, color: T.textMuted, margin: 0, fontFamily: "'Kanit', sans-serif" }}>{p.gap}</p>}
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: cfg.color, background: T.cardBg, border: `1px solid ${cfg.border}`, borderRadius: 9999, padding: "2px 9px", flexShrink: 0, fontFamily: "'Kanit', sans-serif" }}>
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

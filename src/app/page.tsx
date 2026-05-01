"use client";

import { useProjectStore } from "@/lib/useProjectState";
import { useResponsive } from "@/lib/useResponsive";
import { T, badge, card } from "@/lib/theme";
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
  done:        { label: "Terminé",  color: T.green,  bg: T.greenSoft,  border: T.greenBorder },
  in_progress: { label: "En cours", color: T.blue,   bg: T.blueSoft,   border: T.blueBorder  },
  planned:     { label: "Planifié", color: T.slate,  bg: T.slateSoft,  border: T.slateBorder },
};

import { ROADMAP } from "@/lib/data";

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

  return (
    <div style={S.page}>

      {/* ── Bandeau mission ── */}
      <div style={{ background: T.heroGrad, borderRadius: 14, padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(147,197,253,0.9)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10, fontFamily: "'Kanit', sans-serif" }}>
              Programme en cours · FrontierBank
            </p>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#f0f4ff", marginBottom: 8, fontFamily: "'Kanit', sans-serif", lineHeight: 1.2 }}>
              Gouvernance Data & IA<br />
              <span style={{ color: "#93c5fd" }}>BCBS 239 · DAMA-DMBOK · EU AI Act</span>
            </h2>
            <p style={{ fontSize: 13, color: "rgba(191,219,254,0.85)", fontFamily: "'Kanit', sans-serif" }}>
              Mission de conseil · Phase {state.phase}/6 · {state.label} · {state.period}
            </p>
            <p style={{ fontSize: 12, color: "rgba(147,197,253,0.8)", marginTop: 8, fontStyle: "italic", fontFamily: "'Kanit', sans-serif", maxWidth: 560 }}>
              {state.narrative}
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
            {[
              { v: `Phase ${state.phase}`, l: "sur 6 phases" },
              { v: pct,                    l: "avancement"   },
            ].map(x => (
              <div key={x.l} style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "16px 22px", textAlign: "center" }}>
                <p style={{ fontSize: 26, fontWeight: 800, color: "#f0f4ff", marginBottom: 2, fontFamily: "'Kanit', sans-serif" }}>{x.v}</p>
                <p style={{ fontSize: 11, color: "rgba(147,197,253,0.8)", fontFamily: "'Kanit', sans-serif" }}>{x.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Descriptif mission ── */}
<div style={{ ...card(), padding: 0, overflow: "hidden" }}>
  <div style={{ display: "grid", gridTemplateColumns: cols(3, 1, 1) }}>

    {/* Colonne 1 — Contexte mission */}
    <div style={{ padding: 24, borderRight: `1px solid ${T.cardBorder}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: T.blueSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <FileText size={15} color={T.blue} />
        </div>
        <p style={{ fontSize: 11, fontWeight: 700, color: T.blue, textTransform: "uppercase", letterSpacing: "0.07em", margin: 0, fontFamily: "'Kanit', sans-serif" }}>
          Contexte de la Mission
        </p>
      </div>
      <p style={{ fontSize: 13, color: T.textPrimary, fontWeight: 600, marginBottom: 8, fontFamily: "'Kanit', sans-serif", lineHeight: 1.4 }}>
        FrontierBank — Banque de taille intermédiaire sous surveillance prudentielle BCE
      </p>
      <p style={{ fontSize: 12, color: T.textSecondary, lineHeight: 1.7, margin: 0, fontFamily: "'Kanit', sans-serif" }}>
        FrontierBank fait face à une inspection de la BCE dans 18 mois. Son dispositif de gouvernance des données est insuffisant :
        aucun principe BCBS 239 n'est conforme, les données critiques ne sont pas tracées, et les modèles IA sont déployés sans cadre de validation.
        La banque mandate un cabinet de conseil pour piloter la transformation complète de sa maturité data.
      </p>
    </div>

    {/* Colonne 2 — Rôle du consultant */}
    <div style={{ padding: 24, borderRight: `1px solid ${T.cardBorder}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: T.greenSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Users size={15} color={T.green} />
        </div>
        <p style={{ fontSize: 11, fontWeight: 700, color: T.green, textTransform: "uppercase", letterSpacing: "0.07em", margin: 0, fontFamily: "'Kanit', sans-serif" }}>
          Rôle du Consultant Data & IA
        </p>
      </div>
      <p style={{ fontSize: 13, color: T.textPrimary, fontWeight: 600, marginBottom: 8, fontFamily: "'Kanit', sans-serif', lineHeight: 1.4" }}>
        Heykel HACHICHE — Consultant Data & IA · Cabinet de conseil
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {[
          "Piloter le programme de gouvernance data de A à Z sur 12 mois",
          "Animer les ateliers métiers, IT et conformité pour aligner les parties prenantes",
          "Produire les livrables : diagnostics, frameworks, politiques, roadmaps",
          "Assurer la conformité BCBS 239, DAMA-DMBOK et EU AI Act",
          "Présenter l'avancement au Comex et préparer l'inspection BCE",
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: T.green, marginTop: 6, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: T.textSecondary, lineHeight: 1.5, fontFamily: "'Kanit', sans-serif" }}>{item}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Colonne 3 — Ce que couvre ce site */}
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: T.purpleSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <LayoutGrid size={15} color={T.purple} />
        </div>
        <p style={{ fontSize: 11, fontWeight: 700, color: T.purple, textTransform: "uppercase", letterSpacing: "0.07em", margin: 0, fontFamily: "'Kanit', sans-serif" }}>
          Ce que couvre ce site
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          { label: "Diagnostic",   desc: "Maturité DAMA-DMBOK · 8 domaines · Scores et gaps",         color: T.blue   },
          { label: "Gouvernance",  desc: "Rôles · RACI · Politiques · Comité de gouvernance",          color: T.indigo },
          { label: "Data Catalog", desc: "Glossaire · Datasets certifiés · Référentiel Snowflake",     color: T.amber  },
          { label: "Data Quality", desc: "4 KPIs · BCBS 239 · Plans de remédiation par domaine",       color: T.green  },
          { label: "Data Lineage", desc: "Graphe flux · Systèmes sources → reporting réglementaire",   color: T.purple },
          { label: "IA Governance",desc: "EU AI Act · Registre modèles · Drift monitoring",            color: T.red    },
          { label: "Comex Report", desc: "Synthèse exécutive · Budget · ROI · Décisions DG",           color: T.slate  },
        ].map(item => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: T.textPrimary, fontFamily: "'Kanit', sans-serif", minWidth: 90 }}>{item.label}</span>
            <span style={{ fontSize: 11, color: T.textMuted, fontFamily: "'Kanit', sans-serif" }}>{item.desc}</span>
          </div>
        ))}
      </div>
    </div>

  </div>
</div>

      {/* ── Ce qui a été fait concrètement ── */}
<div style={card()}>
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
    <div>
      <p style={{ fontSize: 11, fontWeight: 700, color: T.textPrimary, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'Kanit', sans-serif" }}>
        Ce qui a été fait concrètement — Phase {state.phase}
      </p>
      <p style={{ fontSize: 12, color: T.textMuted, marginTop: 3, fontFamily: "'Kanit', sans-serif" }}>
        Actions réalisées, livrables produits et décisions prises depuis le démarrage du programme
      </p>
    </div>
    <span style={badge(T.blueSoft, T.blue, T.blueBorder)}>Phase {state.phase} · {state.label}</span>
  </div>

  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
    {{
      1: [
        { titre: "Diagnostic de maturité réalisé", detail: "Entretiens menés avec 6 directions. Score de maturité initial établi à 1.0/5. Identification des 14 données critiques BCBS 239 non tracées.", color: T.blue, icon: Activity },
        { titre: "Cartographie AS-IS des systèmes", detail: "Inventaire des 5 systèmes sources (T24, Murex, SAP, Salesforce, Bloomberg). Flux ETL identifiés mais non documentés. 0% de lineage.", color: T.purple, icon: GitBranch },
        { titre: "Note de cadrage Comex", detail: "Présentation du diagnostic à la Direction Générale. Validation du programme 12 mois et du budget de 2,4M€. Nomination du CDO.", color: T.green, icon: FileText },
      ],
      2: [
        { titre: "Rôles data formalisés", detail: "CDO nommé. 6 Data Owners désignés (un par direction). 6 Data Stewards recrutés. Charte de Gouvernance Data signée par le Comex.", color: T.blue, icon: Users },
        { titre: "Comité de Gouvernance lancé", detail: "1ère réunion mensuelle tenue. Ordre du jour type défini. Reporting KPIs data instauré. 4 principes BCBS 239 passent conformes.", color: T.green, icon: ShieldCheck },
        { titre: "Politiques data rédigées", detail: "Politique de Gouvernance v2.1, Standard de Classification v1.0 et Politique RGPD v2.0 validées et diffusées aux 6 directions.", color: T.amber, icon: FileText },
      ],
      3: [
        { titre: "Collibra déployé", detail: "Data catalog opérationnel. 120 termes métier certifiés dans le glossaire. Scan automatique des 2 400 tables Snowflake configuré.", color: T.blue, icon: Database },
        { titre: "Contrôles qualité automatisés", detail: "1 200 tests dbt et Great Expectations déployés sur les données critiques. KPI qualité moyen passe de 64% à 82% en 6 mois.", color: T.green, icon: TrendingUp },
        { titre: "DWH Snowflake opérationnel", detail: "Architecture gold/silver/raw déployée. 12 datasets certifiés. Premiers dashboards Power BI Risk et Finance alimentés par le DWH.", color: T.purple, icon: Database },
      ],
      4: [
        { titre: "MDM Semarchy déployé", detail: "3,1M clients dédupliqués. Golden record unifié entre CRM, Core Banking et Risques. Cohérence données Clients : 71% → 91%.", color: T.green, icon: Database },
        { titre: "Lineage BCBS 239 complet", detail: "14 données critiques tracées de bout en bout (source → régulateur). Pipeline COREP/FINREP automatisé vers la BCE. Délai : 48h → 4h.", color: T.blue, icon: GitBranch },
        { titre: "10/14 principes BCBS conformes", detail: "Validation par l'équipe Conformité. Rapport BCBS 239 signé et transmis à la BCE. Inspection dans 6 mois abordée avec confiance.", color: T.amber, icon: ShieldCheck },
      ],
      5: [
        { titre: "Registre IA complet", detail: "5 modèles inventoriés, classifiés EU AI Act et documentés. 3 modèles Risque Élevé avec supervision humaine obligatoire activée.", color: T.purple, icon: Brain },
        { titre: "Monitoring drift opérationnel", detail: "Alertes automatiques configurées sur les 5 modèles. FraudDetector identifié en drift critique (3.7% > seuil 2.5%) → réentraînement lancé.", color: T.red, icon: Activity },
        { titre: "13/14 principes BCBS conformes", detail: "Quasi-conformité atteinte. Accuracy moyenne des modèles IA : 83% → 93% grâce à la meilleure qualité des données d'entraînement.", color: T.green, icon: TrendingUp },
      ],
      6: [
        { titre: "BCBS 239 : 14/14 conformes", detail: "Conformité totale validée lors de l'inspection BCE. Zéro finding majeur. FrontierBank peut reconstituer tout indicateur de risque en < 2h.", color: T.green, icon: ShieldCheck },
        { titre: "400 collaborateurs formés", detail: "Programme Data Literacy déployé sur toutes les directions. 45 Data Stewards formés et autonomes. Culture data ancrée dans l'organisation.", color: T.blue, icon: Users },
        { titre: "Maturité data : 4.0/5", detail: "Niveau Géré atteint sur 6/8 domaines. Programme clôturé avec succès. ROI estimé à 3,2x sur 3 ans. FrontierBank est autonome sur la gouvernance data.", color: T.amber, icon: Award },
      ],
    }[state.phase]?.map((item: { titre: string; detail: string; color: string; icon: any }, i: number) => {
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
          {
            Icon: Activity,    iconBg: T.blueSoft,   iconColor: T.blue,
            value: `${avgMaturity}/5`,
            label: "Maturité Data globale",
            sub: "Score moyen sur 8 domaines DAMA-DMBOK",
            badgeTxt: parseFloat(avgMaturity) < 2 ? "Niveau initial" : parseFloat(avgMaturity) < 3 ? "En progression" : parseFloat(avgMaturity) < 4 ? "Niveau défini" : "Niveau géré",
            badgeBg: parseFloat(avgMaturity) < 2 ? T.amberSoft : parseFloat(avgMaturity) < 3 ? T.blueSoft : T.greenSoft,
            badgeColor: parseFloat(avgMaturity) < 2 ? T.amber : parseFloat(avgMaturity) < 3 ? T.blue : T.green,
            badgeBorder: parseFloat(avgMaturity) < 2 ? T.amberBorder : parseFloat(avgMaturity) < 3 ? T.blueBorder : T.greenBorder,
          },
          {
            Icon: ShieldCheck, iconBg: T.greenSoft,  iconColor: T.green,
            value: `${compliant}/14`,
            label: "Principes BCBS 239 conformes",
            sub: `${compliant} conformes · ${partial} partiels · ${nonCompliant} non conformes`,
            badgeTxt: compliant < 4 ? "Critique" : compliant < 10 ? "En cours" : compliant < 14 ? "Presque" : "Conforme",
            badgeBg: compliant < 4 ? T.redSoft : compliant < 10 ? T.amberSoft : T.greenSoft,
            badgeColor: compliant < 4 ? T.red : compliant < 10 ? T.amber : T.green,
            badgeBorder: compliant < 4 ? T.redBorder : compliant < 10 ? T.amberBorder : T.greenBorder,
          },
          {
            Icon: TrendingUp,  iconBg: T.blueSoft,   iconColor: T.blue,
            value: `${state.stats.avgQuality}%`,
            label: "KPI Qualité moyen",
            sub: "Complétude · Exactitude · Fraîcheur · Cohérence",
            badgeTxt: state.stats.avgQuality >= 90 ? "Objectif atteint" : state.stats.avgQuality >= 80 ? "En progression" : "À améliorer",
            badgeBg: state.stats.avgQuality >= 90 ? T.greenSoft : state.stats.avgQuality >= 80 ? T.blueSoft : T.amberSoft,
            badgeColor: state.stats.avgQuality >= 90 ? T.green : state.stats.avgQuality >= 80 ? T.blue : T.amber,
            badgeBorder: state.stats.avgQuality >= 90 ? T.greenBorder : state.stats.avgQuality >= 80 ? T.blueBorder : T.amberBorder,
          },
          {
            Icon: Brain,       iconBg: T.purpleSoft, iconColor: T.purple,
            value: `${state.stats.aiValidated}/5`,
            label: "Modèles IA validés",
            sub: `${aiModels.filter(m => m.status === "in_review").length} en review · ${aiModels.filter(m => m.status === "pending").length} en attente`,
            badgeTxt: "EU AI Act",
            badgeBg: T.purpleSoft, badgeColor: T.purple, badgeBorder: T.purpleBorder,
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
        <div style={S.insight(T.amberSoft, T.amberBorder)}>
          <Info size={14} color={T.amber} style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12, color: "#78350f", lineHeight: 1.7, fontFamily: "'Kanit', sans-serif" }}>
            <strong>Lecture :</strong> La zone bleue représente le niveau actuel de FrontierBank à la <strong>Phase {state.phase}</strong>.
            L'écart avec la zone grise identifie les chantiers prioritaires restants.
            {state.phase < 4 && <> Les domaines <strong>Data Lineage</strong> et <strong>IA Governance</strong> sont les plus critiques.</>}
            {state.phase >= 4 && state.phase < 6 && <> La progression est nette sur le Lineage et le Management. L'Acculturation reste à consolider.</>}
            {state.phase === 6 && <> FrontierBank atteint le niveau 4 (Géré) sur la majorité des domaines. Objectif atteint.</>}
          </p>
        </div>
      </div>

      {/* ── KPI évolution ── */}
      <div style={S.card}>
        <SectionHeader
          title="Évolution des KPIs Qualité des Données"
          sub="Progression mensuelle des 4 dimensions qualité depuis le lancement du programme — en %"
          right={<span style={badge(T.greenSoft, T.green, T.greenBorder)}>Tendance positive</span>}
        />
        <div style={{ background: "#f4f6fb", borderRadius: 10, padding: "16px 16px 8px", border: `1px solid ${T.cardBorder}` }}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={state.kpis} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
              <CartesianGrid stroke={T.cardBorder} strokeDasharray="5 5" />
              <XAxis dataKey="month" tick={{ fill: T.textMuted, fontSize: 12, fontFamily: "Kanit" }} axisLine={false} tickLine={false} />
              <YAxis domain={[55, 100]} tick={{ fill: T.textMuted, fontSize: 12, fontFamily: "Kanit" }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: T.textMuted, fontFamily: "Kanit", paddingTop: 12 }} />
              <Line dataKey="completeness" stroke={T.blue}   strokeWidth={2.5} dot={false} name="Complétude" />
              <Line dataKey="accuracy"     stroke={T.green}  strokeWidth={2.5} dot={false} name="Exactitude" />
              <Line dataKey="freshness"    stroke={T.purple} strokeWidth={2.5} dot={false} name="Fraîcheur"  />
              <Line dataKey="consistency"  stroke={T.amber}  strokeWidth={2.5} dot={false} name="Cohérence"  />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={S.insight(T.greenSoft, T.greenBorder)}>
          <Info size={14} color={T.green} style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12, color: "#065f46", lineHeight: 1.7, fontFamily: "'Kanit', sans-serif" }}>
            <strong>Insight Phase {state.phase} :</strong>{" "}
            {state.phase <= 2 && "Les KPIs sont en phase de baseline. Les contrôles qualité ne sont pas encore automatisés — les données sont collectées manuellement."}
            {state.phase === 3 && <>La Cohérence reste le point faible à <strong>81%</strong>. Elle est directement liée à l'absence de MDM sur les données clients — chantier prévu en Phase 4.</>}
            {state.phase === 4 && <>Le déploiement du MDM fait bondir la Cohérence de <strong>+12 points</strong>. L'Exactitude progresse grâce au data lineage qui identifie les sources de dégradation.</>}
            {state.phase === 5 && <>Tous les KPIs dépassent <strong>90%</strong>. La gouvernance des modèles IA contribue à la qualité des données d'entraînement.</>}
            {state.phase === 6 && <>Objectif atteint : moyenne <strong>95%+</strong>. Le programme de Data Literacy a généré une culture de la qualité data dans toutes les directions.</>}
          </p>
        </div>
      </div>

      {/* ── Feuille de route ── */}
      <div style={S.card}>
        <SectionHeader
          title="Feuille de Route du Programme"
          sub="6 phases de transformation · Jan 2026 – Déc 2026 · Pilotée par le CDO et le cabinet de conseil"
          right={<span style={badge(T.blueSoft, T.blue, T.blueBorder)}>Phase {state.phase} active</span>}
        />
        <div style={{ display: "grid", gridTemplateColumns: cols(6, 3, 2), gap: 14 }}>
          {ROADMAP.map((r, idx) => {
            const phaseState = idx + 1 < state.phase ? "done" : idx + 1 === state.phase ? "in_progress" : "planned";
            const s = ROAD_STATUS[phaseState];
            return (
              <div key={r.phase} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 12, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: s.color, fontFamily: "'Kanit', sans-serif" }}>Phase {r.phase}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, color: s.color, background: T.cardBg, border: `1px solid ${s.border}`, borderRadius: 9999, padding: "2px 8px", fontFamily: "'Kanit', sans-serif" }}>
                    {s.label}
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
                  {r.items.length > 3 && <p style={{ fontSize: 11, color: T.textMuted, fontFamily: "'Kanit', sans-serif" }}>+{r.items.length - 3} livrables</p>}
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
              <span style={badge(T.greenSoft, T.green, T.greenBorder)}>{compliant} conformes</span>
              <span style={badge(T.amberSoft, T.amber, T.amberBorder)}>{partial} partiels</span>
              <span style={badge(T.redSoft,   T.red,   T.redBorder)}  >{nonCompliant} non conf.</span>
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
            Taux de conformité global : <strong style={{ color: T.textPrimary }}>{Math.round((compliant/14)*100)}%</strong>
            &nbsp;·&nbsp;Cible fin 2026 : <strong style={{ color: T.textPrimary }}>100%</strong>
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: cols(2, 1, 1), gap: 8 }}>
          {bcbsPrinciples.map(p => {
            const cfgMap = {
              compliant:     { Icon: CheckCircle2,  color: T.green, bg: T.greenSoft, border: T.greenBorder, label: "Conforme"     },
              partial:       { Icon: AlertTriangle, color: T.amber, bg: T.amberSoft, border: T.amberBorder, label: "Partiel"      },
              non_compliant: { Icon: AlertTriangle, color: T.red,   bg: T.redSoft,   border: T.redBorder,   label: "Non conforme" },
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
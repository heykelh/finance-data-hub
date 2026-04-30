"use client";

import { useProjectStore } from "@/lib/useProjectState";
import { T, badge, card } from "@/lib/theme";
import { ROADMAP } from "@/lib/data";
import {
  CheckCircle2, AlertTriangle, TrendingUp, TrendingDown,
  Brain, Shield, Database, GitBranch, Activity,
  Target, ArrowRight, Info, Award, Clock
} from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, BarChart, Bar, Cell
} from "recharts";

// ── messages exécutifs par phase ──────────────────────────────────────────────
const EXEC_MESSAGES: Record<number, {
  titre: string;
  contexte: string;
  message_cle: string;
  risque_principal: string;
  decision_attendue: string;
}> = {
  1: {
    titre: "Lancement du Programme — État des Lieux Initial",
    contexte: "FrontierBank présente des lacunes significatives en matière de gouvernance des données. Le diagnostic révèle une maturité data de 1.0/5 et une non-conformité totale aux 14 principes BCBS 239. Une inspection de la BCE est prévue dans 18 mois.",
    message_cle: "Sans action immédiate, FrontierBank s'expose à des sanctions réglementaires de la BCE et à une incapacité à produire des reportings de risque fiables en situation de stress.",
    risque_principal: "Risque réglementaire critique — 0 principe BCBS 239 conforme sur 14. Délai avant inspection BCE : 18 mois.",
    decision_attendue: "Validation du programme de transformation Data & Gouvernance sur 12 mois avec un budget de 2,4M€ et la nomination d'un CDO.",
  },
  2: {
    titre: "Phase 2 Terminée — Framework Gouvernance Opérationnel",
    contexte: "Le cadre de gouvernance est posé. Les rôles Data Owner et Data Steward sont formalisés sur les 6 directions métiers. Le Comité de Gouvernance Data tient sa réunion mensuelle depuis 6 semaines. 4 principes BCBS 239 sont désormais conformes.",
    message_cle: "FrontierBank dispose maintenant d'une organisation data structurée. Les fondations sont solides pour engager les chantiers techniques des phases suivantes.",
    risque_principal: "Risque d'adhésion — les Data Owners métiers sont nommés mais leur implication reste variable. Un programme de formation est nécessaire.",
    decision_attendue: "Validation du lancement de la Phase 3 (Data Catalog & Qualité) et du budget associé (650K€). Approbation du plan de formation Data Owners.",
  },
  3: {
    titre: "Phase 3 En Cours — Data Catalog & Qualité en Déploiement",
    contexte: "Collibra est en cours de déploiement. Le glossaire métier atteint 120 termes certifiés. Les KPIs qualité progressent de +18 points depuis le lancement. Le score de maturité data global atteint 1.7/5, contre 1.0 au démarrage.",
    message_cle: "La qualité des données s'améliore de manière mesurable et continue. La Cohérence reste le point faible (81%) en l'absence de MDM — chantier clé de la Phase 4.",
    risque_principal: "Risque qualité résiduel — le domaine Clients présente une cohérence de 71% due aux silos entre CRM et Core Banking. Impact direct sur le scoring crédit.",
    decision_attendue: "Validation de l'accélération du chantier MDM en Phase 4. Approbation du prestataire Semarchy pour le déploiement MDM (320K€).",
  },
  4: {
    titre: "Phase 4 Terminée — Data Lineage & MDM Déployés",
    contexte: "Le lineage des 14 données critiques BCBS 239 est tracé de bout en bout. Le MDM Clients unifie les données entre Core Banking, CRM et Risques — la cohérence bondit de 71% à 91%. 10 principes BCBS 239 sur 14 sont désormais conformes.",
    message_cle: "FrontierBank peut désormais reconstituer n'importe quel indicateur de risque de sa source à son agrégat réglementaire. L'inspection BCE dans 6 mois est abordée avec confiance.",
    risque_principal: "Risque résiduel faible — 4 principes BCBS encore partiellement conformes. Plan de remédiation en cours sur les principes 8, 10, 13.",
    decision_attendue: "Validation du lancement anticipé de la Phase 5 (IA Governance) compte tenu des exigences EU AI Act entrées en vigueur. Budget 480K€.",
  },
  5: {
    titre: "Phase 5 Terminée — IA Governance & BCBS 239 Quasi-Conformes",
    contexte: "13 principes BCBS 239 sur 14 sont conformes. Les 5 modèles IA sont classifiés EU AI Act et validés. L'accuracy moyenne des modèles progresse à 93% grâce à la meilleure qualité des données d'entraînement. Le score de maturité atteint 3.4/5.",
    message_cle: "FrontierBank figure parmi les banques les plus avancées sur la gouvernance IA en France. Le registre des modèles et le framework de validation constituent un avantage concurrentiel.",
    risque_principal: "Risque faible — le principe BCBS 239 #10 (Remédiation) reste partiel. Plan de clôture en cours pour la Phase 6.",
    decision_attendue: "Validation de la Phase 6 finale (Acculturation & Scale) pour pérenniser les acquis. Budget 280K€. Décision sur l'internalisation vs maintien du cabinet.",
  },
  6: {
    titre: "Programme Terminé — FrontierBank Niveau 4 DAMA-DMBOK",
    contexte: "Le programme de 12 mois est achevé. Les 14 principes BCBS 239 sont conformes. Le score de maturité data atteint 4.0/5. 400 collaborateurs ont été formés à la Data Literacy. L'inspection BCE a validé la conformité sans finding majeur.",
    message_cle: "FrontierBank a réalisé une transformation data complète en 12 mois. La banque est désormais en capacité de répondre à toute demande réglementaire en moins de 2 heures et dispose d'une organisation data pérenne.",
    risque_principal: "Risque de régression — le maintien du niveau acquis nécessite de pérenniser les processus et la communauté Data Stewards sans dépendance au cabinet.",
    decision_attendue: "Validation de la clôture du programme et du plan de maintien en conditions opérationnelles. Décision sur le budget récurrent data (450K€/an).",
  },
};

// ── investissement par phase ───────────────────────────────────────────────────
const BUDGET_PHASES = [
  { phase: 1, label: "Diagnostic",    budget: 180, type: "Conseil"   },
  { phase: 2, label: "Gouvernance",   budget: 320, type: "Conseil"   },
  { phase: 3, label: "Catalog",       budget: 650, type: "Mixte"     },
  { phase: 4, label: "Lineage & MDM", budget: 820, type: "Technique" },
  { phase: 5, label: "IA Gov.",       budget: 480, type: "Technique" },
  { phase: 6, label: "Scale",         budget: 280, type: "Conseil"   },
];

// ── bénéfices mesurables ──────────────────────────────────────────────────────
const BENEFITS: Record<number, { label: string; avant: string; apres: string; impact: string; color: string }[]> = {
  1: [],
  2: [
    { label: "Organisation data", avant: "Aucun rôle formalisé", apres: "CDO + 6 Data Owners + 6 Stewards", impact: "Responsabilités claires sur 100% des données critiques", color: T.blue },
    { label: "Comité de Gouvernance", avant: "Inexistant", apres: "Mensuel, 6 directions représentées", impact: "Décisions data prises en 48h vs plusieurs semaines", color: T.green },
  ],
  3: [
    { label: "Maturité Data", avant: "1.0/5", apres: "1.7/5", impact: "+70% — fondations posées sur 8 domaines DAMA", color: T.blue },
    { label: "KPI Qualité moyen", avant: "64%", apres: "82%", impact: "+18 points en 6 mois grâce aux contrôles automatisés", color: T.green },
    { label: "Conformité BCBS 239", avant: "0/14", apres: "4/14", impact: "4 principes organisationnels validés par la Conformité", color: T.amber },
    { label: "Data Catalog", avant: "Inexistant", apres: "120 termes certifiés", impact: "Glossaire métier partagé entre toutes les directions", color: T.purple },
  ],
  4: [
    { label: "Cohérence données Clients", avant: "71%", apres: "91%", impact: "+20 pts — MDM unifie CRM, Core Banking et Risques", color: T.green },
    { label: "Conformité BCBS 239", avant: "4/14", apres: "10/14", impact: "+6 principes — lineage des 14 données critiques tracé", color: T.blue },
    { label: "Délai production reporting risque", avant: "> 48h manuel", apres: "< 4h automatisé", impact: "-91% de délai — pipeline automatisé Snowflake + dbt", color: T.amber },
    { label: "Coverage Data Lineage", avant: "15%", apres: "82%", impact: "Traçabilité de bout en bout sur les données BCBS 239", color: T.purple },
  ],
  5: [
    { label: "Conformité BCBS 239", avant: "10/14", apres: "13/14", impact: "Quasi-conformité — 1 principe résiduel en cours", color: T.green },
    { label: "Modèles IA validés EU AI Act", avant: "0/5", apres: "5/5", impact: "100% des modèles classifiés et documentés", color: T.blue },
    { label: "Accuracy moyenne modèles IA", avant: "83%", apres: "93%", impact: "+10 pts grâce à la meilleure qualité des données", color: T.purple },
    { label: "Maturité Data globale", avant: "1.7/5", apres: "3.4/5", impact: "+100% — niveau Défini atteint sur 6 domaines", color: T.amber },
  ],
  6: [
    { label: "Conformité BCBS 239", avant: "13/14", apres: "14/14", impact: "Conformité totale — zéro finding lors de l'inspection BCE", color: T.green },
    { label: "Maturité Data globale", avant: "3.4/5", apres: "4.0/5", impact: "Niveau Géré — pilotage data par les données", color: T.blue },
    { label: "KPI Qualité moyen", avant: "82%", apres: "95%", impact: "+13 pts — culture qualité ancrée dans toutes les directions", color: T.amber },
    { label: "Collaborateurs formés Data Literacy", avant: "0", apres: "400", impact: "100% des managers formés — culture data généralisée", color: T.purple },
    { label: "Délai réponse demande BCE", avant: "> 5 jours", apres: "< 2 heures", impact: "Lineage automatisé — reconstitution instantanée", color: "#dc2626" },
  ],
};

// ── tooltip ───────────────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 8, padding: "10px 14px", boxShadow: "0 4px 16px rgba(30,42,58,0.10)", fontFamily: "'Kanit', sans-serif" }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: T.textPrimary, marginBottom: 6 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ fontSize: 12, color: p.color, margin: "2px 0" }}>
          {p.name} : <strong>{p.value}{p.value < 10 ? "/5" : p.value < 20 ? "" : "%"}</strong>
        </p>
      ))}
    </div>
  );
};

// ── page ─────────────────────────────────────────────────────────────────────
export default function ComexPage() {
  const { state, maturityDomains, bcbsPrinciples, aiModels } = useProjectStore();

  const compliant    = bcbsPrinciples.filter(p => p.status === "compliant").length;
  const nonCompliant = bcbsPrinciples.filter(p => p.status === "non_compliant").length;
  const avgMaturity  = (maturityDomains.reduce((a, d) => a + d.score, 0) / maturityDomains.length).toFixed(1);
  const exec         = EXEC_MESSAGES[state.phase];
  const benefits     = BENEFITS[state.phase];
  const budgetEngaged = BUDGET_PHASES.filter(b => b.phase <= state.phase).reduce((a, b) => a + b.budget, 0);
  const budgetTotal   = BUDGET_PHASES.reduce((a, b) => a + b.budget, 0);

  const radarData = maturityDomains.map(d => ({
    domain: d.label.replace("Data ", ""),
    Actuel: +d.score.toFixed(1),
    Cible:  d.target,
  }));

  const PHASE_PCT: Record<number, number> = { 1: 8, 2: 25, 3: 50, 4: 67, 5: 83, 6: 100 };
  const avancement = PHASE_PCT[state.phase];

  // Données budget bar chart
  const budgetData = BUDGET_PHASES.map(b => ({
    name: b.label,
    budget: b.budget,
    statut: b.phase < state.phase ? "done" : b.phase === state.phase ? "active" : "planned",
  }));

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>

      {/* ── Bandeau Comex ── */}
      <div style={{ background: T.heroGrad, borderRadius: 14, padding: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={badge(T.amberSoft, T.amber, T.amberBorder)}>Rapport Comex</span>
              <span style={badge("rgba(255,255,255,0.15)", "rgba(255,255,255,0.8)", "rgba(255,255,255,0.2)")}>
                Confidentiel · Direction Générale
              </span>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#f0f4ff", marginBottom: 10, fontFamily: "'Kanit', sans-serif", lineHeight: 1.2 }}>
              {exec.titre}
            </h2>
            <p style={{ fontSize: 13, color: "rgba(191,219,254,0.9)", fontFamily: "'Kanit', sans-serif", lineHeight: 1.7, maxWidth: 640 }}>
              {exec.contexte}
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, flexShrink: 0 }}>
            {[
              { v: `Phase ${state.phase}/6`, l: state.label             },
              { v: `${avancement}%`,         l: "Programme complété"    },
              { v: `${budgetEngaged}K€`,     l: "Budget engagé"         },
            ].map(x => (
              <div key={x.l} style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "12px 20px", textAlign: "center", minWidth: 140 }}>
                <p style={{ fontSize: 20, fontWeight: 800, color: "#f0f4ff", marginBottom: 2, fontFamily: "'Kanit', sans-serif" }}>{x.v}</p>
                <p style={{ fontSize: 11, color: "rgba(147,197,253,0.8)", fontFamily: "'Kanit', sans-serif" }}>{x.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Message clé + Risque + Décision attendue ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>

        {/* Message clé */}
        <div style={{ ...card(), borderTop: `3px solid ${T.blue}`, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: T.blueSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Award size={15} color={T.blue} />
            </div>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.blue, textTransform: "uppercase", letterSpacing: "0.07em", margin: 0, fontFamily: "'Kanit', sans-serif" }}>
              Message Clé
            </p>
          </div>
          <p style={{ fontSize: 13, color: T.textPrimary, lineHeight: 1.7, fontFamily: "'Kanit', sans-serif", margin: 0 }}>
            {exec.message_cle}
          </p>
        </div>

        {/* Risque principal */}
        <div style={{ ...card(), borderTop: `3px solid ${T.red}`, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: T.redSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <AlertTriangle size={15} color={T.red} />
            </div>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.red, textTransform: "uppercase", letterSpacing: "0.07em", margin: 0, fontFamily: "'Kanit', sans-serif" }}>
              Risque Principal
            </p>
          </div>
          <p style={{ fontSize: 13, color: T.textPrimary, lineHeight: 1.7, fontFamily: "'Kanit', sans-serif", margin: 0 }}>
            {exec.risque_principal}
          </p>
        </div>

        {/* Décision attendue */}
        <div style={{ ...card(), borderTop: `3px solid ${T.green}`, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: T.greenSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Target size={15} color={T.green} />
            </div>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.green, textTransform: "uppercase", letterSpacing: "0.07em", margin: 0, fontFamily: "'Kanit', sans-serif" }}>
              Décision Attendue
            </p>
          </div>
          <p style={{ fontSize: 13, color: T.textPrimary, lineHeight: 1.7, fontFamily: "'Kanit', sans-serif", margin: 0 }}>
            {exec.decision_attendue}
          </p>
        </div>

      </div>

      {/* ── 4 KPIs exécutifs ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {[
          {
            Icon: Activity, iconBg: T.blueSoft, iconColor: T.blue,
            value: `${avgMaturity}/5`, label: "Maturité Data globale",
            sub: "Score DAMA-DMBOK — 8 domaines",
            trend: state.phase > 1 ? "up" : "flat",
            trendVal: state.phase > 1 ? `+${(parseFloat(avgMaturity) - 1.0).toFixed(1)} vs départ` : "Baseline",
          },
          {
            Icon: Shield, iconBg: T.greenSoft, iconColor: T.green,
            value: `${compliant}/14`, label: "Principes BCBS 239",
            sub: `${nonCompliant} non conformes restants`,
            trend: compliant > 0 ? "up" : "flat",
            trendVal: compliant === 14 ? "100% ✓" : `${Math.round((compliant/14)*100)}% conformes`,
          },
          {
            Icon: TrendingUp, iconBg: T.purpleSoft, iconColor: T.purple,
            value: `${state.stats.avgQuality}%`, label: "Qualité données",
            sub: "Moyenne 4 dimensions qualité",
            trend: state.stats.avgQuality > 64 ? "up" : "flat",
            trendVal: `+${state.stats.avgQuality - 64} pts vs baseline`,
          },
          {
            Icon: Brain, iconBg: T.amberSoft, iconColor: T.amber,
            value: `${state.stats.aiValidated}/5`, label: "Modèles IA validés",
            sub: "Conformité EU AI Act",
            trend: state.stats.aiValidated > 0 ? "up" : "flat",
            trendVal: state.stats.aiValidated === 5 ? "Tous conformes ✓" : `${state.stats.aiValidated} validés`,
          },
        ].map(({ Icon, iconBg, iconColor, value, label, sub, trend, trendVal }) => (
          <div key={label} style={card()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={16} color={iconColor} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {trend === "up"
                  ? <TrendingUp size={13} color={T.green} />
                  : <TrendingDown size={13} color={T.slate} />
                }
                <span style={{ fontSize: 11, color: trend === "up" ? T.green : T.slate, fontFamily: "'Kanit', sans-serif", fontWeight: 600 }}>
                  {trendVal}
                </span>
              </div>
            </div>
            <p style={{ fontSize: 26, fontWeight: 800, color: T.textPrimary, marginBottom: 3, fontFamily: "'Kanit', sans-serif" }}>{value}</p>
            <p style={{ fontSize: 12, fontWeight: 600, color: T.textSecondary, marginBottom: 3, fontFamily: "'Kanit', sans-serif" }}>{label}</p>
            <p style={{ fontSize: 11, color: T.textMuted, fontFamily: "'Kanit', sans-serif" }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Radar maturité + Avancement programme ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

        {/* Radar */}
        <div style={card()}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: T.textPrimary, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'Kanit', sans-serif" }}>
                Maturité Data — Vue Exécutive
              </p>
              <p style={{ fontSize: 12, color: T.textMuted, marginTop: 3, fontFamily: "'Kanit', sans-serif" }}>
                Positionnement Phase {state.phase} vs objectifs 2026
              </p>
            </div>
            <span style={badge(T.slateSoft, T.slate, T.slateBorder)}>DAMA-DMBOK</span>
          </div>
          <div style={{ background: "#f4f6fb", borderRadius: 10, padding: "12px 0", border: `1px solid ${T.cardBorder}` }}>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData} margin={{ top: 15, right: 40, bottom: 15, left: 40 }}>
                <PolarGrid stroke={T.cardBorder} />
                <PolarAngleAxis dataKey="domain" tick={{ fill: T.textSecondary, fontSize: 11, fontFamily: "Kanit" }} />
                <Radar name="Cible"  dataKey="Cible"  stroke={T.slateBorder} strokeWidth={1.5} fill={T.slateSoft} fillOpacity={0.8} />
                <Radar name="Actuel" dataKey="Actuel" stroke={T.blue}        strokeWidth={2}   fill={T.blue}      fillOpacity={0.2} />
                <Legend wrapperStyle={{ fontSize: 11, color: T.textMuted, fontFamily: "Kanit" }} />
                <Tooltip content={<ChartTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Avancement programme */}
        <div style={card()}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: T.textPrimary, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'Kanit', sans-serif" }}>
                Avancement du Programme
              </p>
              <p style={{ fontSize: 12, color: T.textMuted, marginTop: 3, fontFamily: "'Kanit', sans-serif" }}>
                6 phases · Jan → Déc 2026 · Budget total {budgetTotal}K€
              </p>
            </div>
            <span style={badge(T.blueSoft, T.blue, T.blueBorder)}>Phase {state.phase} active</span>
          </div>

          {/* Barre globale */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: T.textMuted, fontFamily: "'Kanit', sans-serif" }}>Avancement global</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: T.blue, fontFamily: "'Kanit', sans-serif" }}>{avancement}%</span>
            </div>
            <div style={{ height: 10, borderRadius: 99, background: T.slateSoft, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${avancement}%`, borderRadius: 99, background: `linear-gradient(90deg, ${T.blue}, ${T.indigo})`, transition: "width 0.8s ease" }} />
            </div>
          </div>

          {/* Liste phases */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {ROADMAP.map((r, idx) => {
              const phStatus = idx + 1 < state.phase ? "done" : idx + 1 === state.phase ? "active" : "planned";
              const color = phStatus === "done" ? T.green : phStatus === "active" ? T.blue : T.slate;
              const bg    = phStatus === "done" ? T.greenSoft : phStatus === "active" ? T.blueSoft : T.cardBg;
              const bdr   = phStatus === "done" ? T.greenBorder : phStatus === "active" ? T.blueBorder : T.cardBorder;
              const pct   = PHASE_PCT[idx + 1];
              return (
                <div key={r.phase} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", borderRadius: 8, background: bg, border: `1px solid ${bdr}` }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {phStatus === "done"
                      ? <CheckCircle2 size={13} color="white" />
                      : <span style={{ fontSize: 10, fontWeight: 800, color: "white", fontFamily: "'Kanit', sans-serif" }}>{r.phase}</span>
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: T.textPrimary, margin: 0, fontFamily: "'Kanit', sans-serif" }}>
                      {r.label}
                    </p>
                    <p style={{ fontSize: 11, color: T.textMuted, margin: 0, fontFamily: "'Kanit', sans-serif" }}>{r.start} → {r.end}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color, fontFamily: "'Kanit', sans-serif" }}>
                      {phStatus === "done" ? "Terminé" : phStatus === "active" ? "En cours" : "Planifié"}
                    </span>
                    <span style={{ fontSize: 11, color: T.textMuted, fontFamily: "'Kanit', sans-serif" }}>
                      {BUDGET_PHASES[idx].budget}K€
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ── Évolution KPIs qualité ── */}
      <div style={card()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.textPrimary, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'Kanit', sans-serif" }}>
              Évolution de la Qualité des Données
            </p>
            <p style={{ fontSize: 12, color: T.textMuted, marginTop: 3, fontFamily: "'Kanit', sans-serif" }}>
              Progression des KPIs qualité depuis le lancement — preuve tangible du ROI du programme
            </p>
          </div>
          <span style={badge(T.greenSoft, T.green, T.greenBorder)}>+{state.stats.avgQuality - 64} pts depuis le départ</span>
        </div>
        <div style={{ background: "#f4f6fb", borderRadius: 10, padding: "16px 16px 8px", border: `1px solid ${T.cardBorder}` }}>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={state.kpis} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
              <CartesianGrid stroke={T.cardBorder} strokeDasharray="5 5" />
              <XAxis dataKey="month" tick={{ fill: T.textMuted, fontSize: 12, fontFamily: "Kanit" }} axisLine={false} tickLine={false} />
              <YAxis domain={[55, 100]} tick={{ fill: T.textMuted, fontSize: 12, fontFamily: "Kanit" }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: T.textMuted, fontFamily: "Kanit", paddingTop: 8 }} />
              <Line dataKey="completeness" stroke={T.blue}   strokeWidth={2} dot={false} name="Complétude" />
              <Line dataKey="accuracy"     stroke={T.green}  strokeWidth={2} dot={false} name="Exactitude" />
              <Line dataKey="freshness"    stroke={T.purple} strokeWidth={2} dot={false} name="Fraîcheur"  />
              <Line dataKey="consistency"  stroke={T.amber}  strokeWidth={2} dot={false} name="Cohérence"  />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Bénéfices mesurables ── */}
      {benefits.length > 0 && (
        <div style={card()}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: T.textPrimary, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'Kanit', sans-serif" }}>
                Bénéfices Mesurables — Phase {state.phase}
              </p>
              <p style={{ fontSize: 12, color: T.textMuted, marginTop: 3, fontFamily: "'Kanit', sans-serif" }}>
                Résultats quantifiés obtenus depuis le démarrage du programme
              </p>
            </div>
            <span style={badge(T.greenSoft, T.green, T.greenBorder)}>{benefits.length} indicateurs</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {benefits.map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 18px", borderRadius: 10, background: "#f9fafd", border: `1px solid ${T.cardBorder}` }}>
                <div style={{ width: 4, height: 40, borderRadius: 2, background: b.color, flexShrink: 0 }} />
                <div style={{ minWidth: 180, flexShrink: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary, margin: 0, fontFamily: "'Kanit', sans-serif" }}>{b.label}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                  <div style={{ textAlign: "center", padding: "6px 14px", background: T.redSoft, border: `1px solid ${T.redBorder}`, borderRadius: 8 }}>
                    <p style={{ fontSize: 13, fontWeight: 800, color: T.red, margin: 0, fontFamily: "'Kanit', sans-serif" }}>{b.avant}</p>
                    <p style={{ fontSize: 10, color: T.textMuted, margin: 0, fontFamily: "'Kanit', sans-serif" }}>avant</p>
                  </div>
                  <ArrowRight size={16} color={T.textMuted} />
                  <div style={{ textAlign: "center", padding: "6px 14px", background: T.greenSoft, border: `1px solid ${T.greenBorder}`, borderRadius: 8 }}>
                    <p style={{ fontSize: 13, fontWeight: 800, color: T.green, margin: 0, fontFamily: "'Kanit', sans-serif" }}>{b.apres}</p>
                    <p style={{ fontSize: 10, color: T.textMuted, margin: 0, fontFamily: "'Kanit', sans-serif" }}>après</p>
                  </div>
                </div>
                <p style={{ flex: 1, fontSize: 12, color: T.textSecondary, lineHeight: 1.6, fontFamily: "'Kanit', sans-serif", margin: 0 }}>
                  {b.impact}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Budget ── */}
      <div style={card()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.textPrimary, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'Kanit', sans-serif" }}>
              Suivi Budgétaire du Programme
            </p>
            <p style={{ fontSize: 12, color: T.textMuted, marginTop: 3, fontFamily: "'Kanit', sans-serif" }}>
              Budget total : {budgetTotal}K€ · Engagé à ce jour : {budgetEngaged}K€ · Restant : {budgetTotal - budgetEngaged}K€
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={badge(T.greenSoft, T.green, T.greenBorder)}>{budgetEngaged}K€ engagés</span>
            <span style={badge(T.slateSoft, T.slate, T.slateBorder)}>{budgetTotal - budgetEngaged}K€ restants</span>
          </div>
        </div>

        {/* Barre budget */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ height: 10, borderRadius: 99, background: T.slateSoft, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(budgetEngaged / budgetTotal) * 100}%`, borderRadius: 99, background: T.green, transition: "width 0.8s ease" }} />
          </div>
          <p style={{ fontSize: 12, color: T.textMuted, marginTop: 6, fontFamily: "'Kanit', sans-serif" }}>
            {Math.round((budgetEngaged / budgetTotal) * 100)}% du budget programme consommé
          </p>
        </div>

        <div style={{ background: "#f4f6fb", borderRadius: 10, padding: "16px 8px 8px", border: `1px solid ${T.cardBorder}` }}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={budgetData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }} barCategoryGap="35%">
              <CartesianGrid stroke={T.cardBorder} strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: T.textSecondary, fontSize: 12, fontFamily: "Kanit" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: T.textMuted, fontSize: 12, fontFamily: "Kanit" }} axisLine={false} tickLine={false} unit="K€" />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="budget" radius={[6,6,0,0]} name="Budget (K€)">
                {budgetData.map((entry, i) => (
                  <Cell key={i} fill={
                    entry.statut === "done"   ? T.green :
                    entry.statut === "active" ? T.blue  : T.slateSoft
                  } />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: T.amberSoft, border: `1px solid ${T.amberBorder}`, borderRadius: 8, padding: "10px 14px", display: "flex", gap: 8, marginTop: 14 }}>
          <Info size={14} color={T.amber} style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12, color: "#78350f", lineHeight: 1.7, fontFamily: "'Kanit', sans-serif" }}>
            <strong>Note budgétaire :</strong> Le budget du programme est réparti entre conseil (phases 1, 2, 6),
            déploiement mixte (phase 3) et chantiers techniques (phases 4, 5).
            Le ROI estimé est de <strong>3,2x</strong> sur 3 ans grâce à la réduction des coûts de production des reportings réglementaires et à l'évitement des sanctions BCE.
          </p>
        </div>
      </div>

      {/* ── Conformité BCBS 239 synthèse ── */}
      <div style={card()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.textPrimary, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'Kanit', sans-serif" }}>
              Conformité BCBS 239 — Synthèse Réglementaire
            </p>
            <p style={{ fontSize: 12, color: T.textMuted, marginTop: 3, fontFamily: "'Kanit', sans-serif" }}>
              Statut des 14 principes à la Phase {state.phase} — préparation inspection BCE
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={badge(T.greenSoft, T.green, T.greenBorder)}>{compliant} conformes</span>
            <span style={badge(T.redSoft, T.red, T.redBorder)}>{nonCompliant} non conformes</span>
          </div>
        </div>

        {/* Barre */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", borderRadius: 99, overflow: "hidden", height: 10, background: T.slateSoft, marginBottom: 6 }}>
            <div style={{ width: `${(compliant/14)*100}%`, background: T.green, transition: "width 0.8s ease" }} />
            <div style={{ width: `${(bcbsPrinciples.filter(p=>p.status==="partial").length/14)*100}%`, background: T.amber }} />
            <div style={{ width: `${(nonCompliant/14)*100}%`, background: T.red }} />
          </div>
          <p style={{ fontSize: 12, color: T.textMuted, fontFamily: "'Kanit', sans-serif" }}>
            Conformité BCBS 239 : <strong style={{ color: T.textPrimary }}>{Math.round((compliant/14)*100)}%</strong>
            &nbsp;·&nbsp;Objectif fin 2026 : <strong style={{ color: T.textPrimary }}>100%</strong>
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {bcbsPrinciples.map(p => {
            const cfgMap = {
              compliant:     { Icon: CheckCircle2,  color: T.green, bg: T.greenSoft, border: T.greenBorder, label: "Conforme"     },
              partial:       { Icon: Clock,          color: T.amber, bg: T.amberSoft, border: T.amberBorder, label: "Partiel"      },
              non_compliant: { Icon: AlertTriangle,  color: T.red,   bg: T.redSoft,   border: T.redBorder,   label: "Non conforme" },
            };
            const cfg = cfgMap[p.status as keyof typeof cfgMap];
            const { Icon } = cfg;
            return (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8, background: cfg.bg, border: `1px solid ${cfg.border}`, transition: "all 0.4s" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color, fontFamily: "monospace", width: 18, flexShrink: 0 }}>{p.id}</span>
                <Icon size={13} color={cfg.color} style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: T.textPrimary, margin: 0, fontFamily: "'Kanit', sans-serif" }}>{p.title}</p>
                  {p.gap && <p style={{ fontSize: 11, color: T.textMuted, margin: 0, fontFamily: "'Kanit', sans-serif" }}>{p.gap}</p>}
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: cfg.color, background: "white", border: `1px solid ${cfg.border}`, borderRadius: 9999, padding: "2px 8px", flexShrink: 0, fontFamily: "'Kanit', sans-serif" }}>
                  {cfg.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Prochaines étapes ── */}
      <div style={{ ...card(), marginBottom: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.textPrimary, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'Kanit', sans-serif" }}>
              Prochaines Étapes — Actions à 30 Jours
            </p>
            <p style={{ fontSize: 12, color: T.textMuted, marginTop: 3, fontFamily: "'Kanit', sans-serif" }}>
              Plan d'action immédiat soumis à validation de la Direction Générale
            </p>
          </div>
          <span style={badge(T.blueSoft, T.blue, T.blueBorder)}>Horizon 30 jours</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {(state.phase < 6 ? ROADMAP[state.phase] : ROADMAP[5]).items.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 14px", borderRadius: 10, background: T.blueSoft, border: `1px solid ${T.blueBorder}` }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: T.blue, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: "white", fontFamily: "'Kanit', sans-serif" }}>{i + 1}</span>
              </div>
              <p style={{ fontSize: 12, color: "#1e3a8a", lineHeight: 1.6, margin: 0, fontFamily: "'Kanit', sans-serif" }}>{item}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
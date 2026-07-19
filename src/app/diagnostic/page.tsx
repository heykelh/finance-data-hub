"use client";

import { useProjectStore } from "@/lib/useProjectState";
import { useLang } from "@/lib/LanguageContext";
import { T, badge, card } from "@/lib/theme";
import { useResponsive } from "@/lib/useResponsive";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, Legend
} from "recharts";
import { AlertTriangle, Clock, Info, ArrowRight, Target, Lightbulb } from "lucide-react";

// ── recommandations (statiques, non traduites car très techniques) ─────────────
const RECO: Record<string, { priority: "critique" | "haute" | "moyenne"; actions: string[]; quick_win: string }> = {
  dg:  { priority: "haute",    actions: ["Formaliser les rôles Data Owner / Steward / CDO", "Créer le Comité de Gouvernance Data mensuel", "Rédiger la Charte de Gouvernance Data"],                                                      quick_win: "Nommer un Data Owner par domaine métier d'ici 2 semaines" },
  dq:  { priority: "haute",    actions: ["Définir les KPIs qualité (complétude, exactitude, fraîcheur, cohérence)", "Mettre en place des contrôles automatisés dbt/Great Expectations", "Créer un tableau de bord qualité hebdomadaire"], quick_win: "Implémenter 5 tests dbt sur les données critiques BCBS 239" },
  dm:  { priority: "moyenne",  actions: ["Cartographier les flux de données critiques", "Standardiser les formats et conventions de nommage", "Documenter les processus ETL existants"],                                                  quick_win: "Produire un inventaire des 20 tables les plus consommées" },
  dc:  { priority: "haute",    actions: ["Déployer Collibra ou Microsoft Purview", "Alimenter le glossaire métier avec les 50 termes prioritaires", "Former les Data Stewards à l'alimentation du catalog"],                             quick_win: "Créer le glossaire des 10 indicateurs clés BCBS 239" },
  dl:  { priority: "critique", actions: ["Cartographier le lineage des 14 données critiques BCBS 239", "Implémenter un outil de lineage automatique (dbt lineage, OpenLineage)", "Documenter les transformations des indicateurs de risque"], quick_win: "Tracer manuellement le lineage du ratio LCR de A à Z" },
  ia:  { priority: "critique", actions: ["Créer le registre des modèles IA de la banque", "Classifier chaque modèle selon l'EU AI Act (High/Limited/Minimal Risk)", "Mettre en place un process de validation des modèles avant déploiement"], quick_win: "Inventorier tous les modèles IA en production sous 1 semaine" },
  sec: { priority: "moyenne",  actions: ["Renforcer les contrôles d'accès aux données sensibles (RBAC)", "Mettre en place le chiffrement des données au repos et en transit", "Compléter le registre des traitements RGPD"],             quick_win: "Auditer les droits d'accès aux tables de données clients" },
  cult:{ priority: "haute",    actions: ["Lancer un programme de formation Data Literacy pour les métiers", "Créer une communauté interne Data (newsletter, démos mensuelles)", "Mettre en place des ambassadeurs data dans chaque direction"], quick_win: "Organiser un premier atelier Data Literacy de 2h pour les managers" },
};

const RECO_EN: Record<string, { priority: "critique" | "haute" | "moyenne"; actions: string[]; quick_win: string }> = {
  dg:  { priority: "haute",    actions: ["Formalise Data Owner / Steward / CDO roles", "Launch monthly Data Governance Committee", "Draft the Data Governance Charter"],                                                                   quick_win: "Appoint one Data Owner per business domain within 2 weeks" },
  dq:  { priority: "haute",    actions: ["Define quality KPIs (completeness, accuracy, timeliness, consistency)", "Deploy automated dbt/Great Expectations controls", "Create a weekly quality dashboard"],                                quick_win: "Implement 5 dbt tests on BCBS 239 critical data assets" },
  dm:  { priority: "moyenne",  actions: ["Map critical data flows", "Standardise naming conventions and formats", "Document existing ETL processes"],                                                                                       quick_win: "Produce an inventory of the 20 most consumed tables" },
  dc:  { priority: "haute",    actions: ["Deploy Collibra or Microsoft Purview", "Feed the business glossary with 50 priority terms", "Train Data Stewards on catalog maintenance"],                                                       quick_win: "Create glossary for the 10 key BCBS 239 indicators" },
  dl:  { priority: "critique", actions: ["Map lineage of all 14 BCBS 239 critical data assets", "Implement automated lineage tooling (dbt lineage, OpenLineage)", "Document risk indicator transformations"],                             quick_win: "Manually trace the LCR ratio lineage end-to-end" },
  ia:  { priority: "critique", actions: ["Create the bank's AI model registry", "Classify each model under EU AI Act (High/Limited/Minimal Risk)", "Establish a model validation process before deployment"],                             quick_win: "Inventory all AI models in production within 1 week" },
  sec: { priority: "moyenne",  actions: ["Strengthen access controls on sensitive data (RBAC)", "Implement encryption at rest and in transit", "Complete the GDPR processing register"],                                                   quick_win: "Audit access rights on customer data tables" },
  cult:{ priority: "haute",    actions: ["Launch a Data Literacy training programme for business teams", "Create an internal Data community (newsletter, monthly demos)", "Appoint data ambassadors in each department"],                  quick_win: "Run a first 2-hour Data Literacy workshop for managers" },
};

// ── tooltip ───────────────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 8, padding: "10px 14px", boxShadow: "0 4px 16px rgba(30,42,58,0.10)", fontFamily: "'Kanit', sans-serif" }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: T.textPrimary, marginBottom: 6 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ fontSize: 12, color: p.color ?? T.blue, margin: "2px 0" }}>
          {p.name} : <strong>{p.value} / 5</strong>
        </p>
      ))}
    </div>
  );
};

// ── barre de progression ──────────────────────────────────────────────────────
function GapBar({ score, target }: { score: number; target: number }) {
  const pctScore  = (score  / 5) * 100;
  const pctTarget = (target / 5) * 100;
  const barColor  = score < 2 ? T.red : score < 3 ? T.amber : T.green;
  return (
    <div style={{ position: "relative", height: 8, borderRadius: 99, background: T.slateSoft, overflow: "visible" }}>
      <div style={{ position: "absolute", left: `${pctTarget}%`, top: -3, width: 2, height: 14, background: T.slate, borderRadius: 1, transform: "translateX(-50%)", zIndex: 2 }} />
      <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${pctScore}%`, borderRadius: 99, background: barColor, transition: "width 0.6s ease" }} />
    </div>
  );
}

// ── page ─────────────────────────────────────────────────────────────────────
export default function DiagnosticPage() {
  const { maturityDomains, state } = useProjectStore();
  const { t, lang } = useLang();
  const { cols, pad } = useResponsive();

  // Niveaux DAMA traduits
  const DAMA_LEVELS = t.diagnostic.dama_levels.map((l, i) => ({
    level: i,
    label: l.label,
    desc:  l.desc,
    color: ["#dc2626","#d97706","#f59e0b","#2d6be4","#0e9f6e","#7c3aed"][i],
    bg:    ["#fef2f2","#fffbeb","#fffbeb","#eff6ff","#ecfdf5","#f5f3ff"][i],
  }));

  // Priorités traduites
  const PRIORITY_CFG = {
    critique: { color: T.red,   bg: T.redSoft,   border: T.redBorder,   label: t.common.critical, Icon: AlertTriangle },
    haute:    { color: T.amber, bg: T.amberSoft, border: T.amberBorder, label: t.common.high,     Icon: Clock         },
    moyenne:  { color: T.blue,  bg: T.blueSoft,  border: T.blueBorder,  label: t.common.medium,   Icon: Target        },
  };

  // Recommandations selon langue
  const reco = lang === "en" ? RECO_EN : RECO;

  const avgScore  = (maturityDomains.reduce((a, d) => a + d.score,  0) / maturityDomains.length).toFixed(1);
  const avgTarget = (maturityDomains.reduce((a, d) => a + d.target, 0) / maturityDomains.length).toFixed(1);
  const gap       = (parseFloat(avgTarget) - parseFloat(avgScore)).toFixed(1);

  const barData   = maturityDomains.map(d => ({ name: d.label.replace("Data ", ""), Actuel: +d.score.toFixed(1), Cible: d.target, color: d.color }));
  const radarData = maturityDomains.map(d => ({ domain: d.label.replace("Data ", ""), Actuel: +d.score.toFixed(1), Cible: d.target }));

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24, padding: pad }}>

      {/* ── Bandeau ── */}
      <div style={{ background: T.heroGrad, borderRadius: 14, padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(147,197,253,0.9)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10, fontFamily: "'Kanit', sans-serif" }}>
              {t.diagnostic.hero_label.replace("{phase}", String(state.phase))}
            </p>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#f0f4ff", marginBottom: 8, fontFamily: "'Kanit', sans-serif" }}>
              {t.diagnostic.hero_title}
            </h2>
            <p style={{ fontSize: 13, color: "rgba(191,219,254,0.85)", fontFamily: "'Kanit', sans-serif" }}>
              {t.diagnostic.hero_sub.replace("{period}", state.period)}
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
            {[
              { v: `${avgScore}/5`, l: t.diagnostic.avg_score  },
              { v: `+${gap}`,       l: t.diagnostic.gap_to_fill },
            ].map(x => (
              <div key={x.l} style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "16px 22px", textAlign: "center" }}>
                <p style={{ fontSize: 26, fontWeight: 800, color: "#f0f4ff", marginBottom: 2, fontFamily: "'Kanit', sans-serif" }}>{x.v}</p>
                <p style={{ fontSize: 11, color: "rgba(147,197,253,0.8)", fontFamily: "'Kanit', sans-serif" }}>{x.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Légende niveaux DAMA ── */}
      <div style={{ ...card(), padding: 20 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: T.textPrimary, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 14, fontFamily: "'Kanit', sans-serif" }}>
          {t.diagnostic.dama_title}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: cols(6, 3, 2), gap: 10 }}>
          {DAMA_LEVELS.map(l => (
            <div key={l.level} style={{ background: l.bg, border: `1px solid ${l.color}33`, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: l.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "white", fontFamily: "'Kanit', sans-serif" }}>{l.level}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: l.color, fontFamily: "'Kanit', sans-serif" }}>{l.label}</span>
              </div>
              <p style={{ fontSize: 11, color: T.textMuted, fontFamily: "'Kanit', sans-serif", lineHeight: 1.5 }}>{l.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bar chart + Radar ── */}
      <div style={{ display: "grid", gridTemplateColumns: cols(2, 1, 1), gap: 24 }}>

        {/* Bar chart */}
        <div style={card()}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: T.textPrimary, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'Kanit', sans-serif" }}>
                {t.diagnostic.bar_title}
              </p>
              <p style={{ fontSize: 12, color: T.textMuted, marginTop: 3, fontFamily: "'Kanit', sans-serif" }}>
                {t.diagnostic.bar_sub}
              </p>
            </div>
            <span style={badge(T.slateSoft, T.slate, T.slateBorder)}>{t.common.score} / 5</span>
          </div>
          <div style={{ background: "#f4f6fb", borderRadius: 10, padding: "16px 8px 8px", border: `1px solid ${T.cardBorder}` }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData} margin={{ top: 5, right: 20, bottom: 20, left: 0 }} barCategoryGap="30%">
                <CartesianGrid stroke={T.cardBorder} strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: T.textSecondary, fontSize: 11, fontFamily: "Kanit" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 5]} ticks={[0,1,2,3,4,5]} tick={{ fill: T.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: T.textMuted, fontFamily: "Kanit", paddingTop: 8 }} />
                <Bar dataKey="Cible"  fill={T.slateSoft} stroke={T.slateBorder} strokeWidth={1} radius={[4,4,0,0]} name={t.common.target} />
                <Bar dataKey="Actuel" radius={[4,4,0,0]} name={t.common.current}>
                  {barData.map((entry, i) => (
                    <Cell key={i} fill={maturityDomains[i].color} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ background: T.amberSoft, border: `1px solid ${T.amberBorder}`, borderRadius: 8, padding: "10px 14px", display: "flex", gap: 8, marginTop: 14 }}>
            <Info size={14} color={T.amber} style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 12, color: "#78350f", lineHeight: 1.7, fontFamily: "'Kanit', sans-serif" }}>
              <strong>{t.common.reading} :</strong> {t.diagnostic.bar_insight}
            </p>
          </div>
        </div>

        {/* Radar */}
        <div style={card()}>
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.textPrimary, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'Kanit', sans-serif" }}>
              {t.diagnostic.radar_title}
            </p>
            <p style={{ fontSize: 12, color: T.textMuted, marginTop: 3, fontFamily: "'Kanit', sans-serif" }}>
              {t.diagnostic.radar_sub}
            </p>
          </div>
          <div style={{ background: "#f4f6fb", borderRadius: 10, padding: "8px 0", border: `1px solid ${T.cardBorder}` }}>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <PolarGrid stroke={T.cardBorder} />
                <PolarAngleAxis dataKey="domain" tick={{ fill: T.textSecondary, fontSize: 11, fontFamily: "Kanit" }} />
                <Radar name={t.common.target}  dataKey="Cible"  stroke={T.slateBorder} strokeWidth={1.5} fill={T.slateSoft} fillOpacity={0.8} />
                <Radar name={t.common.current} dataKey="Actuel" stroke={T.blue} strokeWidth={2} fill={T.blue} fillOpacity={0.2} />
                <Legend wrapperStyle={{ fontSize: 11, color: T.textMuted, fontFamily: "Kanit" }} />
                <Tooltip content={<ChartTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* ── Tableau détaillé ── */}
      <div style={card()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.textPrimary, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'Kanit', sans-serif" }}>
              {t.diagnostic.detail_title}
            </p>
            <p style={{ fontSize: 12, color: T.textMuted, marginTop: 3, fontFamily: "'Kanit', sans-serif" }}>
              {t.diagnostic.detail_sub}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={badge(T.redSoft,   T.red,   T.redBorder)}  >
              {maturityDomains.filter(d => reco[d.id]?.priority === "critique").length} {t.common.critical}
            </span>
            <span style={badge(T.amberSoft, T.amber, T.amberBorder)}>
              {maturityDomains.filter(d => reco[d.id]?.priority === "haute").length} {t.common.high}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {maturityDomains.map(domain => {
            const lvlIdx  = Math.min(Math.floor(domain.score), 5);
            const lvlCfg  = DAMA_LEVELS[lvlIdx];
            const r       = reco[domain.id];
            const prioCfg = PRIORITY_CFG[r.priority];
            const gapVal  = (domain.target - domain.score).toFixed(1);

            return (
              <div key={domain.id} style={{ border: `1px solid ${T.cardBorder}`, borderRadius: 12, overflow: "hidden", background: T.cardBg }}>

                {/* Header */}
                <div style={{ display: "grid", gridTemplateColumns: cols(2, 1, 1) === "repeat(1, 1fr)" ? "1fr" : "2fr 80px 80px 80px 140px 160px", gap: 16, alignItems: "center", padding: "14px 20px", borderBottom: `1px solid ${T.cardBorder}`, background: "#f9fafd" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: domain.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary, fontFamily: "'Kanit', sans-serif" }}>{domain.label}</span>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontSize: 18, fontWeight: 800, color: domain.color, fontFamily: "'Kanit', sans-serif", margin: 0 }}>{domain.score.toFixed(1)}</p>
                    <p style={{ fontSize: 10, color: T.textMuted, fontFamily: "'Kanit', sans-serif", margin: 0 }}>{t.common.current}</p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontSize: 18, fontWeight: 800, color: T.slate, fontFamily: "'Kanit', sans-serif", margin: 0 }}>{domain.target}</p>
                    <p style={{ fontSize: 10, color: T.textMuted, fontFamily: "'Kanit', sans-serif", margin: 0 }}>{t.common.target}</p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontSize: 18, fontWeight: 800, color: parseFloat(gapVal) > 2 ? T.red : T.amber, fontFamily: "'Kanit', sans-serif", margin: 0 }}>+{gapVal}</p>
                    <p style={{ fontSize: 10, color: T.textMuted, fontFamily: "'Kanit', sans-serif", margin: 0 }}>{t.common.gap}</p>
                  </div>
                  <span style={badge(lvlCfg.bg, lvlCfg.color, lvlCfg.color + "44")}>
                    Niv.{lvlIdx} — {lvlCfg.label}
                  </span>
                  <span style={badge(prioCfg.bg, prioCfg.color, prioCfg.border)}>
                    {prioCfg.label}
                  </span>
                </div>

                {/* Barre progression */}
                <div style={{ padding: "10px 20px" }}>
                  <GapBar score={domain.score} target={domain.target} />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                    <span style={{ fontSize: 10, color: T.textMuted, fontFamily: "'Kanit', sans-serif" }}>0</span>
                    <span style={{ fontSize: 10, color: T.slate, fontFamily: "'Kanit', sans-serif" }}>▲ {t.common.target} ({domain.target})</span>
                    <span style={{ fontSize: 10, color: T.textMuted, fontFamily: "'Kanit', sans-serif" }}>5</span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ padding: "0 20px 14px", display: "grid", gridTemplateColumns: cols(2, 1, 1), gap: 12 }}>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: T.textSecondary, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8, fontFamily: "'Kanit', sans-serif" }}>
                      {t.diagnostic.actions_title}
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      {r.actions.map((a, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                          <ArrowRight size={12} color={domain.color} style={{ flexShrink: 0, marginTop: 2 }} />
                          <span style={{ fontSize: 12, color: T.textSecondary, lineHeight: 1.5, fontFamily: "'Kanit', sans-serif" }}>{a}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ background: T.greenSoft, border: `1px solid ${T.greenBorder}`, borderRadius: 10, padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                      <Lightbulb size={13} color={T.green} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: T.green, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "'Kanit', sans-serif" }}>
                        {t.common.quick_win}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: "#065f46", lineHeight: 1.6, fontFamily: "'Kanit', sans-serif" }}>
                      {r.quick_win}
                    </p>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* ── Synthèse priorités ── */}
      <div style={card()}>
        <p style={{ fontSize: 11, fontWeight: 700, color: T.textPrimary, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 16, fontFamily: "'Kanit', sans-serif" }}>
          {t.diagnostic.summary_title.replace("{period}", state.period)}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: cols(3, 1, 1), gap: 16 }}>
          {(["critique", "haute", "moyenne"] as const).map(prio => {
            const cfg     = PRIORITY_CFG[prio];
            const domains = maturityDomains.filter(d => reco[d.id]?.priority === prio);
            const { Icon } = cfg;
            return (
              <div key={prio} style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 12, padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <Icon size={16} color={cfg.color} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: cfg.color, fontFamily: "'Kanit', sans-serif" }}>
                    {cfg.label} — {domains.length} {lang === "en"
                      ? (domains.length > 1 ? "domains" : "domain")
                      : (domains.length > 1 ? "domaines" : "domaine")}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {domains.map(d => (
                    <div key={d.id} style={{ background: "rgba(255,255,255,0.7)", borderRadius: 8, padding: "10px 12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: T.textPrimary, fontFamily: "'Kanit', sans-serif" }}>{d.label}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: d.color, fontFamily: "'Kanit', sans-serif" }}>{d.score.toFixed(1)}/5</span>
                      </div>
                      <p style={{ fontSize: 11, color: T.textMuted, fontFamily: "'Kanit', sans-serif" }}>
                        {reco[d.id].quick_win}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

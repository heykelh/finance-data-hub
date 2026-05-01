"use client";

import { useProjectStore } from "@/lib/useProjectState";
import { useResponsive } from "@/lib/useResponsive";
import { T, badge, card } from "@/lib/theme";
import {
  Database, Search, BookOpen, Tag, CheckCircle2,
  AlertTriangle, Clock, ArrowRight, Info, Users,
  FileText, Filter, Star
} from "lucide-react";
import { useState } from "react";

// ── glossaire métier ──────────────────────────────────────────────────────────
const GLOSSAIRE = [
  { id: "g01", terme: "LCR",              domaine: "Risques",     definition: "Liquidity Coverage Ratio — ratio de couverture des besoins de liquidité à 30 jours. Minimum réglementaire : 100%.", source: "BCBS / CRR",  phase_intro: 1, certified: true,  owner: "Direction Risques",    bcbs: true  },
  { id: "g02", terme: "NSFR",             domaine: "Risques",     definition: "Net Stable Funding Ratio — ratio de financement stable net. Mesure la capacité à financer les actifs à long terme.", source: "BCBS / CRR",  phase_intro: 1, certified: true,  owner: "Direction Risques",    bcbs: true  },
  { id: "g03", terme: "VaR",              domaine: "Risques",     definition: "Value at Risk — perte maximale potentielle sur un portefeuille pour un niveau de confiance et un horizon donné.", source: "FRTB",        phase_intro: 1, certified: true,  owner: "Direction Risques",    bcbs: true  },
  { id: "g04", terme: "COREP",            domaine: "Conformité",  definition: "Common Reporting — format de reporting réglementaire unifié pour les établissements de crédit européens, transmis à la BCE.", source: "EBA",         phase_intro: 1, certified: true,  owner: "Conformité",           bcbs: true  },
  { id: "g05", terme: "P&L",              domaine: "Finance",     definition: "Profit and Loss — compte de résultat mesurant la performance financière d'une entité sur une période donnée.", source: "IFRS",        phase_intro: 1, certified: true,  owner: "Direction Finance",    bcbs: false },
  { id: "g06", terme: "Scoring Crédit",   domaine: "Risques",     definition: "Probabilité de défaut d'un client calculée par un modèle IA à partir de données comportementales et financières.", source: "Interne",     phase_intro: 1, certified: false, owner: "Direction Risques",    bcbs: false },
  { id: "g07", terme: "BCBS 239",         domaine: "Conformité",  definition: "Principes du Comité de Bâle pour une agrégation efficace des données de risque et un reporting de risque fiable.", source: "BIS",         phase_intro: 1, certified: true,  owner: "Conformité",           bcbs: true  },
  { id: "g08", terme: "Data Lineage",     domaine: "Gouvernance", definition: "Traçabilité complète du cycle de vie d'une donnée : origine, transformations successives, destinations et consommateurs.", source: "DAMA",        phase_intro: 2, certified: true,  owner: "CDO",                  bcbs: true  },
  { id: "g09", terme: "Data Steward",     domaine: "Gouvernance", definition: "Responsable opérationnel de la qualité et de la documentation d'un domaine de données au quotidien.", source: "DAMA-DMBOK",  phase_intro: 2, certified: true,  owner: "CDO",                  bcbs: false },
  { id: "g10", terme: "Data Owner",       domaine: "Gouvernance", definition: "Responsable métier d'un domaine de données, garant de sa définition, qualité et conformité d'usage.", source: "DAMA-DMBOK",  phase_intro: 2, certified: true,  owner: "CDO",                  bcbs: false },
  { id: "g11", terme: "FRTB",             domaine: "Risques",     definition: "Fundamental Review of the Trading Book — réforme Bâle IV du cadre de risque de marché pour les activités de trading.", source: "BCBS",        phase_intro: 2, certified: false, owner: "Direction Risques",    bcbs: true  },
  { id: "g12", terme: "Complétude",       domaine: "Qualité",     definition: "Dimension qualité mesurant la proportion de champs renseignés sur le total des champs attendus pour un enregistrement.", source: "DAMA",        phase_intro: 2, certified: true,  owner: "Data Steward Qualité", bcbs: true  },
  { id: "g13", terme: "Exactitude",       domaine: "Qualité",     definition: "Dimension qualité mesurant la conformité des données à leur valeur réelle ou à une source de référence certifiée.", source: "DAMA",        phase_intro: 2, certified: true,  owner: "Data Steward Qualité", bcbs: true  },
  { id: "g14", terme: "Data Catalog",     domaine: "Gouvernance", definition: "Référentiel centralisé des métadonnées : définitions, propriétaires, qualité, lineage et règles de gestion des données.", source: "DAMA",        phase_intro: 3, certified: true,  owner: "CDO",                  bcbs: false },
  { id: "g15", terme: "EU AI Act",        domaine: "IA",          definition: "Règlement européen 2024/1689 encadrant le développement et déploiement des systèmes IA selon leur niveau de risque.", source: "UE",          phase_intro: 3, certified: true,  owner: "Conformité",           bcbs: false },
  { id: "g16", terme: "Drift",            domaine: "IA",          definition: "Dégradation progressive des performances d'un modèle IA due à l'évolution des distributions des données en production.", source: "MLOps",       phase_intro: 3, certified: true,  owner: "Data Science",         bcbs: false },
  { id: "g17", terme: "Cohérence",        domaine: "Qualité",     definition: "Dimension qualité mesurant l'absence de contradictions entre des données présentes dans différents systèmes.", source: "DAMA",        phase_intro: 3, certified: true,  owner: "Data Steward Qualité", bcbs: true  },
  { id: "g18", terme: "Fraîcheur",        domaine: "Qualité",     definition: "Dimension qualité mesurant le délai entre la création d'une donnée et sa disponibilité dans les systèmes cibles.", source: "DAMA",        phase_intro: 3, certified: true,  owner: "Data Steward Qualité", bcbs: true  },
  { id: "g19", terme: "Golden Record",    domaine: "Clients",     definition: "Version unique et certifiée d'un enregistrement client, résultant de la fusion et déduplication de toutes les sources.", source: "MDM",         phase_intro: 4, certified: true,  owner: "Data Owner Clients",   bcbs: false },
  { id: "g20", terme: "MDM",              domaine: "Données",     definition: "Master Data Management — gestion centralisée des données de référence pour garantir une version unique et cohérente.", source: "DAMA",        phase_intro: 4, certified: true,  owner: "Data Owner Clients",   bcbs: false },
  { id: "g21", terme: "COREP/FINREP",     domaine: "Conformité",  definition: "Reportings prudentiels transmis à la BCE — COREP pour les fonds propres et ratios de liquidité, FINREP pour les états financiers.", source: "EBA/BCE",     phase_intro: 4, certified: true,  owner: "Conformité",           bcbs: true  },
  { id: "g22", terme: "OpenLineage",      domaine: "Gouvernance", definition: "Standard open source de capture automatique du lineage technique — traçabilité des pipelines de données sans instrumentation manuelle.", source: "OpenLineage", phase_intro: 4, certified: true,  owner: "IT/DSI",               bcbs: true  },
  { id: "g23", terme: "Model Risk",       domaine: "IA",          definition: "Risque lié à l'utilisation de modèles inadaptés, mal calibrés ou dont les résultats sont mal interprétés par les décideurs.", source: "SR 11-7",     phase_intro: 5, certified: true,  owner: "Conformité",           bcbs: false },
  { id: "g24", terme: "Feature Store",    domaine: "IA",          definition: "Référentiel centralisé des variables calculées (features) utilisées dans les modèles IA — garantit la cohérence entre entraînement et production.", source: "MLOps",       phase_intro: 5, certified: true,  owner: "Data Science",         bcbs: false },
  { id: "g25", terme: "MLflow",           domaine: "IA",          definition: "Plateforme open source de gestion du cycle de vie des modèles ML — tracking des expériences, versionnage, déploiement et monitoring.", source: "Databricks",  phase_intro: 5, certified: true,  owner: "Data Science",         bcbs: false },
  { id: "g26", terme: "Explainabilité",   domaine: "IA",          definition: "Capacité d'un modèle IA à justifier ses décisions de manière compréhensible par un humain — exigence EU AI Act pour les modèles à haut risque.", source: "EU AI Act",   phase_intro: 5, certified: true,  owner: "Conformité",           bcbs: false },
  { id: "g27", terme: "Data Literacy",    domaine: "Gouvernance", definition: "Capacité des collaborateurs à lire, comprendre, analyser et communiquer avec des données dans leur contexte métier quotidien.", source: "DAMA",        phase_intro: 6, certified: true,  owner: "CDO",                  bcbs: false },
  { id: "g28", terme: "DataOps",          domaine: "Gouvernance", definition: "Ensemble de pratiques combinant Agile, DevOps et data management pour améliorer la qualité et réduire le délai de livraison des pipelines data.", source: "DAMA",        phase_intro: 6, certified: true,  owner: "IT/DSI",               bcbs: false },
  { id: "g29", terme: "Data Mesh",        domaine: "Gouvernance", definition: "Architecture data décentralisée où chaque domaine métier est responsable de ses propres data products — alternative au data lake centralisé.", source: "ThoughtWorks",phase_intro: 6, certified: false, owner: "CDO",                  bcbs: false },
  { id: "g30", terme: "Data Product",     domaine: "Gouvernance", definition: "Donnée ou ensemble de données traité comme un produit — avec un owner, une documentation, des SLA de qualité et un cycle de vie géré.", source: "Data Mesh",   phase_intro: 6, certified: true,  owner: "CDO",                  bcbs: false },
];

// ── datasets du DWH ───────────────────────────────────────────────────────────
const DATASETS = [
  { id: "d01", nom: "fact_transactions",        domaine: "Core Banking", schema: "gold",   lignes: "45.2M",  fraicheur: "J-1",        qualite: 94, phase_intro: 2, owner: "IT/DSI",             critical: true,  desc: "Table de faits centrale — toutes les transactions clients, débits, crédits, virements." },
  { id: "d02", nom: "stg_core_banking_raw",      domaine: "Core Banking", schema: "silver", lignes: "180.2M", fraicheur: "J",           qualite: 71, phase_intro: 1, owner: "IT/DSI",             critical: false, desc: "Données brutes extraites de Temenos T24 — zone staging avant transformation dbt." },
  { id: "d03", nom: "fact_risk_indicators",      domaine: "Risques",      schema: "gold",   lignes: "1.8M",   fraicheur: "J-1",        qualite: 89, phase_intro: 2, owner: "Risques",            critical: true,  desc: "Indicateurs de risque calculés : LCR, NSFR, VaR, ratio de levier par entité juridique." },
  { id: "d04", nom: "stg_murex_risk_raw",        domaine: "Risques",      schema: "silver", lignes: "4.2M",   fraicheur: "J",           qualite: 82, phase_intro: 1, owner: "IT/DSI",             critical: true,  desc: "Données brutes Murex — positions de trading, sensibilités, données de marché." },
  { id: "d05", nom: "fact_gl_entries",           domaine: "Finance",      schema: "gold",   lignes: "12.4M",  fraicheur: "J-1",        qualite: 96, phase_intro: 2, owner: "Finance",            critical: true,  desc: "Écritures du Grand Livre SAP — P&L, bilan, charges et produits par centre de coût." },
  { id: "d06", nom: "fact_market_data",          domaine: "Trésorerie",   schema: "silver", lignes: "22.1M",  fraicheur: "Temps réel", qualite: 99, phase_intro: 2, owner: "Trésorerie",         critical: true,  desc: "Données marché Bloomberg — cours, taux, spreads de crédit, volatilités." },
  { id: "d07", nom: "dim_products",              domaine: "Produits",     schema: "gold",   lignes: "8.4K",   fraicheur: "Hebdo",      qualite: 98, phase_intro: 2, owner: "Data Owner Produits", critical: false, desc: "Référentiel produits bancaires — comptes, crédits, placements, assurances." },
  { id: "d08", nom: "mart_bcbs_reporting",       domaine: "Conformité",   schema: "gold",   lignes: "240K",   fraicheur: "J-1",        qualite: 92, phase_intro: 3, owner: "Conformité",         critical: true,  desc: "Data mart dédié aux reportings BCBS 239 — 14 données critiques agrégées et certifiées." },
  { id: "d09", nom: "feat_credit_scoring",       domaine: "IA / ML",      schema: "gold",   lignes: "3.1M",   fraicheur: "Hebdo",      qualite: 88, phase_intro: 3, owner: "Data Science",       critical: false, desc: "Feature store pour les modèles de scoring crédit — 147 variables calculées par client." },
  { id: "d10", nom: "fact_fraud_signals",        domaine: "Conformité",   schema: "gold",   lignes: "890K",   fraicheur: "Temps réel", qualite: 93, phase_intro: 3, owner: "Conformité",         critical: false, desc: "Signaux de fraude détectés par le modèle FraudDetector — transactions scorées." },
  { id: "d11", nom: "dim_clients_golden",        domaine: "MDM",          schema: "gold",   lignes: "3.1M",   fraicheur: "J-1",        qualite: 91, phase_intro: 4, owner: "Data Owner Clients", critical: true,  desc: "Golden record clients unifié — déduplication Core Banking + CRM + Risques via Semarchy." },
  { id: "d12", nom: "mart_customer_360",         domaine: "Clients",      schema: "gold",   lignes: "3.1M",   fraicheur: "J-1",        qualite: 86, phase_intro: 4, owner: "Marketing",          critical: false, desc: "Vue 360° client — transactions, produits détenus, interactions, score de risque." },
  { id: "d13", nom: "ref_mdm_products",          domaine: "MDM",          schema: "gold",   lignes: "12.6K",  fraicheur: "Hebdo",      qualite: 97, phase_intro: 4, owner: "Data Owner Produits", critical: false, desc: "Référentiel produits MDM — golden record unifié entre Core Banking, CRM et Risques." },
  { id: "d14", nom: "lineage_bcbs_critical",     domaine: "Conformité",   schema: "gold",   lignes: "14K",    fraicheur: "J-1",        qualite: 95, phase_intro: 4, owner: "Conformité",         critical: true,  desc: "Métadonnées de lineage des 14 données critiques BCBS 239 — source → transformation → reporting." },
  { id: "d15", nom: "feat_fraud_detection",      domaine: "IA / ML",      schema: "gold",   lignes: "18.2M",  fraicheur: "Temps réel", qualite: 94, phase_intro: 5, owner: "Data Science",       critical: false, desc: "Features pour le modèle FraudDetector — 89 variables comportementales et transactionnelles." },
  { id: "d16", nom: "feat_churn_prediction",     domaine: "IA / ML",      schema: "gold",   lignes: "890K",   fraicheur: "Hebdo",      qualite: 91, phase_intro: 5, owner: "Data Science",       critical: false, desc: "Features pour le modèle ChurnPredictor — 64 variables comportementales clients." },
  { id: "d17", nom: "mart_model_monitoring",     domaine: "IA / ML",      schema: "gold",   lignes: "2.4M",   fraicheur: "Quotidien",  qualite: 96, phase_intro: 5, owner: "Data Science",       critical: false, desc: "Monitoring des modèles IA en production — drift, accuracy, volume de prédictions par modèle." },
  { id: "d18", nom: "ref_ai_model_registry",     domaine: "IA / ML",      schema: "gold",   lignes: "5",      fraicheur: "Mensuel",    qualite: 100, phase_intro: 5, owner: "Conformité",        critical: false, desc: "Registre des 5 modèles IA — classification EU AI Act, statut de validation, owner, documentation." },
  { id: "d19", nom: "mart_data_quality_history", domaine: "Qualité",      schema: "gold",   lignes: "8.7M",   fraicheur: "Quotidien",  qualite: 98, phase_intro: 6, owner: "Data Steward Qualité",critical: false, desc: "Historique des KPIs qualité par dataset et par domaine — 18 mois d'historique pour le reporting CDO." },
  { id: "d20", nom: "mart_governance_kpis",      domaine: "Gouvernance",  schema: "gold",   lignes: "120K",   fraicheur: "Mensuel",    qualite: 99, phase_intro: 6, owner: "CDO",                critical: false, desc: "KPIs de gouvernance data consolidés — maturité, qualité, conformité, coverage lineage — pour le Comex." },
  { id: "d21", nom: "feat_liquidity_forecast",   domaine: "Finance",      schema: "gold",   lignes: "240K",   fraicheur: "Hebdo",      qualite: 93, phase_intro: 6, owner: "Finance",            critical: true,  desc: "Features pour le modèle LiquidityForecast — données de bilan, flux de trésorerie, données marché." },
];

// ── domaines ──────────────────────────────────────────────────────────────────
const DOMAINES = [
  { nom: "Risques",      color: T.red,    bg: T.redSoft,    border: T.redBorder    },
  { nom: "Finance",      color: T.blue,   bg: T.blueSoft,   border: T.blueBorder   },
  { nom: "Clients",      color: T.green,  bg: T.greenSoft,  border: T.greenBorder  },
  { nom: "Conformité",   color: T.amber,  bg: T.amberSoft,  border: T.amberBorder  },
  { nom: "Gouvernance",  color: T.indigo, bg: T.indigoSoft, border: T.indigoBorder },
  { nom: "IA",           color: T.purple, bg: T.purpleSoft, border: T.purpleBorder },
  { nom: "Qualité",      color: "#0891b2",bg: "#ecfeff",    border: "#a5f3fc"      },
  { nom: "Données",      color: T.slate,  bg: T.slateSoft,  border: T.slateBorder  },
];

function getDomaineCfg(nom: string) {
  return DOMAINES.find(d => d.nom === nom) ?? { color: T.slate, bg: T.slateSoft, border: T.slateBorder };
}

function getSchemaCfg(schema: string) {
  const map: Record<string, { color: string; bg: string; border: string }> = {
    gold:   { color: "#92400e", bg: "#fffbeb", border: "#fde68a" },
    silver: { color: T.slate,  bg: T.slateSoft, border: T.slateBorder },
    raw:    { color: T.red,    bg: T.redSoft,   border: T.redBorder   },
  };
  return map[schema] ?? map["silver"];
}

// ── page ─────────────────────────────────────────────────────────────────────
export default function CatalogPage() {
  const { state } = useProjectStore();
  const { cols, pad } = useResponsive();
  const [searchGlossaire, setSearchGlossaire] = useState("");
  const [searchDataset, setSearchDataset]     = useState("");
  const [filterDomaine, setFilterDomaine]     = useState("Tous");

  const phase = state.phase;

  // Données visibles selon phase
  const visibleGlossaire = GLOSSAIRE.filter(g => g.phase_intro <= phase);
  const visibleDatasets  = DATASETS.filter(d => d.phase_intro <= phase);

  // Filtres
  const filteredGlossaire = visibleGlossaire.filter(g => {
    const matchSearch = g.terme.toLowerCase().includes(searchGlossaire.toLowerCase()) ||
                        g.definition.toLowerCase().includes(searchGlossaire.toLowerCase());
    const matchDomaine = filterDomaine === "Tous" || g.domaine === filterDomaine;
    return matchSearch && matchDomaine;
  });

  const filteredDatasets = visibleDatasets.filter(d => {
    const matchSearch = d.nom.toLowerCase().includes(searchDataset.toLowerCase()) ||
                        d.desc.toLowerCase().includes(searchDataset.toLowerCase());
    const matchDomaine = filterDomaine === "Tous" || d.domaine === filterDomaine;
    return matchSearch && matchDomaine;
  });

  const certifies    = visibleGlossaire.filter(g => g.certified).length;
  const bcbsTermes   = visibleGlossaire.filter(g => g.bcbs).length;
  const goldDatasets = visibleDatasets.filter(d => d.schema === "gold").length;
  const avgQualite   = Math.round(visibleDatasets.reduce((a, d) => a + d.qualite, 0) / visibleDatasets.length) || 0;

  // Narration par phase
  const NARRATION: Record<number, string> = {
    1: "Phase 1 — Le data catalog n'existe pas encore. Les définitions métier sont éparpillées dans des documents Word et des wikis non maintenus. Aucune donnée n'est certifiée.",
    2: "Phase 2 — Les premiers termes clés sont définis dans le cadre du framework de gouvernance. Collibra est en cours d'acquisition. Le glossaire existe en mode manuel.",
    3: "Phase 3 — Collibra est déployé. Les Data Stewards alimentent le glossaire. Les datasets du DWH Snowflake sont scannés et référencés automatiquement.",
    4: "Phase 4 — Le MDM enrichit le catalog avec les golden records. Le lineage automatique alimente les métadonnées. Coverage : 82% des tables documentées.",
    5: "Phase 5 — Le catalog couvre 95% des tables. Les features IA sont documentées. Chaque modèle est lié à ses données sources dans le catalog.",
    6: "Phase 6 — Data catalog complet et maintenu en autonomie. 100% des données critiques documentées, certifiées et tracées. FrontierBank est autonome.",
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24, padding: pad }}>

      {/* ── Bandeau ── */}
      <div style={{ background: T.heroGrad, borderRadius: 14, padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(147,197,253,0.9)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10, fontFamily: "'Kanit', sans-serif" }}>
              FrontierBank · Data Catalog · Phase {phase}
            </p>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#f0f4ff", marginBottom: 8, fontFamily: "'Kanit', sans-serif" }}>
              Data Catalog — Glossaire & Référentiel des Données
            </h2>
            <p style={{ fontSize: 13, color: "rgba(191,219,254,0.85)", fontFamily: "'Kanit', sans-serif" }}>
              Métadonnées · Glossaire métier · Datasets certifiés · Ownership · {state.period}
            </p>
            <p style={{ fontSize: 12, color: "rgba(147,197,253,0.8)", marginTop: 8, fontStyle: "italic", fontFamily: "'Kanit', sans-serif", maxWidth: 560 }}>
              {NARRATION[phase]}
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
            {[
              { v: `${visibleGlossaire.length}`, l: "Termes définis"    },
              { v: `${visibleDatasets.length}`,  l: "Datasets référencés" },
            ].map(x => (
              <div key={x.l} style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "16px 22px", textAlign: "center" }}>
                <p style={{ fontSize: 26, fontWeight: 800, color: "#f0f4ff", marginBottom: 2, fontFamily: "'Kanit', sans-serif" }}>{x.v}</p>
                <p style={{ fontSize: 11, color: "rgba(147,197,253,0.8)", fontFamily: "'Kanit', sans-serif" }}>{x.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── KPIs ── */}
      <div style={{ display: "grid", gridTemplateColumns: cols(4, 2, 1), gap: 16 }}>
        {[
          { icon: BookOpen,     iconBg: T.blueSoft,   iconColor: T.blue,
            value: `${certifies}/${visibleGlossaire.length}`,
            label: "Termes certifiés",
            sub: "Validés par les Data Owners",
            badgeTxt: `${Math.round((certifies/visibleGlossaire.length||1)*100)}%`,
            badgeBg: T.greenSoft, badgeColor: T.green, badgeBorder: T.greenBorder },
          { icon: Tag,          iconBg: T.purpleSoft, iconColor: T.purple,
            value: `${bcbsTermes}`,
            label: "Termes BCBS 239",
            sub: "Liés aux données critiques réglementaires",
            badgeTxt: "Réglementaire",
            badgeBg: T.purpleSoft, badgeColor: T.purple, badgeBorder: T.purpleBorder },
          { icon: Database,     iconBg: T.amberSoft,  iconColor: T.amber,
            value: `${goldDatasets}/${visibleDatasets.length}`,
            label: "Datasets Gold",
            sub: "Données certifiées zone gold DWH",
            badgeTxt: "Certifiés",
            badgeBg: T.amberSoft, badgeColor: T.amber, badgeBorder: T.amberBorder },
          { icon: Star,         iconBg: T.greenSoft,  iconColor: T.green,
            value: `${avgQualite}%`,
            label: "Qualité moyenne",
            sub: "Score moyen des datasets référencés",
            badgeTxt: avgQualite >= 90 ? "Excellent" : avgQualite >= 80 ? "Bon" : "À améliorer",
            badgeBg: avgQualite >= 90 ? T.greenSoft : T.amberSoft,
            badgeColor: avgQualite >= 90 ? T.green : T.amber,
            badgeBorder: avgQualite >= 90 ? T.greenBorder : T.amberBorder },
        ].map(({ icon: Icon, iconBg, iconColor, value, label, sub, badgeTxt, badgeBg, badgeColor, badgeBorder }) => (
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

      {/* ── Domaines data ── */}
      <div style={card()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.textPrimary, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'Kanit', sans-serif" }}>
              Domaines de Données — Couverture du Catalog
            </p>
            <p style={{ fontSize: 12, color: T.textMuted, marginTop: 3, fontFamily: "'Kanit', sans-serif" }}>
              Répartition des termes et datasets par domaine métier à la Phase {phase}
            </p>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {DOMAINES.map(dom => {
            const termes   = visibleGlossaire.filter(g => g.domaine === dom.nom).length;
            const datasets = visibleDatasets.filter(d => d.domaine === dom.nom).length;
            if (termes === 0 && datasets === 0) return null;
            return (
              <div key={dom.nom} style={{ background: dom.bg, border: `1px solid ${dom.border}`, borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: dom.color, flexShrink: 0 }} />
                  <p style={{ fontSize: 13, fontWeight: 700, color: dom.color, margin: 0, fontFamily: "'Kanit', sans-serif" }}>{dom.nom}</p>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <div>
                    <p style={{ fontSize: 20, fontWeight: 800, color: T.textPrimary, margin: 0, fontFamily: "'Kanit', sans-serif" }}>{termes}</p>
                    <p style={{ fontSize: 10, color: T.textMuted, margin: 0, fontFamily: "'Kanit', sans-serif" }}>termes</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 20, fontWeight: 800, color: T.textPrimary, margin: 0, fontFamily: "'Kanit', sans-serif" }}>{datasets}</p>
                    <p style={{ fontSize: 10, color: T.textMuted, margin: 0, fontFamily: "'Kanit', sans-serif" }}>datasets</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Glossaire métier ── */}
      <div style={card()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.textPrimary, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'Kanit', sans-serif" }}>
              Glossaire Métier — Termes Certifiés
            </p>
            <p style={{ fontSize: 12, color: T.textMuted, marginTop: 3, fontFamily: "'Kanit', sans-serif" }}>
              {visibleGlossaire.length} termes définis · Certifiés par les Data Owners · Mis à jour en continu
            </p>
          </div>
          <span style={badge(T.blueSoft, T.blue, T.blueBorder)}>Collibra</span>
        </div>

        {/* Barre de recherche + filtre */}
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Search size={14} color={T.textMuted} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              placeholder="Rechercher un terme ou une définition..."
              value={searchGlossaire}
              onChange={e => setSearchGlossaire(e.target.value)}
              style={{
                width: "100%", padding: "9px 12px 9px 34px",
                borderRadius: 8, border: `1px solid ${T.cardBorder}`,
                background: T.cardBg, color: T.textPrimary,
                fontSize: 13, fontFamily: "'Kanit', sans-serif",
                outline: "none",
              }}
            />
          </div>
          <select
            value={filterDomaine}
            onChange={e => setFilterDomaine(e.target.value)}
            style={{
              padding: "9px 14px", borderRadius: 8,
              border: `1px solid ${T.cardBorder}`, background: T.cardBg,
              color: T.textPrimary, fontSize: 13, fontFamily: "'Kanit', sans-serif",
              outline: "none", cursor: "pointer",
            }}
          >
            <option value="Tous">Tous les domaines</option>
            {DOMAINES.map(d => <option key={d.nom} value={d.nom}>{d.nom}</option>)}
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filteredGlossaire.length === 0 && (
            <p style={{ fontSize: 13, color: T.textMuted, textAlign: "center", padding: "20px 0", fontFamily: "'Kanit', sans-serif" }}>
              Aucun terme trouvé pour cette recherche.
            </p>
          )}
          {filteredGlossaire.map(terme => {
            const domCfg = getDomaineCfg(terme.domaine);
            const isNew  = terme.phase_intro === phase;
            return (
              <div key={terme.id} style={{
                display: "flex", alignItems: "flex-start", gap: 14,
                padding: "14px 16px", borderRadius: 10,
                background: isNew ? T.blueSoft : "#f9fafd",
                border: `1px solid ${isNew ? T.blueBorder : T.cardBorder}`,
                transition: "all 0.2s",
              }}>
                {/* Badge domaine */}
                <div style={{ flexShrink: 0, marginTop: 2 }}>
                  <span style={badge(domCfg.bg, domCfg.color, domCfg.border)}>{terme.domaine}</span>
                </div>

                {/* Contenu */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: T.textPrimary, margin: 0, fontFamily: "'Kanit', sans-serif" }}>
                      {terme.terme}
                    </p>
                    {terme.certified && <span style={badge(T.greenSoft, T.green, T.greenBorder)}>Certifié ✓</span>}
                    {terme.bcbs      && <span style={badge(T.redSoft,   T.red,   T.redBorder)}>BCBS 239</span>}
                    {isNew           && <span style={badge(T.blueSoft,  T.blue,  T.blueBorder)}>Nouveau · Ph.{terme.phase_intro}</span>}
                    {!terme.certified && <span style={badge(T.amberSoft, T.amber, T.amberBorder)}>En validation</span>}
                  </div>
                  <p style={{ fontSize: 12, color: T.textSecondary, lineHeight: 1.6, margin: "0 0 6px", fontFamily: "'Kanit', sans-serif" }}>
                    {terme.definition}
                  </p>
                  <div style={{ display: "flex", gap: 12 }}>
                    <span style={{ fontSize: 11, color: T.textMuted, fontFamily: "'Kanit', sans-serif" }}>
                      Source : <strong style={{ color: T.textSecondary }}>{terme.source}</strong>
                    </span>
                    <span style={{ fontSize: 11, color: T.textMuted, fontFamily: "'Kanit', sans-serif" }}>
                      Owner : <strong style={{ color: T.textSecondary }}>{terme.owner}</strong>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Datasets DWH ── */}
      <div style={card()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.textPrimary, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'Kanit', sans-serif" }}>
              Référentiel des Datasets — DWH Snowflake
            </p>
            <p style={{ fontSize: 12, color: T.textMuted, marginTop: 3, fontFamily: "'Kanit', sans-serif" }}>
              {visibleDatasets.length} tables référencées · Zones raw, silver, gold · Qualité et fraîcheur en temps réel
            </p>
          </div>
          <span style={badge(T.amberSoft, T.amber, T.amberBorder)}>Snowflake</span>
        </div>

        {/* Recherche datasets */}
        <div style={{ position: "relative", marginBottom: 16 }}>
          <Search size={14} color={T.textMuted} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            placeholder="Rechercher un dataset..."
            value={searchDataset}
            onChange={e => setSearchDataset(e.target.value)}
            style={{
              width: "100%", padding: "9px 12px 9px 34px",
              borderRadius: 8, border: `1px solid ${T.cardBorder}`,
              background: T.cardBg, color: T.textPrimary,
              fontSize: 13, fontFamily: "'Kanit', sans-serif",
              outline: "none",
            }}
          />
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 6px", fontFamily: "'Kanit', sans-serif" }}>
            <thead>
              <tr>
                {["Dataset", "Domaine", "Zone", "Lignes", "Fraîcheur", "Qualité", "Owner", "Statut"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredDatasets.map(ds => {
                const domCfg    = getDomaineCfg(ds.domaine);
                const schemaCfg = getSchemaCfg(ds.schema);
                const isNew     = ds.phase_intro === phase;
                const bg        = isNew ? T.blueSoft : T.cardBg;
                const bdr       = isNew ? T.blueBorder : T.cardBorder;
                const cellBase: React.CSSProperties = {
                  padding: "10px 12px", background: bg,
                  borderTop: `1px solid ${bdr}`, borderBottom: `1px solid ${bdr}`,
                  borderLeft: "none", borderRight: "none",
                };
                return (
                  <tr key={ds.id}>
                    <td style={{ ...cellBase, borderLeft: `1px solid ${bdr}`, borderRadius: "10px 0 0 10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: T.textPrimary, fontFamily: "monospace" }}>{ds.nom}</span>
                        {isNew        && <span style={badge(T.blueSoft, T.blue, T.blueBorder)}>New</span>}
                        {ds.critical  && <span style={badge(T.redSoft,  T.red,  T.redBorder)}>BCBS</span>}
                      </div>
                      <p style={{ fontSize: 11, color: T.textMuted, margin: "2px 0 0", fontFamily: "'Kanit', sans-serif", maxWidth: 220 }}>{ds.desc}</p>
                    </td>
                    <td style={cellBase}>
                      <span style={badge(domCfg.bg, domCfg.color, domCfg.border)}>{ds.domaine}</span>
                    </td>
                    <td style={cellBase}>
                      <span style={badge(schemaCfg.bg, schemaCfg.color, schemaCfg.border)}>{ds.schema}</span>
                    </td>
                    <td style={{ ...cellBase, whiteSpace: "nowrap" as const }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: T.textPrimary, fontFamily: "'Kanit', sans-serif" }}>{ds.lignes}</span>
                    </td>
                    <td style={{ ...cellBase, whiteSpace: "nowrap" as const }}>
                      <span style={{ fontSize: 12, color: T.textSecondary, fontFamily: "'Kanit', sans-serif" }}>{ds.fraicheur}</span>
                    </td>
                    <td style={cellBase}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 48, height: 6, borderRadius: 99, background: T.slateSoft, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${ds.qualite}%`, borderRadius: 99, background: ds.qualite >= 90 ? T.green : ds.qualite >= 80 ? T.amber : T.red }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: ds.qualite >= 90 ? T.green : ds.qualite >= 80 ? T.amber : T.red, fontFamily: "'Kanit', sans-serif" }}>
                          {ds.qualite}%
                        </span>
                      </div>
                    </td>
                    <td style={{ ...cellBase, whiteSpace: "nowrap" as const }}>
                      <span style={{ fontSize: 11, color: T.textSecondary, fontFamily: "'Kanit', sans-serif" }}>{ds.owner}</span>
                    </td>
                    <td style={{ ...cellBase, borderRight: `1px solid ${bdr}`, borderRadius: "0 10px 10px 0" }}>
                      {ds.qualite >= 90
                        ? <div style={{ display: "flex", alignItems: "center", gap: 4 }}><CheckCircle2 size={13} color={T.green} /><span style={{ fontSize: 11, color: T.green, fontFamily: "'Kanit', sans-serif" }}>Certifié</span></div>
                        : ds.qualite >= 80
                          ? <div style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={13} color={T.amber} /><span style={{ fontSize: 11, color: T.amber, fontFamily: "'Kanit', sans-serif" }}>Surveillance</span></div>
                          : <div style={{ display: "flex", alignItems: "center", gap: 4 }}><AlertTriangle size={13} color={T.red} /><span style={{ fontSize: 11, color: T.red, fontFamily: "'Kanit', sans-serif" }}>Action requise</span></div>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ background: T.blueSoft, border: `1px solid ${T.blueBorder}`, borderRadius: 8, padding: "10px 14px", display: "flex", gap: 8, marginTop: 14 }}>
          <Info size={14} color={T.blue} style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12, color: "#1e3a8a", lineHeight: 1.7, fontFamily: "'Kanit', sans-serif" }}>
            <strong>Zones DWH :</strong> La zone <strong style={{ color: "#92400e" }}>Gold</strong> contient les données certifiées et transformées, prêtes à la consommation.
            La zone <strong style={{ color: T.slate }}>Silver</strong> contient les données nettoyées mais pas encore certifiées.
            La zone <strong>Raw</strong> contient les données brutes issues des sources — jamais consommées directement.
          </p>
        </div>
      </div>

    </div>
  );
}
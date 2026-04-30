"use client";

import { useProjectStore } from "@/lib/useProjectState";
import { T, badge, card } from "@/lib/theme";
import { useEffect, useRef } from "react";
import {
  GitBranch, Database, ArrowRight, Info,
  CheckCircle2, AlertTriangle, Clock, Layers,
  Server, FileText, BarChart2, Shield, Users, Brain, BookOpen
} from "lucide-react";

// ── types ─────────────────────────────────────────────────────────────────────
type NodeType = "source" | "ingestion" | "transform" | "storage" | "consumption" | "reporting";
type LinkStatus = "documented" | "partial" | "undocumented";

type LineageNode = {
  id: string;
  label: string;
  type: NodeType;
  system: string;
  owner: string;
  phase_visible: number;
  critical_bcbs: boolean;
  desc: string;
};

type LineageLink = {
  from: string;
  to: string;
  label: string;
  phase_visible: number;
  status: LinkStatus;
  volume: string;
  frequency: string;
  transformation?: string;
};

// ── nodes ─────────────────────────────────────────────────────────────────────
const ALL_NODES: LineageNode[] = [
  // Sources
  { id: "core_banking",  label: "Core Banking",       type: "source",      system: "Temenos T24",      owner: "IT/DSI",       phase_visible: 1, critical_bcbs: true,  desc: "Système central bancaire — données clients, comptes, transactions, contrats" },
  { id: "crm",           label: "CRM",                type: "source",      system: "Salesforce",       owner: "Marketing",    phase_visible: 1, critical_bcbs: false, desc: "Gestion de la relation client — interactions, opportunités, segments" },
  { id: "risk_engine",   label: "Moteur de Risques",  type: "source",      system: "Murex",            owner: "Risques",      phase_visible: 1, critical_bcbs: true,  desc: "Calcul des indicateurs de risque marché, crédit et liquidité (LCR, VaR, NSFR)" },
  { id: "gl",            label: "Grand Livre",        type: "source",      system: "SAP Finance",      owner: "Finance",      phase_visible: 1, critical_bcbs: true,  desc: "Comptabilité générale — écritures, balances, P&L par entité juridique" },
  { id: "market_data",   label: "Données Marché",     type: "source",      system: "Bloomberg",        owner: "Trésorerie",   phase_visible: 2, critical_bcbs: true,  desc: "Flux de données marché temps réel — cours, taux, spreads de crédit" },

  // Ingestion
  { id: "etl_ops",       label: "ETL Opérationnel",   type: "ingestion",   system: "Talend",           owner: "IT/DSI",       phase_visible: 1, critical_bcbs: false, desc: "Collecte et chargement des données opérationnelles depuis les systèmes sources" },
  { id: "stream",        label: "Stream Temps Réel",  type: "ingestion",   system: "Kafka",            owner: "IT/DSI",       phase_visible: 3, critical_bcbs: false, desc: "Ingestion temps réel des flux de transactions et événements marché" },
  { id: "api_layer",     label: "API Gateway",        type: "ingestion",   system: "Internal API",     owner: "IT/DSI",       phase_visible: 2, critical_bcbs: false, desc: "Exposition des données via API REST pour les consommateurs internes et partenaires" },

  // Transform
  { id: "dbt_core",      label: "Transformation dbt", type: "transform",   system: "dbt Core",         owner: "Data Team",    phase_visible: 2, critical_bcbs: true,  desc: "Transformations SQL documentées — calcul des indicateurs métier et réglementaires" },
  { id: "mdm_engine",    label: "MDM Engine",         type: "transform",   system: "Semarchy",         owner: "Data Owner",   phase_visible: 4, critical_bcbs: true,  desc: "Unification des données maîtres clients, produits, tiers — golden record" },
  { id: "quality_ctrl",  label: "Contrôles Qualité",  type: "transform",   system: "Great Expectations",owner: "Data Team",   phase_visible: 3, critical_bcbs: true,  desc: "Tests automatisés de qualité — complétude, exactitude, cohérence, fraîcheur" },

  // Storage
  { id: "data_lake",     label: "Data Lake",          type: "storage",     system: "Azure ADLS",       owner: "IT/DSI",       phase_visible: 1, critical_bcbs: false, desc: "Stockage brut des données — zone raw, silver et gold — format Parquet/Delta" },
  { id: "dwh",           label: "Data Warehouse",     type: "storage",     system: "Snowflake",        owner: "Data Team",    phase_visible: 2, critical_bcbs: true,  desc: "Entrepôt de données analytique — données certifiées, modèle en étoile, historisation" },
  { id: "data_catalog",  label: "Data Catalog",       type: "storage",     system: "Collibra",         owner: "Data Steward", phase_visible: 3, critical_bcbs: true,  desc: "Référentiel des métadonnées, glossaire, lineage, règles de qualité et ownership" },

  // Consumption
  { id: "risk_reporting",label: "Reporting Risques",  type: "consumption", system: "Power BI",         owner: "Risques",      phase_visible: 2, critical_bcbs: true,  desc: "Tableaux de bord risques — LCR, NSFR, VaR, FRTB, ratio de levier" },
  { id: "fin_reporting", label: "Reporting Finance",  type: "consumption", system: "Power BI",         owner: "Finance",      phase_visible: 2, critical_bcbs: false, desc: "Reportings financiers internes — P&L, budget vs réalisé, prévisions" },
  { id: "ai_models",     label: "Modèles IA",         type: "consumption", system: "Python/MLflow",    owner: "Data Science", phase_visible: 3, critical_bcbs: false, desc: "Consommation des données certifiées pour l'entraînement et l'inférence des modèles" },
  { id: "bcbs_report",   label: "Reporting BCBS 239", type: "reporting",   system: "Regulatory Engine",owner: "Conformité",   phase_visible: 3, critical_bcbs: true,  desc: "Production des reportings réglementaires BCBS 239 — données agrégées de risque" },
  { id: "regulator",     label: "Régulateur (BCE)",   type: "reporting",   system: "XBRL/COREP",       owner: "Conformité",   phase_visible: 4, critical_bcbs: true,  desc: "Transmission des reportings COREP/FINREP à la Banque Centrale Européenne" },
];

// ── liens ─────────────────────────────────────────────────────────────────────
const ALL_LINKS: LineageLink[] = [
  { from: "core_banking",  to: "etl_ops",       label: "Extract daily",      phase_visible: 1, status: "partial",       volume: "2M lignes/j",    frequency: "Quotidien",    transformation: "Extraction CDC" },
  { from: "risk_engine",   to: "etl_ops",       label: "Risk indicators",    phase_visible: 1, status: "undocumented",  volume: "500K calc/j",    frequency: "Quotidien",    transformation: "Agrégation" },
  { from: "gl",            to: "etl_ops",       label: "Accounting data",    phase_visible: 1, status: "partial",       volume: "800K écritures/j",frequency: "Quotidien",    transformation: "Mapping comptes" },
  { from: "etl_ops",       to: "data_lake",     label: "Load raw",           phase_visible: 1, status: "documented",    volume: "~4GB/j",         frequency: "Quotidien",    transformation: "Chargement brut" },
  { from: "crm",           to: "api_layer",     label: "Customer events",    phase_visible: 2, status: "partial",       volume: "50K events/j",   frequency: "Temps réel",   transformation: "Événements CRM" },
  { from: "market_data",   to: "stream",        label: "Market feed",        phase_visible: 2, status: "documented",    volume: "1M ticks/j",     frequency: "Continu",      transformation: "Normalisation" },
  { from: "stream",        to: "data_lake",     label: "Stream to lake",     phase_visible: 3, status: "documented",    volume: "~2GB/h",         frequency: "Continu",      transformation: "Sérialisation Parquet" },
  { from: "api_layer",     to: "dwh",           label: "API to DWH",         phase_visible: 2, status: "partial",       volume: "200K rows/j",    frequency: "Horaire",      transformation: "Normalisation" },
  { from: "data_lake",     to: "dbt_core",      label: "Silver transform",   phase_visible: 2, status: "documented",    volume: "Multi-sources",  frequency: "Quotidien",    transformation: "Modèles SQL dbt" },
  { from: "dbt_core",      to: "quality_ctrl",  label: "Test suite",         phase_visible: 3, status: "documented",    volume: "1 200 tests",    frequency: "Quotidien",    transformation: "Tests Great Expectations" },
  { from: "dbt_core",      to: "dwh",           label: "Gold layer",         phase_visible: 2, status: "documented",    volume: "Modèle en étoile",frequency: "Quotidien",    transformation: "Agrégats certifiés" },
  { from: "data_lake",     to: "mdm_engine",    label: "Client raw data",    phase_visible: 4, status: "documented",    volume: "3M clients",     frequency: "Quotidien",    transformation: "Déduplication" },
  { from: "core_banking",  to: "mdm_engine",    label: "Account data",       phase_visible: 4, status: "documented",    volume: "8M comptes",     frequency: "Quotidien",    transformation: "Golden record" },
  { from: "mdm_engine",    to: "dwh",           label: "Master data",        phase_visible: 4, status: "documented",    volume: "Référentiels",   frequency: "Quotidien",    transformation: "Chargement MDM" },
  { from: "quality_ctrl",  to: "data_catalog",  label: "Quality metadata",   phase_visible: 3, status: "documented",    volume: "KPIs qualité",   frequency: "Quotidien",    transformation: "Publication métriques" },
  { from: "dwh",           to: "data_catalog",  label: "Table metadata",     phase_visible: 3, status: "documented",    volume: "2 400 tables",   frequency: "Continu",      transformation: "Scan automatique" },
  { from: "dwh",           to: "risk_reporting",label: "Risk data mart",     phase_visible: 2, status: "partial",       volume: "Indicateurs DG", frequency: "Quotidien",    transformation: "Mart risques" },
  { from: "dwh",           to: "fin_reporting", label: "Finance data mart",  phase_visible: 2, status: "partial",       volume: "P&L, Budget",    frequency: "Mensuel",      transformation: "Mart finance" },
  { from: "dwh",           to: "ai_models",     label: "Training data",      phase_visible: 3, status: "documented",    volume: "Features store", frequency: "Hebdomadaire", transformation: "Feature engineering" },
  { from: "dwh",           to: "bcbs_report",   label: "Regulatory data",    phase_visible: 3, status: "partial",       volume: "14 principes",   frequency: "Quotidien",    transformation: "Calcul réglementaire" },
  { from: "bcbs_report",   to: "regulator",     label: "COREP/FINREP",       phase_visible: 4, status: "documented",    volume: "Rapports BCE",   frequency: "Trimestriel",  transformation: "Format XBRL" },
];

// ── config visuelle des types de nœuds ────────────────────────────────────────
const NODE_TYPE_CFG: Record<NodeType, { color: string; bg: string; border: string; icon: any; label: string }> = {
  source:      { color: T.blue,   bg: T.blueSoft,   border: T.blueBorder,   icon: Database,  label: "Source"        },
  ingestion:   { color: T.indigo, bg: T.indigoSoft, border: T.indigoBorder, icon: ArrowRight,label: "Ingestion"     },
  transform:   { color: T.purple, bg: T.purpleSoft, border: T.purpleBorder, icon: Layers,    label: "Transformation"},
  storage:     { color: T.amber,  bg: T.amberSoft,  border: T.amberBorder,  icon: Server,    label: "Stockage"      },
  consumption: { color: T.green,  bg: T.greenSoft,  border: T.greenBorder,  icon: BarChart2, label: "Consommation"  },
  reporting:   { color: "#dc2626",bg: "#fef2f2",    border: "#fecaca",      icon: FileText,  label: "Reporting"     },
};

const LINK_STATUS_CFG: Record<LinkStatus, { color: string; label: string; bg: string; border: string }> = {
  documented:   { color: T.green, label: "Documenté",     bg: T.greenSoft,  border: T.greenBorder  },
  partial:      { color: T.amber, label: "Partiel",       bg: T.amberSoft,  border: T.amberBorder  },
  undocumented: { color: T.red,   label: "Non documenté", bg: T.redSoft,    border: T.redBorder    },
};

// ── layout positions des nœuds (x%, y%) ──────────────────────────────────────
const NODE_POSITIONS: Record<string, { x: number; y: number }> = {
  // Colonne 1 — Sources
  core_banking:  { x: 3,  y: 8  },
  crm:           { x: 3,  y: 26 },
  risk_engine:   { x: 3,  y: 44 },
  gl:            { x: 3,  y: 62 },
  market_data:   { x: 3,  y: 80 },
  // Colonne 2 — Ingestion
  etl_ops:       { x: 22, y: 20 },
  api_layer:     { x: 22, y: 44 },
  stream:        { x: 22, y: 68 },
  // Colonne 3 — Transform + Storage
  dbt_core:      { x: 42, y: 12 },
  mdm_engine:    { x: 42, y: 36 },
  quality_ctrl:  { x: 42, y: 58 },
  data_lake:     { x: 42, y: 80 },
  // Colonne 4 — DWH + Catalog
  dwh:           { x: 62, y: 20 },
  data_catalog:  { x: 62, y: 58 },
  // Colonne 5 — Consumption
  risk_reporting:{ x: 80, y: 8  },
  fin_reporting: { x: 80, y: 28 },
  ai_models:     { x: 80, y: 48 },
  bcbs_report:   { x: 80, y: 66 },
  regulator:     { x: 80, y: 84 },
};

// ── SVG lineage canvas ────────────────────────────────────────────────────────
function LineageCanvas({ nodes, links, phase }: { nodes: LineageNode[]; links: LineageLink[]; phase: number }) {
  const W = 900;
  const H = 560;
  const NODE_W = 130;
  const NODE_H = 44;

  const visibleNodes = nodes.filter(n => n.phase_visible <= phase);
  const visibleLinks = links.filter(l => l.phase_visible <= phase);

  function nodeCenter(id: string) {
    const pos = NODE_POSITIONS[id];
    if (!pos) return { x: 0, y: 0 };
    return {
      x: (pos.x / 100) * W + NODE_W / 2,
      y: (pos.y / 100) * H + NODE_H / 2,
    };
  }

  function nodeRect(id: string) {
    const pos = NODE_POSITIONS[id];
    if (!pos) return { x: 0, y: 0 };
    return {
      x: (pos.x / 100) * W,
      y: (pos.y / 100) * H,
    };
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      <defs>
        <marker id="arrow-doc"     markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill={T.green} />
        </marker>
        <marker id="arrow-partial" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill={T.amber} />
        </marker>
        <marker id="arrow-undoc"   markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill={T.red} />
        </marker>
        <filter id="shadow">
          <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.08" />
        </filter>
      </defs>

      {/* ── Colonnes de fond ── */}
      {[
        { x: 0,   w: 18,  label: "Sources",          color: "#f0f4ff" },
        { x: 18,  w: 17,  label: "Ingestion",        color: "#f5f3ff" },
        { x: 35,  w: 22,  label: "Transform & Stockage", color: "#fffbeb" },
        { x: 57,  w: 18,  label: "DWH & Catalog",    color: "#f0fdf4" },
        { x: 75,  w: 25,  label: "Consommation",     color: "#f0f9ff" },
      ].map(col => (
        <g key={col.label}>
          <rect
            x={(col.x / 100) * W + 2} y={4}
            width={(col.w / 100) * W - 4} height={H - 8}
            rx={10} fill={col.color} stroke="#e2e8f0" strokeWidth={1}
          />
          <text
            x={(col.x / 100) * W + (col.w / 100) * W / 2} y={18}
            textAnchor="middle" fontSize={9} fontWeight={700}
            fill="#94a3b8" fontFamily="Kanit, sans-serif"
            style={{ textTransform: "uppercase", letterSpacing: 1 }}
          >
            {col.label}
          </text>
        </g>
      ))}

      {/* ── Liens ── */}
      {visibleLinks.map((link, i) => {
        const from = nodeCenter(link.from);
        const to   = nodeCenter(link.to);
        if (!from || !to) return null;

        const cfg    = LINK_STATUS_CFG[link.status];
        const markId = link.status === "documented" ? "arrow-doc" : link.status === "partial" ? "arrow-partial" : "arrow-undoc";

        // Courbe de Bézier
        const dx = to.x - from.x;
        const cx1 = from.x + dx * 0.4;
        const cx2 = to.x - dx * 0.4;
        const path = `M ${from.x} ${from.y} C ${cx1} ${from.y} ${cx2} ${to.y} ${to.x - 4} ${to.y}`;

        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2 - 8;

        return (
          <g key={i}>
            <path
              d={path}
              fill="none"
              stroke={cfg.color}
              strokeWidth={link.status === "documented" ? 2 : 1.5}
              strokeDasharray={link.status === "undocumented" ? "5 4" : link.status === "partial" ? "8 3" : "none"}
              markerEnd={`url(#${markId})`}
              opacity={0.75}
            />
            {/* Label lien */}
            <text
              x={midX} y={midY}
              textAnchor="middle" fontSize={8}
              fill={cfg.color} fontFamily="Kanit, sans-serif"
              fontWeight={600}
            >
              {link.label}
            </text>
          </g>
        );
      })}

      {/* ── Nœuds ── */}
      {visibleNodes.map(node => {
        const pos  = nodeRect(node.id);
        const cfg  = NODE_TYPE_CFG[node.type];
        const isNew = node.phase_visible === phase;

        return (
          <g key={node.id} filter="url(#shadow)">
            {/* Fond nœud */}
            <rect
              x={pos.x} y={pos.y}
              width={NODE_W} height={NODE_H}
              rx={8}
              fill={cfg.bg}
              stroke={node.critical_bcbs ? cfg.color : "#e2e8f0"}
              strokeWidth={node.critical_bcbs ? 2 : 1}
            />
            {/* Badge "nouveau" */}
            {isNew && (
              <rect x={pos.x + NODE_W - 18} y={pos.y - 6} width={16} height={12} rx={6} fill={T.blue} />
            )}
            {isNew && (
              <text x={pos.x + NODE_W - 10} y={pos.y + 2} textAnchor="middle" fontSize={7} fill="white" fontWeight={700} fontFamily="Kanit">
                NEW
              </text>
            )}
            {/* Icône type */}
            <circle cx={pos.x + 16} cy={pos.y + NODE_H / 2} r={10} fill={cfg.color} opacity={0.15} />
            {/* Nom */}
            <text
              x={pos.x + 30} y={pos.y + NODE_H / 2 - 5}
              fontSize={10} fontWeight={700}
              fill={cfg.color} fontFamily="Kanit, sans-serif"
              clipPath={`inset(0 0 0 0)`}
            >
              {node.label}
            </text>
            {/* Système */}
            <text
              x={pos.x + 30} y={pos.y + NODE_H / 2 + 8}
              fontSize={8} fill="#94a3b8" fontFamily="Kanit, sans-serif"
            >
              {node.system}
            </text>
            {/* Indicateur BCBS */}
            {node.critical_bcbs && (
              <rect x={pos.x + NODE_W - 30} y={pos.y + NODE_H - 14} width={26} height={10} rx={5} fill={T.red} opacity={0.12} />
            )}
            {node.critical_bcbs && (
              <text x={pos.x + NODE_W - 17} y={pos.y + NODE_H - 6} textAnchor="middle" fontSize={7} fill={T.red} fontWeight={700} fontFamily="Kanit">
                BCBS
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ── page ─────────────────────────────────────────────────────────────────────
export default function LineagePage() {
  const { state } = useProjectStore();
  const phase = state.phase;

  const visibleNodes = ALL_NODES.filter(n => n.phase_visible <= phase);
  const visibleLinks = ALL_LINKS.filter(l => l.phase_visible <= phase);

  const documented   = visibleLinks.filter(l => l.status === "documented").length;
  const partial      = visibleLinks.filter(l => l.status === "partial").length;
  const undocumented = visibleLinks.filter(l => l.status === "undocumented").length;
  const bcbsNodes    = visibleNodes.filter(n => n.critical_bcbs).length;
  const coveragePct  = Math.round((documented / visibleLinks.length) * 100) || 0;

  // Nouvelles entités cette phase
  const newNodes = ALL_NODES.filter(n => n.phase_visible === phase);
  const newLinks = ALL_LINKS.filter(l => l.phase_visible === phase);

  // Narration par phase
  const PHASE_NARRATIVE: Record<number, string> = {
    1: "Phase 1 — Les systèmes sources sont identifiés mais le lineage n'est pas encore documenté. Les flux ETL existent de manière informelle. Priorité : cartographier l'existant.",
    2: "Phase 2 — Introduction de dbt et du Data Warehouse Snowflake. Les premières transformations sont documentées. Les flux marché et API sont tracés. Coverage lineage : ~35%.",
    3: "Phase 3 — Déploiement du Data Catalog Collibra. Le stream Kafka est intégré. Les contrôles qualité automatisés alimentent le catalog. Les flux BCBS 239 sont en cours de documentation.",
    4: "Phase 4 — Le MDM Semarchy unifie les données maîtres. Le lineage des 14 données critiques BCBS 239 est tracé de bout en bout. La transmission réglementaire BCE est formalisée.",
    5: "Phase 5 — Lineage complet sur les modèles IA (traçabilité données d'entraînement → modèle → décision). Le data catalog couvre 95% des tables du DWH.",
    6: "Phase 6 — Lineage automatisé et maintenu en continu. Chaque transformation est documentée, testée et versionnée. FrontierBank peut répondre à toute demande réglementaire en < 2h.",
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>

      {/* ── Bandeau ── */}
      <div style={{ background: T.heroGrad, borderRadius: 14, padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(147,197,253,0.9)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10, fontFamily: "'Kanit', sans-serif" }}>
              FrontierBank · Data Lineage · Phase {phase}
            </p>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#f0f4ff", marginBottom: 8, fontFamily: "'Kanit', sans-serif" }}>
              Traçabilité des Données — De la Source au Reporting
            </h2>
            <p style={{ fontSize: 13, color: "rgba(191,219,254,0.85)", fontFamily: "'Kanit', sans-serif" }}>
              {visibleNodes.length} systèmes · {visibleLinks.length} flux · {bcbsNodes} données critiques BCBS 239 · {state.period}
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
            {[
              { v: `${coveragePct}%`, l: "Coverage lineage" },
              { v: `${bcbsNodes}`,   l: "Nœuds BCBS 239"   },
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {[
          { icon: CheckCircle2, iconBg: T.greenSoft,  iconColor: T.green,
            value: `${documented}`, label: "Flux documentés",
            sub: "Lineage tracé, transformation documentée",
            badgeTxt: `${Math.round((documented/visibleLinks.length||1)*100)}%`,
            badgeBg: T.greenSoft, badgeColor: T.green, badgeBorder: T.greenBorder },
          { icon: AlertTriangle, iconBg: T.amberSoft, iconColor: T.amber,
            value: `${partial}`, label: "Flux partiels",
            sub: "Documentation incomplète à finaliser",
            badgeTxt: "À compléter",
            badgeBg: T.amberSoft, badgeColor: T.amber, badgeBorder: T.amberBorder },
          { icon: GitBranch, iconBg: T.redSoft, iconColor: T.red,
            value: `${undocumented}`, label: "Flux non documentés",
            sub: "Traçabilité absente — risque réglementaire",
            badgeTxt: "Critique",
            badgeBg: T.redSoft, badgeColor: T.red, badgeBorder: T.redBorder },
          { icon: Shield, iconBg: T.purpleSoft, iconColor: T.purple,
            value: `${bcbsNodes}`, label: "Données critiques BCBS",
            sub: "Nœuds soumis aux 14 principes BCBS 239",
            badgeTxt: "BCBS 239",
            badgeBg: T.purpleSoft, badgeColor: T.purple, badgeBorder: T.purpleBorder },
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

      {/* ── Narration phase ── */}
      <div style={{ ...card(), padding: 20, background: T.blueSoft, border: `1px solid ${T.blueBorder}` }}>
        <div style={{ display: "flex", gap: 10 }}>
          <Info size={16} color={T.blue} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: T.blue, marginBottom: 4, fontFamily: "'Kanit', sans-serif" }}>
              Situation Phase {phase} — {state.label}
            </p>
            <p style={{ fontSize: 12, color: "#1e3a8a", lineHeight: 1.7, fontFamily: "'Kanit', sans-serif" }}>
              {PHASE_NARRATIVE[phase]}
            </p>
          </div>
        </div>
      </div>

      {/* ── Graphe SVG lineage ── */}
      <div style={card()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.textPrimary, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'Kanit', sans-serif" }}>
              Graphe de Data Lineage — Vue Complète
            </p>
            <p style={{ fontSize: 12, color: T.textMuted, marginTop: 3, fontFamily: "'Kanit', sans-serif" }}>
              Cartographie des flux de données de bout en bout · {visibleNodes.length} systèmes · {visibleLinks.length} flux tracés à la Phase {phase}
            </p>
          </div>
          {/* Légende types */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "flex-end", maxWidth: 400 }}>
            {Object.entries(NODE_TYPE_CFG).map(([type, cfg]) => (
              <div key={type} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: cfg.bg, border: `1px solid ${cfg.border}` }} />
                <span style={{ fontSize: 10, color: T.textMuted, fontFamily: "'Kanit', sans-serif" }}>{cfg.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Légende liens */}
        <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
          {Object.entries(LINK_STATUS_CFG).map(([status, cfg]) => (
            <div key={status} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 28, height: 2, background: cfg.color, borderRadius: 1,
                borderTop: status === "partial" ? "2px dashed" : status === "undocumented" ? "2px dotted" : "2px solid",
                borderColor: cfg.color,
              }} />
              <span style={{ fontSize: 11, color: T.textMuted, fontFamily: "'Kanit', sans-serif" }}>{cfg.label}</span>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 22, height: 10, borderRadius: 3, background: "#fef2f2", border: `1px solid ${T.red}` }} />
            <span style={{ fontSize: 11, color: T.textMuted, fontFamily: "'Kanit', sans-serif" }}>Donnée critique BCBS 239</span>
          </div>
        </div>

        <div style={{ background: "#f8fafc", borderRadius: 10, padding: 12, border: `1px solid ${T.cardBorder}`, overflowX: "auto" }}>
          <LineageCanvas nodes={ALL_NODES} links={ALL_LINKS} phase={phase} />
        </div>

        <div style={{ background: T.amberSoft, border: `1px solid ${T.amberBorder}`, borderRadius: 8, padding: "10px 14px", display: "flex", gap: 8, marginTop: 14 }}>
          <Info size={14} color={T.amber} style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12, color: "#78350f", lineHeight: 1.7, fontFamily: "'Kanit', sans-serif" }}>
            <strong>Lecture :</strong> Le graphe se construit progressivement au fil des phases. Les nœuds <strong>bordés en couleur</strong> sont des données critiques BCBS 239.
            Les flèches <span style={{ color: T.green, fontWeight: 700 }}>vertes continues</span> indiquent un flux documenté,
            les <span style={{ color: T.amber, fontWeight: 700 }}>oranges en tirets</span> un lineage partiel,
            et les <span style={{ color: T.red, fontWeight: 700 }}>rouges en pointillés</span> un flux non documenté — risque réglementaire.
            Le badge <span style={{ background: "#fef2f2", color: T.red, padding: "0 4px", borderRadius: 3, fontWeight: 700 }}>BCBS</span> signale les nœuds soumis aux 14 principes.
          </p>
        </div>
      </div>

      {/* ── Démarche consultant & acteurs ── */}
<div style={card()}>
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
    <div>
      <p style={{ fontSize: 11, fontWeight: 700, color: T.textPrimary, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'Kanit', sans-serif" }}>
        Démarche — Ce qui se passe réellement à la Phase {phase}
      </p>
      <p style={{ fontSize: 12, color: T.textMuted, marginTop: 3, fontFamily: "'Kanit', sans-serif" }}>
        Rôle du consultant Data, actions des équipes internes et livrables produits pour faire progresser le lineage
      </p>
    </div>
    <span style={badge(T.blueSoft, T.blue, T.blueBorder)}>Phase {phase} · {state.label}</span>
  </div>

  {{
    1: (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {[
          {
            who: "Consultant Data",
            color: T.blue, bg: T.blueSoft, border: T.blueBorder,
            icon: FileText,
            actions: [
              "Réalise des entretiens avec chaque direction (Finance, Risques, IT, Conformité) pour cartographier les systèmes existants",
              "Identifie les flux de données informels non documentés — souvent des extractions Excel manuelles",
              "Produit la cartographie initiale des systèmes sources et des flux critiques BCBS 239",
              "Rédige la note de cadrage du programme de Data Lineage",
            ],
            livrable: "Cartographie AS-IS des flux · Note de cadrage · Identification des 14 données critiques BCBS 239",
          },
          {
            who: "Équipes IT / DSI",
            color: T.purple, bg: T.purpleSoft, border: T.purpleBorder,
            icon: Server,
            actions: [
              "Fournissent l'inventaire des systèmes en production (Core Banking, Murex, SAP, Salesforce)",
              "Documentent les flux ETL existants — souvent dans des scripts non maintenus",
              "Identifient les dépendances techniques entre systèmes",
              "Exposent les schémas de données disponibles",
            ],
            livrable: "Inventaire technique · Schémas de tables · Documentation ETL existante",
          },
          {
            who: "Directions Métiers",
            color: T.green, bg: T.greenSoft, border: T.greenBorder,
            icon: Users,
            actions: [
              "Participent aux ateliers d'identification des données critiques pour leur périmètre",
              "Valident quelles données sont utilisées dans les reportings réglementaires",
              "Remontent les problèmes de qualité constatés au quotidien",
              "Identifient les flux manuels (Excel, emails) qui contournent les systèmes officiels",
            ],
            livrable: "Liste des données critiques métier · Flux manuels identifiés · Cas d'usage prioritaires",
          },
        ].map(block => {
          const Icon = block.icon;
          return (
            <div key={block.who} style={{ background: block.bg, border: `1px solid ${block.border}`, borderRadius: 12, padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: block.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={16} color="white" />
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary, margin: 0, fontFamily: "'Kanit', sans-serif" }}>{block.who}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                {block.actions.map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: block.color, marginTop: 6, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: T.textSecondary, lineHeight: 1.6, fontFamily: "'Kanit', sans-serif" }}>{a}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: 8, padding: "10px 12px" }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4, fontFamily: "'Kanit', sans-serif" }}>
                  Livrable
                </p>
                <p style={{ fontSize: 11, color: T.textSecondary, lineHeight: 1.5, margin: 0, fontFamily: "'Kanit', sans-serif" }}>{block.livrable}</p>
              </div>
            </div>
          );
        })}
      </div>
    ),
    2: (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {[
          {
            who: "Consultant Data",
            color: T.blue, bg: T.blueSoft, border: T.blueBorder,
            icon: FileText,
            actions: [
              "Anime des ateliers de définition des transformations dbt avec les Data Engineers",
              "Structure le modèle de données du DWH Snowflake (zones raw, silver, gold)",
              "Définit les conventions de nommage et standards de documentation des transformations",
              "Crée les premiers modèles de lineage dans Collibra en lien avec les transformations dbt",
            ],
            livrable: "Architecture DWH documentée · Standards dbt · Premiers flux lineage dans Collibra",
          },
          {
            who: "Data Engineers / IT",
            color: T.purple, bg: T.purpleSoft, border: T.purpleBorder,
            icon: Server,
            actions: [
              "Développent les premiers modèles dbt qui transforment les données du Data Lake",
              "Mettent en place les pipelines d'ingestion des données marché (Bloomberg via Kafka)",
              "Documentent chaque modèle dbt avec des descriptions, propriétaires et tests",
              "Configurent la génération automatique du lineage via dbt docs",
            ],
            livrable: "Modèles dbt documentés · Pipeline Kafka opérationnel · dbt docs généré",
          },
          {
            who: "Data Owners Métiers",
            color: T.green, bg: T.greenSoft, border: T.greenBorder,
            icon: Users,
            actions: [
              "Valident les définitions des données certifiées dans le DWH (golden layer)",
              "Approuvent les règles de transformation des indicateurs de risque",
              "Participent aux revues de qualité des premières données chargées dans Snowflake",
              "Commencent à utiliser les premiers dashboards Power BI alimentés par le DWH",
            ],
            livrable: "Validation des données certifiées · Règles de transformation approuvées",
          },
        ].map(block => {
          const Icon = block.icon;
          return (
            <div key={block.who} style={{ background: block.bg, border: `1px solid ${block.border}`, borderRadius: 12, padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: block.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={16} color="white" />
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary, margin: 0, fontFamily: "'Kanit', sans-serif" }}>{block.who}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                {block.actions.map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: block.color, marginTop: 6, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: T.textSecondary, lineHeight: 1.6, fontFamily: "'Kanit', sans-serif" }}>{a}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: 8, padding: "10px 12px" }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4, fontFamily: "'Kanit', sans-serif" }}>Livrable</p>
                <p style={{ fontSize: 11, color: T.textSecondary, lineHeight: 1.5, margin: 0, fontFamily: "'Kanit', sans-serif" }}>{block.livrable}</p>
              </div>
            </div>
          );
        })}
      </div>
    ),
    3: (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {[
          {
            who: "Consultant Data",
            color: T.blue, bg: T.blueSoft, border: T.blueBorder,
            icon: FileText,
            actions: [
              "Pilote le déploiement de Collibra — paramètre les workflows de validation des métadonnées",
              "Anime des ateliers avec les Data Stewards pour alimenter le glossaire métier (120 termes)",
              "Définit le processus de certification des données : qui valide, selon quels critères",
              "Crée les tableaux de bord de suivi du coverage lineage pour le Comité de Gouvernance",
            ],
            livrable: "Collibra opérationnel · Glossaire 120 termes · Process de certification · Dashboard coverage",
          },
          {
            who: "Data Stewards",
            color: T.green, bg: T.greenSoft, border: T.greenBorder,
            icon: BookOpen,
            actions: [
              "Alimentent le data catalog avec les définitions métier et les règles de gestion",
              "Documentent les transformations dans dbt en lien avec le glossaire Collibra",
              "Exécutent les premiers contrôles qualité Great Expectations sur les données critiques",
              "Remontent les anomalies de lineage identifiées lors des contrôles qualité",
            ],
            livrable: "Catalog alimenté · Tests qualité déployés · Anomalies de lineage remontées",
          },
          {
            who: "Équipe Conformité",
            color: T.amber, bg: T.amberSoft, border: T.amberBorder,
            icon: Shield,
            actions: [
              "Valide que le lineage tracé couvre bien les 14 données critiques BCBS 239",
              "Identifie les flux réglementaires non encore documentés (Reporting BCBS)",
              "Prépare les premières réponses aux demandes de l'inspection réglementaire",
              "Définit les exigences de traçabilité pour le reporting COREP/FINREP",
            ],
            livrable: "Couverture BCBS 239 validée · Gaps réglementaires identifiés · Plan de remédiation",
          },
        ].map(block => {
          const Icon = block.icon;
          return (
            <div key={block.who} style={{ background: block.bg, border: `1px solid ${block.border}`, borderRadius: 12, padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: block.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={16} color="white" />
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary, margin: 0, fontFamily: "'Kanit', sans-serif" }}>{block.who}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                {block.actions.map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: block.color, marginTop: 6, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: T.textSecondary, lineHeight: 1.6, fontFamily: "'Kanit', sans-serif" }}>{a}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: 8, padding: "10px 12px" }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4, fontFamily: "'Kanit', sans-serif" }}>Livrable</p>
                <p style={{ fontSize: 11, color: T.textSecondary, lineHeight: 1.5, margin: 0, fontFamily: "'Kanit', sans-serif" }}>{block.livrable}</p>
              </div>
            </div>
          );
        })}
      </div>
    ),
    4: (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {[
          {
            who: "Consultant Data",
            color: T.blue, bg: T.blueSoft, border: T.blueBorder,
            icon: FileText,
            actions: [
              "Pilote le chantier MDM Semarchy — anime les ateliers de définition du golden record client",
              "Coordonne la réconciliation des données entre Core Banking, CRM et Risques",
              "Trace le lineage des 14 données critiques BCBS 239 de bout en bout (source → régulateur)",
              "Prépare la documentation lineage pour l'inspection de la BCE",
            ],
            livrable: "Lineage BCBS 239 complet · Golden record client déployé · Dossier inspection BCE",
          },
          {
            who: "Data Engineers / IT",
            color: T.purple, bg: T.purpleSoft, border: T.purpleBorder,
            icon: Server,
            actions: [
              "Développent les pipelines MDM — déduplication, matching, golden record automatisé",
              "Implémentent OpenLineage pour la capture automatique du lineage technique",
              "Construisent les pipelines de transmission BCE (format XBRL/COREP)",
              "Automatisent la mise à jour du lineage dans Collibra via API",
            ],
            livrable: "MDM en production · OpenLineage déployé · Pipeline BCE opérationnel",
          },
          {
            who: "Direction des Risques & Conformité",
            color: T.amber, bg: T.amberSoft, border: T.amberBorder,
            icon: Shield,
            actions: [
              "Valident le lineage des indicateurs LCR, NSFR, VaR, ratio de levier",
              "Testent la capacité à reconstituer un indicateur de risque de la source à l'agrégat",
              "Signent le rapport de conformité BCBS 239 soumis à la BCE",
              "Forment les équipes à l'utilisation du lineage pour les demandes réglementaires",
            ],
            livrable: "Rapport BCBS 239 signé · Validation des indicateurs de risque · Formation équipes",
          },
        ].map(block => {
          const Icon = block.icon;
          return (
            <div key={block.who} style={{ background: block.bg, border: `1px solid ${block.border}`, borderRadius: 12, padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: block.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={16} color="white" />
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary, margin: 0, fontFamily: "'Kanit', sans-serif" }}>{block.who}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                {block.actions.map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: block.color, marginTop: 6, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: T.textSecondary, lineHeight: 1.6, fontFamily: "'Kanit', sans-serif" }}>{a}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: 8, padding: "10px 12px" }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4, fontFamily: "'Kanit', sans-serif" }}>Livrable</p>
                <p style={{ fontSize: 11, color: T.textSecondary, lineHeight: 1.5, margin: 0, fontFamily: "'Kanit', sans-serif" }}>{block.livrable}</p>
              </div>
            </div>
          );
        })}
      </div>
    ),
    5: (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {[
          {
            who: "Consultant Data",
            color: T.blue, bg: T.blueSoft, border: T.blueBorder,
            icon: FileText,
            actions: [
              "Étend le lineage aux modèles IA — trace les données d'entraînement jusqu'à la décision",
              "Définit le framework de traçabilité des modèles EU AI Act (input → modèle → output → impact)",
              "Anime les ateliers de validation du lineage IA avec les Data Scientists et la Conformité",
              "Produit le rapport de couverture lineage pour le Comex (94% atteint)",
            ],
            livrable: "Lineage IA complet · Framework EU AI Act · Rapport Comex couverture 94%",
          },
          {
            who: "Data Scientists / MLOps",
            color: T.purple, bg: T.purpleSoft, border: T.purpleBorder,
            icon: Brain,
            actions: [
              "Intègrent MLflow pour tracer les expériences, datasets et versions de modèles",
              "Documentent les features utilisées dans chaque modèle et leur source dans le DWH",
              "Mettent en place le monitoring du drift avec alertes automatiques",
              "Publient le lineage des modèles dans Collibra via API",
            ],
            livrable: "MLflow opérationnel · Features documentées · Monitoring drift actif · Lineage IA dans Collibra",
          },
          {
            who: "Conformité & Data Owners",
            color: T.amber, bg: T.amberSoft, border: T.amberBorder,
            icon: Shield,
            actions: [
              "Valident que chaque modèle EU AI Act Haut Risque a un lineage de données complet",
              "Vérifient que les données d'entraînement respectent les exigences RGPD",
              "Approuvent le registre des modèles IA et leur classification EU AI Act",
              "Préparent la documentation pour l'audit de conformité EU AI Act",
            ],
            livrable: "Registre IA validé · Conformité RGPD données d'entraînement · Dossier audit EU AI Act",
          },
        ].map(block => {
          const Icon = block.icon;
          return (
            <div key={block.who} style={{ background: block.bg, border: `1px solid ${block.border}`, borderRadius: 12, padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: block.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={16} color="white" />
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary, margin: 0, fontFamily: "'Kanit', sans-serif" }}>{block.who}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                {block.actions.map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: block.color, marginTop: 6, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: T.textSecondary, lineHeight: 1.6, fontFamily: "'Kanit', sans-serif" }}>{a}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: 8, padding: "10px 12px" }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4, fontFamily: "'Kanit', sans-serif" }}>Livrable</p>
                <p style={{ fontSize: 11, color: T.textSecondary, lineHeight: 1.5, margin: 0, fontFamily: "'Kanit', sans-serif" }}>{block.livrable}</p>
              </div>
            </div>
          );
        })}
      </div>
    ),
    6: (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {[
          {
            who: "Consultant Data",
            color: T.blue, bg: T.blueSoft, border: T.blueBorder,
            icon: FileText,
            actions: [
              "Livre le bilan final du programme lineage — couverture 100%, processus pérennisés",
              "Forme les équipes internes à la maintenance autonome du lineage dans Collibra",
              "Rédige le guide de gouvernance du lineage pour assurer la continuité sans le cabinet",
              "Présente au Comex les résultats : FrontierBank répond à toute demande BCE en < 2h",
            ],
            livrable: "Bilan programme · Guide de gouvernance lineage · Présentation Comex résultats finaux",
          },
          {
            who: "Data Stewards (internalisé)",
            color: T.green, bg: T.greenSoft, border: T.greenBorder,
            icon: BookOpen,
            actions: [
              "Maintiennent le lineage de manière autonome — plus de dépendance au cabinet",
              "Mettent à jour le catalog à chaque nouvelle transformation ou système",
              "Animent la communauté lineage interne (45 Data Stewards formés)",
              "Produisent les reportings mensuels de couverture lineage pour le CDO",
            ],
            livrable: "Lineage maintenu en autonomie · Communauté 45 stewards · Reporting CDO mensuel",
          },
          {
            who: "CDO & Direction",
            color: T.amber, bg: T.amberSoft, border: T.amberBorder,
            icon: Shield,
            actions: [
              "Valident la clôture du programme de Data Lineage avec le cabinet de conseil",
              "Utilisent le lineage comme outil de pilotage stratégique (impact des décisions sur les données)",
              "Présentent les résultats à la BCE lors de l'inspection annuelle — zéro finding sur le lineage",
              "Intègrent le lineage dans le processus d'onboarding de tout nouveau système SI",
            ],
            livrable: "Clôture programme · Zéro finding BCE · Lineage intégré au processus SI",
          },
        ].map(block => {
          const Icon = block.icon;
          return (
            <div key={block.who} style={{ background: block.bg, border: `1px solid ${block.border}`, borderRadius: 12, padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: block.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={16} color="white" />
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary, margin: 0, fontFamily: "'Kanit', sans-serif" }}>{block.who}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                {block.actions.map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: block.color, marginTop: 6, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: T.textSecondary, lineHeight: 1.6, fontFamily: "'Kanit', sans-serif" }}>{a}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: 8, padding: "10px 12px" }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4, fontFamily: "'Kanit', sans-serif" }}>Livrable</p>
                <p style={{ fontSize: 11, color: T.textSecondary, lineHeight: 1.5, margin: 0, fontFamily: "'Kanit', sans-serif" }}>{block.livrable}</p>
              </div>
            </div>
          );
        })}
      </div>
    ),
  }[phase] as React.ReactNode}

  
</div>

      {/* ── Nouveautés de la phase ── */}
      {(newNodes.length > 0 || newLinks.length > 0) && (
        <div style={card()}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: T.textPrimary, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'Kanit', sans-serif" }}>
                Nouveautés Phase {phase} — {state.label}
              </p>
              <p style={{ fontSize: 12, color: T.textMuted, marginTop: 3, fontFamily: "'Kanit', sans-serif" }}>
                Systèmes et flux introduits à cette phase du programme
              </p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {newNodes.length > 0 && <span style={badge(T.blueSoft, T.blue, T.blueBorder)}>{newNodes.length} nouveaux systèmes</span>}
              {newLinks.length > 0 && <span style={badge(T.purpleSoft, T.purple, T.purpleBorder)}>{newLinks.length} nouveaux flux</span>}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

            {/* Nouveaux nœuds */}
            {newNodes.length > 0 && (
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: T.textSecondary, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10, fontFamily: "'Kanit', sans-serif" }}>
                  Nouveaux systèmes
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {newNodes.map(node => {
                    const cfg = NODE_TYPE_CFG[node.type];
                    return (
                      <div key={node.id} style={{ display: "flex", gap: 12, padding: "12px 14px", borderRadius: 10, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                        <div style={{ width: 36, height: 36, borderRadius: 9, background: cfg.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <cfg.icon size={16} color="white" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                            <p style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary, margin: 0, fontFamily: "'Kanit', sans-serif" }}>
                              {node.label}
                            </p>
                            <span style={badge(cfg.bg, cfg.color, cfg.border)}>{cfg.label}</span>
                            {node.critical_bcbs && <span style={badge(T.redSoft, T.red, T.redBorder)}>BCBS 239</span>}
                          </div>
                          <p style={{ fontSize: 11, color: T.textMuted, margin: 0, fontFamily: "'Kanit', sans-serif" }}>
                            {node.system} · Owner : {node.owner}
                          </p>
                          <p style={{ fontSize: 12, color: T.textSecondary, margin: "4px 0 0", fontFamily: "'Kanit', sans-serif", lineHeight: 1.5 }}>
                            {node.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Nouveaux liens */}
            {newLinks.length > 0 && (
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: T.textSecondary, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10, fontFamily: "'Kanit', sans-serif" }}>
                  Nouveaux flux tracés
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {newLinks.map((link, i) => {
                    const sCfg   = LINK_STATUS_CFG[link.status];
                    const fromNode = ALL_NODES.find(n => n.id === link.from);
                    const toNode   = ALL_NODES.find(n => n.id === link.to);
                    return (
                      <div key={i} style={{ padding: "12px 14px", borderRadius: 10, background: sCfg.bg, border: `1px solid ${sCfg.border}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: T.textPrimary, fontFamily: "'Kanit', sans-serif" }}>
                            {fromNode?.label ?? link.from}
                          </span>
                          <ArrowRight size={12} color={sCfg.color} />
                          <span style={{ fontSize: 12, fontWeight: 700, color: T.textPrimary, fontFamily: "'Kanit', sans-serif" }}>
                            {toNode?.label ?? link.to}
                          </span>
                          <span style={badge(sCfg.bg, sCfg.color, sCfg.border)}>{sCfg.label}</span>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                          {[
                            { l: "Volume",    v: link.volume    },
                            { l: "Fréquence", v: link.frequency },
                            { l: "Transform", v: link.transformation ?? "—" },
                          ].map(row => (
                            <div key={row.l}>
                              <p style={{ fontSize: 10, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", margin: 0, fontFamily: "'Kanit', sans-serif" }}>
                                {row.l}
                              </p>
                              <p style={{ fontSize: 12, color: T.textSecondary, margin: 0, fontFamily: "'Kanit', sans-serif" }}>
                                {row.v}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Catalogue des systèmes ── */}
      <div style={card()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.textPrimary, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'Kanit', sans-serif" }}>
              Catalogue des Systèmes — Phase {phase}
            </p>
            <p style={{ fontSize: 12, color: T.textMuted, marginTop: 3, fontFamily: "'Kanit', sans-serif" }}>
              Détail de chaque système visible à cette phase — type, propriétaire, criticité réglementaire
            </p>
          </div>
          <span style={badge(T.slateSoft, T.slate, T.slateBorder)}>{visibleNodes.length} systèmes</span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 6px", fontFamily: "'Kanit', sans-serif" }}>
            <thead>
              <tr>
                {["Système", "Type", "Technologie", "Propriétaire", "Phase intro", "BCBS 239", "Description"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
  {visibleNodes.map(node => {
    const cfg   = NODE_TYPE_CFG[node.type];
    const isNew = node.phase_visible === phase;
    const bg    = isNew ? T.blueSoft : T.cardBg;
    const bdr   = isNew ? T.blueBorder : T.cardBorder;
    const cellStyle = (extra?: React.CSSProperties): React.CSSProperties => ({
      padding: "10px 12px", background: bg,
      borderTop: `1px solid ${bdr}`,
      borderBottom: `1px solid ${bdr}`,
      borderLeft: "none",
      borderRight: "none",
      ...extra,
    });
    return (
      <tr key={node.id}>
        <td style={{ ...cellStyle({ borderLeft: `1px solid ${bdr}`, borderRadius: "10px 0 0 10px" }), whiteSpace: "nowrap" as const }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary }}>{node.label}</span>
            {isNew && <span style={badge(T.blueSoft, T.blue, T.blueBorder)}>Nouveau</span>}
          </div>
        </td>
        <td style={cellStyle()}>
          <span style={badge(cfg.bg, cfg.color, cfg.border)}>{cfg.label}</span>
        </td>
        <td style={{ ...cellStyle(), whiteSpace: "nowrap" as const }}>
          <span style={{ fontSize: 12, color: T.textSecondary }}>{node.system}</span>
        </td>
        <td style={{ ...cellStyle(), whiteSpace: "nowrap" as const }}>
          <span style={{ fontSize: 12, color: T.textSecondary }}>{node.owner}</span>
        </td>
        <td style={{ ...cellStyle(), textAlign: "center" as const }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: isNew ? T.blue : T.textMuted }}>P{node.phase_visible}</span>
        </td>
        <td style={{ ...cellStyle(), textAlign: "center" as const }}>
          {node.critical_bcbs
            ? <CheckCircle2 size={14} color={T.green} />
            : <span style={{ fontSize: 11, color: T.textMuted }}>—</span>
          }
        </td>
        <td style={{ ...cellStyle({ borderRight: `1px solid ${bdr}`, borderRadius: "0 10px 10px 0" }) }}>
          <span style={{ fontSize: 11, color: T.textSecondary, lineHeight: 1.5 }}>{node.desc}</span>
        </td>
      </tr>
    );
  })}
</tbody>
          </table>
        </div>
      </div>

      {/* ── Coverage progression ── */}
      <div style={card()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.textPrimary, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'Kanit', sans-serif" }}>
              Progression du Coverage Lineage par Phase
            </p>
            <p style={{ fontSize: 12, color: T.textMuted, marginTop: 3, fontFamily: "'Kanit', sans-serif" }}>
              Évolution du taux de documentation des flux de données — objectif 100% à Phase 6
            </p>
          </div>
          <span style={badge(
            coveragePct >= 80 ? T.greenSoft : coveragePct >= 50 ? T.amberSoft : T.redSoft,
            coveragePct >= 80 ? T.green : coveragePct >= 50 ? T.amber : T.red,
            coveragePct >= 80 ? T.greenBorder : coveragePct >= 50 ? T.amberBorder : T.redBorder,
          )}>
            {coveragePct}% documenté
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { ph: 1, label: "Diagnostic & Cadrage",    pct: 15,  nodes: 5,  links: 4,  desc: "Identification des sources — aucun flux documenté formellement" },
            { ph: 2, label: "Framework Gouvernance",    pct: 38,  nodes: 10, links: 11, desc: "Introduction dbt + DWH Snowflake — premiers flux documentés" },
            { ph: 3, label: "Data Catalog & Qualité",   pct: 58,  nodes: 15, links: 17, desc: "Déploiement Collibra — les flux critiques BCBS 239 sont tracés" },
            { ph: 4, label: "Data Lineage & MDM",       pct: 82,  nodes: 19, links: 21, desc: "MDM + transmission BCE — lineage BCBS 239 complet" },
            { ph: 5, label: "IA Governance",            pct: 94,  nodes: 20, links: 21, desc: "Lineage modèles IA — traçabilité données → modèle → décision" },
            { ph: 6, label: "Acculturation & Scale",    pct: 100, nodes: 20, links: 21, desc: "Lineage automatisé, versionné et maintenu en continu" },
          ].map(row => (
            <div key={row.ph} style={{
              display: "flex", alignItems: "center", gap: 16, padding: "12px 16px",
              borderRadius: 10,
              background: row.ph === phase ? T.blueSoft : row.ph < phase ? T.greenSoft : T.cardBg,
              border: `1px solid ${row.ph === phase ? T.blueBorder : row.ph < phase ? T.greenBorder : T.cardBorder}`,
              transition: "all 0.3s",
            }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                background: row.ph === phase ? T.blue : row.ph < phase ? T.green : T.slateSoft,
                border: `2px solid ${row.ph === phase ? T.blue : row.ph < phase ? T.green : T.slateBorder}`,
              }}>
                {row.ph < phase
                  ? <CheckCircle2 size={14} color="white" />
                  : <span style={{ fontSize: 11, fontWeight: 800, color: row.ph === phase ? "white" : T.textMuted, fontFamily: "'Kanit', sans-serif" }}>{row.ph}</span>
                }
              </div>
              <div style={{ minWidth: 180, flexShrink: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: T.textPrimary, margin: 0, fontFamily: "'Kanit', sans-serif" }}>{row.label}</p>
                <p style={{ fontSize: 11, color: T.textMuted, margin: 0, fontFamily: "'Kanit', sans-serif" }}>
                  {row.nodes} systèmes · {row.links} flux
                </p>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ height: 8, borderRadius: 99, background: T.slateSoft, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 99,
                    width: `${row.ph <= phase ? row.pct : 0}%`,
                    background: row.ph === phase ? T.blue : row.ph < phase ? T.green : T.slate,
                    transition: "width 0.8s ease",
                  }} />
                </div>
              </div>
              <span style={{ fontSize: 13, fontWeight: 800, color: row.ph === phase ? T.blue : row.ph < phase ? T.green : T.textMuted, fontFamily: "'Kanit', sans-serif", minWidth: 40, textAlign: "right" }}>
                {row.ph <= phase ? `${row.pct}%` : "—"}
              </span>
              <p style={{ fontSize: 11, color: T.textSecondary, fontFamily: "'Kanit', sans-serif", minWidth: 280, display: row.ph <= phase ? "block" : "none" }}>
                {row.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
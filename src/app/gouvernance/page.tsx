"use client";

import { useProjectStore } from "@/lib/useProjectState";
import { T, badge, card } from "@/lib/theme";
import { RACI_DATA } from "@/lib/data";
import {
  CheckCircle2, AlertTriangle, Clock, Users, FileText,
  Shield, BookOpen, ArrowRight, Info, ChevronRight
} from "lucide-react";

// ── config rôles ──────────────────────────────────────────────────────────────
const ROLES_CONFIG = [
  {
    id: "cdo",
    title: "Chief Data Officer",
    short: "CDO",
    color: T.blue,
    bg: T.blueSoft,
    border: T.blueBorder,
    icon: Shield,
    desc: "Responsable de la stratégie data et de la gouvernance au niveau groupe. Préside le Comité de Gouvernance Data.",
    responsabilites: [
      "Définir et piloter la stratégie data de FrontierBank",
      "Présider le Comité mensuel de Gouvernance Data",
      "Valider les politiques et standards de données",
      "Arbitrer les conflits de gouvernance inter-directions",
      "Rendre compte au Comex de l'avancement du programme",
    ],
    phase_activation: 2,
  },
  {
    id: "owner",
    title: "Data Owner",
    short: "DO",
    color: T.indigo,
    bg: T.indigoSoft,
    border: T.indigoBorder,
    icon: Users,
    desc: "Responsable métier d'un domaine de données. Valide la définition, la qualité et les usages des données de son périmètre.",
    responsabilites: [
      "Valider les définitions des données critiques du domaine",
      "Approuver les règles de qualité et les SLA data",
      "Décider des priorités de remédiation qualité",
      "Nommer et encadrer les Data Stewards du domaine",
      "Représenter le domaine au Comité de Gouvernance",
    ],
    phase_activation: 2,
    instances: ["Finance", "Risques", "Clients", "Conformité", "Opérations", "Trésorerie"],
  },
  {
    id: "steward",
    title: "Data Steward",
    short: "DS",
    color: T.green,
    bg: T.greenSoft,
    border: T.greenBorder,
    icon: BookOpen,
    desc: "Expert opérationnel de la donnée. Assure la qualité quotidienne, alimente le data catalog et fait le lien entre métier et IT.",
    responsabilites: [
      "Alimenter et maintenir le data catalog (glossaire, métadonnées)",
      "Contrôler la qualité des données au quotidien",
      "Documenter les règles de gestion et transformations",
      "Identifier et remonter les incidents qualité",
      "Former les utilisateurs aux bonnes pratiques data",
    ],
    phase_activation: 2,
    instances: ["Finance", "Risques", "Clients", "Conformité", "Opérations", "Trésorerie"],
  },
  {
    id: "it",
    title: "IT / DSI",
    short: "IT",
    color: T.purple,
    bg: T.purpleSoft,
    border: T.purpleBorder,
    icon: FileText,
    desc: "Implémente les solutions techniques de gouvernance (data catalog, pipelines, MDM) et garantit la sécurité des données.",
    responsabilites: [
      "Déployer et maintenir les outils de gouvernance (Collibra, dbt)",
      "Implémenter les pipelines et contrôles qualité automatisés",
      "Assurer la sécurité et les droits d'accès aux données",
      "Maintenir le data lineage technique",
      "Contribuer à l'architecture data du groupe",
    ],
    phase_activation: 1,
  },
  {
    id: "conformite",
    title: "Conformité",
    short: "CONF",
    color: T.amber,
    bg: T.amberSoft,
    border: T.amberBorder,
    icon: AlertTriangle,
    desc: "Veille à la conformité réglementaire des données (BCBS 239, RGPD, EU AI Act) et pilote les programmes d'audit data.",
    responsabilites: [
      "Piloter la conformité BCBS 239 et le suivi des principes",
      "Assurer la conformité RGPD sur les données personnelles",
      "Réaliser les audits de qualité et gouvernance data",
      "Valider les modèles IA selon l'EU AI Act",
      "Produire les reportings réglementaires",
    ],
    phase_activation: 1,
  },
  {
    id: "metiers",
    title: "Métiers",
    short: "MÉT",
    color: T.slate,
    bg: T.slateSoft,
    border: T.slateBorder,
    icon: Users,
    desc: "Utilisateurs et producteurs de données. Participent aux ateliers de gouvernance et remontent les besoins data.",
    responsabilites: [
      "Produire des données de qualité dans les processus métier",
      "Participer aux ateliers de définition des données",
      "Remonter les incidents et besoins qualité data",
      "Respecter les politiques et standards de données",
      "Contribuer à la culture data de l'organisation",
    ],
    phase_activation: 3,
  },
];

// ── politiques data ───────────────────────────────────────────────────────────
const POLITIQUES = [
  {
    id: "p1", titre: "Politique de Gouvernance des Données",
    version: "v2.1", date: "Mars 2026", statut: "active" as const,
    phase_creation: 2,
    desc: "Cadre général de gouvernance définissant les principes, rôles, responsabilités et instances de décision.",
    sections: ["Principes de gouvernance", "Organisation et rôles", "Instances de décision", "Processus de révision"],
    icon: Shield,
  },
  {
    id: "p2", titre: "Charte de Qualité des Données",
    version: "v1.3", date: "Avr 2026", statut: "active" as const,
    phase_creation: 3,
    desc: "Définit les dimensions qualité, les seuils d'acceptabilité, les KPIs et les processus de remédiation.",
    sections: ["Dimensions qualité (4)", "Seuils et SLA", "KPIs et reporting", "Plan de remédiation"],
    icon: CheckCircle2,
  },
  {
    id: "p3", titre: "Standard de Classification des Données",
    version: "v1.0", date: "Fév 2026", statut: "active" as const,
    phase_creation: 2,
    desc: "Taxonomy de classification des données selon leur criticité, sensibilité et réglementation applicable.",
    sections: ["Niveaux de classification (4)", "Données critiques BCBS 239", "Données personnelles RGPD", "Données confidentielles"],
    icon: BookOpen,
  },
  {
    id: "p4", titre: "Politique de Gestion des Données Personnelles",
    version: "v2.0", date: "Jan 2026", statut: "active" as const,
    phase_creation: 1,
    desc: "Cadre RGPD définissant les règles de collecte, traitement, conservation et suppression des données personnelles.",
    sections: ["Bases légales", "Droits des personnes", "Durées de conservation", "Registre des traitements"],
    icon: Shield,
  },
  {
    id: "p5", titre: "Framework de Gouvernance des Modèles IA",
    version: "v1.0", date: "Mai 2026", statut: "draft" as const,
    phase_creation: 5,
    desc: "Définit le cycle de vie des modèles IA, la classification EU AI Act, et le process de validation avant déploiement.",
    sections: ["Classification EU AI Act", "Process de validation", "Registre des modèles", "Monitoring en production"],
    icon: AlertTriangle,
  },
  {
    id: "p6", titre: "Politique d'Accès et Sécurité des Données",
    version: "v1.5", date: "Mars 2026", statut: "active" as const,
    phase_creation: 2,
    desc: "Règles de contrôle d'accès (RBAC), chiffrement, traçabilité des accès et gestion des habilitations.",
    sections: ["Contrôle d'accès RBAC", "Chiffrement", "Audit trail", "Gestion des habilitations"],
    icon: Shield,
  },
];

// ── comité de gouvernance ─────────────────────────────────────────────────────
const COMITE_AGENDA = [
  { ordre: 1, sujet: "Revue des KPIs Data Quality du mois",         duree: "15 min", responsable: "CDO",  recurrent: true  },
  { ordre: 2, sujet: "Point d'avancement programme BCBS 239",       duree: "20 min", responsable: "CONF", recurrent: true  },
  { ordre: 3, sujet: "Arbitrage incidents qualité en cours",         duree: "15 min", responsable: "DO",   recurrent: false },
  { ordre: 4, sujet: "Validation nouvelles définitions Data Catalog",duree: "20 min", responsable: "DS",   recurrent: false },
  { ordre: 5, sujet: "Point programme Data Lineage Phase 4",         duree: "15 min", responsable: "IT",   recurrent: false },
  { ordre: 6, sujet: "Décisions et actions à suivre",                duree: "15 min", responsable: "CDO",  recurrent: true  },
];

// ── RACI config ───────────────────────────────────────────────────────────────
const RACI_COLORS: Record<string, { bg: string; color: string; border: string; label: string }> = {
  R: { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe", label: "Responsable" },
  A: { bg: "#f0fdf4", color: "#059669", border: "#a7f3d0", label: "Approbateur" },
  C: { bg: "#fffbeb", color: "#d97706", border: "#fde68a", label: "Consulté"    },
  I: { bg: "#f8fafc", color: "#64748b", border: "#e2e8f0", label: "Informé"     },
};

// ── page ─────────────────────────────────────────────────────────────────────
export default function GouvernancePage() {
  const { state } = useProjectStore();

  const isActive = (phase: number) => state.phase >= phase;

  const politiquesActives = POLITIQUES.filter(p => state.phase >= p.phase_creation);
  const politiquesDraft   = POLITIQUES.filter(p => state.phase < p.phase_creation);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>

      {/* ── Bandeau ── */}
      <div style={{ background: T.heroGrad, borderRadius: 14, padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(147,197,253,0.9)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10, fontFamily: "'Kanit', sans-serif" }}>
              FrontierBank · Framework Gouvernance · Phase {state.phase}
            </p>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#f0f4ff", marginBottom: 8, fontFamily: "'Kanit', sans-serif" }}>
              Organisation & Gouvernance des Données
            </h2>
            <p style={{ fontSize: 13, color: "rgba(191,219,254,0.85)", fontFamily: "'Kanit', sans-serif" }}>
              Rôles · Responsabilités · Matrice RACI · Politiques · Comité de Gouvernance · {state.period}
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
            {[
              { v: `${ROLES_CONFIG.filter(r => isActive(r.phase_activation)).length}/6`, l: "Rôles activés" },
              { v: `${politiquesActives.length}/${POLITIQUES.length}`, l: "Politiques actives" },
            ].map(x => (
              <div key={x.l} style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "16px 22px", textAlign: "center" }}>
                <p style={{ fontSize: 26, fontWeight: 800, color: "#f0f4ff", marginBottom: 2, fontFamily: "'Kanit', sans-serif" }}>{x.v}</p>
                <p style={{ fontSize: 11, color: "rgba(147,197,253,0.8)", fontFamily: "'Kanit', sans-serif" }}>{x.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Organigramme rôles ── */}
      <div style={card()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.textPrimary, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'Kanit', sans-serif" }}>
              Organisation Data — Rôles & Responsabilités
            </p>
            <p style={{ fontSize: 12, color: T.textMuted, marginTop: 3, fontFamily: "'Kanit', sans-serif" }}>
              Structure de gouvernance déployée progressivement au fil des phases
            </p>
          </div>
          <span style={badge(T.blueSoft, T.blue, T.blueBorder)}>
            {ROLES_CONFIG.filter(r => isActive(r.phase_activation)).length} rôles actifs
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {ROLES_CONFIG.map(role => {
            const active = isActive(role.phase_activation);
            const Icon = role.icon;
            return (
              <div key={role.id} style={{
                border: `1px solid ${active ? role.border : T.cardBorder}`,
                borderRadius: 12, padding: 20,
                background: active ? role.bg : T.cardBg,
                opacity: active ? 1 : 0.5,
                transition: "all 0.4s",
              }}>
                {/* Header rôle */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: active ? role.color : T.slateSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={16} color={active ? "white" : T.textMuted} />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: active ? T.textPrimary : T.textMuted, margin: 0, fontFamily: "'Kanit', sans-serif" }}>
                      {role.title}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                      <span style={badge(
                        active ? role.bg : T.slateSoft,
                        active ? role.color : T.slate,
                        active ? role.border : T.slateBorder,
                      )}>{role.short}</span>
                      <span style={badge(
                        active ? T.greenSoft : T.slateSoft,
                        active ? T.green : T.slate,
                        active ? T.greenBorder : T.slateBorder,
                      )}>
                        {active ? `Actif · Ph.${role.phase_activation}` : `Actif Ph.${role.phase_activation}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p style={{ fontSize: 12, color: T.textSecondary, lineHeight: 1.6, marginBottom: 12, fontFamily: "'Kanit', sans-serif" }}>
                  {role.desc}
                </p>

                {/* Instances */}
                {"instances" in role && role.instances && active && (
                  <div style={{ marginBottom: 10 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6, fontFamily: "'Kanit', sans-serif" }}>
                      Périmètres ({role.instances.length})
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {role.instances.map(inst => (
                        <span key={inst} style={badge(T.cardBg, T.textSecondary, T.cardBorder)}>{inst}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Responsabilités */}
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6, fontFamily: "'Kanit', sans-serif" }}>
                    Responsabilités clés
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {role.responsabilites.slice(0, 3).map((r, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                        <ChevronRight size={11} color={active ? role.color : T.textMuted} style={{ flexShrink: 0, marginTop: 2 }} />
                        <span style={{ fontSize: 11, color: active ? T.textSecondary : T.textMuted, lineHeight: 1.5, fontFamily: "'Kanit', sans-serif" }}>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Matrice RACI ── */}
      <div style={card()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.textPrimary, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'Kanit', sans-serif" }}>
              Matrice RACI — Gouvernance des Données
            </p>
            <p style={{ fontSize: 12, color: T.textMuted, marginTop: 3, fontFamily: "'Kanit', sans-serif" }}>
              Répartition des responsabilités sur les activités clés de gouvernance
            </p>
          </div>
          {/* Légende */}
          <div style={{ display: "flex", gap: 6 }}>
            {Object.entries(RACI_COLORS).map(([k, v]) => (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ ...badge(v.bg, v.color, v.border), minWidth: 22, justifyContent: "center" }}>{k}</span>
                <span style={{ fontSize: 11, color: T.textMuted, fontFamily: "'Kanit', sans-serif" }}>{v.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontFamily: "'Kanit', sans-serif" }}>
            {/* Header colonnes */}
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "10px 16px", fontSize: 12, fontWeight: 700, color: T.textPrimary, background: "#f4f6fb", borderRadius: "10px 0 0 0", border: `1px solid ${T.cardBorder}`, borderRight: "none", minWidth: 280 }}>
                  Activité
                </th>
                {RACI_DATA.roles.map((role, i) => (
                  <th key={role} style={{
                    textAlign: "center", padding: "10px 8px",
                    fontSize: 11, fontWeight: 700, color: ROLES_CONFIG[i]?.color ?? T.textPrimary,
                    background: "#f4f6fb",
                    border: `1px solid ${T.cardBorder}`,
                    borderLeft: "none", borderRight: i === RACI_DATA.roles.length - 1 ? `1px solid ${T.cardBorder}` : "none",
                    borderRadius: i === RACI_DATA.roles.length - 1 ? "0 10px 0 0" : 0,
                    whiteSpace: "nowrap", minWidth: 90,
                  }}>
                    {role}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RACI_DATA.activities.map((activity, rowIdx) => (
                <tr key={rowIdx}>
                  <td style={{
                    padding: "10px 16px", fontSize: 12, fontWeight: 500, color: T.textPrimary,
                    background: rowIdx % 2 === 0 ? T.cardBg : "#f9fafd",
                    border: `1px solid ${T.cardBorder}`, borderTop: "none", borderRight: "none",
                    borderRadius: rowIdx === RACI_DATA.activities.length - 1 ? "0 0 0 10px" : 0,
                  }}>
                    {activity.name}
                  </td>
                  {activity.raci.map((r, colIdx) => {
                    const cfg = RACI_COLORS[r] ?? RACI_COLORS["I"];
                    const isLast = colIdx === activity.raci.length - 1;
                    const isLastRow = rowIdx === RACI_DATA.activities.length - 1;
                    return (
                      <td key={colIdx} style={{
                        textAlign: "center", padding: "10px 8px",
                        background: rowIdx % 2 === 0 ? T.cardBg : "#f9fafd",
                        border: `1px solid ${T.cardBorder}`, borderTop: "none",
                        borderLeft: "none", borderRight: isLast ? `1px solid ${T.cardBorder}` : "none",
                        borderRadius: isLast && isLastRow ? "0 0 10px 0" : 0,
                      }}>
                        <span style={{
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          width: 28, height: 28, borderRadius: 8,
                          background: cfg.bg, color: cfg.color,
                          border: `1px solid ${cfg.border}`,
                          fontSize: 12, fontWeight: 800,
                          fontFamily: "'Kanit', sans-serif",
                        }}>
                          {r}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ background: T.blueSoft, border: `1px solid ${T.blueBorder}`, borderRadius: 8, padding: "10px 14px", display: "flex", gap: 8, marginTop: 14 }}>
          <Info size={14} color={T.blue} style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12, color: "#1e3a8a", lineHeight: 1.7, fontFamily: "'Kanit', sans-serif" }}>
            <strong>Lecture :</strong> R = Responsable (exécute), A = Approbateur (valide, 1 seul par activité), C = Consulté (contribue), I = Informé (reçoit l'information).
            Chaque activité doit avoir exactement un <strong>A</strong> pour éviter les conflits de responsabilité.
          </p>
        </div>
      </div>

      {/* ── Politiques data ── */}
      <div style={card()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.textPrimary, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'Kanit', sans-serif" }}>
              Politiques & Standards de Données
            </p>
            <p style={{ fontSize: 12, color: T.textMuted, marginTop: 3, fontFamily: "'Kanit', sans-serif" }}>
              Corpus documentaire du programme — {politiquesActives.length} documents actifs · {politiquesDraft.length} en préparation
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={badge(T.greenSoft, T.green, T.greenBorder)}>{politiquesActives.length} actives</span>
            <span style={badge(T.slateSoft, T.slate, T.slateBorder)}>{politiquesDraft.length} à venir</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {POLITIQUES.map(pol => {
            const active = state.phase >= pol.phase_creation;
            const Icon = pol.icon;
            return (
              <div key={pol.id} style={{
                border: `1px solid ${active ? T.cardBorder : T.slateBorder}`,
                borderRadius: 12, padding: 18,
                background: active ? T.cardBg : "#fafbfc",
                opacity: active ? 1 : 0.55,
                transition: "all 0.3s",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: active ? T.blueSoft : T.slateSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={15} color={active ? T.blue : T.slate} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    <span style={badge(
                      active ? T.greenSoft : T.slateSoft,
                      active ? T.green : T.slate,
                      active ? T.greenBorder : T.slateBorder,
                    )}>
                      {active ? "Active" : `Phase ${pol.phase_creation}`}
                    </span>
                    <span style={{ fontSize: 10, color: T.textMuted, fontFamily: "'Kanit', sans-serif" }}>{pol.version} · {pol.date}</span>
                  </div>
                </div>

                <p style={{ fontSize: 13, fontWeight: 700, color: active ? T.textPrimary : T.textMuted, marginBottom: 6, fontFamily: "'Kanit', sans-serif", lineHeight: 1.3 }}>
                  {pol.titre}
                </p>
                <p style={{ fontSize: 12, color: T.textSecondary, lineHeight: 1.6, marginBottom: 12, fontFamily: "'Kanit', sans-serif" }}>
                  {pol.desc}
                </p>

                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6, fontFamily: "'Kanit', sans-serif" }}>
                    Sections
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {pol.sections.map((s, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 4, height: 4, borderRadius: "50%", background: active ? T.blue : T.slate, flexShrink: 0 }} />
                        <span style={{ fontSize: 11, color: active ? T.textSecondary : T.textMuted, fontFamily: "'Kanit', sans-serif" }}>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Comité de Gouvernance ── */}
      <div style={card()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.textPrimary, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'Kanit', sans-serif" }}>
              Comité de Gouvernance Data — Ordre du Jour Type
            </p>
            <p style={{ fontSize: 12, color: T.textMuted, marginTop: 3, fontFamily: "'Kanit', sans-serif" }}>
              Réunion mensuelle · 1h30 · Présidée par le CDO · {state.phase >= 2 ? "Opérationnel depuis Phase 2" : "Démarrage Phase 2"}
            </p>
          </div>
          <span style={badge(
            state.phase >= 2 ? T.greenSoft : T.slateSoft,
            state.phase >= 2 ? T.green : T.slate,
            state.phase >= 2 ? T.greenBorder : T.slateBorder,
          )}>
            {state.phase >= 2 ? "Actif" : "Phase 2"}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, opacity: state.phase >= 2 ? 1 : 0.5 }}>
          {COMITE_AGENDA.map(item => {
            const roleConfig = ROLES_CONFIG.find(r => r.short === item.responsable || r.title.includes(item.responsable));
            const roleColor = roleConfig?.color ?? T.slate;
            const roleBg = roleConfig?.bg ?? T.slateSoft;
            const roleBorder = roleConfig?.border ?? T.slateBorder;
            return (
              <div key={item.ordre} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderRadius: 10, background: "#f9fafd", border: `1px solid ${T.cardBorder}` }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: T.blueSoft, border: `1px solid ${T.blueBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: T.blue, fontFamily: "'Kanit', sans-serif" }}>{item.ordre}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: T.textPrimary, margin: 0, fontFamily: "'Kanit', sans-serif" }}>{item.sujet}</p>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                  {item.recurrent && <span style={badge(T.purpleSoft, T.purple, T.purpleBorder)}>Récurrent</span>}
                  <span style={badge(roleBg, roleColor, roleBorder)}>{item.responsable}</span>
                  <div style={{ padding: "4px 10px", borderRadius: 8, background: T.slateSoft, border: `1px solid ${T.slateBorder}` }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: T.textSecondary, fontFamily: "'Kanit', sans-serif" }}>
                      <Clock size={11} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
                      {item.duree}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Total durée */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
          <div style={{ padding: "8px 16px", borderRadius: 8, background: T.blueSoft, border: `1px solid ${T.blueBorder}` }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.blue, fontFamily: "'Kanit', sans-serif" }}>
              Durée totale : {COMITE_AGENDA.reduce((a, i) => a + parseInt(i.duree), 0)} min
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
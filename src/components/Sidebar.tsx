"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { T } from "@/lib/theme";
import {
  LayoutDashboard, Activity, ShieldCheck, Database,
  GitBranch, Brain, FileText, TrendingUp, ChevronRight
} from "lucide-react";

const NAV = [
  { href: "/",              icon: LayoutDashboard, label: "Vue d'ensemble",   sub: "Dashboard exécutif" },
  { href: "/diagnostic",    icon: Activity,        label: "Diagnostic",       sub: "Maturité DAMA-DMBOK" },
  { href: "/gouvernance",   icon: ShieldCheck,     label: "Gouvernance",      sub: "RACI · Politiques" },
  { href: "/catalog",       icon: Database,        label: "Data Catalog",     sub: "Métadonnées · Glossaire" },
  { href: "/qualite",       icon: TrendingUp,      label: "Data Quality",     sub: "KPIs · BCBS 239" },
  { href: "/lineage",       icon: GitBranch,       label: "Data Lineage",     sub: "Flux · Traçabilité" },
  { href: "/ia-governance", icon: Brain,           label: "IA Governance",    sub: "EU AI Act · Registre" },
  { href: "/comex",         icon: FileText,        label: "Comex Report",     sub: "Synthèse Direction" },
];

export default function Sidebar() {
  const path = usePathname();

  return (
    <aside style={{
      position: "fixed", left: 0, top: 0, height: "100vh", width: 240,
      display: "flex", flexDirection: "column", zIndex: 40,
      background: T.sidebarBg,
    }}>

      {/* Logo */}
      <div style={{ padding: "22px 20px 18px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: T.blue, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Database size={16} color="white" />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#f0f4ff", fontFamily: "'Kanit', sans-serif" }}>FinanceDataHub</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "'Kanit', sans-serif" }}>FrontierBank · 2026</p>
          </div>
        </div>
      </div>

      {/* Nav label */}
      <div style={{ padding: "18px 20px 8px" }}>
        <p style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Kanit', sans-serif" }}>
          Navigation
        </p>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "0 10px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV.map(({ href, icon: Icon, label, sub }) => {
          const active = path === href;
          return (
            <Link key={href} href={href} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 12px", borderRadius: 10, textDecoration: "none",
              background: active ? "rgba(45,107,228,0.25)" : "transparent",
              border: active ? "1px solid rgba(45,107,228,0.4)" : "1px solid transparent",
              transition: "all 0.15s",
            }}>
              <Icon size={15} color={active ? "#7eb3f7" : "rgba(255,255,255,0.35)"} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? "#c8dcfc" : "rgba(255,255,255,0.6)", margin: 0, fontFamily: "'Kanit', sans-serif" }}>
                  {label}
                </p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", margin: 0, fontFamily: "'Kanit', sans-serif" }}>{sub}</p>
              </div>
              {active && <ChevronRight size={12} color="#7eb3f7" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#0e9f6e" }} />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "'Kanit', sans-serif" }}>Mission active</span>
        </div>
        <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", fontFamily: "'Kanit', sans-serif" }}>Michel Dupont</p>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "'Kanit', sans-serif" }}>Consultant Data & IA</p>
      </div>
    </aside>
  );
}
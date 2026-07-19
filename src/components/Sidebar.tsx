"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { T } from "@/lib/theme";
import { useResponsive } from "@/lib/useResponsive";
import { useLang } from "@/lib/LanguageContext";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, Activity, ShieldCheck, Database,
  GitBranch, Brain, FileText, TrendingUp, ChevronRight,
  Menu, X
} from "lucide-react";

function SidebarContent({ path, onNavClick }: { path: string; onNavClick?: () => void }) {
  const { t } = useLang();

  const NAV = [
    { href: "/",              icon: LayoutDashboard, label: t.nav.overview,    sub: t.nav.overview_sub    },
    { href: "/diagnostic",    icon: Activity,        label: t.nav.diagnostic,  sub: t.nav.diagnostic_sub  },
    { href: "/gouvernance",   icon: ShieldCheck,     label: t.nav.gouvernance, sub: t.nav.gouvernance_sub },
    { href: "/catalog",       icon: Database,        label: t.nav.catalog,     sub: t.nav.catalog_sub     },
    { href: "/qualite",       icon: TrendingUp,      label: t.nav.qualite,     sub: t.nav.qualite_sub     },
    { href: "/lineage",       icon: GitBranch,       label: t.nav.lineage,     sub: t.nav.lineage_sub     },
    { href: "/ia-governance", icon: Brain,           label: t.nav.ia,          sub: t.nav.ia_sub          },
    { href: "/comex",         icon: FileText,        label: t.nav.comex,       sub: t.nav.comex_sub       },
  ];

  return (
    <>
      {/* Logo */}
      <div style={{ padding: "22px 20px 18px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: T.blue, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Database size={16} color="white" />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#f0f4ff", fontFamily: "'Kanit', sans-serif", margin: 0 }}>
              FinanceDataHub
            </p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "'Kanit', sans-serif", margin: 0 }}>
              FrontierBank · 2026
            </p>
          </div>
        </div>
      </div>

      {/* Label nav */}
      <div style={{ padding: "18px 20px 8px" }}>
        <p style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Kanit', sans-serif", margin: 0 }}>
          Navigation
        </p>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "0 10px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV.map(({ href, icon: Icon, label, sub }) => {
          const active = path === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavClick}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", borderRadius: 10, textDecoration: "none",
                background: active ? "rgba(45,107,228,0.25)" : "transparent",
                border: active ? "1px solid rgba(45,107,228,0.4)" : "1px solid transparent",
                transition: "all 0.15s",
              }}
            >
              <Icon size={15} color={active ? "#7eb3f7" : "rgba(255,255,255,0.35)"} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? "#c8dcfc" : "rgba(255,255,255,0.6)", margin: 0, fontFamily: "'Kanit', sans-serif" }}>
                  {label}
                </p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", margin: 0, fontFamily: "'Kanit', sans-serif" }}>
                  {sub}
                </p>
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
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "'Kanit', sans-serif" }}>
            {t.nav.mission_active}
          </span>
        </div>
        <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", fontFamily: "'Kanit', sans-serif", margin: 0 }}>
          Rigobert Hachiche
        </p>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "'Kanit', sans-serif", margin: 0 }}>
          {t.nav.consultant_title}
        </p>
      </div>
    </>
  );
}

export default function Sidebar() {
  const path = usePathname();
  const { isMobile, isTablet, mounted } = useResponsive();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isNarrow = isMobile || isTablet;

  useEffect(() => { setMobileOpen(false); }, [path]);
  useEffect(() => { if (!isNarrow) setMobileOpen(false); }, [isNarrow]);

  if (!mounted) {
    return (
      <aside style={{ position: "fixed", left: 0, top: 0, height: "100vh", width: 240, display: "flex", flexDirection: "column", zIndex: 40, background: T.sidebarBg }}>
        <SidebarContent path={path} />
      </aside>
    );
  }

  if (isNarrow) {
    return (
      <>
        <button
          onClick={() => setMobileOpen(prev => !prev)}
          style={{ position: "fixed", top: 10, left: 10, zIndex: 200, width: 40, height: 40, borderRadius: 10, background: T.sidebarBg, border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 12px rgba(0,0,0,0.3)" }}
        >
          {mobileOpen ? <X size={18} color="white" /> : <Menu size={18} color="white" />}
        </button>

        {mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 98, backdropFilter: "blur(2px)" }}
          />
        )}

        <aside style={{ position: "fixed", left: mobileOpen ? 0 : -260, top: 0, height: "100vh", width: 240, display: "flex", flexDirection: "column", zIndex: 99, background: T.sidebarBg, transition: "left 0.28s cubic-bezier(0.4,0,0.2,1)", boxShadow: mobileOpen ? "6px 0 32px rgba(0,0,0,0.4)" : "none" }}>
          <SidebarContent path={path} onNavClick={() => setMobileOpen(false)} />
        </aside>
      </>
    );
  }

  return (
    <aside style={{ position: "fixed", left: 0, top: 0, height: "100vh", width: 240, display: "flex", flexDirection: "column", zIndex: 40, background: T.sidebarBg }}>
      <SidebarContent path={path} />
    </aside>
  );
}

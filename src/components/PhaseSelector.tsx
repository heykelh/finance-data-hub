// src/components/PhaseSelector.tsx
"use client";

import { useProjectStore } from "@/lib/useProjectState";
import { TIMELINE } from "@/lib/timeline";
import { T } from "@/lib/theme";
import { CheckCircle2, Clock, Circle } from "lucide-react";

export default function PhaseSelector() {
  const { currentPhase, setPhase } = useProjectStore();

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 4,
      background: "#eef1f8", borderRadius: 10,
      padding: "4px 6px", border: `1px solid ${T.cardBorder}`,
    }}>
      {TIMELINE.map((p) => {
        const active = currentPhase === p.phase;
        const done   = p.status === "done";
        const Icon   = done ? CheckCircle2 : p.status === "in_progress" ? Clock : Circle;
        const color  = done ? T.green : p.status === "in_progress" ? T.blue : T.slate;

        return (
          <button
            key={p.phase}
            onClick={() => setPhase(p.phase)}
            title={`${p.label} · ${p.period}`}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "5px 10px", borderRadius: 7, cursor: "pointer",
              border: active ? `1px solid ${T.blueBorder}` : "1px solid transparent",
              background: active ? "white" : "transparent",
              boxShadow: active ? "0 1px 4px rgba(30,42,58,0.08)" : "none",
              transition: "all 0.15s",
              fontFamily: "'Kanit', sans-serif",
            }}
          >
            <Icon size={12} color={active ? T.blue : color} />
            <span style={{
              fontSize: 12, fontWeight: active ? 700 : 500,
              color: active ? T.blue : T.textSecondary,
              whiteSpace: "nowrap",
            }}>
              P{p.phase}
            </span>
          </button>
        );
      })}
    </div>
  );
}
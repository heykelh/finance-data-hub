// src/lib/useProjectState.ts
"use client";

import { create } from "zustand";
import { TIMELINE, PhaseState } from "./timeline";
import { MATURITY_DOMAINS, BCBS_PRINCIPLES, AI_MODELS } from "./data";

type ProjectStore = {
  currentPhase: number;
  setPhase: (phase: number) => void;
  state: PhaseState;

  // Données dérivées mergées avec la structure de base
  maturityDomains: typeof MATURITY_DOMAINS;
  bcbsPrinciples: typeof BCBS_PRINCIPLES;
  aiModels: typeof AI_MODELS;
};

function buildState(phase: number): Omit<ProjectStore, "currentPhase" | "setPhase" | "state"> {
  const s = TIMELINE[phase - 1];

  const maturityDomains = MATURITY_DOMAINS.map(d => ({
    ...d,
    score: s.maturity[d.id] ?? d.score,
  }));

  const bcbsPrinciples = BCBS_PRINCIPLES.map(p => ({
    ...p,
    status: s.bcbs[p.id] ?? p.status,
  }));

  const aiModels = AI_MODELS.map(m => ({
    ...m,
    status: s.aiModels[m.id] ?? m.status,
  }));

  return { maturityDomains, bcbsPrinciples, aiModels };
}

export const useProjectStore = create<ProjectStore>((set) => ({
  currentPhase: 3,
  state: TIMELINE[2],
  ...buildState(3),

  setPhase: (phase: number) => set({
    currentPhase: phase,
    state: TIMELINE[phase - 1],
    ...buildState(phase),
  }),
}));
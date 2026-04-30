export const T = {
  // Fonds
  pageBg:    "#f0f2f7",   // fond général — gris bleuté très doux
  cardBg:    "#f7f8fc",   // fond des cards — légèrement plus clair
  cardBorder:"#dde2ee",   // bordure des cards
  sidebarBg: "#1e2d4a",   // sidebar — bleu marine profond
  topbarBg:  "#f7f8fc",   // topbar — même que card

  // Textes
  textPrimary:   "#1e2a3a",  // quasi noir — bleu très foncé
  textSecondary: "#4a5568",  // gris ardoise
  textMuted:     "#8896a8",  // gris moyen
  textLight:     "#b8c4d4",  // gris clair

  // Accents principaux
  blue:          "#2d6be4",   // bleu principal
  blueSoft:      "#e8effc",   // bleu très pâle
  blueBorder:    "#b8d0f5",

  indigo:        "#4f46e5",
  indigoSoft:    "#eef2ff",
  indigoBorder:  "#c7d2fe",

  green:         "#0e9f6e",
  greenSoft:     "#ecfdf5",
  greenBorder:   "#a7f3d0",

  amber:         "#d97706",
  amberSoft:     "#fffbeb",
  amberBorder:   "#fde68a",

  red:           "#e02424",
  redSoft:       "#fef2f2",
  redBorder:     "#fecaca",

  purple:        "#7c3aed",
  purpleSoft:    "#f5f3ff",
  purpleBorder:  "#ddd6fe",

  slate:         "#64748b",
  slateSoft:     "#f1f5f9",
  slateBorder:   "#e2e8f0",

  // Dégradé hero
  heroGrad: "linear-gradient(135deg, #1e2d4a 0%, #2d4a7a 60%, #3b5fa0 100%)",
};

export const badge = (bg: string, color: string, border: string) => ({
  display: "inline-flex" as const,
  alignItems: "center" as const,
  padding: "3px 10px",
  borderRadius: 9999,
  fontSize: 11,
  fontWeight: 600,
  fontFamily: "'Kanit', sans-serif",
  background: bg,
  color,
  border: `1px solid ${border}`,
  letterSpacing: "0.04em",
  textTransform: "uppercase" as const,
  whiteSpace: "nowrap" as const,
});

export const card = (extra?: React.CSSProperties): React.CSSProperties => ({
  background: "#f7f8fc",
  border: "1px solid #dde2ee",
  borderRadius: 14,
  padding: 28,
  ...extra,
});
"use client";

import { useResponsive } from "@/lib/useResponsive";

export default function MainWrapper({ children }: { children: React.ReactNode }) {
  const { isNarrow } = useResponsive() as any;
  const { isMobile, isTablet, mounted } = useResponsive();
  const narrow = isMobile || isTablet;

  return (
    <div
      id="main-content"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        marginLeft: !mounted || narrow ? 0 : 240,
        transition: "margin-left 0.28s ease",
      }}
    >
      {children}
    </div>
  );
}
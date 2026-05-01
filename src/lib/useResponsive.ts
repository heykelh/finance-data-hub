"use client";

import { useState, useEffect } from "react";

export function useResponsive() {
  // Démarre à 0 pour forcer la détection côté client
  const [width, setWidth] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Tant que pas monté côté client, on assume desktop
  const effectiveWidth = mounted ? width : 1200;

  const isMobile  = effectiveWidth < 640;
  const isTablet  = effectiveWidth >= 640 && effectiveWidth < 1024;
  const isDesktop = effectiveWidth >= 1024;

  function cols(desktop: number, tablet?: number, mobile?: number): string {
    const t = tablet ?? Math.max(1, Math.floor(desktop / 2));
    const m = mobile ?? 1;
    if (isMobile)  return `repeat(${m}, 1fr)`;
    if (isTablet)  return `repeat(${t}, 1fr)`;
    return `repeat(${desktop}, 1fr)`;
  }

  const pad = isMobile ? 16 : isTablet ? 20 : 28;

  function fs(desktop: number): number {
    if (isMobile) return Math.max(10, desktop - 3);
    if (isTablet) return Math.max(10, desktop - 1);
    return desktop;
  }

  return { isMobile, isTablet, isDesktop, cols, pad, fs, width: effectiveWidth, mounted };
}
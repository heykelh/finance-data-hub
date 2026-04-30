import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

export const metadata: Metadata = {
  title: "FinanceDataHub — Gouvernance Data & IA",
  description: "Plateforme de gouvernance des données et IA — FrontierBank 2026",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
          <Sidebar />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", marginLeft: 240 }}>
            <TopBar />
            <main style={{ flex: 1, overflowY: "auto", padding: 28, background: "#f0f2f7" }}>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
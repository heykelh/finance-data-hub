import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "linear-gradient(135deg, #1e2d4a 0%, #2d6be4 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Lettre F stylisée */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {/* Barre horizontale haute */}
          <div style={{ width: 14, height: 3, background: "white", borderRadius: 2 }} />
          {/* Barre horizontale milieu courte */}
          <div style={{ width: 10, height: 3, background: "#93c5fd", borderRadius: 2 }} />
          {/* Barre verticale + barre basse */}
          <div style={{ width: 14, height: 3, background: "white", borderRadius: 2, opacity: 0.4 }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
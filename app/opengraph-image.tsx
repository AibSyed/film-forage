import { ImageResponse } from "next/og";

export const alt = "Film Forage social preview showing fast movie picks by services and mood";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "56px",
          background:
            "radial-gradient(circle at 12% 12%, rgba(220, 170, 84, 0.16), transparent 30%), radial-gradient(circle at 86% 14%, rgba(33, 88, 152, 0.14), transparent 28%), linear-gradient(135deg, #060d18, #0a1423 72%)",
          color: "#fff8ee",
          fontFamily: "Manrope, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div style={{ fontSize: 28, letterSpacing: 8, textTransform: "uppercase", color: "#f0d3a7" }}>Film Forage</div>
          <div
            style={{
              display: "flex",
              borderRadius: 999,
              border: "1px solid rgba(240, 211, 167, 0.35)",
              background: "rgba(7, 12, 22, 0.6)",
              padding: "10px 18px",
              color: "#f8e5c2",
              fontSize: 19,
              letterSpacing: "0.04em",
            }}
          >
            Neo noir movie finder
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 960 }}>
          <div style={{ fontSize: 80, fontWeight: 700, lineHeight: 0.93, fontFamily: "Bodoni Moda, serif" }}>
            Find a movie worth watching tonight.
          </div>
          <div style={{ fontSize: 33, lineHeight: 1.25, color: "#e5dccd", maxWidth: 900 }}>
            Filter by region and streaming services, narrow by runtime and mood, then keep finalists in watchlist.
          </div>
        </div>
        <div style={{ display: "flex", gap: 14, fontSize: 22, color: "#e6d9c3" }}>
          <div
            style={{
              display: "flex",
              borderRadius: 12,
              border: "1px solid rgba(205, 175, 123, 0.3)",
              background: "rgba(18, 28, 44, 0.62)",
              padding: "10px 14px",
            }}
          >
            Choose region
          </div>
          <div
            style={{
              display: "flex",
              borderRadius: 12,
              border: "1px solid rgba(205, 175, 123, 0.3)",
              background: "rgba(18, 28, 44, 0.62)",
              padding: "10px 14px",
            }}
          >
            Check services
          </div>
          <div
            style={{
              display: "flex",
              borderRadius: 12,
              border: "1px solid rgba(205, 175, 123, 0.3)",
              background: "rgba(18, 28, 44, 0.62)",
              padding: "10px 14px",
            }}
          >
            Save to watchlist
          </div>
        </div>
      </div>
    ),
    size,
  );
}

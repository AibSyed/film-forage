import { ImageResponse } from "next/og";

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
          padding: "64px",
          background: "linear-gradient(135deg, #141d24, #0a1015 72%)",
          color: "#fff8ee",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 10, textTransform: "uppercase", color: "#ffb36c" }}>Film Forage</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 0.92 }}>Find the movie. Keep the shortlist.</div>
          <div style={{ marginTop: 24, fontSize: 34, maxWidth: 920, color: "#d7e3e7" }}>
            One strong lead, a few credible backups, and live streaming availability by region.
          </div>
        </div>
        <div style={{ display: "flex", gap: 18, fontSize: 24, color: "#bfcfd7" }}>
          <div>Lead first</div>
          <div>Backups nearby</div>
          <div>Providers by region</div>
        </div>
      </div>
    ),
    size
  );
}

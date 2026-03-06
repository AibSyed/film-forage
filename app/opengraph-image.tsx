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
          <div style={{ fontSize: 28, letterSpacing: 10, textTransform: "uppercase", color: "#f0d3a7" }}>Film Forage</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 0.92 }}>Find a movie worth watching.</div>
          <div style={{ marginTop: 24, fontSize: 34, maxWidth: 920, color: "#e5dccd" }}>
            Filter by region, services, runtime, and mood. Get a short list you can actually use.
          </div>
        </div>
        <div style={{ display: "flex", gap: 18, fontSize: 24, color: "#bcae9b" }}>
          <div>Region-aware</div>
          <div>Service checks</div>
          <div>Local watchlist</div>
        </div>
      </div>
    ),
    size
  );
}

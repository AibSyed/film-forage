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
          background: "linear-gradient(135deg, #fbf6ec, #ead6b2)",
          color: "#24180f",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 10, textTransform: "uppercase", color: "#6f5d49" }}>Film Forage</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 80, fontWeight: 700, lineHeight: 1 }}>Find one good movie faster.</div>
          <div style={{ marginTop: 24, fontSize: 34, maxWidth: 880, color: "#4c3a2b" }}>
            Real watch availability, cleaner filters, and a local-first watchlist.
          </div>
        </div>
        <div style={{ display: "flex", gap: 18, fontSize: 24, color: "#4c3a2b" }}>
          <div>Film Forage</div>
          <div>Title search</div>
          <div>Local watchlist</div>
        </div>
      </div>
    ),
    size
  );
}

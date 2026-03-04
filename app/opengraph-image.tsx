import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Film Forage — Neo-noir Discovery";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "linear-gradient(160deg, #111111, #1f2937 55%, #78350f)", color: "#fef3c7", padding: "60px" }}>
        <div style={{ letterSpacing: "0.4em", fontSize: 28 }}>FILM FORAGE</div>
        <div style={{ fontSize: 90, lineHeight: 1 }}>Neo-noir Discovery Engine</div>
      </div>
    ),
    size
  );
}

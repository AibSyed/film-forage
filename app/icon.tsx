import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #f59e0b, #111111)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fef3c7", fontSize: 40, fontWeight: 700 }}>
        F
      </div>
    ),
    size
  );
}

import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #f8efe1, #d7c4a6)",
          color: "#24180f",
          fontSize: 220,
          fontWeight: 700,
          borderRadius: 120,
        }}
      >
        FF
      </div>
    ),
    size
  );
}

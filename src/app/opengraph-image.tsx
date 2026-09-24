import { ImageResponse } from "next/og";

export const alt = "NeuroAd attention timeline";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  const bars = [
    22, 28, 31, 27, 24, 38, 52, 71, 86, 92, 78, 61, 44, 33, 26, 21, 18, 16, 19,
    28, 41, 58, 72, 81, 76, 68, 55, 48, 42, 37, 33, 30,
  ];
  const colors = [
    "#3B1F8E",
    "#C0267E",
    "#F26A1B",
    "#FFC23D",
  ];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#181B24",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 64,
        }}
      >
        <div style={{ display: "flex", fontSize: 48, color: "#F2F3F6" }}>
          Neuro<span style={{ color: "#FFC23D" }}>AD</span>
        </div>
        <div
          style={{
            marginTop: 40,
            display: "flex",
            alignItems: "flex-end",
            height: 180,
            gap: 4,
          }}
        >
          {bars.map((h, i) => (
            <div
              key={i}
              style={{
                width: 24,
                height: `${h}%`,
                background: colors[Math.min(3, Math.floor((h / 100) * 4))],
              }}
            />
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}

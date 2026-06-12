import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { theme } from "./theme";

// Decorative Hong Kong skyline silhouette layer (NOT a full scene) — composited
// behind titles/charts. Original art (no photo), subtle drift + lit windows.
type Building = { x: number; w: number; h: number; lit?: number[] };

const BUILDINGS: Building[] = [
  { x: 30, w: 92, h: 180 },
  { x: 132, w: 70, h: 260, lit: [1, 3, 5] },
  { x: 214, w: 120, h: 150 },
  { x: 348, w: 58, h: 330, lit: [2, 4, 7] },
  { x: 418, w: 100, h: 210 },
  { x: 530, w: 80, h: 150 },
  { x: 622, w: 56, h: 430, lit: [3, 6, 9, 12] },
  { x: 690, w: 112, h: 190 },
  { x: 812, w: 70, h: 280, lit: [1, 4] },
  { x: 892, w: 132, h: 160 },
  { x: 1034, w: 64, h: 360, lit: [2, 5, 8] },
  { x: 1110, w: 96, h: 220 },
  { x: 1218, w: 80, h: 150 },
  { x: 1310, w: 58, h: 500, lit: [2, 5, 8, 11, 14] },
  { x: 1380, w: 122, h: 200 },
  { x: 1512, w: 70, h: 300, lit: [1, 3, 6] },
  { x: 1592, w: 112, h: 170 },
  { x: 1714, w: 80, h: 240, lit: [2, 4] },
  { x: 1804, w: 100, h: 160 },
];

export const Skyline: React.FC<any> = ({ opacity = 1, glow = true }) => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 600], [0, -18], { extrapolateRight: "clamp" });
  const rise = interpolate(frame, [0, 30], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ap = interpolate(frame, [0, 30], [0, opacity], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const baseY = 1080;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <radialGradient id="sky-glow" cx="50%" cy="100%" r="80%">
            <stop offset="0%" stopColor={theme.colors.accent} stopOpacity="0.20" />
            <stop offset="45%" stopColor={theme.colors.accent} stopOpacity="0.05" />
            <stop offset="100%" stopColor={theme.colors.accent} stopOpacity="0" />
          </radialGradient>
        </defs>
        {glow && <rect x={0} y={520} width={1920} height={560} fill="url(#sky-glow)" />}
        <g transform={`translate(${drift}, ${rise})`} opacity={ap}>
          {BUILDINGS.map((b, i) => {
            const top = baseY - b.h;
            return (
              <g key={i}>
                <rect x={b.x} y={top} width={b.w} height={b.h} fill="#0d1422" stroke="#161f31" strokeWidth={1} />
                {(b.lit ?? []).map((row, j) => (
                  <rect
                    key={j}
                    x={b.x + 10}
                    y={top + 16 + row * 26}
                    width={Math.max(8, b.w - 20)}
                    height={8}
                    fill={theme.colors.accent2}
                    opacity={0.5}
                  />
                ))}
              </g>
            );
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

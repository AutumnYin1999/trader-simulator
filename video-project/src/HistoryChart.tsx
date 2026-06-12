import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { theme } from "./theme";

// Animated Hang Seng line chart. Data are real, approximate monthly closes that
// capture each event's shape (peak->crash, or steady rally). Drawn progressively.
const SERIES: Record<string, { data: number[]; label: string }> = {
  "1997": {
    data: [13200, 14600, 16100, 16820, 16000, 15200, 13100, 10400, 11500, 9000, 8200, 9100, 7800, 6800, 6660],
    label: "HANG SENG INDEX · 1997–98",
  },
  "2008": {
    data: [31958, 29500, 27000, 24800, 25600, 23000, 22000, 21500, 18000, 16200, 13000, 11800, 13276, 12500, 14000],
    label: "HANG SENG INDEX · 2007–09",
  },
  "2017": {
    data: [22000, 22700, 23700, 24600, 25500, 25700, 26800, 27500, 28000, 28500, 29100, 29800, 30000],
    label: "HANG SENG INDEX · 2017",
  },
  "2020": {
    data: [28500, 27900, 26800, 24000, 23200, 21700, 22800, 24000, 24600, 23500, 25000, 26200],
    label: "HANG SENG INDEX · 2020",
  },
};

const PLOT = { x0: 200, x1: 1720, y0: 280, y1: 800 };

export const HistoryChart: React.FC<any> = ({ event = "1997", tag, tone = "crash", kicker }) => {
  const frame = useCurrentFrame();
  const series = SERIES[event] ?? SERIES["1997"];
  const data = series.data;
  const lineColor = tone === "rally" ? theme.colors.up : theme.colors.down;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const n = data.length;
  const xFor = (i: number) => PLOT.x0 + (i / (n - 1)) * (PLOT.x1 - PLOT.x0);
  const yFor = (v: number) => PLOT.y1 - ((v - min) / (max - min || 1)) * (PLOT.y1 - PLOT.y0);
  const pts = data.map((v, i) => [xFor(i), yFor(v)] as const);
  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L ${PLOT.x1} ${PLOT.y1} L ${PLOT.x0} ${PLOT.y1} Z`;

  const drawStart = 8;
  const drawEnd = 60;
  const progress = interpolate(frame, [drawStart, drawEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // leading dot at fractional index along the polyline
  const fi = progress * (n - 1);
  const i0 = Math.max(0, Math.min(n - 1, Math.floor(fi)));
  const i1 = Math.min(n - 1, i0 + 1);
  const f = fi - i0;
  const dotX = pts[i0][0] + (pts[i1][0] - pts[i0][0]) * f;
  const dotY = pts[i0][1] + (pts[i1][1] - pts[i0][1]) * f;

  const areaOp = interpolate(frame, [drawEnd - 12, drawEnd + 8], [0, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const kickOp = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tagOp = interpolate(frame, [drawEnd - 6, drawEnd + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tagScale = interpolate(frame, [drawEnd - 6, drawEnd + 12], [0.82, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const gridYs = [0.25, 0.5, 0.75].map((g) => PLOT.y0 + g * (PLOT.y1 - PLOT.y0));

  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 100% at 50% 0%, ${theme.colors.bg2} 0%, ${theme.colors.bg} 60%)` }}>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <linearGradient id="hc-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0.42" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
          </linearGradient>
        </defs>
        {gridYs.map((y, i) => (
          <line key={i} x1={PLOT.x0} y1={y} x2={PLOT.x1} y2={y} stroke={theme.colors.grid} strokeWidth={1} />
        ))}
        <line x1={PLOT.x0} y1={PLOT.y1} x2={PLOT.x1} y2={PLOT.y1} stroke={theme.colors.grid} strokeWidth={2} />
        <path d={areaPath} fill="url(#hc-area)" opacity={areaOp} />
        <path
          d={linePath}
          fill="none"
          stroke={lineColor}
          strokeWidth={6}
          strokeLinejoin="round"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - progress}
          style={{ filter: `drop-shadow(0 0 16px ${lineColor})` }}
        />
        {progress > 0.01 && progress < 0.999 && (
          <circle cx={dotX} cy={dotY} r={12} fill={lineColor} style={{ filter: `drop-shadow(0 0 16px ${lineColor})` }} />
        )}
      </svg>

      <div style={{ position: "absolute", left: 200, top: 110, opacity: kickOp, maxWidth: 1100 }}>
        {kicker ? (
          <div style={{ font: `700 30px ${theme.fonts.body}`, letterSpacing: 4, textTransform: "uppercase", color: theme.colors.accent }}>{kicker}</div>
        ) : null}
        <div style={{ font: `600 30px ${theme.fonts.body}`, color: theme.colors.muted, marginTop: kicker ? 10 : 0 }}>{series.label}</div>
      </div>

      {tag ? (
        <div
          style={{
            position: "absolute",
            right: 200,
            top: 150,
            opacity: tagOp,
            transform: `scale(${tagScale})`,
            transformOrigin: "right top",
            maxWidth: 700,
            textAlign: "right",
          }}
        >
          <div style={{ font: `800 56px ${theme.fonts.display}`, color: lineColor, textShadow: `0 0 40px ${lineColor}66`, lineHeight: 1.1 }}>{tag}</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

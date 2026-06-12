import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { theme } from "./theme";

// 3-step recombining CRR tree. phase "build": columns reveal left->right with
// up(green)/down(red) edges. phase "fold": full tree, a highlight sweeps
// right->left and the fair value pops in at the root.
const STEPS = 3;
const COL_X = [380, 760, 1140, 1520];
const CY = 460;
const VGAP = 150;

export const BinomialTree: React.FC<any> = ({ phase = "build", kicker, finalValue }) => {
  const frame = useCurrentFrame();

  const nodes: { c: number; j: number; x: number; y: number }[] = [];
  for (let c = 0; c <= STEPS; c++) {
    for (let j = 0; j <= c; j++) {
      nodes.push({ c, j, x: COL_X[c], y: CY + (j - c / 2) * VGAP });
    }
  }
  const posOf = (c: number, j: number) => nodes.find((nd) => nd.c === c && nd.j === j)!;
  const edges: { a: { x: number; y: number; c: number }; b: { x: number; y: number; c: number; j: number }; up: boolean }[] = [];
  for (let c = 0; c < STEPS; c++) {
    for (let j = 0; j <= c; j++) {
      edges.push({ a: posOf(c, j), b: posOf(c + 1, j) as any, up: true });
      edges.push({ a: posOf(c, j), b: posOf(c + 1, j + 1) as any, up: false });
    }
  }

  const colReveal = (c: number) =>
    interpolate(frame, [6 + c * 13, 18 + c * 13], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const buildDone = 18 + STEPS * 13;
  const foldStart = phase === "fold" ? 10 : buildDone + 6;
  const fold = interpolate(frame, [foldStart, foldStart + 46], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const hiCol = STEPS - fold * STEPS;

  const finalOp = interpolate(frame, [foldStart + 34, foldStart + 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const finalScale = interpolate(frame, [foldStart + 34, foldStart + 50], [0.7, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const kickOp = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 100% at 50% 10%, ${theme.colors.bg2} 0%, ${theme.colors.bg} 60%)` }}>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        {edges.map((e, i) => {
          const r = phase === "fold" ? 1 : colReveal(e.b.c);
          return (
            <line
              key={i}
              x1={e.a.x}
              y1={e.a.y}
              x2={e.a.x + (e.b.x - e.a.x) * r}
              y2={e.a.y + (e.b.y - e.a.y) * r}
              stroke={e.up ? theme.colors.up : theme.colors.down}
              strokeWidth={3}
              opacity={0.5}
            />
          );
        })}
        {nodes.map((nd, i) => {
          const r = phase === "fold" ? 1 : colReveal(nd.c);
          const highlighted = phase === "fold" && Math.abs(nd.c - hiCol) < 0.6;
          const fill = highlighted ? theme.colors.accent : theme.colors.panel;
          const stroke = highlighted ? theme.colors.accent : "#27324a";
          return (
            <g key={i} opacity={r} transform={`translate(${nd.x},${nd.y}) scale(${0.6 + 0.4 * r})`}>
              <circle
                r={26}
                fill={fill}
                stroke={stroke}
                strokeWidth={3}
                style={highlighted ? { filter: `drop-shadow(0 0 18px ${theme.colors.accent})` } : undefined}
              />
            </g>
          );
        })}
      </svg>

      {kicker ? (
        <div
          style={{
            position: "absolute",
            left: 200,
            top: 110,
            opacity: kickOp,
            font: `700 30px ${theme.fonts.body}`,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: theme.colors.accent,
            maxWidth: 1200,
          }}
        >
          {kicker}
        </div>
      ) : null}

      {phase === "fold" && finalValue ? (
        <div
          style={{
            position: "absolute",
            left: COL_X[0] - 160,
            top: CY - 250,
            width: 320,
            textAlign: "center",
            opacity: finalOp,
            transform: `scale(${finalScale})`,
            transformOrigin: "center bottom",
          }}
        >
          <div style={{ font: `700 26px ${theme.fonts.body}`, letterSpacing: 3, textTransform: "uppercase", color: theme.colors.muted }}>fair value</div>
          <div style={{ font: `800 124px ${theme.fonts.display}`, color: theme.colors.accent2, textShadow: `0 0 40px ${theme.colors.accent2}66`, lineHeight: 1 }}>{finalValue}</div>
        </div>
      ) : null}

      {phase === "build" ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: CY + 270,
            textAlign: "center",
            font: `400 32px ${theme.fonts.body}`,
            color: theme.colors.muted,
          }}
        >
          up · down — every path the market could take
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { theme } from "./theme";

/**
 * BarrierBreak
 * A price path cruises in, gently descends, touches a knock-out barrier and
 * "shatters" — shards fly out, the surviving path goes grey, a red KNOCKED OUT
 * stamp slams in. Holds the broken end-state after the intro.
 */

type BarrierBreakProps = {
  barrierLabel?: string;
  kicker?: string;
};

// ---- Geometry (1920x1080 author space) -----------------------------------
const BARRIER_Y = 620;

// The price polyline. It cruises in slightly above the barrier, dips, and the
// 5th vertex is exactly on the barrier line — that is the "touch" point.
const PRICE_PTS: Array<[number, number]> = [
  [200, 360],
  [470, 420],
  [740, 400],
  [1010, 500],
  [1240, BARRIER_Y], // touch point (knock-out)
];
// Where the path WOULD have continued (drawn muted/grey, post-break ghost).
const GHOST_PTS: Array<[number, number]> = [
  [1240, BARRIER_Y],
  [1520, 700],
  [1740, 660],
];

const TOUCH = PRICE_PTS[PRICE_PTS.length - 1];

// Build an SVG path "d" string from a list of points.
function toPath(pts: Array<[number, number]>): string {
  return pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`)
    .join(" ");
}

// Approximate total length of the live path (for stroke-dashoffset draw-on).
function pathLength(pts: Array<[number, number]>): number {
  let len = 0;
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i][0] - pts[i - 1][0];
    const dy = pts[i][1] - pts[i - 1][1];
    len += Math.sqrt(dx * dx + dy * dy);
  }
  return len;
}

// Deterministic shards emitted from the touch point.
const SHARDS = (() => {
  const out: Array<{
    angle: number;
    dist: number;
    len: number;
    rot: number;
    delay: number;
    w: number;
  }> = [];
  const n = 8;
  for (let i = 0; i < n; i++) {
    // spread mostly to the right / down-right (direction of travel)
    const a = -40 + (i / (n - 1)) * 150; // degrees, -40..110
    out.push({
      angle: (a * Math.PI) / 180,
      dist: 90 + ((i * 53) % 140),
      len: 34 + ((i * 37) % 46),
      rot: ((i * 67) % 90) - 45,
      delay: (i % 4) * 1.5,
      w: i % 2 === 0 ? 6 : 4,
    });
  }
  return out;
})();

export const BarrierBreak: React.FC<any> = (props) => {
  const { barrierLabel = "KNOCK-OUT", kicker } = props as BarrierBreakProps;
  const frame = useCurrentFrame();

  const livePath = toPath(PRICE_PTS);
  const ghostPath = toPath(GHOST_PTS);
  const liveLen = pathLength(PRICE_PTS);

  // --- Draw-on of the live path (frames 0..50) ---
  const drawT = interpolate(frame, [0, 50], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dashOffset = liveLen * (1 - drawT);

  // --- Barrier line reveal (frames 4..30) ---
  const barrierDraw = interpolate(frame, [4, 30], [0, 1920], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const barrierOpacity = interpolate(frame, [4, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Flash at the moment of touch (frames 40..56) ---
  const flash = interpolate(frame, [40, 45, 56], [0, 0.85, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Ghost (broken) path fading in grey after the break (frames 50..70) ---
  const ghostOpacity = interpolate(frame, [50, 70], [0, 0.55], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Live path desaturates toward grey after the break ---
  // We crossfade two copies of the live path: coral -> muted.
  const liveGrey = interpolate(frame, [50, 72], [0, 1], {
    easing: Easing.inOut(Easing.quad),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Touch-point pulse ring (frames 40..70) ---
  const ringR = interpolate(frame, [40, 70], [6, 80], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ringOpacity = interpolate(frame, [40, 44, 70], [0, 0.9, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- KNOCKED OUT stamp scales in after frame 50 ---
  const stampT = interpolate(frame, [50, 64], [0, 1], {
    easing: Easing.out(Easing.back(1.7)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const stampScale = interpolate(stampT, [0, 1], [0.4, 1]);
  const stampOpacity = interpolate(frame, [50, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const stampRot = -9; // jaunty tilt

  // --- Kicker fade ---
  const kickerOpacity = interpolate(frame, [6, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 90% at 50% 0%, ${theme.colors.bg2} 0%, ${theme.colors.bg} 60%)`,
        fontFamily: theme.fonts.body,
        overflow: "hidden",
      }}
    >
      {/* full-frame flash overlay on touch */}
      <AbsoluteFill
        style={{
          background: theme.colors.down,
          opacity: flash * 0.18,
          mixBlendMode: "screen",
        }}
      />

      <svg
        viewBox="0 0 1920 1080"
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <filter id="bb-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="7" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="bb-soft" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* faint vertical grid for depth */}
        {[300, 600, 900, 1200, 1500, 1800].map((x) => (
          <line
            key={x}
            x1={x}
            y1={120}
            x2={x}
            y2={900}
            stroke={theme.colors.grid}
            strokeWidth={1}
            opacity={0.5}
          />
        ))}

        {/* BARRIER line (dashed, red), drawn in left->right */}
        <g opacity={barrierOpacity}>
          <line
            x1={120}
            y1={BARRIER_Y}
            x2={120 + barrierDraw}
            y2={BARRIER_Y}
            stroke={theme.colors.down}
            strokeWidth={4}
            strokeDasharray="18 14"
            strokeLinecap="round"
            filter="url(#bb-soft)"
            opacity={0.55}
          />
          <line
            x1={120}
            y1={BARRIER_Y}
            x2={120 + barrierDraw}
            y2={BARRIER_Y}
            stroke={theme.colors.down}
            strokeWidth={3}
            strokeDasharray="18 14"
            strokeLinecap="round"
          />
        </g>
        {/* barrier label, right-aligned, above the line */}
        <text
          x={1800}
          y={BARRIER_Y - 22}
          textAnchor="end"
          fontFamily={theme.fonts.display}
          fontSize={40}
          fontWeight={800}
          letterSpacing={4}
          fill={theme.colors.down}
          opacity={barrierOpacity}
          style={{
            textShadow: "0 0 18px rgba(255,77,94,0.55)",
          }}
        >
          {barrierLabel}
        </text>

        {/* GHOST continuation (the path that never happened) */}
        <path
          d={ghostPath}
          fill="none"
          stroke={theme.colors.muted}
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="10 16"
          opacity={ghostOpacity}
        />

        {/* LIVE path — coral (under) with glow */}
        <path
          d={livePath}
          fill="none"
          stroke={theme.colors.accent}
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={liveLen}
          strokeDashoffset={dashOffset}
          filter="url(#bb-glow)"
          opacity={1 - liveGrey * 0.85}
        />
        {/* LIVE path — grey overlay that fades in after break */}
        <path
          d={livePath}
          fill="none"
          stroke={theme.colors.muted}
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={liveLen}
          strokeDashoffset={dashOffset}
          opacity={liveGrey * 0.85}
        />

        {/* expanding pulse ring at the touch point */}
        <circle
          cx={TOUCH[0]}
          cy={TOUCH[1]}
          r={ringR}
          fill="none"
          stroke={theme.colors.down}
          strokeWidth={3}
          opacity={ringOpacity}
        />

        {/* SHARDS flying outward from the break point */}
        <g>
          {SHARDS.map((s, i) => {
            const local = frame - 42 - s.delay;
            const t = interpolate(local, [0, 24], [0, 1], {
              easing: Easing.out(Easing.cubic),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const op = interpolate(local, [0, 4, 24], [0, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            if (op <= 0) return null;
            const cx = TOUCH[0] + Math.cos(s.angle) * s.dist * t;
            const cy =
              TOUCH[1] +
              Math.sin(s.angle) * s.dist * t +
              // gravity sag as it flies
              0.6 * (s.dist * t) * t;
            const half = s.len / 2;
            return (
              <g
                key={i}
                transform={`translate(${cx} ${cy}) rotate(${s.rot + t * 60})`}
                opacity={op}
              >
                <line
                  x1={-half}
                  y1={0}
                  x2={half}
                  y2={0}
                  stroke={i % 3 === 0 ? theme.colors.accent2 : theme.colors.accent}
                  strokeWidth={s.w}
                  strokeLinecap="round"
                />
              </g>
            );
          })}
        </g>

        {/* bright break-point node */}
        <circle
          cx={TOUCH[0]}
          cy={TOUCH[1]}
          r={9}
          fill={theme.colors.fg}
          opacity={interpolate(frame, [38, 44], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
          style={{ filter: "drop-shadow(0 0 10px rgba(255,77,94,0.9))" }}
        />

        {/* KNOCKED OUT stamp near the break point */}
        <g
          transform={`translate(${TOUCH[0] + 120} ${TOUCH[1] - 150}) rotate(${stampRot}) scale(${stampScale})`}
          opacity={stampOpacity}
        >
          <rect
            x={-210}
            y={-58}
            width={420}
            height={116}
            rx={14}
            fill="none"
            stroke={theme.colors.down}
            strokeWidth={6}
            style={{ filter: "drop-shadow(0 0 22px rgba(255,77,94,0.5))" }}
          />
          <rect
            x={-198}
            y={-46}
            width={396}
            height={92}
            rx={8}
            fill={theme.colors.down}
            opacity={0.12}
          />
          <text
            x={0}
            y={16}
            textAnchor="middle"
            fontFamily={theme.fonts.display}
            fontSize={56}
            fontWeight={900}
            letterSpacing={3}
            fill={theme.colors.down}
            style={{ textShadow: "0 0 24px rgba(255,77,94,0.6)" }}
          >
            KNOCKED OUT
          </text>
        </g>
      </svg>

      {/* kicker — uppercase top-left */}
      {kicker ? (
        <div
          style={{
            position: "absolute",
            left: 140,
            top: 124,
            fontFamily: theme.fonts.display,
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: theme.colors.accent,
            opacity: kickerOpacity,
            textShadow: "0 0 16px rgba(255,107,61,0.45)",
          }}
        >
          {kicker}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export default BarrierBreak;

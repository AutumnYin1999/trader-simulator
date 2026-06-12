import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { theme } from "./theme";

type PayoffDiagramProps = {
  type: "call" | "put";
  title: string;
  note?: string;
};

// Plot area (1920x1080 author space)
const PLOT_LEFT = 360;
const PLOT_RIGHT = 1560;
const PLOT_TOP = 260;
const PLOT_BOTTOM = 760;

// Vertical position of the x-axis (zero P/L line) within the plot.
const AXIS_Y = 600; // below center -> room for the rising call / falling put
const STRIKE_X = (PLOT_LEFT + PLOT_RIGHT) / 2; // 960 — strike at horizontal center
const PREMIUM_Y = AXIS_Y + 70; // dashed loss level below the axis

export const PayoffDiagram: React.FC<any> = (props) => {
  const { type, title, note } = props as PayoffDiagramProps;
  const frame = useCurrentFrame();

  const isCall = type === "call";

  // Build the payoff polyline. Flat (premium loss) on one side, 45deg ramp on the other.
  // Use a consistent slope so the ramp reaches the plot edge.
  const ramp = PLOT_RIGHT - STRIKE_X; // horizontal run from strike to edge
  const rise = ramp; // ~45deg in plot space
  const topRampY = PREMIUM_Y - rise; // where the rising leg ends (clamped to plot top)
  const rampEndY = Math.max(PLOT_TOP, topRampY);

  let pathD: string;
  if (isCall) {
    // Flat at premium loss from left to strike, then kink up to top-right.
    pathD = `M ${PLOT_LEFT} ${PREMIUM_Y} L ${STRIKE_X} ${PREMIUM_Y} L ${PLOT_RIGHT} ${rampEndY}`;
  } else {
    // High on the left, slope down to strike, then flat (premium loss) to the right.
    pathD = `M ${PLOT_LEFT} ${rampEndY} L ${STRIKE_X} ${PREMIUM_Y} L ${PLOT_RIGHT} ${PREMIUM_Y}`;
  }

  // Total path length for the dash draw-on. Sum of segment lengths.
  const segFlat = STRIKE_X - PLOT_LEFT;
  const segRamp = Math.hypot(PLOT_RIGHT - STRIKE_X, PREMIUM_Y - rampEndY);
  const pathLen = segFlat + segRamp;

  // Draw the payoff line progressively (stroke-dashoffset full -> 0) over frames 6-46.
  const drawT = interpolate(frame, [6, 46], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const dashOffset = pathLen * drawT;

  // Axes + frame fade in over frames 0-18.
  const framesIn = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Premium dashed line + labels fade in after the line has mostly drawn.
  const annotIn = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Kicker title fade/slide.
  const titleIn = interpolate(frame, [0, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [0, 22], [-16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const noteIn = interpolate(frame, [40, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Strike marker x; premium label position (on the flat segment).
  const premiumLabelX = isCall
    ? PLOT_LEFT + (STRIKE_X - PLOT_LEFT) * 0.35
    : PLOT_RIGHT - (PLOT_RIGHT - STRIKE_X) * 0.35;

  // Endpoint of the drawn line, for a glowing dot once fully drawn.
  const endDotOpacity = interpolate(frame, [44, 52], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const endX = isCall ? PLOT_RIGHT : PLOT_LEFT;
  const endY = rampEndY;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 90% at 50% 18%, ${theme.colors.bg2} 0%, ${theme.colors.bg} 62%)`,
        fontFamily: theme.fonts.body,
      }}
    >
      <svg
        viewBox="0 0 1920 1080"
        width="100%"
        height="100%"
        style={{ display: "block" }}
      >
        <defs>
          <filter id="payoffGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="dotGlow" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="9" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Kicker title — uppercase coral, top center */}
        <text
          x={960}
          y={150 + titleY}
          textAnchor="middle"
          fill={theme.colors.accent}
          opacity={titleIn}
          style={{
            fontFamily: theme.fonts.display,
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          {(title || "").toUpperCase()}
        </text>

        {/* Plot frame / grid group */}
        <g opacity={framesIn}>
          {/* subtle vertical gridlines */}
          {[0.25, 0.5, 0.75].map((t) => {
            const gx = PLOT_LEFT + (PLOT_RIGHT - PLOT_LEFT) * t;
            return (
              <line
                key={`v${t}`}
                x1={gx}
                y1={PLOT_TOP}
                x2={gx}
                y2={PLOT_BOTTOM}
                stroke={theme.colors.grid}
                strokeWidth={1}
                opacity={0.5}
              />
            );
          })}
          {/* subtle horizontal gridlines */}
          {[0.25, 0.5, 0.75].map((t) => {
            const gy = PLOT_TOP + (PLOT_BOTTOM - PLOT_TOP) * t;
            return (
              <line
                key={`h${t}`}
                x1={PLOT_LEFT}
                y1={gy}
                x2={PLOT_RIGHT}
                y2={gy}
                stroke={theme.colors.grid}
                strokeWidth={1}
                opacity={0.5}
              />
            );
          })}

          {/* Y axis */}
          <line
            x1={PLOT_LEFT}
            y1={PLOT_TOP}
            x2={PLOT_LEFT}
            y2={PLOT_BOTTOM}
            stroke={theme.colors.grid}
            strokeWidth={2}
          />
          {/* X axis (zero P/L) */}
          <line
            x1={PLOT_LEFT}
            y1={AXIS_Y}
            x2={PLOT_RIGHT}
            y2={AXIS_Y}
            stroke={theme.colors.grid}
            strokeWidth={2}
          />

          {/* Axis labels */}
          <text
            x={PLOT_LEFT - 18}
            y={PLOT_TOP + 6}
            textAnchor="end"
            fill={theme.colors.muted}
            style={{ fontSize: 26, fontFamily: theme.fonts.body }}
          >
            P/L
          </text>
          <text
            x={PLOT_RIGHT + 14}
            y={AXIS_Y + 8}
            textAnchor="start"
            fill={theme.colors.muted}
            style={{ fontSize: 26, fontFamily: theme.fonts.body }}
          >
            Spot
          </text>
        </g>

        {/* Premium dashed level (loss) */}
        <g opacity={annotIn}>
          <line
            x1={PLOT_LEFT}
            y1={PREMIUM_Y}
            x2={PLOT_RIGHT}
            y2={PREMIUM_Y}
            stroke={theme.colors.down}
            strokeWidth={2}
            strokeDasharray="12 10"
            opacity={0.75}
          />
          <text
            x={premiumLabelX}
            y={PREMIUM_Y + 34}
            textAnchor="middle"
            fill={theme.colors.muted}
            style={{ fontSize: 28, fontFamily: theme.fonts.body }}
          >
            premium
          </text>
        </g>

        {/* Strike marker on x-axis */}
        <g opacity={annotIn}>
          <line
            x1={STRIKE_X}
            y1={AXIS_Y - 10}
            x2={STRIKE_X}
            y2={AXIS_Y + 10}
            stroke={theme.colors.accent2}
            strokeWidth={3}
          />
          <text
            x={STRIKE_X}
            y={AXIS_Y + 46}
            textAnchor="middle"
            fill={theme.colors.accent2}
            style={{
              fontSize: 30,
              fontFamily: theme.fonts.body,
              fontWeight: 600,
              letterSpacing: 1,
            }}
          >
            Strike
          </text>
        </g>

        {/* Payoff line — glow underlay (blurred duplicate) */}
        <path
          d={pathD}
          fill="none"
          stroke={theme.colors.accent}
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#payoffGlow)"
          opacity={0.55}
          strokeDasharray={pathLen}
          strokeDashoffset={dashOffset}
        />
        {/* Payoff line — crisp top stroke */}
        <path
          d={pathD}
          fill="none"
          stroke={theme.colors.accent}
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={pathLen}
          strokeDashoffset={dashOffset}
        />

        {/* Glowing endpoint dot */}
        <circle
          cx={endX}
          cy={endY}
          r={9}
          fill={theme.colors.accent}
          filter="url(#dotGlow)"
          opacity={endDotOpacity}
        />

        {/* Optional note — muted, centered */}
        {note ? (
          <text
            x={960}
            y={820}
            textAnchor="middle"
            fill={theme.colors.muted}
            opacity={noteIn}
            style={{ fontSize: 32, fontFamily: theme.fonts.body }}
          >
            {note}
          </text>
        ) : null}
      </svg>
    </AbsoluteFill>
  );
};

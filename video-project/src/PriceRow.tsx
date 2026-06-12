import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Easing,
} from "remotion";
import { theme } from "./theme";

type PriceRowProps = {
  prices?: string[];
  label?: string;
};

const STAGGER = 8; // frames between each price popping in

const PriceCell: React.FC<{ value: string; index: number }> = ({
  value,
  index,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = index * STAGGER;

  // Pop in: scale 0.7 -> 1 with a soft spring, opacity 0 -> 1.
  const pop = spring({
    frame: frame - start,
    fps,
    config: { damping: 14, mass: 0.7, stiffness: 130 },
    durationInFrames: 30,
  });
  const scale = interpolate(pop, [0, 1], [0.7, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(frame - start, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Brief gold flash right as it lands, then settle to a steady glow.
  const flash = interpolate(
    frame - start,
    [2, 10, 22],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const baseGlow = 24;
  const glow = baseGlow + flash * 46;
  const flashColor = `rgba(255, 240, 200, ${0.85 * flash})`;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        transform: `scale(${scale})`,
        opacity,
        willChange: "transform, opacity",
      }}
    >
      <span
        style={{
          fontFamily: theme.fonts.display,
          fontWeight: 800,
          fontSize: 90,
          color: theme.colors.accent2,
          marginRight: 6,
          opacity: 0.82,
          transform: "translateY(-0.18em)",
          textShadow: `0 0 ${glow * 0.7}px rgba(245,185,66,${0.45 +
            flash * 0.35})`,
        }}
      >
        $
      </span>
      <span
        style={{
          fontFamily: theme.fonts.display,
          fontWeight: 800,
          fontSize: 150,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          color: theme.colors.accent2,
          textShadow: `0 0 ${glow}px rgba(245,185,66,${0.5 +
            flash * 0.35}), 0 0 ${glow * 2}px rgba(245,185,66,${0.18 +
            flash * 0.2}), 0 2px 0 ${flashColor}`,
        }}
      >
        {value}
      </span>
    </div>
  );
};

const Divider: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  // Divider fades in between its two neighbouring prices.
  const start = index * STAGGER + STAGGER / 2;
  const opacity = interpolate(frame - start, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const grow = interpolate(frame - start, [0, 14], [0.4, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div
      aria-hidden
      style={{
        width: 2,
        height: 96,
        borderRadius: 2,
        background: `linear-gradient(to bottom, rgba(138,148,166,0) 0%, rgba(138,148,166,0.55) 50%, rgba(138,148,166,0) 100%)`,
        opacity: opacity * 0.9,
        transform: `scaleY(${grow})`,
      }}
    />
  );
};

export const PriceRow: React.FC<any> = (props) => {
  const {
    prices = ["186", "934", "297"],
    label,
  }: PriceRowProps = props;

  const frame = useCurrentFrame();
  const list = Array.isArray(prices) && prices.length > 0 ? prices : ["—"];

  // Label fades in after the last price has popped + a small beat.
  const labelStart = (list.length - 1) * STAGGER + 16;
  const labelOpacity = interpolate(frame - labelStart, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelRise = interpolate(frame - labelStart, [0, 14], [14, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 90% at 50% 36%, ${theme.colors.bg2} 0%, ${theme.colors.bg} 62%)`,
        fontFamily: theme.fonts.body,
        color: theme.colors.fg,
      }}
    >
      {/* soft warm pool behind the figures */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 430,
          width: 1300,
          height: 520,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(245,185,66,0.10) 0%, rgba(245,185,66,0) 70%)",
          pointerEvents: "none",
        }}
      />

      {/* the price row, vertically centred at ~y=430 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 430,
          transform: "translateY(-50%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 70,
          padding: "0 120px",
        }}
      >
        {list.map((value, i) => (
          <React.Fragment key={i}>
            {i > 0 ? <Divider index={i} /> : null}
            <PriceCell value={value} index={i} />
          </React.Fragment>
        ))}
      </div>

      {/* optional label below the row at ~y=640 */}
      {label ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 640,
            textAlign: "center",
            fontFamily: theme.fonts.body,
            fontSize: 36,
            fontWeight: 500,
            letterSpacing: "0.02em",
            color: theme.colors.muted,
            opacity: labelOpacity,
            transform: `translateY(${labelRise}px)`,
          }}
        >
          {label}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

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

type Side = { label: string; delta: string; tone: "up" | "down" };

type SplitCompareProps = {
  title: string;
  left: Side;
  right: Side;
};

const PANEL_W = 760;
const PANEL_H = 520;
const GAP = 96;

const Panel: React.FC<{
  side: Side;
  enterStart: number;
  fromX: number;
  align: "left" | "right";
}> = ({ side, enterStart, fromX, align }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const toneColor =
    side.tone === "up" ? theme.colors.up : theme.colors.down;
  const toneGlow =
    side.tone === "up"
      ? "rgba(52, 211, 154, 0.45)"
      : "rgba(255, 77, 94, 0.45)";

  // Panel slide-in + fade.
  const enter = interpolate(
    frame,
    [enterStart, enterStart + 18],
    [0, 1],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );
  const x = interpolate(enter, [0, 1], [fromX, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Delta pop shortly after the panel arrives.
  const deltaStart = enterStart + 12;
  const pop = spring({
    frame: frame - deltaStart,
    fps,
    config: { damping: 14, mass: 0.7, stiffness: 130 },
  });
  const deltaScale = interpolate(pop, [0, 1], [0.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const deltaOpacity = interpolate(
    frame,
    [deltaStart, deltaStart + 14],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        width: PANEL_W,
        height: PANEL_H,
        opacity: enter,
        transform: `translateX(${x}px)`,
        borderRadius: 24,
        background: theme.colors.panel,
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: `0 30px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)`,
        padding: "54px 60px",
        display: "flex",
        flexDirection: "column",
        alignItems: align === "right" ? "flex-end" : "flex-start",
        justifyContent: "flex-start",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          fontFamily: theme.fonts.body,
          fontSize: 40,
          fontWeight: 600,
          color: theme.colors.fg,
          letterSpacing: 0.5,
          textAlign: align === "right" ? "right" : "left",
        }}
      >
        {side.label}
      </div>

      <div
        style={{
          flex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: theme.fonts.display,
            fontSize: 120,
            fontWeight: 800,
            lineHeight: 1,
            color: toneColor,
            opacity: deltaOpacity,
            transform: `scale(${deltaScale})`,
            textShadow: `0 0 48px ${toneGlow}, 0 0 14px ${toneGlow}`,
            letterSpacing: -2,
          }}
        >
          {side.delta}
        </div>
      </div>
    </div>
  );
};

export const SplitCompare: React.FC<any> = (props) => {
  const { title, left, right } = props as SplitCompareProps;
  const frame = useCurrentFrame();

  const kickerOpacity = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const kickerY = interpolate(frame, [0, 16], [-18, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const dividerOpacity = interpolate(frame, [18, 32], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dividerScale = interpolate(frame, [18, 32], [0.6, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pairWidth = PANEL_W * 2 + GAP;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 120% at 50% 0%, ${theme.colors.bg2} 0%, ${theme.colors.bg} 60%)`,
        fontFamily: theme.fonts.body,
      }}
    >
      {/* Kicker / title */}
      <div
        style={{
          position: "absolute",
          top: 150,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: kickerOpacity,
          transform: `translateY(${kickerY}px)`,
          fontFamily: theme.fonts.display,
          fontSize: 34,
          fontWeight: 700,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: theme.colors.accent,
          textShadow: "0 0 30px rgba(255,107,61,0.35)",
        }}
      >
        {title}
      </div>

      {/* Panel pair */}
      <div
        style={{
          position: "absolute",
          top: 250,
          left: "50%",
          transform: "translateX(-50%)",
          width: pairWidth,
          height: PANEL_H,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Panel side={left} enterStart={0} fromX={-60} align="left" />
        <Panel side={right} enterStart={8} fromX={60} align="right" />
      </div>

      {/* VS divider */}
      <div
        style={{
          position: "absolute",
          top: 250,
          left: "50%",
          transform: `translateX(-50%) scaleY(${dividerScale})`,
          height: PANEL_H,
          width: 2,
          opacity: dividerOpacity,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "50%",
            width: 2,
            transform: "translateX(-50%)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.12) 20%, rgba(255,255,255,0.12) 80%, rgba(255,255,255,0) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            fontFamily: theme.fonts.display,
            fontSize: 38,
            fontWeight: 800,
            letterSpacing: 2,
            color: theme.colors.accent2,
            background: theme.colors.bg,
            border: "1px solid rgba(245,185,66,0.35)",
            borderRadius: 999,
            width: 78,
            height: 78,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow:
              "0 0 36px rgba(245,185,66,0.28), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          VS
        </div>
      </div>
    </AbsoluteFill>
  );
};

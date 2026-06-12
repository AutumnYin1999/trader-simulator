import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { theme } from "./theme";

type WordBurnProps = {
  word: string;
  sub?: string;
};

export const WordBurn: React.FC<any> = (props) => {
  const { word, sub } = props as WordBurnProps;
  const frame = useCurrentFrame();

  // Intro burn — finishes by ~frame 22, then holds rock-steady.
  const opacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const scale = interpolate(frame, [0, 22], [1.25, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const blur = interpolate(frame, [0, 22], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Subtle brightness flash — peaks early, settles to 1.0 by ~frame 24.
  const brightness = interpolate(
    frame,
    [0, 8, 24],
    [1.6, 1.45, 1.0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    }
  );

  // Glow intensity tracks the flash slightly — strong at the burn, steady after.
  const glowAlpha = interpolate(frame, [0, 10, 24], [0.7, 0.62, 0.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subOpacity = interpolate(frame, [14, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const subTranslate = interpolate(frame, [14, 30], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 46%, ${theme.colors.bg2} 0%, ${theme.colors.bg} 62%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: theme.fonts.display,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${scale})`,
          filter: `blur(${blur}px) brightness(${brightness})`,
          willChange: "transform, filter",
        }}
      >
        <div
          style={{
            fontFamily: theme.fonts.display,
            fontSize: 210,
            fontWeight: 800,
            lineHeight: 1.0,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: theme.colors.accent2,
            opacity,
            textShadow: `0 0 60px rgba(245,185,66,${glowAlpha}), 0 0 22px rgba(245,185,66,${Math.min(
              0.9,
              glowAlpha + 0.25
            )}), 0 0 120px rgba(255,107,61,0.28)`,
            textAlign: "center",
            whiteSpace: "nowrap",
          }}
        >
          {word}
        </div>

        {sub ? (
          <div
            style={{
              marginTop: 34,
              fontFamily: theme.fonts.body,
              fontSize: 38,
              fontWeight: 500,
              letterSpacing: 2,
              color: theme.colors.muted,
              opacity: subOpacity,
              transform: `translateY(${subTranslate}px)`,
              textAlign: "center",
              textTransform: "uppercase",
            }}
          >
            {sub}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

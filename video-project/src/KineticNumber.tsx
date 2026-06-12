import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { theme } from "./theme";

type Tone = "up" | "down" | "accent";

interface KineticNumberProps {
  value: string;
  suffix?: string;
  label: string;
  tone?: Tone;
}

const toneToColor = (tone: Tone): string => {
  switch (tone) {
    case "up":
      return theme.colors.up;
    case "down":
      return theme.colors.down;
    case "accent":
    default:
      return theme.colors.accent;
  }
};

// rgba helper for soft glows keyed off the tone color.
const glowFor = (tone: Tone): string => {
  switch (tone) {
    case "up":
      return "rgba(52, 211, 154, 0.35)";
    case "down":
      return "rgba(255, 77, 94, 0.35)";
    case "accent":
    default:
      return "rgba(255, 107, 61, 0.35)";
  }
};

export const KineticNumber: React.FC<any> = (props) => {
  const {
    value = "0",
    suffix,
    label = "",
    tone = "accent",
  } = props as KineticNumberProps;

  const frame = useCurrentFrame();

  const color = toneToColor(tone);
  const glow = glowFor(tone);

  // Number slam-in: scale 1.18 -> 1.0 with a slight overshoot, opacity 0 -> 1.
  const numScale = interpolate(
    frame,
    [0, 11, 16],
    [1.18, 0.985, 1.0],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const numOpacity = interpolate(frame, [0, 16], [0, 1], {
    easing: Easing.out(Easing.quad),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Label: fade + rise (translateY 24 -> 0) over frames 10-28.
  const labelOpacity = interpolate(frame, [10, 28], [0, 1], {
    easing: Easing.out(Easing.quad),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const labelY = interpolate(frame, [10, 28], [24, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: theme.colors.bg,
        fontFamily: theme.fonts.body,
      }}
    >
      {/* Soft radial wash behind the number for cinematic depth */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 42%, ${theme.colors.bg2} 0%, ${theme.colors.bg} 60%)`,
        }}
      />

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 380,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {/* Hero number row */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "center",
              transform: `scale(${numScale})`,
              opacity: numOpacity,
              willChange: "transform, opacity",
            }}
          >
            <span
              style={{
                fontFamily: theme.fonts.display,
                fontSize: 190,
                fontWeight: 800,
                lineHeight: 1,
                color,
                letterSpacing: "-0.02em",
                textShadow: `0 0 40px ${glow}`,
              }}
            >
              {value}
            </span>
            {suffix ? (
              <span
                style={{
                  fontFamily: theme.fonts.display,
                  fontSize: 70,
                  fontWeight: 700,
                  lineHeight: 1,
                  color: theme.colors.muted,
                  marginLeft: 18,
                  letterSpacing: "-0.01em",
                }}
              >
                {suffix}
              </span>
            ) : null}
          </div>

          {/* Label below the number */}
          <div
            style={{
              marginTop: 44,
              maxWidth: 1300,
              fontSize: 36,
              lineHeight: 1.3,
              color: theme.colors.muted,
              opacity: labelOpacity,
              transform: `translateY(${labelY}px)`,
              willChange: "transform, opacity",
            }}
          >
            {label}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

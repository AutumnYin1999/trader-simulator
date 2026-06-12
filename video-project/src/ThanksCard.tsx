import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { theme } from "./theme";

type ThanksCardProps = {
  name: string;
  line?: string;
};

export const ThanksCard: React.FC<any> = (props) => {
  const { name, line } = props as ThanksCardProps;
  const frame = useCurrentFrame();

  // Slow, gentle ease-out intro that finishes by ~frame 40, then holds.
  const ease = Easing.out(Easing.cubic);

  const opacity = interpolate(frame, [0, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  const rise = interpolate(frame, [0, 40], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  // The warm glow blooms in very slightly slower for a serene feel.
  const glowOpacity = interpolate(frame, [0, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  return (
    <AbsoluteFill
      style={{
        background: theme.colors.bg,
        fontFamily: theme.fonts.body,
        overflow: "hidden",
      }}
    >
      {/* Soft warm radial glow behind the text */}
      <AbsoluteFill
        style={{
          opacity: glowOpacity,
          background: `radial-gradient(circle at 50% 42%, ${hexA(
            theme.colors.accent2,
            0.16
          )} 0%, ${hexA(theme.colors.accent, 0.08)} 28%, rgba(7,10,18,0) 62%)`,
        }}
      />
      {/* A second, tighter gold core for warmth right behind the name */}
      <AbsoluteFill
        style={{
          opacity: glowOpacity,
          background: `radial-gradient(circle at 50% 40%, ${hexA(
            theme.colors.accent2,
            0.12
          )} 0%, rgba(7,10,18,0) 40%)`,
        }}
      />

      {/* Subtle vignette to settle the edges */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(7,10,18,0) 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      <AbsoluteFill
        style={{
          opacity,
          transform: `translateY(${rise}px)`,
        }}
      >
        {/* Kicker */}
        <div
          style={{
            position: "absolute",
            top: 320,
            left: 0,
            width: "100%",
            textAlign: "center",
            fontFamily: theme.fonts.body,
            fontSize: 32,
            fontWeight: 600,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: theme.colors.muted,
          }}
        >
          With Thanks
        </div>

        {/* Name */}
        <div
          style={{
            position: "absolute",
            top: 430,
            left: 0,
            width: "100%",
            textAlign: "center",
            fontFamily: theme.fonts.display,
            fontSize: 140,
            fontWeight: 700,
            lineHeight: 1.05,
            color: theme.colors.fg,
            textShadow: `0 0 60px ${hexA(theme.colors.accent2, 0.35)}, 0 0 18px ${hexA(
              theme.colors.accent2,
              0.25
            )}`,
          }}
        >
          {name}
        </div>

        {/* Optional line */}
        {line ? (
          <div
            style={{
              position: "absolute",
              top: 600,
              left: 0,
              width: "100%",
              textAlign: "center",
              fontFamily: theme.fonts.body,
              fontSize: 40,
              fontWeight: 400,
              letterSpacing: 0.5,
              color: theme.colors.muted,
            }}
          >
            {line}
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Convert a #rrggbb hex to an rgba() string with the given alpha.
function hexA(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

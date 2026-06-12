import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { theme } from "./theme";

type TicketRevealProps = {
  label: string;
  sub?: string;
};

export const TicketReveal: React.FC<any> = (props) => {
  const { label, sub } = props as TicketRevealProps;
  const frame = useCurrentFrame();

  // Intro: ticket scales 0.86 -> 1, opacity 0 -> 1, rotateZ -3 -> 0 over frames 0-20.
  const scale = interpolate(frame, [0, 20], [0.86, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const cardOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rotateZ = interpolate(frame, [0, 20], [-3, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Coral glow blooms (frames 0-12) then settles (frames 12-30).
  const glowBloom = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const glowSettle = interpolate(frame, [12, 30], [1, 0.55], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const glow = glowBloom * glowSettle;
  const glowBlur = 30 + glow * 60;
  const glowAlpha = 0.18 + glow * 0.32;

  // sub fades in frames 16-32.
  const subOpacity = interpolate(frame, [16, 32], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subShift = interpolate(frame, [16, 32], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const CARD_W = 860;
  const CARD_H = 300;

  return (
    <AbsoluteFill
      style={{
        background: theme.colors.bg,
        fontFamily: theme.fonts.body,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Centered slightly above middle */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 470,
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Ticket card */}
        <div
          style={{
            position: "relative",
            width: CARD_W,
            height: CARD_H,
            borderRadius: 22,
            background: `linear-gradient(180deg, ${theme.colors.panel} 0%, ${theme.colors.bg2} 100%)`,
            border: `1.5px solid ${theme.colors.accent}`,
            opacity: cardOpacity,
            transform: `scale(${scale}) rotateZ(${rotateZ}deg)`,
            transformOrigin: "center center",
            boxShadow: `0 28px 70px rgba(0,0,0,0.55), 0 0 ${glowBlur}px rgba(255,107,61,${glowAlpha})`,
            overflow: "hidden",
          }}
        >
          {/* Coral left accent stripe */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 10,
              background: `linear-gradient(180deg, ${theme.colors.accent} 0%, ${theme.colors.accent2} 100%)`,
              boxShadow: `0 0 24px rgba(255,107,61,0.6)`,
            }}
          />

          {/* Faint perforation: dashed vertical line ~70px from right edge */}
          <div
            style={{
              position: "absolute",
              top: 22,
              bottom: 22,
              right: 70,
              width: 0,
              borderLeft: `2px dashed rgba(247,249,252,0.16)`,
            }}
          />

          {/* Top-left uppercase coral tag */}
          <div
            style={{
              position: "absolute",
              top: 30,
              left: 46,
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: theme.colors.accent,
              fontFamily: theme.fonts.body,
              textShadow: `0 0 16px rgba(255,107,61,0.5)`,
            }}
          >
            HKEX · OPTION
          </div>

          {/* Centered label */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 30,
              right: 56,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 28,
            }}
          >
            <div
              style={{
                fontFamily: theme.fonts.display,
                fontSize: 64,
                fontWeight: 700,
                color: theme.colors.fg,
                textAlign: "center",
                lineHeight: 1.05,
                letterSpacing: -0.5,
                textShadow: `0 2px 18px rgba(0,0,0,0.5)`,
              }}
            >
              {label}
            </div>
          </div>
        </div>

        {/* Optional sub line below ticket (~y=700 in 1080-space) */}
        {sub ? (
          <div
            style={{
              position: "absolute",
              top: 230,
              fontSize: 34,
              color: theme.colors.muted,
              opacity: subOpacity,
              transform: `translateY(${subShift}px)`,
              fontFamily: theme.fonts.body,
              letterSpacing: 0.5,
              textAlign: "center",
              whiteSpace: "nowrap",
            }}
          >
            {sub}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

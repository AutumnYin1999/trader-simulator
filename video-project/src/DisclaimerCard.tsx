import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { theme } from "./theme";

// DisclaimerCard — quiet, minimal end card.
// Three muted lines centered beneath a thin coral divider rule.
// Intro: simple fade-in frames 0-30, then hold.
export const DisclaimerCard: React.FC<any> = () => {
  const frame = useCurrentFrame();

  // Single, restrained fade-in. Finishes by frame 30, then holds.
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // A whisper of upward drift so the fade feels intentional, not abrupt.
  const lift = interpolate(frame, [0, 30], [10, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lines = [
    "Educational use only · Not investment advice",
    "Historical figures are real; example trades are illustrative.",
    "Central Trader · Digital Investfair",
  ];

  return (
    <AbsoluteFill
      style={{
        background: theme.colors.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: theme.fonts.body,
      }}
    >
      {/* Very soft warm vignette so the near-black background reads as a finished frame. */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(255,107,61,0.05), rgba(7,10,18,0) 65%)",
        }}
      />

      <div
        style={{
          opacity,
          transform: `translateY(${lift}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          maxWidth: 1200,
          padding: "0 60px",
        }}
      >
        {/* Thin coral divider rule above the lines. */}
        <div
          style={{
            width: 120,
            height: 2,
            borderRadius: 1,
            background: theme.colors.accent,
            boxShadow: "0 0 16px rgba(255,107,61,0.5)",
            marginBottom: 44,
          }}
        />

        {lines.map((text, i) => (
          <div
            key={i}
            style={{
              color: theme.colors.muted,
              fontSize: 34,
              lineHeight: 1.6,
              fontWeight: 400,
              letterSpacing: 0.2,
              // The signature line sits a touch brighter, gently anchoring the card.
              ...(i === lines.length - 1
                ? { color: "#aab2c2", marginTop: 8, letterSpacing: 0.4 }
                : {}),
            }}
          >
            {text}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

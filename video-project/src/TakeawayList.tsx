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

type TakeawayListProps = {
  title: string;
  items: string[];
  numbered?: boolean;
};

const COLUMN_WIDTH = 1100;
const ROW_HEIGHT = 96;
const LIST_TOP = 280;
const STAGGER = 6;

export const TakeawayList: React.FC<any> = (props) => {
  const { title, items, numbered = false } = props as TakeawayListProps;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const safeItems: string[] = Array.isArray(items) ? items.slice(0, 5) : [];

  // Kicker / title intro
  const kickerOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const kickerY = interpolate(frame, [0, 22], [-18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Thin accent rule under the kicker
  const ruleWidth = interpolate(frame, [8, 30], [0, 220], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(1200px 700px at 50% 18%, ${theme.colors.bg2} 0%, ${theme.colors.bg} 62%)`,
        fontFamily: theme.fonts.body,
        color: theme.colors.fg,
        overflow: "hidden",
      }}
    >
      {/* Soft top vignette glow */}
      <div
        style={{
          position: "absolute",
          top: -260,
          left: "50%",
          transform: "translateX(-50%)",
          width: 1400,
          height: 700,
          background: `radial-gradient(closest-side, ${hexToRgba(
            theme.colors.accent,
            0.1
          )}, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Kicker title */}
      <div
        style={{
          position: "absolute",
          top: 116,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: kickerOpacity,
          transform: `translateY(${kickerY}px)`,
        }}
      >
        <div
          style={{
            fontFamily: theme.fonts.display,
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: theme.colors.accent,
            textShadow: `0 0 30px ${hexToRgba(theme.colors.accent, 0.45)}`,
          }}
        >
          {title}
        </div>
        <div
          style={{
            margin: "22px auto 0",
            width: ruleWidth,
            height: 3,
            borderRadius: 2,
            background: `linear-gradient(90deg, ${hexToRgba(
              theme.colors.accent2,
              0
            )}, ${theme.colors.accent2}, ${hexToRgba(theme.colors.accent2, 0)})`,
            boxShadow: `0 0 18px ${hexToRgba(theme.colors.accent2, 0.5)}`,
          }}
        />
      </div>

      {/* Items column */}
      <div
        style={{
          position: "absolute",
          top: LIST_TOP,
          left: "50%",
          transform: "translateX(-50%)",
          width: COLUMN_WIDTH,
        }}
      >
        {safeItems.map((item, i) => {
          const start = 26 + i * STAGGER;

          const opacity = interpolate(frame, [start, start + 16], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const x = interpolate(frame, [start, start + 18], [-40, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });
          const markerScale = spring({
            frame: frame - start,
            fps,
            config: { damping: 14, mass: 0.6, stiffness: 140 },
            from: 0.6,
            to: 1,
          });

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                height: ROW_HEIGHT,
                opacity,
                transform: `translateX(${x}px)`,
              }}
            >
              {/* Marker */}
              <div
                style={{
                  flex: "0 0 auto",
                  width: numbered ? 64 : 80,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 36,
                  transform: `scale(${markerScale})`,
                }}
              >
                {numbered ? (
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 16,
                      background: `linear-gradient(160deg, ${theme.colors.accent}, ${hexToRgba(
                        theme.colors.accent,
                        0.82
                      )})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: theme.fonts.display,
                      fontSize: 34,
                      fontWeight: 800,
                      color: theme.colors.fg,
                      boxShadow: `0 10px 30px ${hexToRgba(
                        theme.colors.accent,
                        0.4
                      )}, inset 0 1px 0 ${hexToRgba("#ffffff", 0.25)}`,
                    }}
                  >
                    {i + 1}
                  </div>
                ) : (
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      background: theme.colors.accent,
                      transform: "rotate(45deg)",
                      borderRadius: 4,
                      boxShadow: `0 0 20px ${hexToRgba(
                        theme.colors.accent,
                        0.65
                      )}`,
                    }}
                  />
                )}
              </div>

              {/* Item text */}
              <div
                style={{
                  flex: "1 1 auto",
                  fontFamily: theme.fonts.display,
                  fontSize: 52,
                  fontWeight: 600,
                  lineHeight: 1.1,
                  color: theme.colors.fg,
                  textShadow: `0 2px 24px ${hexToRgba("#000000", 0.5)}`,
                }}
              >
                {item}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

function hexToRgba(hex: string, alpha: number): string {
  let h = hex.replace("#", "");
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

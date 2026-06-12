import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "./theme";
import { Skyline } from "./Skyline";

// Title hits + chapter beats. logo=true gives the brand sting (two-tone wordmark
// + skyline). Otherwise a clean kicker / title / subtitle stack.
export const CinematicTitle: React.FC<any> = ({ title, subtitle, kicker, logo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const intro = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 26 });
  const rise = interpolate(intro, [0, 1], [38, 0]);
  const op = interpolate(frame, [0, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subOp = interpolate(frame, [16, 38], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const renderTitle = () => {
    if (logo) {
      const parts = String(title).split(" ");
      return (
        <div style={{ font: `800 154px ${theme.fonts.display}`, letterSpacing: 2, textAlign: "center", lineHeight: 1.04 }}>
          <span style={{ color: theme.colors.accent, textShadow: "0 0 54px rgba(255,107,61,0.5)" }}>{parts[0]}</span>
          {parts.length > 1 && <span style={{ color: theme.colors.fg }}> {parts.slice(1).join(" ")}</span>}
        </div>
      );
    }
    return (
      <div
        style={{
          font: `700 96px ${theme.fonts.display}`,
          color: theme.colors.fg,
          textAlign: "center",
          lineHeight: 1.1,
          maxWidth: 1500,
          textShadow: "0 0 40px rgba(0,0,0,0.6)",
        }}
      >
        {title}
      </div>
    );
  };

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 90% at 50% 16%, ${theme.colors.bg2} 0%, ${theme.colors.bg} 62%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {logo && <Skyline opacity={0.9} />}
      <div
        style={{
          transform: `translateY(${rise}px)`,
          opacity: op,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 26,
          zIndex: 2,
        }}
      >
        {kicker ? (
          <div style={{ font: `700 32px ${theme.fonts.body}`, letterSpacing: 6, textTransform: "uppercase", color: theme.colors.accent }}>
            {kicker}
          </div>
        ) : null}
        {renderTitle()}
        {subtitle ? (
          <div style={{ font: `400 40px ${theme.fonts.body}`, color: theme.colors.muted, opacity: subOp, textAlign: "center", maxWidth: 1300 }}>
            {subtitle}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

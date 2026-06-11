import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { theme } from "./theme";

// Outro QR scene (C5-9): big scannable code + the URL in plain text.
export const QrCard: React.FC<{ title?: string; subtitle?: string }> = ({
  title = "Scan to trade",
  subtitle = "zeref007.github.io/trader-simulator",
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const pop = interpolate(frame, [0, 14], [0.92, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill
      style={{
        background: theme.colors.bg,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 36,
        opacity,
      }}
    >
      <div style={{ color: theme.colors.fg, font: `700 64px ${theme.fonts.display}` }}>{title}</div>
      <div
        style={{
          background: "#ffffff",
          padding: 28,
          borderRadius: 24,
          boxShadow: "0 18px 60px rgba(0,0,0,0.5)",
          transform: `scale(${pop})`,
        }}
      >
        <Img src={staticFile("qr.png")} style={{ width: 460, height: 460, display: "block" }} />
      </div>
      <div style={{ color: theme.colors.accent, font: `600 44px ${theme.fonts.body}` }}>{subtitle}</div>
    </AbsoluteFill>
  );
};

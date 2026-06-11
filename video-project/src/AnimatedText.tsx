import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "./theme";
export const AnimatedText: React.FC<{ text: string; emphasis?: string[] }> = ({ text, emphasis = [] }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ opacity, color: theme.colors.fg, font: `64px ${theme.fonts.display}` }}>
      {text.split(/(\s+)/).map((w, i) =>
        emphasis.includes(w.trim()) ? <span key={i} style={{ color: theme.colors.accent }}>{w}</span> : <span key={i}>{w}</span>
      )}
    </div>
  );
};

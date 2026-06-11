import { AbsoluteFill } from "remotion";
import { theme } from "./theme";
export const StatCard: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <AbsoluteFill style={{ background: theme.colors.bg, justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
    <div style={{ color: theme.colors.accent, font: `128px ${theme.fonts.display}` }}>{value}</div>
    <div style={{ color: theme.colors.fg, font: `36px ${theme.fonts.body}` }}>{label}</div>
  </AbsoluteFill>
);

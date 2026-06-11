import { AbsoluteFill } from "remotion";
import { theme } from "./theme";
export const ModuleOverview: React.FC<{ items: { title: string; desc: string }[] }> = ({ items }) => (
  <AbsoluteFill style={{ background: theme.colors.bg, padding: 80, color: theme.colors.fg, gap: 24 }}>
    {items.map((it, i) => (
      <div key={i} style={{ font: `40px ${theme.fonts.display}` }}>
        <span style={{ color: theme.colors.accent }}>{it.title}</span>
        <span style={{ marginLeft: 16, font: `28px ${theme.fonts.body}` }}>{it.desc}</span>
      </div>
    ))}
  </AbsoluteFill>
);

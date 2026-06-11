import { AbsoluteFill } from "remotion";
import { AnimatedText } from "./AnimatedText";
import { theme } from "./theme";
export const TitleCard: React.FC<{ title: string; subtitle?: string; emphasis?: string[] }> = ({ title, subtitle, emphasis }) => (
  <AbsoluteFill style={{ background: theme.colors.bg, justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 24 }}>
    <AnimatedText text={title} emphasis={emphasis} />
    {subtitle && <div style={{ color: theme.colors.muted, font: `32px ${theme.fonts.body}` }}>{subtitle}</div>}
  </AbsoluteFill>
);

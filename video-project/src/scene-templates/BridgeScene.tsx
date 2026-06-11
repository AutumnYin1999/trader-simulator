import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { Subtitles, Sentence } from "../Subtitles";
import { theme } from "../theme";

export const BridgeScene: React.FC<{
  entry: { id: string; visual: { props: { fromAct: string; toAct: string; message?: string } }; captions: Sentence[]; audioSrc: string };
}> = ({ entry }) => {
  const { fps } = useVideoConfig();
  const dur = Math.ceil((entry.captions.at(-1)?.end ?? 1) * fps);
  return (
    <Sequence durationInFrames={dur}>
      <Audio src={staticFile(entry.audioSrc)} />
      <AbsoluteFill style={{ background: theme.colors.bg, justifyContent: "center", alignItems: "center" }}>
        <div style={{ color: theme.colors.fg, font: `40px ${theme.fonts.body}` }}>
          {entry.visual.props.message ?? `${entry.visual.props.fromAct} → ${entry.visual.props.toAct}`}
        </div>
      </AbsoluteFill>
      <Subtitles sentences={entry.captions} />
    </Sequence>
  );
};

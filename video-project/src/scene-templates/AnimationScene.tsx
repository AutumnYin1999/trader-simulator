import { Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { componentRegistry, ComponentName } from "../component-registry";
import { Subtitles, Sentence } from "../Subtitles";

export type AnimationEntry = {
  id: string;
  visual: { component: ComponentName; props: Record<string, unknown>; enter?: string; emphasis?: string[] };
  captions: Sentence[];
  audioSrc: string;
};

export const AnimationScene: React.FC<{ entry: AnimationEntry }> = ({ entry }) => {
  const Comp = componentRegistry[entry.visual.component];
  const { fps } = useVideoConfig();
  const dur = Math.ceil((entry.captions.at(-1)?.end ?? 1) * fps);
  return (
    <Sequence durationInFrames={dur}>
      <Audio src={staticFile(entry.audioSrc)} />
      <Comp {...entry.visual.props} emphasis={entry.visual.emphasis} />
      <Subtitles sentences={entry.captions} />
    </Sequence>
  );
};

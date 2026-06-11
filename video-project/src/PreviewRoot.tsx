import { Composition, AbsoluteFill, Audio, Sequence, registerRoot, staticFile } from "remotion";
import { Subtitles } from "./Subtitles";
import entries from "./preview-entries.json";

const TOTAL = (entries as any[]).reduce((a, e) => a + e.durationFrames, 0);

const Preview: React.FC = () => {
  let offset = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {(entries as any[]).map((e) => {
        const from = offset;
        offset += e.durationFrames;
        return (
          <Sequence key={e.id} from={from} durationInFrames={e.durationFrames}>
            <Audio src={staticFile(e.audioSrc)} />
            <Subtitles sentences={e.sentences} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

export const RemotionRoot: React.FC = () => (
  <Composition id="Preview" component={Preview} fps={30} width={1920} height={1080} durationInFrames={TOTAL} />
);

registerRoot(RemotionRoot);

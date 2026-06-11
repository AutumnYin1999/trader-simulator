import { Composition, delayRender, continueRender, staticFile } from "remotion";
import { useEffect, useState } from "react";
import { theme } from "./theme";
import { AnimationScene } from "./scene-templates/AnimationScene";
import { BrowserRecordingScene } from "./scene-templates/BrowserRecordingScene";
import { BridgeScene } from "./scene-templates/BridgeScene";
import manifest from "../../narration-manifest.json";
import { loadSegments } from "./segment-loader";

const PROVIDER = process.env.REMOTION_PROVIDER ?? "edge";

type CaptionsMap = Record<string, any>;

const Video: React.FC<{ captionsMap: CaptionsMap }> = ({ captionsMap }) => {
  const segments = loadSegments(PROVIDER);
  return (
    <>
      {(manifest as any[]).map((entry) => {
        const captions = captionsMap[entry.id];
        if (!captions) throw new Error(`captions missing for ${entry.id}`);
        const audioSrc = staticFile(`voiceover/${PROVIDER}/${entry.id}.mp3`);
        if (entry.sceneType === "animation") {
          return <AnimationScene key={entry.id} entry={{ ...entry, captions, audioSrc }} />;
        }
        if (entry.sceneType === "browser-recording") {
          const seg = segments.find((s) => s.id === entry.id);
          if (!seg) throw new Error(`segment missing: ${entry.id}`);
          return <BrowserRecordingScene key={entry.id} segment={seg} captions={captions} audioSrc={audioSrc} />;
        }
        if (entry.sceneType === "bridge") {
          return <BridgeScene key={entry.id} entry={{ ...entry, captions, audioSrc }} />;
        }
        return null;
      })}
    </>
  );
};

const VideoLoader: React.FC = () => {
  const [captionsMap, setCaptionsMap] = useState<CaptionsMap | null>(null);
  const [handle] = useState(() => delayRender("loading captions"));

  useEffect(() => {
    (async () => {
      const map: CaptionsMap = {};
      for (const entry of manifest as any[]) {
        const url = staticFile(`captions/${PROVIDER}/${entry.id}.json`);
        const res = await fetch(url);
        if (!res.ok) throw new Error(`captions fetch failed: ${entry.id}`);
        map[entry.id] = await res.json();
      }
      setCaptionsMap(map);
      continueRender(handle);
    })();
  }, [handle]);

  if (!captionsMap) return null;
  return <Video captionsMap={captionsMap} />;
};

export const RemotionRoot: React.FC = () => (
  <Composition
    id="NarrationDrivenVideo"
    component={VideoLoader}
    fps={theme.fps}
    width={theme.width}
    height={theme.height}
    durationInFrames={30 * 60 * 10}
  />
);

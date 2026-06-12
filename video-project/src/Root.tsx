import {
  AbsoluteFill,
  Audio,
  Composition,
  OffthreadVideo,
  Sequence,
  continueRender,
  delayRender,
  registerRoot,
  staticFile,
} from "remotion";
import { useEffect, useState } from "react";
import { theme } from "./theme";
import { Subtitles, Sentence } from "./Subtitles";
import { componentRegistry, ComponentName } from "./component-registry";
import timeline from "./timeline.json";
import manifest from "../narration-manifest.json";

// v3: no on-screen presenter. Scenes are cinematic components or game footage,
// captions + audio only. (Jordan Bull avatar removed per the "no presenter" cut.)

type TimelineItem = (typeof timeline)[number];
type ManifestEntry = (typeof manifest)[number];

const manifestById: Record<string, ManifestEntry> = Object.fromEntries(
  (manifest as ManifestEntry[]).map((e) => [e.id, e])
);
const TOTAL_FRAMES = timeline.reduce((a, t) => a + t.durationInFrames, 0);

// Animation entry visual: registered component from the manifest.
const AnimationVisual: React.FC<{ entry: ManifestEntry }> = ({ entry }) => {
  const visual = (entry as any).visual ?? {};
  const Comp = componentRegistry[visual.component as ComponentName];
  if (!Comp) throw new Error(`unregistered component for ${entry.id}: ${visual.component}`);
  return <Comp {...(visual.props ?? {})} emphasis={visual.emphasis ?? visual.props?.emphasis} />;
};

const AnimationScene: React.FC<{ item: TimelineItem; sentences: Sentence[] }> = ({ item, sentences }) => {
  const entry = manifestById[item.id];
  return (
    <AbsoluteFill style={{ background: theme.colors.bg }}>
      <AnimationVisual entry={entry} />
      <Subtitles sentences={sentences} />
      <Audio src={staticFile(item.audioSrc)} />
    </AbsoluteFill>
  );
};

const BrowserScene: React.FC<{ item: TimelineItem; sentences: Sentence[] }> = ({ item, sentences }) => {
  const seg = item.segment!;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <OffthreadVideo
        muted
        src={staticFile(seg.src)}
        startFrom={seg.startFrom}
        playbackRate={seg.playbackRate}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
      <Subtitles sentences={sentences} />
      <Audio src={staticFile(item.audioSrc)} />
    </AbsoluteFill>
  );
};

type CaptionsMap = Record<string, Sentence[]>;

const Stage: React.FC<{ captionsMap: CaptionsMap }> = ({ captionsMap }) => (
  <AbsoluteFill style={{ background: theme.colors.bg }}>
    {(timeline as TimelineItem[]).map((item) => {
      const sentences = captionsMap[item.id];
      if (!sentences) throw new Error(`captions missing for ${item.id}`);
      return (
        <Sequence key={item.id} from={item.from} durationInFrames={item.durationInFrames}>
          {item.sceneType === "browser-recording" ? (
            <BrowserScene item={item} sentences={sentences} />
          ) : (
            <AnimationScene item={item} sentences={sentences} />
          )}
        </Sequence>
      );
    })}
  </AbsoluteFill>
);

// The whole scene tree is authored at 1920x1080. To render crisp 4K we keep that
// coordinate space and uniformly scale it to fill the 3840x2160 composition.
// Vector/CSS (cards, captions, avatar) scale losslessly; the 1080p game
// recordings upscale via OffthreadVideo (their on-screen text is already sharp).
const Video: React.FC<{ captionsMap: CaptionsMap }> = ({ captionsMap }) => (
  <AbsoluteFill style={{ background: theme.colors.bg }}>
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: theme.authorWidth,
        height: theme.authorHeight,
        transform: `scale(${theme.scale})`,
        transformOrigin: "top left",
      }}
    >
      <Stage captionsMap={captionsMap} />
    </div>
  </AbsoluteFill>
);

// Captions are fetched from public/ via staticFile + fetch + delayRender
// (dynamic require() does not survive the webpack bundle).
const VideoLoader: React.FC = () => {
  const [captionsMap, setCaptionsMap] = useState<CaptionsMap | null>(null);
  const [handle] = useState(() => delayRender("loading captions"));

  useEffect(() => {
    (async () => {
      const pairs = await Promise.all(
        (timeline as TimelineItem[]).map(async (item) => {
          const res = await fetch(staticFile(item.captionsSrc));
          if (!res.ok) throw new Error(`captions fetch failed: ${item.id}`);
          return [item.id, (await res.json()) as Sentence[]] as const;
        })
      );
      setCaptionsMap(Object.fromEntries(pairs));
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
    durationInFrames={TOTAL_FRAMES}
  />
);

registerRoot(RemotionRoot);

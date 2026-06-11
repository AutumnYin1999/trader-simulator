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
import { JordanBull } from "./JordanBull";
import { QrCard } from "./QrCard";
import timeline from "./timeline.json";
import manifest from "../narration-manifest.json";

// Scenes where Jordan Bull is the featured visual (left half-frame);
// everywhere else he appears as a bottom-right pip badge.
const FEATURE_SCENES = new Set(["C1-4", "C1-5", "C3-2", "C4-2", "C4-10", "C5-8"]);

type TimelineItem = (typeof timeline)[number];
type ManifestEntry = (typeof manifest)[number];

const manifestById: Record<string, ManifestEntry> = Object.fromEntries(
  (manifest as ManifestEntry[]).map((e) => [e.id, e])
);
const TOTAL_FRAMES = timeline.reduce((a, t) => a + t.durationInFrames, 0);

const seedFor = (id: string) => id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 7;

// Animation entry visual: registered component from the manifest (QR special
// case for C5-9, which shows the scannable code + URL instead of a TitleCard).
const AnimationVisual: React.FC<{ entry: ManifestEntry }> = ({ entry }) => {
  const visual = (entry as any).visual ?? {};
  if (entry.id === "C5-9") {
    return <QrCard title={visual.props?.title} subtitle={visual.props?.subtitle} />;
  }
  const Comp = componentRegistry[visual.component as ComponentName];
  if (!Comp) throw new Error(`unregistered component for ${entry.id}: ${visual.component}`);
  return <Comp {...(visual.props ?? {})} emphasis={visual.emphasis ?? visual.props?.emphasis} />;
};

const AnimationScene: React.FC<{ item: TimelineItem; sentences: Sentence[] }> = ({ item, sentences }) => {
  const entry = manifestById[item.id];
  const featured = FEATURE_SCENES.has(item.id);
  return (
    <AbsoluteFill style={{ background: theme.colors.bg }}>
      {featured ? (
        <>
          <div style={{ position: "absolute", left: "50%", top: 0, width: "50%", height: "100%" }}>
            <AnimationVisual entry={entry} />
          </div>
          <JordanBull mode="feature" sentences={sentences} seed={seedFor(item.id)} />
        </>
      ) : (
        <>
          <AnimationVisual entry={entry} />
          <JordanBull mode="pip" sentences={sentences} seed={seedFor(item.id)} />
        </>
      )}
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
        endAt={seg.endAt}
        playbackRate={seg.playbackRate}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
      <JordanBull mode="pip" sentences={sentences} seed={seedFor(item.id)} />
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

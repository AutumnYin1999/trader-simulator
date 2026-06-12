// Builds src/timeline.json: one entry per manifest scene with absolute frame
// offsets, durations, audio/captions paths and (for browser scenes) the
// recording slice + playbackRate per the segment model.
// Also emits out/boundaries.json with per-clip frame ranges for ffmpeg cutting.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FPS = 30;
const PROVIDER = "edge";

// Pacing: narration TTS runs fast (+5%..+11%); tail dwell (silence after the
// line) lets the cut breathe and read. Per-scene model:
//   durationInFrames = max(ceil((narrationSec + tail) * FPS), minFrames)
// Tuned so the full (expanded) video lands in [11:00, 12:00].
// v3 pacing: tight. The old build held ~1.8-2.2s of dead air after every card,
// which read as "long pauses". Cut tails hard so the cinematic cuts move.
const ANIM_PAD_SEC = 1.0; // default hold after an animation card's line
const BROWSER_PAD_SEC = 0.65; // default beat after each demo scene
const TITLE_TAIL_SEC = 1.5; // title/chapter beats breathe a touch longer
const EXTRA_PAD = { "N01": 0.8, "S04": 0.8, "N11": 0.7, "S05": 0.8, "N33": 2.5, "N35": 1.8 }; // cold-open land, title hit, volatility burn, thanks, QR scan, logo sting
// Hard floors (total scene seconds) for beats that must linger regardless of
// how short the narration is.
const MIN_SCENE_SEC = { "N11": 5.0, "N31": 5.0, "N34": 5.0, "N35": 3.5 }; // volatility burn, price row, disclaimer, logo

const manifest = JSON.parse(readFileSync(join(ROOT, "narration-manifest.json"), "utf8"));
const segments = JSON.parse(readFileSync(join(ROOT, `segments-${PROVIDER}.json`), "utf8"));
const segById = Object.fromEntries(segments.map((s) => [s.id, s]));

// Chapter / title cards (T-* plus the opening/closing TitleCard scenes) get a
// slightly longer, fixed tail so a single short line still breathes on screen.
function isTitleCard(entry) {
  return entry.sceneType === "animation" && entry.visual &&
    (entry.visual.component === "CinematicTitle" || entry.visual.component === "TitleCard");
}
function tailFor(entry) {
  const base = entry.sceneType === "animation"
    ? (isTitleCard(entry) ? TITLE_TAIL_SEC : ANIM_PAD_SEC)
    : BROWSER_PAD_SEC;
  return base + (EXTRA_PAD[entry.id] ?? 0);
}

function audioDur(id) {
  const out = execFileSync("ffprobe", [
    "-v", "error", "-show_entries", "format=duration",
    "-of", "default=nw=1:nk=1",
    join(ROOT, "voiceover", PROVIDER, `${id}.mp3`),
  ]).toString().trim();
  return parseFloat(out);
}

const timeline = [];
let from = 0;
const rates = [];
for (const entry of manifest) {
  const captions = JSON.parse(readFileSync(join(ROOT, "captions", PROVIDER, `${entry.id}.json`), "utf8"));
  const capEnd = captions.length ? captions[captions.length - 1].end : 0;
  const aDur = audioDur(entry.id);
  const narrationSec = Math.max(aDur, capEnd);
  const sceneSec = Math.max(narrationSec + tailFor(entry), MIN_SCENE_SEC[entry.id] ?? 0);
  const durationInFrames = Math.ceil(sceneSec * FPS);

  const item = {
    id: entry.id,
    scene: entry.scene,
    sceneType: entry.sceneType,
    from,
    durationInFrames,
    audioSrc: `voiceover/${PROVIDER}/${entry.id}.mp3`,
    captionsSrc: `captions/${PROVIDER}/${entry.id}.json`,
  };
  if (entry.sceneType === "browser-recording") {
    const seg = segById[entry.id];
    if (!seg) throw new Error(`segment missing for ${entry.id}`);
    const recDur = seg.recordingEndSec - seg.recordingStartSec;
    const playbackRate = recDur / (durationInFrames / FPS);
    rates.push({ id: entry.id, playbackRate: +playbackRate.toFixed(3) });
    // No endAt: Remotion applies the trim in local frames WITHOUT scaling by
    // playbackRate, so any slowed scene (rate<1) goes black for its tail. The
    // Sequence already bounds the scene and each seg-*.mp4 carries a 0.8s
    // cloned tail pad, so the right trim is unnecessary.
    item.segment = {
      src: seg.src.replace(/\.webm$/, ".mp4"),
      startFrom: Math.round(seg.recordingStartSec * FPS) + 1, // frame-flash +1
      playbackRate: +playbackRate.toFixed(5),
    };
  }
  timeline.push(item);
  from += durationInFrames;
}

const total = from;
writeFileSync(join(ROOT, "src", "timeline.json"), JSON.stringify(timeline, null, 2));

// clip boundaries by scene group
const groups = ["clip1-hook", "clip2-ticket", "clip3-pricing", "clip4-barrier", "clip5-graduation"];
const boundaries = groups.map((g, i) => {
  const items = timeline.filter((t) => t.scene === g);
  const start = items[0].from;
  const end = items[items.length - 1].from + items[items.length - 1].durationInFrames;
  return { clip: i + 1, scene: g, startFrame: start, endFrame: end, startSec: +(start / FPS).toFixed(3), endSec: +(end / FPS).toFixed(3) };
});
mkdirSync(join(ROOT, "out"), { recursive: true });
writeFileSync(join(ROOT, "out", "boundaries.json"), JSON.stringify({ fps: FPS, totalFrames: total, boundaries }, null, 2));

const mm = Math.floor(total / FPS / 60), ss = (total / FPS) % 60;
console.log(`scenes: ${timeline.length}, totalFrames: ${total}, duration: ${mm}m${ss.toFixed(1)}s`);
console.log("playbackRates:", rates.map((r) => `${r.id}:${r.playbackRate}`).join(" "));
const extremes = rates.filter((r) => r.playbackRate > 1.25 || r.playbackRate < 0.7);
if (extremes.length) console.log("WARNING extreme rates:", JSON.stringify(extremes));
console.log("boundaries:", boundaries.map((b) => `clip${b.clip}: ${b.startSec}s-${b.endSec}s`).join("  "));

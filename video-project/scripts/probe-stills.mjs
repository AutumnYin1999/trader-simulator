// Bundle once, render a still per target scene (post-intro frame) at low scale
// to eyeball every cinematic component before the full 4K render.
import { bundle } from "@remotion/bundler";
import { selectComposition, renderStill } from "@remotion/renderer";
import { readFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(".");
const timeline = JSON.parse(readFileSync(path.join(ROOT, "src/timeline.json"), "utf8"));
const byId = Object.fromEntries(timeline.map((t) => [t.id, t]));

// id -> fraction-through-scene to sample (default 0.6; later for fold/shatter)
const TARGETS = {
  S05: 0.6, S06: 0.7, S11: 0.5, S12: 0.6, S21: 0.6, S23: 0.8, S24: 0.5,
  S32: 0.5, S33: 0.8, S42: 0.5, S44: 0.8, S10: 0.6,
};

mkdirSync(path.join(ROOT, "out/still"), { recursive: true });
const serveUrl = await bundle({ entryPoint: path.join(ROOT, "src/Root.tsx") });
const composition = await selectComposition({ serveUrl, id: "NarrationDrivenVideo" });

for (const [id, frac] of Object.entries(TARGETS)) {
  const t = byId[id];
  if (!t) { console.log("MISSING", id); continue; }
  const frame = Math.min(t.from + Math.floor(t.durationInFrames * frac), composition.durationInFrames - 1);
  await renderStill({ serveUrl, composition, output: path.join(ROOT, `out/still/${id}.png`), frame, scale: 0.4 });
  console.log("still", id, "frame", frame);
}
console.log("done");

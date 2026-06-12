import { bundle } from "@remotion/bundler";
import { selectComposition, renderStill } from "@remotion/renderer";
import { readFileSync } from "node:fs";
import path from "node:path";
const ROOT = path.resolve(".");
const tl = JSON.parse(readFileSync("src/timeline.json","utf8"));
const serveUrl = await bundle({ entryPoint: path.join(ROOT,"src/Root.tsx") });
const composition = await selectComposition({ serveUrl, id: "NarrationDrivenVideo" });
for (const [id, fracs] of [["S44",[0.85,0.95]],["S17",[0.9]],["S25",[0.9]],["S16",[0.95]]]) {
  const t = tl.find(e=>e.id===id);
  for (const frac of fracs) {
    const frame = t.from + Math.floor(t.durationInFrames*frac);
    await renderStill({ serveUrl, composition, output: `out/still/${id}-v2-${frac}.png`, frame, scale: 0.3 });
    console.log(id, frac, "rendered");
  }
}

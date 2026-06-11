// record-demo.template.ts — voice-led Playwright recording.
//
// Delegates: playwright-recording skill for browser launch, login, storageState, scroll basics.
// Adds:
//   - Voice-led capture loop: load voiceover MP3, play in page, gate actions on audio.currentTime.
//   - DOM cursor overlay (cursor-overlay.ts).
//   - Segment marker emission tied to manifest IDs.
//   - Post-recording gap-closing pass writes segments-{provider}.json (merged across clips).
//   - visual.preRoll executor: first browser entry of a clip seeds app state before the
//     playlist is injected (footage before entry 1's begin mark is discarded downstream).
//   - visual.steps executor for action "custom": raw async Playwright lines over `page`.
//   - clip1-hook only: C1-9 issues page.goto mid-audio, which would destroy an in-page
//     <audio>; the gate audio is hosted in a separate page of the same context and all
//     audio gates poll that page (RECORDING.md section 3). The silent audio-page webm is
//     deleted after the run; the main page webm is kept as recordings/<provider>/<scene>.webm.
//
// Usage: ts-node record-demo.template.ts --provider edge --scene name-screening
import { chromium, Page } from "playwright";
import * as fs from "fs/promises";
import * as path from "path";
import { CURSOR_INIT_SCRIPT, easeInOut } from "./cursor-overlay";

type ManifestEntry = {
  id: string;
  sceneType: string;
  scene: string;
  text: string;
  visual: {
    action: string;
    target?: string;
    scroll?: { distance: number; duration: number };
    description?: string;
    preRoll?: string[];
    steps?: string[];
  };
};

type SegMark = { id: string; event: "begin" | "end"; t: number };

type Segment = {
  id: string;
  voiceoverStartSec: number;
  voiceoverEndSec: number;
  recordingStartSec: number;
  recordingEndSec: number;
  src: string;
};

// Entries are short (< 30s of narration), but montage steps can eat into the gate wait;
// keep a generous ceiling so a slow step does not abort the run spuriously.
const AUDIO_GATE_TIMEOUT_MS = 120_000;

// Execute one manifest-authored line of async Playwright code against `page`.
async function runLine(page: Page, line: string) {
  await new Function("page", `return (async () => { ${line} })();`)(page);
}

async function smoothMove(page: Page, fromXY: [number, number], toXY: [number, number], duration: number) {
  const steps = Math.max(2, Math.round(duration / 16));
  for (let i = 0; i <= steps; i++) {
    const k = easeInOut(i / steps);
    const x = fromXY[0] + (toXY[0] - fromXY[0]) * k;
    const y = fromXY[1] + (toXY[1] - fromXY[1]) * k;
    await page.evaluate(([x, y]) => (window as any).__moveCursor(x, y), [x, y]);
    await page.waitForTimeout(duration / steps);
  }
}

async function main() {
  const args = Object.fromEntries(process.argv.slice(2).reduce((acc: string[][], a) => {
    if (a.startsWith("--")) acc.push([a.replace(/^--/, ""), ""]);
    else acc[acc.length - 1][1] = a;
    return acc;
  }, [] as string[][]));
  const provider = args.provider ?? "edge";
  const scene = args.scene ?? "demo";

  const manifest: ManifestEntry[] = JSON.parse(await fs.readFile("narration-manifest.json", "utf-8"));
  const entries = manifest.filter((e) => e.scene === scene && e.sceneType === "browser-recording");

  const recDir = path.join("recordings", provider);
  await fs.mkdir(recDir, { recursive: true });

  const browser = await chromium.launch({
    headless: false,
    slowMo: 50,
    // Playwright 1.60 does not ship this switch by default; without it Chromium may block
    // the gestureless audio.play() that drives the voice-led gating.
    args: ["--autoplay-policy=no-user-gesture-required"],
  });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { dir: recDir, size: { width: 1920, height: 1080 } },
    storageState: (await fs.stat("storageState.json").catch(() => null)) ? "storageState.json" : undefined,
  });
  await context.addInitScript({ content: CURSOR_INIT_SCRIPT });

  // clip1-hook hosts the gate audio in a separate page (opened BEFORE the main page) so
  // C1-9's page.goto cannot kill it. Other clips never navigate mid-audio.
  const audioPage = scene === "clip1-hook" ? await context.newPage() : null;
  const page = await context.newPage();
  const gatePage = audioPage ?? page;

  const marks: SegMark[] = [];
  const t0 = Date.now();
  const mark = (id: string, event: "begin" | "end") => marks.push({ id, event, t: (Date.now() - t0) / 1000 });

  // Inject and play voiceover concatenation. Read files server-side and pass as data URLs
  // so the recording works without a web server.
  const audioDataUrls = await Promise.all(
    entries.map(async (e) => {
      const buf = await fs.readFile(path.join("voiceover", provider, `${e.id}.mp3`));
      return `data:audio/mpeg;base64,${buf.toString("base64")}`;
    })
  );
  await page.goto(process.env.RECORD_START_URL ?? "about:blank");

  // preRoll: the first browser entry of a clip may carry setup lines (reset/seed
  // localStorage, click through to the start stage). Run them BEFORE injecting the
  // playlist; segment extraction starts at entry 1's begin mark, so this footage drops.
  for (const line of entries[0]?.visual.preRoll ?? []) {
    await runLine(page, line);
  }

  await gatePage.evaluate(({ srcList }) => {
    const audio = new Audio();
    (window as any).__audio = audio;
    (window as any).__playlist = srcList;
    (window as any).__playlistIdx = 0;
    audio.src = srcList[0];
    audio.onended = () => {
      const nx = ++(window as any).__playlistIdx;
      if (nx < srcList.length) { audio.src = srcList[nx]; audio.play(); }
    };
    audio.play();
  }, { srcList: audioDataUrls });

  let cursor: [number, number] = [200, 200];
  for (const entry of entries) {
    mark(entry.id, "begin");
    // Wait for the corresponding voiceover index to start (voice-led gating).
    await gatePage.waitForFunction(
      (idx) => (window as any).__playlistIdx === idx && (window as any).__audio.currentTime > 0,
      entries.indexOf(entry),
      { timeout: AUDIO_GATE_TIMEOUT_MS }
    );

    if (entry.visual.action === "click" && entry.visual.target) {
      const box = await page.locator(entry.visual.target).boundingBox();
      if (box) {
        const dest: [number, number] = [box.x + box.width / 2, box.y + box.height / 2];
        await smoothMove(page, cursor, dest, 500);
        await page.evaluate(([x, y]) => (window as any).__ripple(x, y), dest);
        await page.locator(entry.visual.target).click();
        cursor = dest;
      }
    } else if (entry.visual.action === "scroll" && entry.visual.scroll) {
      const { distance, duration } = entry.visual.scroll;
      const steps = Math.max(2, Math.round(duration / 16));
      for (let i = 0; i < steps; i++) {
        await page.mouse.wheel(0, distance / steps);
        await page.waitForTimeout(duration / steps);
      }
    } else if (entry.visual.action === "custom") {
      // Raw Playwright lines authored in the manifest; run once this entry's audio opens,
      // then fall through to the wait-for-audio-end gate below (the dwell tail).
      for (const line of entry.visual.steps ?? []) {
        await runLine(page, line);
      }
    } else if (entry.visual.action === "dwell") {
      // Hold; voice-led loop will tick forward when audio finishes the entry.
    }
    // Wait until audio has moved past this entry.
    await gatePage.waitForFunction(
      (idx) => (window as any).__playlistIdx > idx ||
               ((window as any).__playlistIdx === idx && (window as any).__audio.ended),
      entries.indexOf(entry),
      { timeout: AUDIO_GATE_TIMEOUT_MS }
    );
    mark(entry.id, "end");
  }

  // Resolve recorded webm paths before closing (files finalize on context close).
  const mainVideoPath = await page.video()?.path();
  const audioVideoPath = audioPage ? await audioPage.video()?.path() : undefined;

  await context.close();
  await browser.close();

  // Stable per-clip name for the kept recording; the audio host page's webm is silent
  // filler and is removed.
  const finalWebm = path.join(recDir, `${scene}.webm`);
  if (mainVideoPath) await fs.rename(mainVideoPath, finalWebm);
  if (audioVideoPath) await fs.unlink(audioVideoPath).catch(() => {});

  // Deterministic sweep: drop any webm that is not a kept per-clip recording (covers the
  // audio-page webm finalizing after the unlink above, and partials from crashed runs).
  const keep = new Set(
    manifest.filter((e) => e.sceneType === "browser-recording").map((e) => `${e.scene}.webm`)
  );
  for (const f of await fs.readdir(recDir)) {
    if (f.endsWith(".webm") && !keep.has(f)) await fs.unlink(path.join(recDir, f)).catch(() => {});
  }

  // Write segments-{provider}.json (gap-closing pass).
  const segs: Segment[] = entries.map((e) => {
    const begin = marks.find((m) => m.id === e.id && m.event === "begin")!.t;
    const end   = marks.find((m) => m.id === e.id && m.event === "end")!.t;
    return {
      id: e.id,
      voiceoverStartSec: 0, voiceoverEndSec: 0,
      recordingStartSec: begin, recordingEndSec: end,
      src: `recordings/${provider}/${scene}.webm`,
    };
  });
  // Gap-closing: extend each recordingEnd to next recordingStart.
  for (let i = 0; i < segs.length - 1; i++) segs[i].recordingEndSec = segs[i + 1].recordingStartSec;

  // Merge with segments from other clips (one recorder run per clip); replace this
  // clip's previous segments, keep everything else, order by manifest position.
  let existing: Segment[] = [];
  try { existing = JSON.parse(await fs.readFile(`segments-${provider}.json`, "utf-8")); } catch {}
  const ourIds = new Set(segs.map((s) => s.id));
  const orderOf = new Map(manifest.map((e, i) => [e.id, i] as const));
  const merged = existing
    .filter((s) => !ourIds.has(s.id))
    .concat(segs)
    .sort((a, b) => (orderOf.get(a.id) ?? 0) - (orderOf.get(b.id) ?? 0));
  await fs.writeFile(`segments-${provider}.json`, JSON.stringify(merged, null, 2));
  console.log(`Wrote segments-${provider}.json (${segs.length} segments for ${scene}, ${merged.length} total)`);
}

main().catch((e) => { console.error(e); process.exit(1); });

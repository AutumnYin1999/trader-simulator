// record-demo.template.ts — voice-led Playwright recording.
//
// Delegates: playwright-recording skill for browser launch, login, storageState, scroll basics.
// Adds:
//   - Voice-led capture loop: load voiceover MP3, play in page, gate actions on audio.currentTime.
//   - DOM cursor overlay (cursor-overlay.ts).
//   - Segment marker emission tied to manifest IDs.
//   - Post-recording gap-closing pass writes segments-{provider}.json.
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
  visual: { action: string; target?: string; scroll?: { distance: number; duration: number }; description?: string };
};

type SegMark = { id: string; event: "begin" | "end"; t: number };

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

  const browser = await chromium.launch({ headless: false, slowMo: 50 });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { dir: recDir, size: { width: 1920, height: 1080 } },
    storageState: (await fs.stat("storageState.json").catch(() => null)) ? "storageState.json" : undefined,
  });
  await context.addInitScript({ content: CURSOR_INIT_SCRIPT });
  const page = await context.newPage();

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
  await page.evaluate(({ srcList }) => {
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
    await page.waitForFunction(
      (idx) => (window as any).__playlistIdx === idx && (window as any).__audio.currentTime > 0,
      entries.indexOf(entry)
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
    } else if (entry.visual.action === "dwell") {
      // Hold; voice-led loop will tick forward when audio finishes the entry.
    }
    // Wait until audio has moved past this entry.
    await page.waitForFunction(
      (idx) => (window as any).__playlistIdx > idx ||
               ((window as any).__playlistIdx === idx && (window as any).__audio.ended),
      entries.indexOf(entry)
    );
    mark(entry.id, "end");
  }

  await context.close();
  await browser.close();

  // Write segments-{provider}.json (gap-closing pass).
  const segs = entries.map((e) => {
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
  await fs.writeFile(`segments-${provider}.json`, JSON.stringify(segs, null, 2));
  console.log(`Wrote segments-${provider}.json (${segs.length} segments)`);
}

main().catch((e) => { console.error(e); process.exit(1); });

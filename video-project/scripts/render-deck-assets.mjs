// Render caption-free branded infographics from the video's own components,
// for the PowerPoint deck. Bundle once, render each at a settled frame.
import { bundle } from "@remotion/bundler";
import { selectComposition, renderStill } from "@remotion/renderer";
import { mkdirSync } from "node:fs";
import path from "node:path";

const OUT = path.resolve("../ppt-project/assets/brand");
mkdirSync(OUT, { recursive: true });

const ASSETS = [
  ["title-logo", "CinematicTitle", { title: "CENTRAL TRADER", subtitle: "Digital Investfair · FIN 7870", logo: true }],
  ["chart-1997", "HistoryChart", { event: "1997", phase: "coldopen", kicker: "OCT 1997 · HONG KONG", tag: "-23% in four days", tone: "crash" }],
  ["chart-2008", "HistoryChart", { event: "2008", phase: "crash", tag: "about -58% · 2007 to 2009", tone: "crash" }],
  ["chart-2020", "HistoryChart", { event: "2020", phase: "crash", tag: "about -25% in weeks", tone: "crash" }],
  ["chart-2017", "HistoryChart", { event: "2017", phase: "rally", tag: "+36% · best year since 2009", tone: "rally" }],
  ["payoff", "PayoffDiagram", { type: "call", title: "PAYOFF · LONG CALL", note: "loss capped at the premium" }],
  ["split-put", "SplitCompare", { title: "THE 1997 PUT", left: { label: "Held the stock", delta: "-30%", tone: "down" }, right: { label: "Held a put", delta: "+4,000 pts", tone: "up" } }],
  ["tree-build", "BinomialTree", { phase: "build", kicker: "BUILD EVERY FUTURE" }],
  ["tree-fold", "BinomialTree", { phase: "fold", finalValue: "$186" }],
  ["barrier", "BarrierBreak", { barrierLabel: "KNOCK-OUT", kicker: "CHEAPER, WITH A TRIPWIRE" }],
  ["volatility", "WordBurn", { word: "VOLATILITY", sub: "the fear is the product" }],
  ["product-hk50", "KineticNumber", { value: "HK$50", suffix: " / point", label: "Hang Seng Index Option · European · cash-settled", tone: "accent" }],
  ["rate-280", "KineticNumber", { value: "280%", label: "overnight interbank rate · Oct 1997", tone: "down" }],
  ["price-row", "PriceRow", { prices: ["186", "934", "1,184"], label: "every contract — built, not guessed" }],
  ["ticket", "TicketReveal", { label: "AN OPTION", sub: "the right, not the obligation" }],
  ["thanks", "ThanksCard", { name: "Professor Martin", line: "the inspiration behind this project" }],
  ["agenda", "TakeawayList", { title: "FOUR DAYS ON THE DESK", items: ["The Ticket", "The Price", "The Tripwire", "Graduation"], numbered: true }],
];

const serveUrl = await bundle({ entryPoint: path.resolve("src/Root.tsx") });

for (const [name, comp, cprops] of ASSETS) {
  // Resolve the composition WITH this asset's props so they actually take effect
  // (renderStill alone does not re-resolve a pre-selected composition's props).
  const composition = await selectComposition({ serveUrl, id: "Still", inputProps: { comp, cprops } });
  await renderStill({
    serveUrl,
    composition,
    output: path.join(OUT, `${name}.png`),
    frame: 80,
    inputProps: { comp, cprops },
    scale: 1.5, // 1920x1080 -> 2880x1620, crisp for slides
  });
  console.log("rendered", name);
}
console.log("done:", ASSETS.length, "assets ->", OUT);

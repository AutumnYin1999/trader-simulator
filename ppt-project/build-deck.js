// Central Trader — Digital Investfair deck.
// Minimalist, image-led, same palette as the video. Branded infographics + real
// gameplay frames + two embedded clips + a QR finale.
const pptx = require("pptxgenjs");
const fs = require("fs");
const b64 = (p) => "data:image/png;base64," + fs.readFileSync(p).toString("base64");

const C = {
  bg: "070A12", bg2: "0C1322", panel: "111A2B",
  fg: "F7F9FC", accent: "FF6B3D", gold: "F5B942",
  up: "34D39A", down: "FF4D5E", muted: "8A94A6", line: "26324A",
};
const FONT = "Arial";          // body
const DISP = "Arial";          // headline (Arial Black-ish via bold)

const P = new pptx();
P.defineLayout({ name: "W", width: 13.333, height: 7.5 });
P.layout = "W";
P.author = "Central Trader";
P.title = "Central Trader — Digital Investfair";

const W = 13.333, H = 7.5;
const shadow = () => ({ type: "outer", color: "000000", blur: 14, offset: 5, angle: 90, opacity: 0.45 });

function bg(s, color = C.bg) { s.background = { color }; }

function footer(s, n) {
  s.addShape(P.shapes.RECTANGLE, { x: 0.6, y: 7.06, w: 0.11, h: 0.11, fill: { color: C.accent } });
  s.addText("CENTRAL TRADER", { x: 0.8, y: 6.94, w: 5, h: 0.35, margin: 0, fontFace: FONT, fontSize: 9, color: C.muted, charSpacing: 2, valign: "middle" });
  s.addText(`${n}`, { x: W - 1.1, y: 6.94, w: 0.5, h: 0.35, margin: 0, fontFace: FONT, fontSize: 9, color: C.muted, align: "right", valign: "middle" });
}

function kicker(s, text, x = 0.75, y = 1.25) {
  s.addShape(P.shapes.RECTANGLE, { x, y: y + 0.02, w: 0.16, h: 0.16, fill: { color: C.accent } });
  s.addText(text, { x: x + 0.28, y: y - 0.06, w: 5.5, h: 0.35, margin: 0, fontFace: FONT, fontSize: 12.5, bold: true, color: C.accent, charSpacing: 3, valign: "middle" });
}

// framed image card (image blends on the dark bg; coral hairline frames it)
function framed(s, path, x, y, w, h, opts = {}) {
  s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: x - 0.08, y: y - 0.08, w: w + 0.16, h: h + 0.16, rectRadius: 0.1, fill: { color: C.bg }, line: { color: C.line, width: 1 }, shadow: shadow() });
  s.addImage({ path, x, y, w, h, sizing: { type: opts.contain ? "contain" : "cover", w, h } });
}

// LEFT text / RIGHT image concept slide
function concept(n, { kick, head, cap, img, chips, contain }) {
  const s = P.addSlide(); bg(s);
  kicker(s, kick);
  s.addText(head, { x: 0.75, y: 2.0, w: 4.55, h: 2.2, margin: 0, fontFace: DISP, fontSize: 40, bold: true, color: C.fg, lineSpacingMultiple: 0.98 });
  s.addText(cap, { x: 0.75, y: 4.35, w: 4.45, h: 1.6, margin: 0, fontFace: FONT, fontSize: 15.5, color: C.muted, lineSpacingMultiple: 1.18 });
  if (chips) {
    chips.forEach((ch, i) => {
      const cx = 0.75 + i * 2.15;
      s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: cx, y: 5.55, w: 1.95, h: 0.62, rectRadius: 0.08, fill: { color: C.panel }, line: { color: ch.color, width: 1 } });
      s.addText(ch.t, { x: cx, y: 5.55, w: 1.95, h: 0.62, margin: 0, align: "center", valign: "middle", fontFace: FONT, fontSize: 14, bold: true, color: ch.color });
    });
  }
  framed(s, img, 5.85, 1.45, 6.7, 3.77, { contain });
  footer(s, n);
  return s;
}

// full-bleed image slide with overlay headline (bottom-left)
function bleed(n, { img, kick, head, cap, dim = true }) {
  const s = P.addSlide(); bg(s);
  s.addImage({ path: img, x: 0, y: 0, w: W, h: H, sizing: { type: "cover", w: W, h: H } });
  if (dim) s.addShape(P.shapes.RECTANGLE, { x: 0, y: 4.0, w: W, h: 3.5, fill: { color: "000000", transparency: 25 } });
  if (kick) kicker(s, kick, 0.75, 5.05);
  if (head) s.addText(head, { x: 0.75, y: 5.35, w: 11.8, h: 1.1, margin: 0, fontFace: DISP, fontSize: 44, bold: true, color: C.fg, shadow: shadow() });
  if (cap) s.addText(cap, { x: 0.78, y: 6.45, w: 11.5, h: 0.5, margin: 0, fontFace: FONT, fontSize: 15, color: "D6DEEC" });
  return s;
}

// ---------------------------------------------------------------- 1 · COVER
{
  const s = P.addSlide(); bg(s);
  s.addImage({ path: "assets/brand/title-logo.png", x: 0, y: 0, w: W, h: H, sizing: { type: "cover", w: W, h: H } });
  s.addText("PRICING THE HANG SENG INDEX OPTION", { x: 0, y: 5.55, w: W, h: 0.4, margin: 0, align: "center", fontFace: FONT, fontSize: 15, bold: true, color: C.gold, charSpacing: 3 });
  s.addText("a playable options trading desk", { x: 0, y: 5.98, w: W, h: 0.4, margin: 0, align: "center", fontFace: FONT, fontSize: 13.5, color: C.muted });
}

// ---------------------------------------------------------------- 2 · HOOK (video)
{
  const s = P.addSlide(); bg(s);
  kicker(s, "THE HOOK");
  s.addText("Fear has a price.", { x: 0.75, y: 2.0, w: 4.55, h: 1.6, margin: 0, fontFace: DISP, fontSize: 42, bold: true, color: C.fg });
  s.addText("Hong Kong, 1997. In four days the market fell 23%. The people who profited owned no stock — just one piece of paper.", { x: 0.75, y: 3.85, w: 4.5, h: 2.2, margin: 0, fontFace: FONT, fontSize: 15.5, color: C.muted, lineSpacingMultiple: 1.2 });
  s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: 5.77, y: 1.37, w: 6.86, h: 3.93, rectRadius: 0.1, fill: { color: C.bg }, line: { color: C.line, width: 1 }, shadow: shadow() });
  s.addMedia({ type: "video", path: "assets/intro-hook.mp4", cover: b64("assets/poster-intro.png"), x: 5.85, y: 1.45, w: 6.7, h: 3.77 });
  footer(s, 2);
}

// ---------------------------------------------------------------- 3 · WHAT IS AN OPTION
concept(3, {
  kick: "THE INSTRUMENT",
  head: "A choice,\nnot a promise.",
  cap: "Pay a small premium today for the right — not the obligation — to act later.",
  img: "assets/brand/ticket.png",
  chips: [{ t: "CALL  ↑  buy", color: C.up }, { t: "PUT  ↓  sell", color: C.down }],
});

// ---------------------------------------------------------------- 4 · PAYOFF
concept(4, {
  kick: "WHY IT WORKS",
  head: "Risk a little.\nWin a lot.",
  cap: "Your loss is capped at the premium. Your upside stays open. Traders call it asymmetry.",
  img: "assets/brand/payoff.png",
});

// ---------------------------------------------------------------- 5 · PRODUCT
concept(5, {
  kick: "THE PRODUCT",
  head: "One product,\nstart to finish.",
  cap: "The Hang Seng Index Option — European, cash-settled, HK$50 a point.",
  img: "assets/brand/product-hk50.png",
});

// ---------------------------------------------------------------- 6 · PRICING (tree build)
concept(6, {
  kick: "CHAPTER 2 · THE PRICE",
  head: "Built,\nnot guessed.",
  cap: "A binomial tree maps every path the market could take to expiry.",
  img: "assets/brand/tree-build.png",
});

// ---------------------------------------------------------------- 7 · FAIR VALUE (tree fold)
concept(7, {
  kick: "FAIR VALUE",
  head: "Then fold\nit back.",
  cap: "Discount every future to one number today. For this contract: 186 points — to the dollar.",
  img: "assets/brand/tree-fold.png",
});

// ---------------------------------------------------------------- 8 · BARRIER
concept(8, {
  kick: "THE EXOTIC",
  head: "Cheaper,\nwith a tripwire.",
  cap: "Touch the barrier and the option dies. Same contract: 1,112 → 934, a 16% discount.",
  img: "assets/brand/barrier.png",
});

// ---------------------------------------------------------------- 9 · THE GAME (full bleed)
bleed(9, {
  img: "assets/game/dashboard.png",
  kick: "THE GAME",
  head: "We built a desk you can play.",
  cap: "Four trading days · price real clients · graded performance.",
});

// ---------------------------------------------------------------- 10 · FOUR DAYS grid
{
  const s = P.addSlide(); bg(s);
  kicker(s, "THE CURRICULUM");
  s.addText("Four days on the desk", { x: 0.75, y: 0.62, w: 11, h: 0.9, margin: 0, fontFace: DISP, fontSize: 34, bold: true, color: C.fg });
  const cells = [
    { img: "assets/game/martin-meeting.png", day: "DAY 1", t: "The Ticket" },
    { img: "assets/game/tree-calc.png", day: "DAY 2", t: "The Price" },
    { img: "assets/game/knockout.png", day: "DAY 3", t: "The Tripwire" },
    { img: "assets/game/dashboard.png", day: "DAY 4", t: "Graduation" },
  ];
  const gw = 5.75, gh = 2.3, gx = 0.75, gy = 1.6, gapx = 0.55, gapy = 0.4;
  cells.forEach((c, i) => {
    const x = gx + (i % 2) * (gw + gapx);
    const y = gy + Math.floor(i / 2) * (gh + gapy);
    s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: x - 0.06, y: y - 0.06, w: gw + 0.12, h: gh + 0.12, rectRadius: 0.08, fill: { color: C.bg2 }, line: { color: C.line, width: 1 }, shadow: shadow() });
    s.addImage({ path: c.img, x, y, w: gw, h: gh, sizing: { type: "contain", w: gw, h: gh } });
    s.addShape(P.shapes.RECTANGLE, { x, y: y + gh - 0.5, w: gw, h: 0.5, fill: { color: "070A12", transparency: 12 } });
    s.addText(c.day, { x: x + 0.14, y: y + gh - 0.48, w: 1.4, h: 0.42, margin: 0, valign: "middle", fontFace: FONT, fontSize: 11, bold: true, color: C.accent, charSpacing: 2 });
    s.addText(c.t, { x: x + 1.35, y: y + gh - 0.48, w: gw - 1.5, h: 0.42, margin: 0, valign: "middle", fontFace: FONT, fontSize: 15, bold: true, color: C.fg });
  });
  footer(s, 10);
}

// ---------------------------------------------------------------- 11 · INSIDE (video 2)
{
  const s = P.addSlide(); bg(s);
  kicker(s, "INSIDE THE DESK");
  s.addText("See it move.", { x: 0.75, y: 2.0, w: 4.55, h: 1.4, margin: 0, fontFace: DISP, fontSize: 42, bold: true, color: C.fg });
  s.addText("Pricing a live contract on the binomial tree — up node, down node, fold to fair value.", { x: 0.75, y: 3.55, w: 4.5, h: 2.2, margin: 0, fontFace: FONT, fontSize: 15.5, color: C.muted, lineSpacingMultiple: 1.2 });
  s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: 5.77, y: 1.37, w: 6.86, h: 3.93, rectRadius: 0.1, fill: { color: C.bg }, line: { color: C.line, width: 1 }, shadow: shadow() });
  s.addMedia({ type: "video", path: "assets/pricing-clip.mp4", cover: b64("assets/poster-pricing.png"), x: 5.85, y: 1.45, w: 6.7, h: 3.77 });
  footer(s, 11);
}

// ---------------------------------------------------------------- 12 · REAL CASES triptych
{
  const s = P.addSlide(); bg(s);
  kicker(s, "WHY IT MATTERS");
  s.addText("Crashes are a feature, not a bug.", { x: 0.75, y: 0.62, w: 11.8, h: 0.9, margin: 0, fontFace: DISP, fontSize: 32, bold: true, color: C.fg });
  const cards = [
    { img: "assets/brand/chart-1997.png", t: "1997 · Asian crisis" },
    { img: "assets/brand/chart-2008.png", t: "2008 · Global crash" },
    { img: "assets/brand/chart-2020.png", t: "2020 · COVID" },
  ];
  const cw = 3.84, ch = 2.55, cy = 1.95, gap = 0.18, total = cards.length * cw + (cards.length - 1) * gap;
  const startx = (W - total) / 2;
  cards.forEach((c, i) => {
    const x = startx + i * (cw + gap);
    s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: x - 0.05, y: cy - 0.05, w: cw + 0.1, h: ch + 0.1, rectRadius: 0.08, fill: { color: C.bg }, line: { color: C.line, width: 1 }, shadow: shadow() });
    s.addImage({ path: c.img, x, y: cy, w: cw, h: ch, sizing: { type: "contain", w: cw, h: ch } });
    s.addText(c.t, { x, y: cy + ch + 0.12, w: cw, h: 0.4, margin: 0, align: "center", fontFace: FONT, fontSize: 13, bold: true, color: C.muted });
  });
  s.addText("An option pays when everyone else is panicking.", { x: 0, y: 6.25, w: W, h: 0.5, margin: 0, align: "center", fontFace: FONT, fontSize: 15.5, italic: true, color: C.gold });
  footer(s, 12);
}

// ---------------------------------------------------------------- 13 · RESULTS
concept(13, {
  kick: "RESULTS",
  head: "Every contract,\npriced.",
  cap: "Vanilla 186 · barrier 934 · graduation 1,184 — to the dollar. Final grade: A.",
  img: "assets/brand/price-row.png",
  contain: true,
});

// ---------------------------------------------------------------- 14 · THANKS (full bleed)
{
  const s = P.addSlide(); bg(s);
  s.addImage({ path: "assets/brand/thanks.png", x: 0, y: 0, w: W, h: H, sizing: { type: "cover", w: W, h: H } });
}

// ---------------------------------------------------------------- 15 · QR finale
{
  const s = P.addSlide(); bg(s);
  // soft warm glow
  s.addShape(P.shapes.OVAL, { x: 3.8, y: 1.3, w: 5.7, h: 5.7, fill: { color: C.accent, transparency: 88 } });
  kicker(s, "SCAN TO PLAY", (W - 2.2) / 2 + 0.4, 1.05);
  s.addText("Try the desk yourself.", { x: 0, y: 1.45, w: W, h: 0.9, margin: 0, align: "center", fontFace: DISP, fontSize: 40, bold: true, color: C.fg });
  s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: (W - 2.9) / 2, y: 2.55, w: 2.9, h: 2.9, rectRadius: 0.12, fill: { color: "FFFFFF" }, shadow: shadow() });
  s.addImage({ path: "assets/qr-hi.png", x: (W - 2.5) / 2, y: 2.75, w: 2.5, h: 2.5 });
  s.addText("zeref007.github.io/trader-simulator", { x: 0, y: 5.7, w: W, h: 0.5, margin: 0, align: "center", fontFace: FONT, fontSize: 19, bold: true, color: C.accent });
  s.addText("Central Trader · Digital Investfair · FIN 7870", { x: 0, y: 6.3, w: W, h: 0.4, margin: 0, align: "center", fontFace: FONT, fontSize: 12, color: C.muted });
}

P.writeFile({ fileName: "Central-Trader-Deck.pptx" }).then((f) => console.log("wrote", f));

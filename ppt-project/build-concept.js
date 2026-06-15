// Central Trader, Options, from first principles.
// Light "quant-paper" theme. Concept explainer: options, price drivers, Greeks,
// pricing models (binomial tree, Black-Scholes, Monte Carlo), volatility,
// barriers, put-call parity, the product. Native diagrams + formulas. No gameplay.
const pptx = require("pptxgenjs");
const fs = require("fs");

const C = {
  paper: "F6F4EF", card: "FFFFFF", ink: "16243A", teal: "0E7C66",
  green: "0E8A3F", red: "D7263D", muted: "53606E", hair: "DDD6C8", panel: "EFEDE6",
};
const HEAD = "Georgia", BODY = "Arial", MONO = "Courier New";
const W = 13.333, H = 7.5;

const P = new pptx();
P.defineLayout({ name: "W", width: W, height: H });
P.layout = "W";
P.author = "Central Trader";
P.title = "Options, from first principles";

const sh = () => ({ type: "outer", color: "8A8270", blur: 9, offset: 3, angle: 90, opacity: 0.22 });
let SLIDE = 0;
const newSlide = () => { SLIDE++; const s = P.addSlide(); s.background = { color: C.paper }; return s; };

function header(s, kick, title) {
  s.addShape(P.shapes.RECTANGLE, { x: 0.7, y: 0.56, w: 0.15, h: 0.15, fill: { color: C.teal } });
  s.addText(kick, { x: 0.95, y: 0.48, w: 11, h: 0.32, margin: 0, fontFace: BODY, fontSize: 12, bold: true, color: C.teal, charSpacing: 3, valign: "middle" });
  s.addText(title, { x: 0.68, y: 0.84, w: 12, h: 0.75, margin: 0, fontFace: HEAD, fontSize: 30, bold: true, color: C.ink });
}
function footer(s) {
  s.addText("Central Trader · Digital Investfair", { x: 0.7, y: 7.04, w: 7, h: 0.32, margin: 0, fontFace: BODY, fontSize: 9, color: C.muted, valign: "middle" });
  s.addText(`${SLIDE}`, { x: W - 1.1, y: 7.04, w: 0.5, h: 0.32, margin: 0, fontFace: BODY, fontSize: 9, color: C.muted, align: "right", valign: "middle" });
}
function card(s, x, y, w, h, accent) {
  s.addShape(P.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.06, fill: { color: C.card }, line: { color: C.hair, width: 1 }, shadow: sh() });
  if (accent) s.addShape(P.shapes.RECTANGLE, { x, y, w: 0.07, h, fill: { color: accent } });
}
function img(s, path, x, y, w, h) {
  s.addImage({ path, x, y, w, h, sizing: { type: "contain", w, h } });
}

// ============================================================ 1 · TITLE
{
  const s = newSlide();
  s.addShape(P.shapes.RECTANGLE, { x: 6.577, y: 1.0, w: 0.18, h: 0.18, fill: { color: C.teal } });
  s.addText("DIGITAL INVESTFAIR · FIN 7870", { x: 0, y: 1.55, w: W, h: 0.4, margin: 0, align: "center", fontFace: BODY, fontSize: 14, bold: true, color: C.teal, charSpacing: 4 });
  s.addText("Pricing an Option", { x: 0, y: 2.45, w: W, h: 1.0, margin: 0, align: "center", fontFace: HEAD, fontSize: 56, bold: true, color: C.ink });
  s.addText("from first principles", { x: 0, y: 3.5, w: W, h: 0.7, margin: 0, align: "center", fontFace: HEAD, fontSize: 30, italic: true, color: C.muted });
  s.addText("Hang Seng Index Options, the mathematics behind the trade", { x: 0, y: 4.7, w: W, h: 0.4, margin: 0, align: "center", fontFace: BODY, fontSize: 16, color: C.ink });
}

// ============================================================ 2 · WHAT IS AN OPTION
{
  const s = newSlide();
  header(s, "THE INSTRUMENT", "What is an option?");
  s.addText("A contract that gives you the right, not the obligation, to trade at a fixed price.", { x: 0.7, y: 1.7, w: 11.9, h: 0.5, margin: 0, fontFace: BODY, fontSize: 18.5, color: C.ink });
  const cw = 5.75, cy = 2.5, ch = 2.4;
  card(s, 0.7, cy, cw, ch, C.green);
  s.addText("CALL", { x: 1.05, y: cy + 0.28, w: cw - 0.6, h: 0.7, margin: 0, fontFace: HEAD, fontSize: 34, bold: true, color: C.green });
  s.addText([{ text: "The right to BUY at the strike K.", options: { breakLine: true, bullet: false } }, { text: "You profit when the market rises  ▲", options: { color: C.green, bold: true } }], { x: 1.05, y: cy + 1.05, w: cw - 0.7, h: 1.1, margin: 0, fontFace: BODY, fontSize: 17, color: C.ink, lineSpacingMultiple: 1.3 });
  card(s, 6.86, cy, cw, ch, C.red);
  s.addText("PUT", { x: 7.21, y: cy + 0.28, w: cw - 0.6, h: 0.7, margin: 0, fontFace: HEAD, fontSize: 34, bold: true, color: C.red });
  s.addText([{ text: "The right to SELL at the strike K.", options: { breakLine: true } }, { text: "You profit when the market falls  ▼", options: { color: C.red, bold: true } }], { x: 7.21, y: cy + 1.05, w: cw - 0.7, h: 1.1, margin: 0, fontFace: BODY, fontSize: 17, color: C.ink, lineSpacingMultiple: 1.3 });
  s.addText("You pay a premium up front, the price of the choice.", { x: 0.7, y: 5.2, w: 11.9, h: 0.4, margin: 0, fontFace: BODY, fontSize: 17, italic: true, color: C.muted });
  footer(s);
}

// ============================================================ 3 · VOCABULARY
{
  const s = newSlide();
  header(s, "THE VOCABULARY", "Five words to own");
  const terms = [
    ["S", "Underlying", "the spot price right now"],
    ["K", "Strike", "the locked-in price"],
    ["P", "Premium", "what the option costs"],
    ["T", "Expiry", "when the choice ends"],
    ["M", "Moneyness", "ITM / ATM / OTM"],
  ];
  const n = terms.length, gap = 0.28, cw = (11.93 - gap * (n - 1)) / n, cy = 2.3, ch = 3.0;
  terms.forEach((t, i) => {
    const x = 0.7 + i * (cw + gap);
    card(s, x, cy, cw, ch, C.teal);
    s.addText(t[0], { x: x + 0.18, y: cy + 0.35, w: cw - 0.3, h: 0.9, margin: 0, fontFace: MONO, fontSize: t[0].length > 3 ? 18 : 30, bold: true, color: C.ink });
    s.addText(t[1], { x: x + 0.18, y: cy + 1.4, w: cw - 0.3, h: 0.5, margin: 0, fontFace: HEAD, fontSize: 18, bold: true, color: C.teal });
    s.addText(t[2], { x: x + 0.18, y: cy + 1.95, w: cw - 0.3, h: 0.9, margin: 0, fontFace: BODY, fontSize: 15, color: C.muted, lineSpacingMultiple: 1.15 });
  });
  footer(s);
}

// ============================================================ 4 · PAYOFF
{
  const s = newSlide();
  header(s, "PAYOFF AT EXPIRY", "Loss capped, upside open");
  img(s, "assets/concept/payoff.png", 0.9, 1.75, 11.5, 3.9);
  s.addText("A long option can lose only the premium, but its gains are unbounded. That asymmetry is the whole point.", { x: 0.7, y: 5.85, w: 11.9, h: 0.6, margin: 0, align: "center", fontFace: BODY, fontSize: 16.5, italic: true, color: C.muted });
  footer(s);
}

// ============================================================ 5 · MONEYNESS
{
  const s = newSlide();
  header(s, "WHERE THE STRIKE SITS", "In, at, or out of the money");
  const cw = 5.75, cy = 2.05, ch = 2.95;
  const tag = (t, c) => ({ text: t, options: { bold: true, color: c, fontFace: MONO } });
  const rest = (t) => ({ text: t, options: { color: C.muted, breakLine: true } });
  card(s, 0.7, cy, cw, ch, C.green);
  s.addText("Call", { x: 1.05, y: cy + 0.25, w: cw - 0.6, h: 0.6, margin: 0, fontFace: HEAD, fontSize: 26, bold: true, color: C.green });
  s.addText([
    tag("ITM   ", C.green), rest("spot above strike   (S > K)"),
    tag("ATM   ", C.muted), rest("spot at the strike  (S = K)"),
    tag("OTM   ", C.red), rest("spot below strike   (S < K)"),
  ], { x: 1.05, y: cy + 1.0, w: cw - 0.7, h: 1.7, margin: 0, fontFace: BODY, fontSize: 15, color: C.ink, lineSpacingMultiple: 1.4 });
  card(s, 6.86, cy, cw, ch, C.red);
  s.addText("Put", { x: 7.21, y: cy + 0.25, w: cw - 0.6, h: 0.6, margin: 0, fontFace: HEAD, fontSize: 26, bold: true, color: C.red });
  s.addText([
    tag("ITM   ", C.green), rest("spot below strike   (S < K)"),
    tag("ATM   ", C.muted), rest("spot at the strike  (S = K)"),
    tag("OTM   ", C.red), rest("spot above strike   (S > K)"),
  ], { x: 7.21, y: cy + 1.0, w: cw - 0.7, h: 1.7, margin: 0, fontFace: BODY, fontSize: 15, color: C.ink, lineSpacingMultiple: 1.4 });
  s.addText("Premium = intrinsic value + time value. Time value pays for what spot might still do, and it fades to zero by expiry.", { x: 0.7, y: 5.35, w: 11.9, h: 0.7, margin: 0, fontFace: BODY, fontSize: 16, italic: true, color: C.muted, lineSpacingMultiple: 1.2 });
  footer(s);
}

// ============================================================ 6 · PRICE DRIVERS
{
  const s = newSlide();
  header(s, "WHAT MOVES THE PRICE", "Six inputs");
  const up = { text: "▲", options: { color: C.green, bold: true, align: "center", fontFace: MONO, fontSize: 18 } };
  const dn = { text: "▼", options: { color: C.red, bold: true, align: "center", fontFace: MONO, fontSize: 18 } };
  const hd = (t) => ({ text: t, options: { fill: { color: C.ink }, color: "FFFFFF", bold: true, align: "center", fontFace: BODY } });
  const lab = (t) => ({ text: t, options: { color: C.ink, bold: true, fontFace: BODY, align: "left" } });
  const rows = [
    [hd("Input (rises)"), hd("Call value"), hd("Put value")],
    [lab("Spot price  S"), up, dn],
    [lab("Strike  K"), dn, up],
    [lab("Time to expiry  T"), up, up],
    [lab("Volatility  σ"), up, up],
    [lab("Interest rate  r"), up, dn],
    [lab("Dividend  q"), dn, up],
  ];
  s.addTable(rows, { x: 1.4, y: 2.0, w: 7.2, colW: [3.6, 1.8, 1.8], rowH: 0.55, fontFace: BODY, fontSize: 17, color: C.ink, valign: "middle", border: { type: "solid", pt: 1, color: C.hair }, fill: { color: C.card }, align: "center" });
  card(s, 9.1, 2.0, 3.5, 3.85, C.teal);
  s.addText("Volatility is the\nbig one.", { x: 9.4, y: 2.35, w: 3.0, h: 1.2, margin: 0, fontFace: HEAD, fontSize: 22, bold: true, color: C.ink });
  s.addText("It is the only input you cannot read off a screen, and it drives the premium most.", { x: 9.4, y: 3.7, w: 3.0, h: 1.4, margin: 0, fontFace: BODY, fontSize: 15, color: C.muted, lineSpacingMultiple: 1.25 });
  s.addText("These sensitivities are the Greeks.", { x: 1.4, y: 6.15, w: 9, h: 0.4, margin: 0, fontFace: BODY, fontSize: 15, italic: true, color: C.muted });
  footer(s);
}

// ============================================================ 7 · THE GREEKS
{
  const s = newSlide();
  header(s, "THE GREEKS", "Five sensitivities");
  const g = [
    ["Δ", "Delta", "value vs. spot price"],
    ["Γ", "Gamma", "how fast Delta moves"],
    ["Θ", "Theta", "value lost to time decay"],
    ["ν", "Vega", "value vs. volatility"],
    ["ρ", "Rho", "value vs. interest rates"],
  ];
  const n = g.length, gap = 0.28, cw = (11.93 - gap * (n - 1)) / n, cy = 2.4, ch = 2.9;
  g.forEach((t, i) => {
    const x = 0.7 + i * (cw + gap);
    card(s, x, cy, cw, ch, C.teal);
    s.addText(t[0], { x, y: cy + 0.35, w: cw, h: 1.0, margin: 0, align: "center", fontFace: HEAD, fontSize: 50, bold: true, color: C.teal });
    s.addText(t[1], { x, y: cy + 1.55, w: cw, h: 0.45, margin: 0, align: "center", fontFace: HEAD, fontSize: 19, bold: true, color: C.ink });
    s.addText(t[2], { x: x + 0.12, y: cy + 2.05, w: cw - 0.24, h: 0.7, margin: 0, align: "center", fontFace: BODY, fontSize: 14, color: C.muted, lineSpacingMultiple: 1.15 });
  });
  footer(s);
}

// ============================================================ 8 · THREE MODELS
{
  const s = newSlide();
  header(s, "HOW TO PRICE IT", "Three models, one fair value");
  const m = [
    ["Binomial Tree", "Step the price up or down, then fold the value back to today.", "Best for: American & barrier options. Intuitive, what this project uses."],
    ["Black–Scholes", "One closed-form equation for the price.", "Best for: European vanilla options. Instant, exact."],
    ["Monte Carlo", "Simulate thousands of random paths, then average the payoff.", "Best for: complex, path-dependent exotics."],
  ];
  const n = m.length, gap = 0.4, cw = (11.93 - gap * (n - 1)) / n, cy = 2.1, ch = 3.7;
  m.forEach((t, i) => {
    const x = 0.7 + i * (cw + gap);
    card(s, x, cy, cw, ch, C.teal);
    s.addText(t[0], { x: x + 0.28, y: cy + 0.35, w: cw - 0.5, h: 0.7, margin: 0, fontFace: HEAD, fontSize: 22, bold: true, color: C.ink });
    s.addText(t[1], { x: x + 0.28, y: cy + 1.2, w: cw - 0.55, h: 1.4, margin: 0, fontFace: BODY, fontSize: 16.5, color: C.ink, lineSpacingMultiple: 1.25 });
    s.addText(t[2], { x: x + 0.28, y: cy + 2.75, w: cw - 0.55, h: 0.85, margin: 0, fontFace: BODY, fontSize: 14.5, italic: true, color: C.muted, lineSpacingMultiple: 1.2 });
  });
  footer(s);
}

// ============================================================ 9 · BINOMIAL TREE
{
  const s = newSlide();
  header(s, "THE BINOMIAL TREE", "Build forward, price backward");
  img(s, "assets/concept/tree.png", 0.7, 1.7, 8.4, 4.5);
  card(s, 9.35, 2.3, 3.25, 3.2, C.teal);
  s.addText("Backward induction", { x: 9.6, y: 2.55, w: 2.8, h: 0.5, margin: 0, fontFace: HEAD, fontSize: 17, bold: true, color: C.ink });
  s.addText("At expiry the payoff is obvious. Discount each step by", { x: 9.6, y: 3.1, w: 2.75, h: 1.0, margin: 0, fontFace: BODY, fontSize: 14.5, color: C.muted, lineSpacingMultiple: 1.2 });
  s.addText("e^(−rΔt)", { x: 9.6, y: 4.05, w: 2.75, h: 0.45, margin: 0, fontFace: MONO, fontSize: 18, bold: true, color: C.ink });
  s.addText("and fold back to today:", { x: 9.6, y: 4.5, w: 2.75, h: 0.4, margin: 0, fontFace: BODY, fontSize: 14.5, color: C.muted });
  s.addText("fair value = 186 pts", { x: 9.6, y: 4.95, w: 2.75, h: 0.4, margin: 0, fontFace: MONO, fontSize: 16, bold: true, color: C.teal });
  s.addText("S spot · u up factor · d down factor · p risk-neutral prob · r rate · σ vol · Δt step · e^(−rΔt) discount", { x: 0.4, y: 6.55, w: 12.53, h: 0.4, margin: 0, align: "center", fontFace: MONO, fontSize: 11.5, color: C.ink });
  footer(s);
}

// ============================================================ 10 · WORKED EXAMPLE
{
  const s = newSlide();
  header(s, "BINOMIAL, BY HAND", "One node, worked out");
  const cw = 5.75, ch = 1.78, gx = 6.86, ry0 = 1.95, ry1 = 3.83;
  const step = (x, y, accent, head, lines) => {
    card(s, x, y, cw, ch, accent);
    s.addText(head, { x: x + 0.3, y: y + 0.18, w: cw - 0.5, h: 0.4, margin: 0, fontFace: HEAD, fontSize: 15, bold: true, color: C.ink });
    s.addText(lines.map((t) => ({ text: t, options: { breakLine: true } })), { x: x + 0.3, y: y + 0.66, w: cw - 0.55, h: ch - 0.75, margin: 0, fontFace: MONO, fontSize: 13, color: C.ink, lineSpacingMultiple: 1.18 });
  };
  step(0.7, ry0, C.teal, "1 · Two outcomes", ["S₀ = 21,500", "up   → 21,500 × u = 22,069", "down → 21,500 × d = 20,946"]);
  step(gx, ry0, C.teal, "2 · Risk-neutral p", ["p = (e^(rΔt) − d) / (u − d)", "  = 0.504     1 − p = 0.496"]);
  step(0.7, ry1, C.green, "3 · Payoffs at K = 22,000", ["Cu = max(22,069 − 22,000, 0) = 69", "Cd = max(20,946 − 22,000, 0) =  0"]);
  step(gx, ry1, C.teal, "4 · Discount one node", ["C = e^(−rΔt) [ p·Cu + (1−p)·Cd ]", "  ≈ 0.504 × 69   ≈   34.7"]);
  card(s, 0.7, 5.75, 11.92, 0.92, C.red);
  s.addText([
    { text: "One node of the 3-step grid ≈ 34.7.   ", options: { color: C.ink } },
    { text: "Same rule, finer grid: 3 steps → fair value 186.", options: { color: C.red, bold: true } },
  ], { x: 1.0, y: 5.75, w: 11.4, h: 0.92, margin: 0, fontFace: BODY, fontSize: 15.5, valign: "middle", lineSpacingMultiple: 1.1 });
  footer(s);
}

// ============================================================ 11 · RISK-NEUTRAL
{
  const s = newSlide();
  header(s, "THE KEY TRICK", "Risk-neutral valuation");
  const cw = 5.75, cy = 2.1, ch = 3.4;
  card(s, 0.7, cy, cw, ch, C.teal);
  s.addText("p is a pricing weight, not a probability", { x: 1.05, y: cy + 0.3, w: cw - 0.6, h: 0.8, margin: 0, fontFace: HEAD, fontSize: 19, bold: true, color: C.ink, lineSpacingMultiple: 1.1 });
  s.addText([
    { text: "p = (e^(rΔt) − d) / (u − d)", options: { breakLine: true, fontFace: MONO, color: C.ink } },
    { text: "A pricing weight, not the real chance of a rise.", options: { breakLine: true } },
    { text: "Real-world drift never enters.", options: {} },
  ], { x: 1.05, y: cy + 1.35, w: cw - 0.7, h: 1.8, margin: 0, fontFace: BODY, fontSize: 15.5, color: C.muted, lineSpacingMultiple: 1.3 });
  card(s, 6.86, cy, cw, ch, C.green);
  s.addText("Why we discount at r", { x: 7.21, y: cy + 0.3, w: cw - 0.6, h: 0.5, margin: 0, fontFace: HEAD, fontSize: 19, bold: true, color: C.ink });
  s.addText([
    { text: "Pretend every asset grows at the risk-free rate r.", options: { breakLine: true } },
    { text: "Then price = e^(−rT) × expected payoff.", options: { breakLine: true, fontFace: MONO, color: C.ink } },
    { text: "No risk premium, no risk appetite needed.", options: {} },
  ], { x: 7.21, y: cy + 1.35, w: cw - 0.7, h: 1.8, margin: 0, fontFace: BODY, fontSize: 15.5, color: C.muted, lineSpacingMultiple: 1.3 });
  s.addText("The same risk-neutral logic sits under Black-Scholes too.", { x: 0.7, y: 5.75, w: 11.9, h: 0.5, margin: 0, align: "center", fontFace: BODY, fontSize: 15.5, italic: true, color: C.muted });
  footer(s);
}

// ============================================================ 12 · BLACK–SCHOLES
{
  const s = newSlide();
  header(s, "BLACK–SCHOLES", "The continuous limit");
  card(s, 1.6, 2.5, 10.1, 2.6, C.teal);
  s.addText("C = S · N(d1) − K · e^(−rT) · N(d2)", { x: 1.6, y: 2.95, w: 10.1, h: 0.9, margin: 0, align: "center", fontFace: MONO, fontSize: 30, bold: true, color: C.ink });
  s.addText([
    { text: "d1 = [ ln(S/K) + (r + σ²/2) T ] / (σ√T)", options: { breakLine: true } },
    { text: "d2 = d1 − σ√T", options: {} },
  ], { x: 1.6, y: 4.0, w: 10.1, h: 0.9, margin: 0, align: "center", fontFace: MONO, fontSize: 17, color: C.muted, lineSpacingMultiple: 1.3 });
  s.addText("As the tree's steps shrink toward zero, it converges to this single formula. Same fair value, computed instantly.", { x: 1.6, y: 5.55, w: 10.1, h: 0.8, margin: 0, align: "center", fontFace: BODY, fontSize: 17, italic: true, color: C.ink, lineSpacingMultiple: 1.25 });
  footer(s);
}

// ============================================================ 13 · DELTA HEDGING
{
  const s = newSlide();
  header(s, "DELTA HEDGING & REPLICATION", "How the desk stays flat");
  const m = [
    [C.teal, "Cancel the risk", ["Writing a call leaves you short the market.", "Hold Δ units of the index to offset.", "Net exposure → 0: the book is flat."]],
    [C.red, "Re-hedge as Δ drifts", ["Δ moves when spot moves; that drift is Gamma.", "Trim or add the underlying to stay flat.", "Each adjustment locks in a small cost."]],
    [C.green, "Replication = price", ["An index + cash portfolio copies the payoff.", "Rebalanced each step, it tracks the option.", "Its running cost IS the fair value."]],
  ];
  const n = m.length, gap = 0.4, cw = (11.93 - gap * (n - 1)) / n, cy = 2.15, ch = 3.5;
  m.forEach((t, i) => {
    const x = 0.7 + i * (cw + gap);
    card(s, x, cy, cw, ch, t[0]);
    s.addText(t[1], { x: x + 0.28, y: cy + 0.32, w: cw - 0.5, h: 0.6, margin: 0, fontFace: HEAD, fontSize: 19, bold: true, color: C.ink });
    s.addText(t[2].map((l) => ({ text: l, options: { breakLine: true } })), { x: x + 0.28, y: cy + 1.15, w: cw - 0.55, h: 2.1, margin: 0, fontFace: BODY, fontSize: 14.5, color: C.muted, lineSpacingMultiple: 1.3 });
  });
  s.addText("Hedge Δ, fund Γ: the running cost of replication is the premium.", { x: 0.7, y: 5.9, w: 11.9, h: 0.5, margin: 0, align: "center", fontFace: BODY, fontSize: 15.5, italic: true, color: C.muted });
  footer(s);
}

// ============================================================ 14 · VOLATILITY
{
  const s = newSlide();
  header(s, "VOLATILITY", "The only input you cannot see");
  img(s, "assets/concept/vol.png", 1.05, 1.75, 6.6, 4.0);
  card(s, 8.1, 2.2, 4.5, 3.4, C.teal);
  s.addText("Spot, strike, time, rate, all observable.", { x: 8.4, y: 2.55, w: 3.95, h: 0.8, margin: 0, fontFace: BODY, fontSize: 17, color: C.ink, lineSpacingMultiple: 1.2 });
  s.addText("Volatility is the market's estimate of how violently the price will move, its fear. It drives the premium more than anything else.", { x: 8.4, y: 3.4, w: 3.95, h: 1.5, margin: 0, fontFace: BODY, fontSize: 16, color: C.muted, lineSpacingMultiple: 1.25 });
  s.addText("Solve it backward from prices → implied volatility.", { x: 8.4, y: 4.95, w: 3.95, h: 0.6, margin: 0, fontFace: BODY, fontSize: 15, italic: true, color: C.teal, lineSpacingMultiple: 1.2 });
  footer(s);
}

// ============================================================ 15 · VOLATILITY SMILE
{
  const s = newSlide();
  header(s, "BEYOND ONE SIGMA", "The volatility smile");
  const m = [
    [C.teal, "One vol, all strikes?", ["Black-Scholes uses one σ for every strike.", "Real option prices disagree.", "The wings trade richer."]],
    [C.teal, "The smile", ["Plot implied vol against strike.", "It rises away from the money.", "Both wings curl up: a smile."]],
    [C.red, "Equity-index skew", ["Indices tilt, they don't smile evenly.", "Crash fear bids up the OTM puts.", "Low strikes carry the highest vol."]],
  ];
  const n = m.length, gap = 0.4, cw = (11.93 - gap * (n - 1)) / n, cy = 2.15, ch = 3.5;
  m.forEach((t, i) => {
    const x = 0.7 + i * (cw + gap);
    card(s, x, cy, cw, ch, t[0]);
    s.addText(t[1], { x: x + 0.28, y: cy + 0.32, w: cw - 0.5, h: 0.6, margin: 0, fontFace: HEAD, fontSize: 18, bold: true, color: C.ink });
    s.addText(t[2].map((l) => ({ text: l, options: { breakLine: true } })), { x: x + 0.28, y: cy + 1.15, w: cw - 0.55, h: 2.1, margin: 0, fontFace: BODY, fontSize: 14.5, color: C.muted, lineSpacingMultiple: 1.3 });
  });
  s.addText("One model, one σ. Real prices reveal many.", { x: 0.7, y: 5.9, w: 11.9, h: 0.5, margin: 0, align: "center", fontFace: BODY, fontSize: 15.5, italic: true, color: C.muted });
  footer(s);
}

// ============================================================ 16 · BARRIER / EXOTIC
{
  const s = newSlide();
  header(s, "EXOTIC OPTIONS", "Cheaper, with a tripwire");
  img(s, "assets/concept/barrier.png", 1.05, 1.8, 8.0, 4.0);
  card(s, 9.3, 2.2, 3.3, 3.3, C.red);
  s.addText("Knock-out", { x: 9.6, y: 2.5, w: 2.85, h: 0.5, margin: 0, fontFace: HEAD, fontSize: 19, bold: true, color: C.ink });
  s.addText("Touch the barrier once and the option dies, worthless, instantly.", { x: 9.6, y: 3.05, w: 2.85, h: 1.2, margin: 0, fontFace: BODY, fontSize: 15.5, color: C.muted, lineSpacingMultiple: 1.25 });
  s.addText("Less protection,\nlower premium:\n1,112 → 934", { x: 9.6, y: 4.35, w: 2.85, h: 1.0, margin: 0, fontFace: MONO, fontSize: 16, bold: true, color: C.red, lineSpacingMultiple: 1.25 });
  footer(s);
}

// ============================================================ 17 · BARRIER FAMILY
{
  const s = newSlide();
  header(s, "BARRIER OPTIONS", "The barrier family");
  const cw = 5.75, ch = 1.78, gx = 6.86, ry0 = 1.95, ry1 = 3.83;
  const q = (x, y, accent, head, lines) => {
    card(s, x, y, cw, ch, accent);
    s.addText(head, { x: x + 0.3, y: y + 0.2, w: cw - 0.5, h: 0.45, margin: 0, fontFace: HEAD, fontSize: 18, bold: true, color: C.ink });
    s.addText(lines.map((l) => ({ text: l, options: { breakLine: true } })), { x: x + 0.3, y: y + 0.72, w: cw - 0.55, h: ch - 0.8, margin: 0, fontFace: BODY, fontSize: 13.5, color: C.muted, lineSpacingMultiple: 1.22 });
  };
  q(0.7, ry0, C.red, "Down-and-out", ["Dies if spot falls to the barrier.", "Barrier below the start (the deck's Day 3 trade)."]);
  q(gx, ry0, C.teal, "Down-and-in", ["Born only if spot falls to the barrier.", "Dormant until that level is hit."]);
  q(0.7, ry1, C.red, "Up-and-out", ["Dies if spot rises to the barrier.", "Barrier above the start, usually paired with puts."]);
  q(gx, ry1, C.teal, "Up-and-in", ["Born only if spot rises to the barrier.", "No touch, no option."]);
  s.addText("Same strike, expiry and barrier: knock-in + knock-out = the vanilla option.", { x: 0.7, y: 5.85, w: 11.9, h: 0.6, margin: 0, align: "center", fontFace: BODY, fontSize: 15.5, italic: true, color: C.muted });
  footer(s);
}

// ============================================================ 18 · PUT–CALL PARITY
{
  const s = newSlide();
  header(s, "PUT–CALL PARITY", "Calls and puts are linked");
  card(s, 3.55, 2.55, 6.25, 1.9, C.teal);
  s.addText("C − P = S − K · e^(−rT)", { x: 3.55, y: 2.93, w: 6.25, h: 1.1, margin: 0, align: "center", fontFace: MONO, fontSize: 30, bold: true, color: C.ink });
  s.addText("Hold a call and sell a put, and you have replicated the stock itself. Arbitrage forces this to hold, so knowing one option's price gives you the other's.", { x: 1.9, y: 4.85, w: 9.5, h: 1.0, margin: 0, align: "center", fontFace: BODY, fontSize: 17, italic: true, color: C.ink, lineSpacingMultiple: 1.3 });
  s.addText("C call   ·   P put   ·   S spot   ·   K strike   ·   r rate   ·   T time", { x: 0.7, y: 6.2, w: 11.9, h: 0.4, margin: 0, align: "center", fontFace: MONO, fontSize: 14, color: C.ink });
  footer(s);
}

// ============================================================ 19 · THE PRODUCT
{
  const s = newSlide();
  header(s, "THE PRODUCT", "Hang Seng Index Option");
  const rows = [
    ["Underlying", "Hang Seng Index (HSI)"],
    ["Contract multiplier", "HK$50 per index point"],
    ["Exercise style", "European, exercised only at expiry"],
    ["Settlement", "Cash (no shares change hands)"],
    ["Exchange", "HKEX · listed since 1993"],
  ].map((r) => [
    { text: r[0], options: { bold: true, color: C.ink, fontFace: BODY, fill: { color: C.panel } } },
    { text: r[1], options: { color: C.ink, fontFace: BODY, fill: { color: C.card } } },
  ]);
  s.addTable(rows, { x: 1.5, y: 2.2, w: 10.3, colW: [3.6, 6.7], rowH: 0.62, fontFace: BODY, fontSize: 17, valign: "middle", border: { type: "solid", pt: 1, color: C.hair }, margin: 0.12 });
  s.addText("Asia's flagship equity-index derivative, and the contract priced throughout this project.", { x: 1.5, y: 5.9, w: 10.3, h: 0.4, margin: 0, fontFace: BODY, fontSize: 16, italic: true, color: C.muted });
  footer(s);
}

// ============================================================ 20 · CTA + QR
{
  const s = newSlide();
  header(s, "TRY IT YOURSELF", "From theory to the trading desk");
  s.addText("We built a game that runs this exact pricing engine: four trading days, real clients to quote, a grade at the end.", { x: 0.7, y: 1.95, w: 7.2, h: 1.4, margin: 0, fontFace: BODY, fontSize: 19, color: C.ink, lineSpacingMultiple: 1.3 });
  s.addText("Scan to play in your browser:", { x: 0.7, y: 3.7, w: 7, h: 0.4, margin: 0, fontFace: BODY, fontSize: 16, bold: true, color: C.teal });
  s.addText("zeref007.github.io/trader-simulator", { x: 0.7, y: 4.15, w: 7.2, h: 0.5, margin: 0, fontFace: MONO, fontSize: 18, bold: true, color: C.ink });
  s.addText("With thanks to Professor Martin, the inspiration behind this project.", { x: 0.7, y: 5.5, w: 7.2, h: 0.7, margin: 0, fontFace: HEAD, fontSize: 17, italic: true, color: C.muted, lineSpacingMultiple: 1.25 });
  s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: 9.0, y: 2.0, w: 3.4, h: 3.4, rectRadius: 0.08, fill: { color: C.card }, line: { color: C.hair, width: 1 }, shadow: sh() });
  s.addImage({ path: "assets/qr-hi.png", x: 9.25, y: 2.25, w: 2.9, h: 2.9 });
  s.addText("Central Trader · FIN 7870", { x: 9.0, y: 5.5, w: 3.4, h: 0.35, margin: 0, align: "center", fontFace: BODY, fontSize: 13, color: C.muted });
  footer(s);
}

// Write a NEW versioned filename every build, so an already-open PowerPoint
// (which caches the file it loaded) never masks the latest changes.
const vers = fs.readdirSync(".")
  .map((f) => /^Central-Trader-Deck-v(\d+)\.pptx$/.exec(f))
  .filter(Boolean)
  .map((m) => +m[1]);
const ver = (vers.length ? Math.max(...vers) : 0) + 1;
const fileName = `Central-Trader-Deck-v${ver}.pptx`;
P.writeFile({ fileName }).then((f) => console.log("wrote", f));

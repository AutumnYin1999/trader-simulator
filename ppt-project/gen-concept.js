// Generate concept diagrams as crisp PNGs in the light "quant-paper" theme.
const sharp = require("sharp");
const fs = require("fs");

const INK = "#16243A", TEAL = "#0E7C66", GREEN = "#1B998B", RED = "#D7263D",
  MUTED = "#6B7A90", HAIR = "#C9C2B4", GREENF = "rgba(27,153,139,0.10)";
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "Arial, Helvetica, sans-serif";
const MONO = "'Courier New', monospace";

async function save(name, vb, scale, body) {
  const [w, h] = vb;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w * scale}" height="${h * scale}">${body}</svg>`;
  await sharp(Buffer.from(svg)).png().toFile(`assets/concept/${name}.png`);
  console.log("wrote", name);
}

// ---- 1) Payoff: long call + long put, side by side ----
function panel(ox, title, formula, pts, kPts, kx, dir) {
  // axes box: x 0..480 within panel, baseline y=400 (P/L=0 at y=300)
  const ax = ox + 70, ay0 = 70, ay1 = 430, axR = ox + 540;
  const zero = 300;
  return `
  <text x="${ox + 70}" y="48" font-family="${SERIF}" font-size="30" font-weight="bold" fill="${INK}">${title}</text>
  <line x1="${ax}" y1="${ay1}" x2="${axR}" y2="${ay1}" stroke="${INK}" stroke-width="2.5"/>
  <line x1="${ax}" y1="${ay0}" x2="${ax}" y2="${ay1}" stroke="${INK}" stroke-width="2.5"/>
  <text x="${axR - 6}" y="${ay1 + 34}" font-family="${SANS}" font-size="20" fill="${MUTED}" text-anchor="end">spot price</text>
  <text x="${ax - 14}" y="${ay0 + 4}" font-family="${SANS}" font-size="20" fill="${MUTED}" text-anchor="end">P/L</text>
  <line x1="${ax}" y1="${zero}" x2="${axR}" y2="${zero}" stroke="${HAIR}" stroke-width="1.5" stroke-dasharray="6 6"/>
  <line x1="${kx}" y1="${ay0}" x2="${kx}" y2="${ay1}" stroke="${HAIR}" stroke-width="1.5" stroke-dasharray="4 6"/>
  <text x="${kx}" y="${ay1 + 30}" font-family="${MONO}" font-size="22" fill="${INK}" text-anchor="middle">K</text>
  <polyline points="${pts}" fill="none" stroke="${TEAL}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>
  <text x="${ax + 14}" y="378" font-family="${SANS}" font-size="18" fill="${RED}">− premium (max loss)</text>
  <text x="${ox + 70}" y="520" font-family="${MONO}" font-size="24" fill="${INK}">${formula}</text>`;
}
const payoff = panel(0, "Long Call", "payoff = max(S − K, 0)", "70,345 330,345 538,118", null, 330) +
  panel(600, "Long Put", "payoff = max(K − S, 0)", "672,118 905,345 1138,345", null, 905);

// ---- 2) Binomial (CRR) tree, 2 steps ----
function node(x, y, val, sub) {
  return `<g>
    <rect x="${x - 72}" y="${y - 34}" rx="10" width="144" height="68" fill="#FFFFFF" stroke="${INK}" stroke-width="2"/>
    <text x="${x}" y="${y - 4}" font-family="${MONO}" font-size="26" fill="${INK}" text-anchor="middle">${val}</text>
    ${sub ? `<text x="${x}" y="${y + 22}" font-family="${SANS}" font-size="16" fill="${MUTED}" text-anchor="middle">${sub}</text>` : ""}
  </g>`;
}
function edge(x1, y1, x2, y2, up) {
  return `<line x1="${x1 + 74}" y1="${y1 + (up ? -18 : 18)}" x2="${x2 - 74}" y2="${y2 + (up ? 14 : -14)}" stroke="${up ? GREEN : RED}" stroke-width="3"/>`;
}
const T0 = [150, 320], U = [470, 180], D = [470, 460], UU = [800, 110], UD = [800, 320], DD = [800, 530];
const tree = `
  <text x="60" y="50" font-family="${SERIF}" font-size="30" font-weight="bold" fill="${INK}">Binomial tree · CRR · 2 steps shown</text>
  ${edge(...T0, ...U, true)}${edge(...T0, ...D, false)}
  ${edge(...U, ...UU, true)}${edge(...U, ...UD, false)}
  ${edge(...D, ...UD, true)}${edge(...D, ...DD, false)}
  ${node(...T0, "21,500", "today")}
  ${node(...U, "22,069", "up ×u")}${node(...D, "20,946", "down ×d")}
  ${node(...UU, "22,653")}${node(...UD, "21,500")}${node(...DD, "20,405")}
  <g font-family="${MONO}" font-size="20" fill="${INK}">
    <text x="905" y="250">u = e^(σ√Δt)</text>
    <text x="905" y="298" fill="${MUTED}">d = 1 / u</text>
    <text x="905" y="352">p = (e^(rΔt)−d)/(u−d)</text>
  </g>
  <text x="905" y="430" font-family="${SANS}" font-size="20" fill="${TEAL}">forward to build,</text>
  <text x="905" y="458" font-family="${SANS}" font-size="20" fill="${TEAL}">backward to price</text>`;

// ---- 3) Barrier knock-out ----
const barrier = `
  <text x="60" y="50" font-family="${SERIF}" font-size="30" font-weight="bold" fill="${INK}">Down-and-out call · the tripwire</text>
  <line x1="110" y1="440" x2="1040" y2="440" stroke="${INK}" stroke-width="2"/>
  <text x="1035" y="474" font-family="${SANS}" font-size="20" fill="${MUTED}" text-anchor="end">time</text>
  <line x1="110" y1="360" x2="1040" y2="360" stroke="${RED}" stroke-width="2" stroke-dasharray="8 7"/>
  <text x="1035" y="350" font-family="${SANS}" font-size="20" fill="${RED}" text-anchor="end">barrier</text>
  <polyline points="120,250 250,230 380,290 460,330 520,360" fill="none" stroke="${TEAL}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>
  <polyline points="520,360 650,330 800,300 1000,235" fill="none" stroke="${MUTED}" stroke-width="4" stroke-dasharray="8 8" opacity="0.7"/>
  <circle cx="520" cy="360" r="11" fill="${RED}"/>
  <text x="548" y="408" font-family="${SANS}" font-size="22" font-weight="bold" fill="${RED}">knocked out</text>
  <text x="120" y="210" font-family="${MONO}" font-size="22" fill="${INK}">vanilla 1,112  →  barrier 934   (−16%)</text>`;

// ---- 4) Vega / volatility curve ----
const vol = `
  <text x="60" y="50" font-family="${SERIF}" font-size="30" font-weight="bold" fill="${INK}">Higher volatility → higher value</text>
  <line x1="110" y1="430" x2="820" y2="430" stroke="${INK}" stroke-width="2.5"/>
  <line x1="110" y1="80" x2="110" y2="430" stroke="${INK}" stroke-width="2.5"/>
  <text x="815" y="464" font-family="${SANS}" font-size="20" fill="${MUTED}" text-anchor="end">volatility σ</text>
  <text x="128" y="108" font-family="${SANS}" font-size="20" fill="${MUTED}" text-anchor="start">option value</text>
  <path d="M110,405 C 300,395 470,330 600,230 S 760,120 815,100" fill="none" stroke="${TEAL}" stroke-width="6" stroke-linecap="round"/>
  <text x="150" y="150" font-family="${SANS}" font-size="22" fill="${TEAL}">Vega &gt; 0</text>`;

(async () => {
  await save("payoff", [1200, 560], 2, payoff);
  await save("tree", [1180, 630], 2, tree);
  await save("barrier", [1100, 520], 2, barrier);
  await save("vol", [880, 500], 2, vol);
  console.log("done");
})();

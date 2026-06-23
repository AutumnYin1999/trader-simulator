// Central Trader — YouTube thumbnail (1280x720, rendered @2x for crispness).
const sharp = require("sharp");
const fs = require("fs");

const W = 1280, H = 720;
const BG = "#0b0f17", INK = "#f7f9fc", CORAL = "#ff6b3d", GOLD = "#f5b942",
  GREEN = "#34d39a", RED = "#ff4d5e", MUTED = "#aeb9cc";
const BLACK = "Arial Black, Arial, sans-serif";
const SANS = "Arial, Helvetica, sans-serif";

// 1997 crash line (dramatic downtrend) on the right
const crash = "740,210 800,170 860,300 930,250 1000,395 1075,345 1150,505 1235,560";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W * 2}" height="${H * 2}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="g1" cx="14%" cy="12%" r="55%">
      <stop offset="0%" stop-color="${CORAL}" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="${CORAL}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g2" cx="92%" cy="6%" r="55%">
      <stop offset="0%" stop-color="${GOLD}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${GOLD}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="logo" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${CORAL}"/><stop offset="100%" stop-color="${GOLD}"/>
    </linearGradient>
    <linearGradient id="redfill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${RED}" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="${RED}" stop-opacity="0"/>
    </linearGradient>
    <filter id="glowR" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="glowG" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="10" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect width="${W}" height="${H}" fill="url(#g1)"/>
  <rect width="${W}" height="${H}" fill="url(#g2)"/>

  <!-- 1997 crash chart, right side -->
  <polygon points="740,210 ${crash.split(' ').slice(1).join(' ')} 1235,610 740,610" fill="url(#redfill)" opacity="0.9"/>
  <polyline points="${crash}" fill="none" stroke="${RED}" stroke-width="9" stroke-linejoin="round" stroke-linecap="round" filter="url(#glowR)"/>
  <circle cx="1235" cy="560" r="13" fill="${RED}" filter="url(#glowR)"/>
  <text x="1238" y="150" font-family="${BLACK}" font-size="74" font-weight="900" fill="${RED}" text-anchor="end" filter="url(#glowR)">-23%</text>
  <text x="1238" y="186" font-family="${SANS}" font-size="22" fill="${MUTED}" text-anchor="end" letter-spacing="2">HANG SENG · FOUR DAYS</text>

  <!-- left headline block -->
  <text x="80" y="138" font-family="${SANS}" font-size="30" font-weight="bold" fill="${GOLD}" letter-spacing="7">HONG KONG · 1997</text>
  <text x="76" y="250" font-family="${BLACK}" font-size="104" font-weight="900" fill="${INK}">ONE PIECE</text>
  <text x="76" y="350" font-family="${BLACK}" font-size="104" font-weight="900" fill="${INK}">OF PAPER</text>

  <text x="80" y="486" font-family="${BLACK}" font-size="92" font-weight="900" fill="${GREEN}" filter="url(#glowG)">$10 → $10,000</text>
  <text x="84" y="540" font-family="${SANS}" font-size="31" fill="${MUTED}">it pays when the market crashes.</text>

  <!-- brand -->
  <rect x="80" y="636" width="42" height="42" rx="9" fill="url(#logo)"/>
  <text x="135" y="668" font-family="${BLACK}" font-size="34" font-weight="900" fill="${INK}" letter-spacing="2">CENTRAL TRADER</text>
</svg>`;

(async () => {
  const out = "../video-project/out/thumbnail.png";
  await sharp(Buffer.from(svg)).png().toFile(out);
  console.log("wrote", out);
})();

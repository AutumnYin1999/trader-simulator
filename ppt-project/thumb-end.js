// Central Trader — YouTube end-screen card (1280x720 @2x). Thanks Professor Martin
// + QR to the game with a "meet him at the desk" CTA on the right.
const sharp = require("sharp");
const fs = require("fs");

const W = 1280, H = 720, S = 2; // render scale
const BG = "#0b0f17", INK = "#f7f9fc", CORAL = "#ff6b3d", GOLD = "#f5b942",
  GREEN = "#34d39a", MUTED = "#aeb9cc";
const BLACK = "Arial Black, Arial, sans-serif";
const SANS = "Arial, Helvetica, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";

// QR card geometry (viewBox coords)
const CARDX = 902, CARDY = 250, CARDW = 300, CARDH = 300;
const QRPAD = 26, QRSIZE = CARDW - QRPAD * 2; // 248

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W * S}" height="${H * S}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="g1" cx="18%" cy="24%" r="60%">
      <stop offset="0%" stop-color="${CORAL}" stop-opacity="0.22"/><stop offset="100%" stop-color="${CORAL}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g2" cx="82%" cy="86%" r="55%">
      <stop offset="0%" stop-color="${GOLD}" stop-opacity="0.16"/><stop offset="100%" stop-color="${GOLD}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="logo" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${CORAL}"/><stop offset="100%" stop-color="${GOLD}"/></linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="${GOLD}"/><stop offset="100%" stop-color="${CORAL}"/></linearGradient>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="cardsh" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="6" stdDeviation="14" flood-color="#000" flood-opacity="0.45"/></filter>
  </defs>

  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect width="${W}" height="${H}" fill="url(#g1)"/>
  <rect width="${W}" height="${H}" fill="url(#g2)"/>

  <polyline points="84,560 300,540 480,470 660,360 820,300" fill="none" stroke="${GREEN}" stroke-width="4" stroke-linecap="round" opacity="0.28" filter="url(#glow)"/>

  <text x="84" y="140" font-family="${SANS}" font-size="27" font-weight="bold" fill="${GOLD}" letter-spacing="6">DIGITAL INVESTFAIR · FIN 7870</text>
  <text x="78" y="292" font-family="${BLACK}" font-size="112" font-weight="900" fill="${INK}">THANK YOU</text>
  <text x="82" y="394" font-family="${SERIF}" font-size="80" font-style="italic" fill="url(#gold)" filter="url(#glow)">Professor Martin</text>
  <text x="86" y="458" font-family="${SANS}" font-size="29" fill="${MUTED}">the inspiration behind this project,</text>
  <text x="86" y="496" font-family="${SANS}" font-size="29" fill="${MUTED}">and the opportunity to build it.</text>

  <!-- brand -->
  <rect x="84" y="624" width="40" height="40" rx="9" fill="url(#logo)"/>
  <text x="137" y="654" font-family="${BLACK}" font-size="30" font-weight="900" fill="${INK}" letter-spacing="2">CENTRAL TRADER</text>
  <text x="86" y="690" font-family="${SANS}" font-size="21" fill="${MUTED}">zeref007.github.io/trader-simulator</text>

  <!-- QR card (right) -->
  <text x="${CARDX + CARDW / 2}" y="${CARDY - 26}" font-family="${BLACK}" font-size="30" font-weight="900" fill="${INK}" text-anchor="middle">MEET HIM AT THE DESK</text>
  <rect x="${CARDX}" y="${CARDY}" width="${CARDW}" height="${CARDH}" rx="20" fill="#ffffff" filter="url(#cardsh)"/>
  <text x="${CARDX + CARDW / 2}" y="${CARDY + CARDH + 38}" font-family="${SANS}" font-size="26" font-weight="bold" fill="${GOLD}" text-anchor="middle">scan · play the desk →</text>
</svg>`;

(async () => {
  const qrPath = fs.existsSync("assets/qr-hi.png") ? "assets/qr-hi.png" : "../public/qr.png";
  const qr = await sharp(qrPath).resize(QRSIZE * S, QRSIZE * S, { fit: "contain", background: "#fff" }).png().toBuffer();
  const out = "../video-project/out/end-screen.png";
  await sharp(Buffer.from(svg))
    .composite([{ input: qr, left: (CARDX + QRPAD) * S, top: (CARDY + QRPAD) * S }])
    .png().toFile(out);
  console.log("wrote", out, "(QR from", qrPath + ")");
})();

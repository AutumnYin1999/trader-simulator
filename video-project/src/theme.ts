// Components are authored in a 1920x1080 coordinate space (AUTHOR_W x AUTHOR_H).
// The composition renders at 4K (width x height); Root scales the whole tree by
// SCALE so every vector/CSS element stays proportional and crisp at 3840x2160.
const AUTHOR_W = 1920;
const AUTHOR_H = 1080;
const SCALE = 2; // 1920x1080 -> 3840x2160

// Cinematic palette (v3). Warm coral/gold accents over near-black — no blue.
// Green = gains, red = losses for the market charts.
export const theme = {
  fps: 30,
  width: AUTHOR_W * SCALE, // 3840
  height: AUTHOR_H * SCALE, // 2160
  authorWidth: AUTHOR_W,
  authorHeight: AUTHOR_H,
  scale: SCALE,
  colors: {
    bg: "#070a12", // near-black cinematic base
    bg2: "#0c1322", // panel / gradient stop
    panel: "#111a2b",
    fg: "#f7f9fc",
    accent: "#ff6b3d", // coral (matches the game UI)
    accent2: "#f5b942", // gold
    up: "#34d39a", // gains / green
    down: "#ff4d5e", // losses / red
    muted: "#8a94a6",
    grid: "#1b2436",
  },
  fonts: {
    body: "Inter, system-ui, sans-serif",
    display: "InterDisplay, Inter, system-ui, sans-serif",
  },
} as const;

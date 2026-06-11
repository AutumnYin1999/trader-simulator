// Components are authored in a 1920x1080 coordinate space (AUTHOR_W x AUTHOR_H).
// The composition renders at 4K (width x height); Root scales the whole tree by
// SCALE so every vector/CSS element stays proportional and crisp at 3840x2160.
const AUTHOR_W = 1920;
const AUTHOR_H = 1080;
const SCALE = 2; // 1920x1080 -> 3840x2160

export const theme = {
  fps: 30,
  width: AUTHOR_W * SCALE, // 3840
  height: AUTHOR_H * SCALE, // 2160
  authorWidth: AUTHOR_W,
  authorHeight: AUTHOR_H,
  scale: SCALE,
  colors: {
    bg: "#0b0f1a",
    fg: "#f5f7fb",
    accent: "#3aa0ff",
    muted: "#7a869a",
  },
  fonts: {
    body: "Inter, system-ui, sans-serif",
    display: "InterDisplay, Inter, system-ui, sans-serif",
  },
} as const;

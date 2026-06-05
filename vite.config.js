import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// base is "/trader-simulator/" for GitHub Pages project sites (set GH_PAGES=1),
// and "/" everywhere else (local dev, Vercel, Netlify).
export default defineConfig({
  base: process.env.GH_PAGES ? "/trader-simulator/" : "/",
  plugins: [react()],
});

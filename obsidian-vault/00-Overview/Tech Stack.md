---
tags: [overview, tech-stack]
---

The libraries and services the app is built on, and how they are wired.

# Tech Stack

## Runtime dependencies (package.json)

| Package | Version | Role |
|---|---|---|
| react / react-dom | ^19.0.0 | UI runtime (StrictMode mount in `src/main.jsx`) |
| vite | ^7.0.0 | Dev server and build |
| @vitejs/plugin-react | ^5.0.0 | JSX transform |
| @supabase/supabase-js | ^2.107.0 | Auth and cloud progress, see [[Supabase Integration]] |

Note: older docs say React 18; package.json pins `^19.0.0`.

## Styling

- Tailwind is loaded from the CDN in `index.html` (`<script src="https://cdn.tailwindcss.com">`), not via PostCSS. Utility classes are used inline with CSS variables, e.g. `bg-[var(--surface)]`.
- A handwritten `<style>` block (`StyleBlock`, line 1994) defines tokens and keyframes, see [[Theme System]].
- Fonts come from Google Fonts: Plus Jakarta Sans (body) and JetBrains Mono (numbers, `.font-terminal` and `.num` classes).

## Scripts

```bash
npm install
npm run dev      # vite --host 127.0.0.1  -> http://127.0.0.1:5173/
npm run build    # vite build -> dist/
npm run preview  # vite preview --host 127.0.0.1
```

The working convention (HANDOFF.md) is to run `npm run build` after every change as a compile check.

## Config files

- `vite.config.js`, sets `base: "/trader-simulator/"` when `GH_PAGES=1`, else `/` (see [[Deployment]])
- `vercel.json`, SPA rewrite of everything to `/`
- `.env` (gitignored), `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`; without them the app runs in guest mode (see [[Supabase Integration]])
- `supabase/schema.sql`, the database bootstrap (see [[Database Schema]])

## What there is none of

No router (the [[Game Flow]] state machine replaces it), no state library, no CSS framework build step, no test runner, no TypeScript. The whole game is one component tree in one file, see [[Architecture]].

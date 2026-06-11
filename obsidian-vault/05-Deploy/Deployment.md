---
tags: [deploy, github-pages, vercel, hosting]
---

How the static Vite build ships: GitHub Pages on the ZEREF007 fork today, Vercel as the documented alternative.

# Deployment

The app is a static Vite SPA ([[Tech Stack]]); any static host works. Supabase is external, so hosting and backend are independent (see [[Supabase Integration]]).

## GitHub Pages (current, the live URL)

Live at https://zeref007.github.io/trader-simulator/, served from the ZEREF007 fork (see [[Repos and Branches]]).

- `vite.config.js` switches the base path: `base: process.env.GH_PAGES ? "/trader-simulator/" : "/"` (commit a314a49). Project sites on Pages live under `/<repo>/`, so assets break without it.
- Flow: build with `GH_PAGES=1 npm run build`, publish `dist/` to the fork's `gh-pages` branch, Pages serves that branch.
- Supabase env vars, if wanted on Pages, must be injected at build time (GitHub Actions secrets), since Vite inlines `VITE_*` values into the bundle. Without them the public demo runs in guest mode with no sign-up wall, which is the desired booth behavior for the [[Investfair Assignment]].

## Vercel (documented in DEPLOY.md)

- Import the repo, framework auto-detected as Vite, build `npm run build`, output `dist`
- Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables (anon key is safe client-side because of RLS, see [[Database Schema]]; never the service_role key)
- `vercel.json` rewrites every route to `/` for SPA behavior
- Every push to `main` redeploys; accounts toggle on/off purely by the presence of the env vars

## Legacy VM auto-deploy (ops/)

`ops/deploy-trader-simulator.sh` plus `ops/trader-simulator-deploy.cron`: a root cron job that polls `origin/main` every minute on a server, rebuilds when the SHA changes, and copies `dist/` into `/var/www/html` with a flock to avoid overlapping runs. Predates Pages/Vercel; kept for reference.

## Checklists

- Run `supabase/schema.sql` once before accounts work anywhere ([[Database Schema]])
- `npm run build` must pass before any deploy (working convention in HANDOFF.md)
- Netlify and Cloudflare Pages take the same `dist/` output unchanged

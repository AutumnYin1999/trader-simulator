# Deploying Central Trader (Vercel)

This is a static Vite single-page app. Supabase is an external service, so any
static host works; these steps cover Vercel.

## One-time setup

1. Push `main` to GitHub (done).
2. Go to https://vercel.com, sign in with GitHub, click **Add New... > Project**.
3. **Import** the `trader-simulator` repository.
4. Vercel auto-detects the framework as **Vite**. Leave the defaults:
   - Build command: `npm run build`
   - Output directory: `dist`
5. Expand **Environment Variables** and add the two Supabase values (same as the
   local `.env`):
   - `VITE_SUPABASE_URL` = your project URL
   - `VITE_SUPABASE_ANON_KEY` = your anon / public key
   The anon key is safe in the client build because Row Level Security restricts
   data per user. Never add the `service_role` key.
6. Click **Deploy**. You get a `https://<project>.vercel.app` URL in about a minute.

Every push to `main` redeploys automatically.

## Accounts on or off

- **With** the two env vars set: visitors must sign in or create an account, and
  progress syncs to Supabase (cross-device).
- **Without** the env vars: the app runs open in local guest mode, with progress
  saved per browser. Useful for a public demo with no sign-up wall.

## Before accounts work

Run `supabase/schema.sql` once in the Supabase SQL editor to create the
`profiles` and `progress` tables (see `HANDOFF-backend.md`).

## Other hosts

The same `dist` output deploys to Netlify, Cloudflare Pages, or GitHub Pages.
For GitHub Pages set `base: "/trader-simulator/"` in `vite.config.js` and inject
the two `VITE_` vars as build-time secrets in a GitHub Actions workflow.

---
tags: [backend, supabase, auth]
---

How the app talks to Supabase, and how it degrades to pure-local guest mode when no credentials exist.

# Supabase Integration

The app runs in two modes, switched by one boolean. Schema details in [[Database Schema]]; the dual-write logic in [[Progress Persistence]].

## The client (src/supabaseClient.js)

```js
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const isSupabaseConfigured = Boolean(url && anonKey);
export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null;
```

If either env var is missing (`.env` is gitignored; see `.env.example`), `supabase` is null and every cloud feature is skipped. No keys means no login wall: the game behaves exactly like the original localStorage-only build. HANDOFF-backend.md documents the full setup.

## Auth gate and session flow

All in the root component (see [[Architecture]]):

- `session` state (line 7951) and `authChecked` (line 7952, starts true when unconfigured so guests skip the gate)
- On mount (configured only): `supabase.auth.getSession()` resolves the current session, then `onAuthStateChange` (line 7965) keeps it in sync
- No session: `AuthScreen` (line 2854) renders sign in / create account, themed to match the [[Theme System]]. Sign-up with email confirmation enabled shows a "confirm your email" notice (commit 55c1399) because no session returns yet
- With a session: the app upserts the user's `profiles` row, loads their `progress` rows into state, and proceeds to the title screen ([[Game Flow]])
- `signOut` (line 8977) is reachable from the TopBar account menu

## Security model

The anon key ships to the browser deliberately: Row Level Security restricts every query to `auth.uid() = user_id`, so a leaked anon key only grants access to your own rows (see [[Database Schema]]). The `service_role` key must never appear in client code or env vars used by Vite.

## Writes

The only write paths are the profile upsert at sign-in and `persistDayProgress` (line 8108) upserting `progress` rows when a day completes, fire-and-forget with a console error on failure (see [[Progress Persistence]]). On [[Deployment]] targets, the two env vars are set as build-time variables (Vercel env settings or GitHub Actions secrets).

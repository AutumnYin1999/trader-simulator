---
tags: [backend, persistence, localstorage]
---

How day grades and the player profile are saved: always to localStorage, additionally to Supabase when signed in.

# Progress Persistence

Persistence is local-first with an optional cloud mirror. The cloud side is described in [[Supabase Integration]] and [[Database Schema]].

## localStorage layer

Keys and helpers (lines 1498 to 1551):

- `ct_profile_v1` (`CT_PROFILE_KEY`): `{ name }`, default `{ name: "Guest Trader" }`
- `ct_progress_v1` (`CT_PROGRESS_KEY`): `{ day1..day4: { grade, score, completedAt } | null }`

`loadProfile` / `saveProfile` / `loadProgress` / `saveDayProgress` all wrap JSON parse/stringify in try/catch and fall back to defaults, so private mode or blocked storage never crashes the game. `saveDayProgress` merges one day record into the stored object and returns the merged result for in-memory state.

## Grade mapping

`GRADE_PERCENT` and `gradeToPercent` (line 1553): A 95, A- 90, B 82, B- 78, C 68, D 50, unrecognized 60, missing 0. The percent is what `ProgressDashboard` (line 7781) displays and what lands in the Supabase `score` column. Letter grades come from the [[Scoring System]].

## The dual-write

`persistDayProgress(day, record)` (line 8108) does three things:

1. Updates React state (`setProgress`)
2. Writes localStorage via `saveDayProgress`
3. If `isSupabaseConfigured` and a session exists, upserts `{ user_id, day, grade, score, completed_at }` into `progress`, logging (not throwing) on error

So localStorage is always the source of truth for the current browser; the cloud row enables cross-device sync for signed-in users.

## When writes fire

`recordDayProgress(day, grade)` (line 8128) runs from `useEffect` hooks watching `day1Score` / `day2Score` / `day3Score` (results of `evaluateDayN`, see [[Scoring System]]) and, for Day 4, the scorecard stage with `day4Results` (see [[Day 4 Graduation Round]]). A guard skips the write when the same grade and score are already recorded; replays overwrite the previous attempt, matching the upsert semantics of the composite key in [[Database Schema]].

## Consumers

`ProgressDashboard` reads `progress` to show per-day grades and replay buttons; the TopBar account menu opens it (see [[Component Map]] and [[Game Flow]]). On sign-in, cloud rows are loaded and merged so a returning user sees their history on a fresh machine.

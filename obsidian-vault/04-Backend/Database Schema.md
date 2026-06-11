---
tags: [backend, database, schema, rls]
---

The two-table Supabase schema with row-level security, bootstrapped by supabase/schema.sql.

# Database Schema

Source: `supabase/schema.sql`. Run once in the Supabase SQL editor; it is written to be safely re-runnable (`create table if not exists`, `drop policy if exists` before each `create policy`). Connection details in [[Supabase Integration]].

## profiles

One row per user, holding the display name shown in the TopBar.

```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  name text,
  created_at timestamptz not null default now()
);
```

The app upserts this row right after sign up; there is no database trigger.

## progress

One row per (user, day), the cloud copy of a day grade.

```sql
create table if not exists public.progress (
  user_id uuid not null references auth.users on delete cascade,
  day int not null check (day between 1 and 4),
  grade text,
  score int,
  completed_at timestamptz not null default now(),
  primary key (user_id, day)
);
```

The composite primary key is what lets `persistDayProgress` upsert cleanly: a replayed day overwrites the prior attempt (see [[Progress Persistence]]). `grade` is the letter from the [[Scoring System]]; `score` is its `gradeToPercent` mapping. The `check (day between 1 and 4)` matches the four-day arc in [[Game Flow]].

## Row Level Security

RLS is enabled on both tables. With RLS on and no policies, everything is denied; six policies re-open access only for the owning user:

- `profiles_select_own` / `profiles_insert_own` / `profiles_update_own`: `auth.uid() = id`
- `progress_select_own` / `progress_insert_own` / `progress_update_own`: `auth.uid() = user_id`

Update policies carry both `using` and `with check` so a user can neither read nor write anyone else's rows. There are no delete policies, so rows are effectively append-and-overwrite. This per-user lockdown is the reason shipping the anon key in the browser is safe, and why the `service_role` key must stay server-side only (see [[Supabase Integration]] and [[Deployment]]).

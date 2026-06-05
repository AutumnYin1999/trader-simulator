-- Central Trader: Supabase schema
-- Run this once in the Supabase SQL editor (Dashboard -> SQL Editor -> New query).
-- It creates the two tables the app reads/writes and locks them down with
-- Row Level Security (RLS) so every authenticated user can only touch their own
-- rows. The browser uses the anon/public key, which is safe precisely because
-- these policies restrict data access per user. The service_role key must never
-- be shipped to the client.

-- ---------------------------------------------------------------------------
-- profiles: one row per user, holding the display name.
-- The app upserts this row right after sign up (no database trigger needed).
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  name text,
  created_at timestamptz not null default now()
);

-- progress: one row per (user, day). Stores the letter grade and percent score
-- for each of the four days. The composite primary key lets the app upsert a
-- day result and overwrite a prior attempt cleanly.
create table if not exists public.progress (
  user_id uuid not null references auth.users on delete cascade,
  day int not null check (day between 1 and 4),
  grade text,
  score int,
  completed_at timestamptz not null default now(),
  primary key (user_id, day)
);

-- ---------------------------------------------------------------------------
-- Enable Row Level Security. With RLS on and no policies, all access is denied
-- by default; the policies below re-open access but only for the owning user.
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.progress enable row level security;

-- profiles policies: a user may read and write only the row whose id matches
-- their own auth uid. Separate policies per command keep intent explicit.
-- (Drop-if-exists first so this script can be re-run safely.)
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- progress policies: same idea, keyed on user_id.
drop policy if exists "progress_select_own" on public.progress;
create policy "progress_select_own"
  on public.progress for select
  using (auth.uid() = user_id);

drop policy if exists "progress_insert_own" on public.progress;
create policy "progress_insert_own"
  on public.progress for insert
  with check (auth.uid() = user_id);

drop policy if exists "progress_update_own" on public.progress;
create policy "progress_update_own"
  on public.progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

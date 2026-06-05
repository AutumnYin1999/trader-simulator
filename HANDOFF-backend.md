# Backend setup: Supabase auth and cloud progress

This app runs in two modes. With no Supabase credentials it behaves exactly as
before: a local guest with progress saved in the browser, and no login screen.
When you add credentials, the app requires sign in and syncs each user's profile
and day grades to Supabase.

## 1. Create a Supabase project

Sign in at supabase.com, create a new project, and wait for it to finish
provisioning.

## 2. Copy your credentials into a local .env

In the Supabase dashboard open Project Settings, then API. Copy two values:

- Project URL into VITE_SUPABASE_URL
- the anon / public key into VITE_SUPABASE_ANON_KEY

Create a file named .env in the project root (next to package.json) with those
two lines. The .env file is gitignored, so it is never committed. See
.env.example for the exact shape to copy.

The anon key is safe to ship in the browser because Row Level Security (RLS)
restricts every query to the signed in user's own rows. Never put the
service_role key in this app or in any client code; it bypasses RLS.

## 3. Create the database tables

In the Supabase dashboard open the SQL Editor, start a new query, paste the full
contents of supabase/schema.sql, and run it. This creates the profiles and
progress tables and enables RLS with per user policies. The script is safe to
re-run.

## 4. Run the app

Install dependencies and start the dev server:

    npm install
    npm run dev

Open the printed local URL. If credentials are present you will see a sign in /
create account screen. Create an account, and your profile plus any completed
day grades will be stored in Supabase. Sign out from the account menu in the top
bar.

## How fallback works

If either env var is missing, the app skips the auth gate entirely and uses
browser localStorage for the guest profile and progress, identical to the
original behavior. No keys means no login wall.

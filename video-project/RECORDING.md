# RECORDING.md : browser-recording phase runbook

Voice-led Playwright capture for the 37 `sceneType: "browser-recording"` entries in
`narration-manifest.json`. Five clips, one recorder run and one webm per clip:

| clip (`scene` field) | browser entries |
|---|---|
| `clip1-hook` | C1-8, C1-9, C1-10 |
| `clip2-ticket` | C2-1 .. C2-11 |
| `clip3-pricing` | C3-1, C3-3, C3-4, C3-7 .. C3-14 |
| `clip4-barrier` | C4-1, C4-6, C4-7, C4-8, C4-9 |
| `clip5-graduation` | C5-1 .. C5-7 |

Animation entries interleave in the final composition but are NOT part of these runs;
consecutive browser entries of a clip record back to back in one continuous session and
each scene continues from the previous scene's app state.

## 1. Start the app gate-free (guest mode, no auth)

From the repo root (`/Users/ace/Desktop/Claude_Projects/trader-simulator`):

```bash
mv .env .env.bak                      # disables Supabase -> no sign-in gate, guest mode
npx vite --host 127.0.0.1 --port 5173
```

App URL: `http://127.0.0.1:5173/` (base is `/` locally; the GitHub Pages base only applies with GH_PAGES=1).

After ALL recording is done:

```bash
mv .env.bak .env
```

Do not record with `.env` in place: the app would render the AuthScreen instead of the title screen.

## 2. Record command (per clip, per provider)

Playwright Chromium is already installed (`npx playwright install chromium`, chromium-1223 + headless shell).
There is no tsconfig in video-project; the template runs via ts-node with explicit compiler options:

```bash
cd video-project
RECORD_START_URL=http://127.0.0.1:5173/ npx ts-node --transpile-only \
  --compiler-options '{"module":"commonjs","target":"es2020","esModuleInterop":true}' \
  scripts/record-demo.ts --provider edge --scene clip1-hook      # then clip2-ticket, ... clip5-graduation
```

Type-check (passes clean today):

```bash
npx tsc --noEmit --target es2020 --module commonjs --moduleResolution node --esModuleInterop --skipLibCheck scripts/record-demo.ts scripts/cursor-overlay.ts
```

Voiceover MP3s exist for every entry at `voiceover/edge/<id>.mp3`; per-sentence timings at `captions/edge/<id>.json`.
Output: `recordings/edge/*.webm` plus `segments-edge.json`; convert with `scripts/webm-to-mp4.sh`.

Recording order between clips does not matter: every clip's pre-roll resets or seeds
`localStorage` itself (`ct_progress_v1`, `ct_profile_v1`). Viewport is 1920x1080.

## 3. Required template extensions (scaffold gaps)

`scripts/record-demo.ts` is the scaffold; it currently implements only `click` (via
`page.locator(target)`), `scroll`, and `dwell`. The manifest uses two extra conventions
the runner must execute. Both are deliberate, schema-valid extra fields:

1. `visual.preRoll: string[]` on the FIRST browser entry of each clip. Execute these
   lines AFTER `page.goto(RECORD_START_URL)` and BEFORE injecting/playing the voiceover
   playlist. Pre-roll footage is automatically discarded because segment extraction uses
   the begin/end marks, which only start at entry 1.
2. `visual.steps: string[]` for `action: "custom"` entries. Execute sequentially once the
   entry's audio gate opens, e.g.:

   ```ts
   for (const line of entry.visual.steps ?? []) {
     await new Function("page", `return (async () => { ${line} })();`)(page);
   }
   ```

   Every line is plain async Playwright code over `page` (getByRole / getByLabel / mouse /
   goto / waitForTimeout). After steps finish, fall through to the existing
   wait-for-audio-end gate, which provides the dwell tail.

3. clip1 ONLY: C1-9 contains two `page.goto(...)` calls (live site, then back to local).
   A goto destroys the in-page `<audio>` gate the scaffold injects. For this clip host the
   gate audio in a SEPARATE page of the same context (e.g. `const audioPage = await
   context.newPage()` opened before the main page; inject `__audio`/`__playlist` there and
   run all `waitForFunction` gates against `audioPage`). The context records one webm per
   page; keep the main page's webm (the long one) and delete the tiny audio-page webm.
   Clips 2 to 5 never navigate, so the scaffold's same-page audio is fine for them.

4. `action: "dwell"` entries may also carry `preRoll` (C2-1, C3-1); nothing else needed,
   the audio gate is the dwell.

## 4. Stage -> primary button map (BottomActionBar, source of truth)

Title: `Start the Simulator` -> day1_welcome.

Day 1: `Start Morning Meeting` -> basics; `Continue: Call and Put` -> intro (CALL/PUT);
`Continue: Premium` -> premium; `Continue: Vanilla Option Rules` -> vanilla rules;
`Update Handbook` -> handbook splash; `Meet the First Client` -> client (Ms. Li);
`Go to Product Selection` -> 4 product cards; `Confirm Product` (needs selection) ->
risk disclosure; `Confirm Disclosure` (needs the 3 correct ticks, not the misleading 4th)
-> market run (auto, 11 chart points x 520ms); `View Report` (appears when run completes)
-> report; `Complete Day One`; `Enter Day Two: Pricing Desk`.

Day 2: `Start the Pricing Lesson` -> anchor lesson; `Continue: Binomial Tree Paths` ->
tree paths (accordion rows: `Today`, `Step 1 Up`, `Step 1 Down`, `Step 2 Recombine`,
`Step 3 Expiry`); `Continue: Payoff and Backward Induction` -> backward lesson;
`Update Handbook`; `Meet the Client` (Mr. Wang); `Go to Product Confirmation`;
`Confirm Product` -> data desk; `Parameters Noted, Go to the Pricing Desk` -> calculator +
quote; quote gate: button reads `Please Enter a Quote First` (disabled) until the quote
number input has a value, then `Continue to Risk Disclosure`; `Confirm Risk Disclosure`
(4 correct ticks) -> client response; `View Market Settlement` -> run (4 points);
`View Report`; `Complete Day Two`; `Enter Day Three: Barrier Options`.

Day 3: `Start the Barrier Lesson`; `Continue: What Is Knock-Out`; `Update Handbook`;
`Meet the Client` (Ms. Chen); `Go to Product Selection` (cards: Down-and-Out Call Option,
Vanilla Call Option, Up-and-Out Call Option, Buy the Index Directly);
`Go to the Data Desk for Parameters`; `Parameters Noted, Continue to Pricing` ->
compare panel (1,112 vs 934) + barrier calculator + quote; same quote gate ->
`Continue to Risk Disclosure`; `Confirm Risk Disclosure` -> response;
`View Market Settlement` -> run (6 points, knock-out at point 4 = 20,950);
`View Report`; `Complete Day Three`; `Enter the Graduation Round: Three-Client Pricing`.

Day 4: `Start Meeting Clients`; per client: `I've Read the Needs, Go Quote` (Zhang, Li) or
`I've Read the Needs, Go Judge the Product` (He) -> judge desk -> `Confirm Product, Go to
Quoting`; `Submit Quote` (gated on quote input); `Next Client` / `View Graduation
Scorecard` (3rd client); `Complete Graduation`.

Top bar (any in-game stage): nav buttons `Dashboard`, `About`, `Handbook`; back arrow
`aria-label="Go back"`; `aria-label="Account menu"` opens a menu with `role=menuitem`
items `Dashboard` and `Sign Out`. Dashboard day cards: buttons
`aria-label="Replay Day N: <topic>"` (text `Start` or `Replay`), usable to jump straight
to any day (used by clip 3, 4, 5 pre-rolls).

Calculator inputs (label -> getByLabel regex): `S0 Spot`, `K Strike`, `Barrier Level`
(barrier mode only), `r Risk-Free Rate %` (/Risk-Free Rate/), `Sigma Volatility %`
(/Volatility/), `T Annualized Maturity` (/Annualized Maturity/); steps N is locked
read-only. Quote box: label `Your Quote (points)` (/Your Quote/). Calculator defaults are
placeholder minimums by design; the real parameters must be typed for the theoretical
price to appear (Day2: 185.94, Day4: 297.06 / 980.77 / 1184.20). Day3's 1,112 vs 934
compare cards come from config and show without touching the calculator.

Disclosure checkboxes: `input[type="checkbox"]` in render order. Day 1: tick nth 0,1,2
(skip 3, misleading). Day 2 and Day 3: tick nth 0,1,2,3 (skip 4, misleading).

Quote values used (all land in the "Reasonable Quote / accepted" band):
Day2: 210 vs 186. Day3: 1050 vs 934 (fair up to x1.183 = 1104). Day4: Zhang 320 vs 297,
Li 1100 vs 981 (fair to 1160), He 1350 vs 1184 (fair to 1400).

## 5. Game mechanics that affect timing

- Typewriter: the mentor panel types its text; any click on a non-interactive area skips
  it. The manifest uses `await page.mouse.click(30, 300);` (left margin inside <main>,
  never a button/label) after every stage change. Keep that x under ~60px.
- Market runs animate at 520ms per point once the stage is entered; the run starts
  immediately (no extra click). Day1: 11 points (~5.2s). Day2: 4 points (~1.6s).
  Day3: 6 points (~2.6s); the knock-out pill flips red when point 4 (20,950) lands.
  `View Report` only appears after the last point.
- The bottom action bar is fixed to the viewport bottom, always clickable mid-scroll.
- Playwright `fill` on the calculator inputs auto-scrolls them into view, which is the
  intended camera move down to the calculator.

## 6. Fragile scenes (watch these on review)

- C1-9: the only scene with page.goto mid-audio; needs the audio-page variant (section 3).
  Live site must be reachable; it shows the sign-in screen because the deployed build has
  Supabase configured. Type nothing there.
- C2-4: 4-click montage lands on the product desk around 4.5s, then the cursor parks on
  the Vanilla Call card's mini payoff diagram for the "below the strike" half of the line.
- C2-6: KNOWN SCRIPT MISMATCH: narration says "Mister Wang", the Day 1 client card on
  screen is Ms. Li (the game's Day 1 client; Wang is the Day 2 client). Accepted as is.
- C2-7: ends by clicking the LOCKED Barrier Option card on purpose; the amber "not
  unlocked on day one" notice should pop on "we'll earn that one later".
- C3-8 / C3-9 / C3-10: scroll distances (650 / 650 / 520) were estimated against the
  760px-tall tree visual; verify the terminal payoff nodes, the mid-tree, and the
  "Today's Price ... 186 points" card land in frame; adjust wheel deltas if the layout
  shifts.
- C3-11: heaviest Day 2 scene: 5-stage montage plus 5 calculator fills inside 12.8s. The
  config param strip ("Simplified Theoretical Price 186 pts") covers the "theory says one
  eighty-six" beat before the live 185.94 appears.
- C3-13: fill 210 + 4 ticks + confirm inside 9.3s; "Trade Accepted" should be visible by
  ~6.5s for the "desk's lunch" tail.
- C4-7: `View Market Settlement` is clicked at 3.6s so the 20,950 knock-out dot lands
  near "twenty thousand nine fifty" (sentence at 7.8s; dot at roughly 6.3 to 7.0s with
  slowMo). If it drifts, tune the leading waitForTimeout only.
- C4-7/C4-8/C4-9 are one continuous run; C4-8 and C4-9 are dwells over the knocked-out
  settlement; segment boundaries come from narration timing, as planned.
- C5-4 / C5-5: densest stretch (Li's 6 fills in 6.4s, then He's full judge-and-fill
  sequence in 11s). "Eleven eighty-four" is narrated before 1,184.20 renders at the scene
  tail; accepted drift. If a run overshoots, trim the waitForTimeout pacing lines first.
- C5-7: clicks `Complete Graduation` first so Day 4 writes to progress, then Account menu
  -> Dashboard shows 4/4 days completed (days 1 to 3 are seeded by the clip 5 pre-roll).
  Guest mode shows "Local progress" in the menu; there is no cloud-sync badge, the
  completed cards are the "saved to your account" visual.

## 7. Manifest editing loop

After any action tweak:

```bash
cd video-project && uv run scripts/validate-manifest.py narration-manifest.json
```

Narration text must not change (voiceover and captions are already generated).

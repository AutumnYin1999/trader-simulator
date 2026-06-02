# Handoff / Execution Doc · Central Trader Game Project

> Written for the next Claude taking over
> Date: 2026-05-31
> Project: `trader-simulator-day1` — a React single-page app that teaches barrier options through gamification
> User: HKBU Fin 7870 group assignment, currently under iterative development

---

## 1. Project Background (must read)

This is a **gamified options teaching simulator**. The player takes on the role of a rookie at a Central trading desk and learns over four consecutive days:
- Day 1: Vanilla options basics (Call/Put, premium, suitability)
- Day 2: Binomial tree pricing (theoretical price → quote negotiation)
- Day 3: Barrier options (Down-and-Out Call, path-dependent)
- Day 4: CBBC (Callable Bull/Bear Contracts) (MCE, leverage, call price)

**Main file**: `e:\HKBU\Trimester 3\Derivatives\trader-simulator-day1\src\Day1TraderSimulator.jsx` (about 6600 lines; all logic lives in this single file)

**The teammate's math-engine materials** (reusable real data):
`e:\HKBU\Trimester 3\Derivatives\central-trader-en\central-trader-en\`
- `data/hsi_2020_covid.csv` — real HSI daily bars
- `data/vhsi_history.csv` — real VHSI volatility index (2003–2026)
- `data/option_chain_current.csv` — real HSI option chain
- `data/hsi_full_history.csv` — full HSI history

**Review & change log**: `e:\HKBU\Trimester 3\Derivatives\trader-simulator-day1\REVIEW-AND-CHANGES.md`
(It contains ✅ markers for completed items along with detailed notes; read it first)

---

## 2. Work Already Done (do not redo)

The following has already been fixed and verified via `npm run build`:

1. ✅ **Bear contract structure fix**: added `cbbcStrike: 22000`, decoupling the bear contract strike from the vanilla Put strike
2. ✅ **CBBC cost/payoff scale**: switched to a leveraged linear model (`cbbcLeverage: 7`), eliminating pseudo-arbitrage
3. ✅ **Vanilla Call price unified**: Day1/Day3's 150 → 186, barrier option 90 → 115, aligned with Day2 theoretical price
4. ✅ **Real-data enrichment layer**: the Day3/Day4 market-path panel gained a "📡 Real-World Reference" green card, citing real 2020 COVID data (data verified line by line)

---

## 3. Work Remaining (by priority)

### 🔴 Task 1: Fix the calculator↔quote linkage bug ✅ Done (2026-05-31)

**What was fixed**:
- `getQuoteAnalysis(quote, theoretical)` and `getDay2PricingScore(quote, theoretical)` gained a second parameter and no longer hard-code 186
- The fair range was changed to a relative offset: `[theoretical+4, theoretical+34]`, with the rejection line at `theoretical+74`
- `VanillaBinomialPricingTool` gained an `onUpdateTheoretical` callback that automatically passes `Math.round(tree.vanillaPrice)` to the parent component on every tree recompute
- The main component gained a `liveTheoretical` state (initial value 186), updated via `actions.updateTheoretical`
- The `Day2QuoteSliderPanel`, `Day2ClientResponsePanel`, `evaluateDay2`, and `day2_risk_disclosure` handlers were all switched to use `liveTheoretical`
- The scale labels below the quote slider (theoretical price / fair range / rejection line) were also switched to display dynamically

**Verification**: set the calculator to σ=20%, K=23300, theoretical price about 350, quote 380 → reasonable A; quote 260 → too low D. Verified via `npm run build` + `getDiagnostics`.

**Problem description**:
Day 2's binomial tree calculator and the quote box below it **were not actually linked**.
- After changing calculator parameters, the "model reference" number would change accordingly (e.g. to 349.6)
- But the scoring function `getQuoteAnalysis()` always judged quote quality using the hard-coded `day2Config.quoteRules.theoreticalPrice = 186`
- Result: the player changed calculator parameters, saw "model reference 349.6", quoted 260 but was judged "too expensive C" — because the scoring secretly compared 260 vs 186, completely ignoring the calculator

**Root cause** (code location):
```js
// getQuoteAnalysis() around line 1168
function getQuoteAnalysis(quote) {
  const theoretical = day2Config.quoteRules.theoreticalPrice; // ← always 186, hard-coded
  ...
}
```

**Fix (Option A, recommended)**:
Make the scoring follow the calculator's live theoretical price. This requires:
1. The `VanillaBinomialPricingTool` component passes `tree.vanillaPrice` to the parent component via `onUpdateQuote` or a new `onUpdateTheoretical` callback
2. The parent component passes this live theoretical price to `getQuoteAnalysis(quote, theoreticalPrice)` and `getDay2PricingScore(quote, theoreticalPrice)`
3. The quote box's "math anchor" displays the live theoretical price (instead of the hard-coded 186)
4. The fair range `fairRange` is also changed to a percentage relative to the theoretical price (e.g. `[theoretical + 4, theoretical + 34]`), instead of absolute values

**Verification**: after the fix, set the calculator to σ=20%, K=23300, theoretical price about 349; a quote of 380 should get an A, and a quote of 260 should get a D (too low).

---

### 🟠 Task 2: Add the "Central Data Desk" page (Research Terminal) ✅ Done (2026-05-31)

**What was implemented**:
- Added a `day2_research_terminal` stage, wired in after `day2_handbook_updated` and before `day2_client_arrival` (via the `toResearchTerminal` transition)
- Added a `Day2ResearchTerminalPanel` component + `researchCards` data, with 4 info cards: 📈 Market terminal (S₀ 21,500, VHSI σ), 📋 Contract spec (K 22,000, T 0.08, with an expandable real option chain), 🏦 Rates board (r 2%, HIBOR reference), 📊 Index overview (q 3.5%, N 3 steps)
- A bottom "parameter cheat sheet" with 5 columns (S₀/K/r/σ/T) so the player can copy them into the calculator; each card has a "fill-in hint"
- Real data cites `vhsi_history.csv` / `option_chain_current.csv`, attributed to the same group's math-engine team
- Verified via `npm run build`

**Background**:
The user proposed a great product idea — before the player fills in the calculator, there should be a "data desk" page where the player **looks up for themselves** the key parameters needed for pricing (interest rate, volatility, spot price, tenor, etc.), instead of being handed pre-filled numbers. Only this way teaches the real trader skill of "sourcing the inputs".

**Design (MVP version)**:
Before Day 2's `day2_tree_explainer` stage, add a `day2_research_terminal` stage that shows a simulated "Central Data Desk" page, containing 4 info cards:

| Info card | Content | Real data source |
|--------|------|-------------|
| 📈 Market card | HSI spot 21,500, VHSI volatility index | Real VHSI ≈ 60% near 2020-03-23 in `vhsi_history.csv` |
| 📋 Contract card | Real option chain snippet (strike, expiry) | First few rows of `option_chain_current.csv` |
| 🏦 Rates board card | HKD risk-free rate r = 2% (HIBOR reference) | Hard-coded teaching value, labeled "HIBOR reference" |
| 📊 Index overview card | HSI dividend yield q ≈ 3.5% | Hard-coded teaching value, labeled "HSI annualized dividend yield" |

The player reads these 4 cards, notes the numbers down, then enters the calculator stage and fills them in themselves.

**Implementation notes**:
- Add a `day2_research_terminal` stage to `day2Config.stages`
- Add a `Day2ResearchTerminalPanel` component with a 4-card layout
- Insert it into the stage flow after `day2_handbook_updated` and before `day2_tree_explainer`
- The MVP stage does not need to validate whether the player's entries are correct; it just displays the data for reference
- Card styling follows the existing `TerminalCard` + `TerminalHeader` components to keep the visuals consistent

**Note**: this task depends on Task 1 being done (the data desk only makes sense once the calculator linkage is fixed).

---

### 🟡 Task 3: Optional items ✅ Done (2026-05-31)

**3a. Discrete monitoring disclosure** ✅:
- The Day3 barrier option manual's "Risk Disclosure" section gained: "This simulation uses discrete observation points to demonstrate the path; real barrier products are mostly continuously monitored, so knock-out is more likely to occur"
- The Day4 CBBC manual's "Mandatory Call Event (MCE)" section gained: "This simulation uses discrete observation points; real CBBCs are continuously monitored, so calls are more likely to occur"

**3b. Dividend yield q disclosure** ✅ (covered by the Task 2 data desk; the manual entry was skipped per the note):
The data desk's "Index overview card" already shows q ≈ 3.5% and notes that real pricing must deduct it, so it is no longer repeated in the manual.

**3c. Day2 hedging awareness** ✅:
A teaching note was added after the `Day2ReportPanel` "Simulated Market Path" block: "A real trading desk hedges directional risk (e.g. flattening Delta with futures or offsetting options); what is shown here is the unhedged single-trade result, used only to understand pricing P&L, and does not represent the trading desk's real risk exposure".

**Verification**: all three changes passed `npm run build`.

---

### 🔵 Task 4 (✅ code done, Day2 tested; Day3 pending live test): Calculator layering + Day3 data desk

**Status (updated in the 2026-06-01 follow-up session)**: batch one (generalizing the data desk + the Day3 data desk stage) and batch two (merging the calculators into `BinomialPricingTool({mode})`) are **both done and pass build**. In addition, a batch of Day2 experience changes was made (stage order adjustment, blind quoting at the quote desk + story-consequence feedback, a new market playback page, the VHSI 24%→16% correction, locking step count N). **Day2 has been fully tested by the user in the browser; the Day3 code has been changed but not yet live-tested — next step is to start testing from Day3.**
For the detailed checklist, wiring points, and next steps, see the standalone doc: **the "⭐ Latest Status" section at the top of `HANDOFF-calculator-and-day3-dashboard.md` (must read)**.

One-line goal: merge Day2/Day3's two highly duplicated binomial tree calculators into a single component switched by `mode`; Day3 "unlocks" the barrier parameters on top of Day2 (highlighted row + NEW badge); and give Day3 a new data desk stage (4 barrier-specific info cards). Tenor Day2 = 1 month, Day3 = 3 months.

**Also, this session fixed two bugs (build passes)**:
- The entry point `startGame` was changed back from `startDay2` to `startDay1`
- Fixed a **global white-screen** bug caused by `MainPanel` failing to pass/destructure `liveTheoretical` (see the lesson in Section 1 of the Task 4 doc)

---

## 4. Working Conventions (must follow)

1. **After every change you must run `npm run build`** and confirm compilation passes before reporting
2. **Also run `getDiagnostics` after changes** to confirm there are no errors
3. **After completing each task, mark the corresponding entry as ✅ Changed in `REVIEW-AND-CHANGES.md`** and write a one-line note of what was done
4. **Do not change the teaching-path `path` arrays** (`day1/2/3/4Config.market.path`) — these are carefully tuned story paths; changing them breaks the drama of the knock-out/MCE
5. **Do not change the structure of the scoring logic** (`scoringRules`) — only change values and linkage, not the scoring framework
6. **Keep the visuals consistent**: all new components should use the existing `TerminalCard`, `TerminalHeader`, `cn()` and other utility functions; do not introduce a new UI library

---

## 5. Quick-Start Commands

```bash
# Working directory
cd "e:\HKBU\Trimester 3\Derivatives\trader-simulator-day1"

# Dev preview (long-running; use control_pwsh_process start)
npm run dev
# → visit http://127.0.0.1:5173/

# Build verification (run after every change)
npm run build
```

---

## 6. Advice for the Next Claude

1. **Read `REVIEW-AND-CHANGES.md` first** to understand what has been done and why, to avoid duplicate work or backtracking
2. **Do Task 1 (the linkage bug) first**; it is the problem the user feels most directly, and it is a prerequisite for Task 2
3. **After finishing Task 1, demo it to the user first** (describe what changed and how the numbers move), confirm the user is satisfied, then do Task 2
4. **Before doing Task 2, write a short design proposal for the user to confirm** (what the page looks like, what goes on the 4 cards); start writing code only after the user nods
5. The user is an HKBU student; **communicate in Chinese**. Technical explanations should be clear but not overly academic — keep a conversational tone

---

## 7. Project File Structure Quick Reference

```
trader-simulator-day1/
├── src/
│   ├── Day1TraderSimulator.jsx   ← main file, all logic
│   └── main.jsx                  ← entry point, only an import
├── index.html
├── package.json
├── vite.config.js
├── REVIEW-AND-CHANGES.md          ← review log (completed items have ✅)
└── HANDOFF.md                     ← this file

central-trader-en/central-trader-en/
├── data/
│   ├── hsi_2020_covid.csv        ← real HSI (2019-11 ~ 2020-04)
│   ├── vhsi_history.csv          ← real VHSI (2003–2026, 5600+ rows)
│   ├── option_chain_current.csv  ← real option chain
│   └── hsi_full_history.csv      ← full HSI history
└── analysis_report_step1-7.md    ← the teammate's math-engine analysis report
```

---

Good luck. Whenever something is uncertain, read the code before acting — don't guess.

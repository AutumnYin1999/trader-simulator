# Handoff doc · Day4 rework: cut CBBC, build a "three-client pricing live round"

> Written for the next Claude taking over
> Date: 2026-06-01 (**the rework was completed that same day, see "✅ Completion record" below**)
> Project: `trader-simulator`, a gamified options-trading teaching simulator (React single-page app, main file `src/Day1TraderSimulator.jsx`, about 7800 lines, all logic lives in this one file)
> User: HKBU student, **communicates in Chinese**, wants a conversational, clear, not-too-academic tone. By this day they were quite worn out and explicitly said "CBBC is too hard, I don't have the energy to keep polishing it."
> Line numbers drift, **always locate by function name / string via Grep, don't trust old line numbers**.

---

## ✅ Completion record (done on 2026-06-01, the same day)

**Day4 has been changed from CBBC into a "three-client pricing live round / graduation chapter", the build passes, and Playwright (Edge headless) ran through the success path and the failure path once each, with zero blank screens and zero errors.**

### Final three-client setup (theoretical prices all computed with the project's binomial tree, r=2%)
| | Client | Product | Parameters | Theoretical-price anchor | Task |
|---|---|---|---|---|---|
| ① | Mr. Zhang (institutional, half-hint) | Vanilla Call | S0 24000 / K 24500 / σ18% / T0.08 / N3 | **297** (computed 297.06) | Quote directly |
| ② | Ms. Li (budget-sensitive, fewer hints) | Barrier Call (down-out) | S0 24000 / K 24500 / barrier 23000 / σ28% / T0.25 / N4 | **981** (computed 980.77, vanilla Call 1167) | Quote directly |
| ③ | Mr. He (graduation judgment, minimal hints) | Barrier Call (player decides) | S0 25000 / K 25500 / barrier 23500 / σ32% / T0.25 / N4 | **1184** (computed 1184.20, vanilla Call 1411) | **Pick the product first, then quote** |
- Narrative: a few months after Day3 (the covid crash), the Hang Seng Index has recovered to 24000 to 25000, so the parameters don't repeat the earlier ones and the player has to recompute.
- Anchor-verification script logic: `u=e^(σ√Δt), d=1/u, p=(e^(rΔt)−d)/(u−d)`, discount `e^(−rΔt)`, barrier node `price<=barrier` zeroed out. Consistent with `BinomialPricingTool`.

### What code changed (all locatable via Grep)
- **CBBC archived, not deleted**: `day4Config` → renamed `day4CbbcConfig_ARCHIVED` (with an archive comment); the old panels renamed `Day4Cbbc*Panel_ARCHIVED`, `getDay4CbbcMarketResult_ARCHIVED`, `evaluateDay4Cbbc_ARCHIVED`, all repointed to the archived config, **no longer hooked into panels/actionBars** (Grep `_ARCHIVED`).
- **New `day4Clients`** three-client array + **new `day4Config`** (new stages: `day4_intro / day4_client_arrival / day4_judge / day4_pricing / day4_client_response / day4_scorecard / day4_complete`). The new config carries safe placeholders `market.path:[]` and `scoringRules.correctDisclosureIds:[]` to prevent the existing `isDay4Stage` derived logic from reading undefined.
- **Merged quote evaluation**: new `getDay4QuoteAnalysis(quote, client)`, which produces vanilla (+4/+34/+74) or barrier (×1.183/×1.398) copy based on `client.mode`. The original Day2/Day3 functions were untouched.
- **Generic index-driven panels** (Grep): `Day4BriefingPanel / Day4ClientProfilePanel / Day4PricingPanel / Day4ClientResponsePanel / Day4ScorecardPanel / Day4GraduationPanel`, all consuming `day4Clients[day4ClientIndex]`.
- **Queue scheduling**: new state `day4ClientIndex / day4Results`; new actions `beginDay4Clients / toDay4Task / submitDay4Quote / nextDay4Client` (Grep). Picking the wrong product (only possible for client ③) → graded D and no deal.
- **Calculator reuse**: `BinomialPricingTool` got two optional props, `enableParamCheck` (Day4 turns off Day2's "it should be 21500" reminder) and `quoteHint` (quote-box copy customized per client).
- **Chrome copy**: in `SideData` the Day 4 theme changed to "three-client pricing / live-round quoting", the products to "vanilla / barrier"; the day3_complete navigation button changed to "Enter the graduation live round".

### ⚠️ Must-do before release
- `actions.startGame` is currently = **`startDay4`** (I changed it to test Day4, so clicking "Enter game" goes straight into Day4). **Change it back to `startDay1` before the official release** (Grep `startGame:`).

### Still polishable (not required)
- On the scorecard, client ③'s product name shows the full name "down-and-out call option", while ① and ② show the short names "vanilla Call / barrier Call". If you want them uniform, change `productName` inside `submitDay4Quote`.
- If client ③ picks the wrong product they still enter the barrier calculator (because `client.mode` is fixed); the wrong pick already grades D directly, so the impact is minor.

---

## 🔧 Next item up for discussion: are the parameter cards "too easy"? (raised by the user before leaving for the day, pick up when back)

**The user's question**: at the top of the quote page `Day4PricingPanel` there's a `Day4ParamCard` that lists S₀/K/barrier/σ/T/r/N in full and even says "fill these into the calculator". Does that turn into copy-pasting with no challenge?

**Clarification (let's separate things first)**: the card shows the **input parameters**, not the answer.
- "The calculator's answer" = the theoretical price (297/981/1184), **which is NOT written on the card**; the player has to fill the parameters into the calculator to get it (only after submitting does the feedback page show the anchor, which is after-the-fact review).
- The real "quote" being tested = theoretical price + the player's own profit margin; client ③ also has to **judge the product** first. None of that is given.
- The calculator does the arithmetic for the player, which is the same in Day2/Day3 too, so it's not Day4 that leaks the answer.

**But the half that's fair**: I did **remove the Day2/Day3 friction of "go to the data dashboard and find the parameters yourself"** and instead listed them as a card + "fill these in", so **the fill-in-parameters step became mechanical**, especially for client ③ which is billed as the hardest yet still has the parameters laid out.

**To add difficulty, the lever is NOT "hide the theoretical price"** (once the parameters are filled the calculator must show it, you can't hide it), but the three options below (**these are just proposals, nothing done yet**):

- **Option A · hide the parameters back in the dialogue / market terminal**: don't give client ③ a parameter card; make the player **extract** what to fill from the client's words ("I want a 25500 strike, three-month term") + a market terminal (spot 25000, σ32%). Tests "reading the order + knowing which inputs the model needs". Bigger change (need to build a market terminal / parse dialogue).
- **Option B · add distractor parameters**: put extra unused numbers on the card (volume, prior close, etc.), and the player has to pick which ones go into the model. Small change, but a bit of a "nitpick" flavor.
- **Option C · tighten only on client ③ (recommended)**: keep the parameter card for ① and ② as teaching scaffolding, remove the card for ③, echoing "hints taper off, you go solo at graduation". Smallest change, most coherent with the design intent.

> Handoff tip: the implementation entry points are all in `Day4PricingPanel` / `Day4ParamCard` (Grep). Option C is the easiest: add a `showParamCard` check to `Day4PricingPanel` and just don't render `Day4ParamCard` when `client.taskType === "judge"`.

---

## Below is the original rework spec (already executed, kept as background)

---

## ⭐ The "one big task" this doc is about

**Change Day4 from "teaching CBBC (callable bull/bear contracts)" into a "three-client pricing live round / graduation chapter".**

The user decided: **drop CBBC** (it's not an option, can't use the binomial-tree calculator, would need a separate leverage + MCE model, high polishing cost, the user has no energy for it). Instead, have the player use the **Day2 (vanilla option pricing) + Day3 (barrier option pricing)** skills learned earlier to give live quotes to 3 clients with differing needs.

### Why change it this way (the design rationale, don't overturn it)
- **Reuse the entire existing engine**: `BinomialPricingTool` (vanilla + barrier modes), `getQuoteAnalysis` (vanilla, anchor 186), `getDay3QuoteAnalysis` (barrier, anchor 934), `ProductSelectionPanel`, the client-arrival / client-feedback panel patterns, all already exist, far less engineering than continuing to polish CBBC.
- **The learning track is already complete**: option basics (Day1) → pricing (Day2) → barrier + path (Day3) → **live application (Day4)**. Leaving CBBC out is completely fine.
- **Fills a gap in the old Day4**: the old Day4 dropped the "pricing" skill (CBBC doesn't quote); the new version puts the calculator back on stage.

### Design decisions already settled with the user (from the discussion)
1. **Client depth = medium**: each client gets `pick a product + one key decision (quote) + consequence`. Not max-level (not everyone gets disclosure + multiple steps).
2. **Hint strength = reduced, to give a graduation feel**: the client-arrival page gives full information, but Martin only gives **general principles** ("read the direction first, then read the risk tolerance, then think about the product"), and **does not name** which product to pick or how much to quote. Picking wrong gives feedback, but doesn't spoil it in advance.
3. **CBBC is "hidden", not "deleted"**: keep the CBBC data in `day4Config` (rename to archived or as a comment block), so it can be picked back up later if wanted. Minimal loss.

---

## The three-client lineup (specific numbers to be refined, direction set)

> All use the existing calculator (vanilla Call + barrier Call, two modes), **no new Put mode** (keep it lightweight). The three clients increase in difficulty and decrease in hints.

| | Client | Need clues | Correct product | Key decision | What it tests | Hints |
|---|---|---|---|---|---|---|
| ① | TBD (e.g. "Mr. Zhang") | Bullish, wants something simple, limited losses, doesn't want any add-on conditions | Vanilla Call | **Quote** (against the vanilla theoretical price) | Day2 pricing | Half (opening demo) |
| ② | TBD (e.g. "Ms. Li") | Bullish **but finds the vanilla Call expensive**, explicitly willing to accept "knocked out if it breaks below some line" in exchange for cheaper | Barrier Call (down-and-out) | **Quote** (against the barrier theoretical price) | Day3 barrier + pricing | Fewer |
| ③ | TBD (combined-judgment client) | Gives needs **but doesn't say outright which product**, the player must first judge whether to go vanilla or barrier (from budget / risk clues) | Player decides | **Pick the product first, then quote** | Day2 + Day3 judgment | Minimal |

- **Client ③ is the essence of graduation**: the first two clients tell you which product they want, the third doesn't, so you have to sniff out whether to go vanilla or barrier from "is the budget tight, can they accept a knock-out", then quote.
- Each client gets **their own parameters** (S₀/K/σ/T, plus a barrier for the barrier client), so the player actually computes rather than memorizing numbers. Specific numbers to be refined next (see "To-do" below).

### Each client's mini-flow
```
Client arrival (full info + Martin's general principles, no answer named)
  → [client ③ has one extra step: pick the product]
  → Calculator computes the theoretical price + a blind quote (using the "quote input box" already built in Day3)
  → Client feedback (accept/reject + lines, reusing the Day3 ClientResponse pattern)
```
After all clients are handled → **graduation scorecard** (new panel): per-order grading + how many deals closed + Martin's overall review.

---

## Engineering implementation guide (for the Claude doing the work)

### A. How to "hide" CBBC (first step, do it together with building the new version, don't do it alone first or Day4 will be hollow)
- `day4Config` (Grep `const day4Config`) is one whole block of CBBC data: clientProfile=Ms. Zhou, suitabilityOptions, products (bull cert / bear cert / Call / Put), disclosureItems, market (cbbcLeverage/cbbcCallPrice etc.), marketContext, scoringRules.
- **Keep but disable**: suggest renaming to `day4CbbcConfig_ARCHIVED` or commenting out the whole thing, and leaving a line at the top "// Archived: CBBC content, in 2026-06 the user decided to change Day4 into the pricing live round, kept for reference".
- Related CBBC-specific panels/functions (Grep): `Day4SuitabilityPanel`, `Day4MarketRunPanel` (CBBC version), `Day4ReportPanel`, `evaluateDay4`, `getDay4MarketResult`, in actions `selectSuitability/confirmSuitability/meetDay4Client/toDay4Suitability`, and all `day4_*` branches in BottomActionBar and panels. The new Day4 will replace these → archive/comment out the old ones the same way, don't delete them bare (minimal loss).

### B. What can be reused directly (this is where the savings are)
- **Calculator**: `BinomialPricingTool({ mode, selectedQuote, quoteAnalysis, onUpdateQuote, onUpdateTheoretical })`, `mode="vanilla"`/`"barrier"`. The quote input box is already built in (Grep the "enter your own quote" string in the source).
- **Quote evaluation**: `getQuoteAnalysis(quote, theoretical, clientName, clientDesc)` (vanilla), `getDay3QuoteAnalysis(quote, theoretical)` (barrier). **Suggest merging the two into one while you're at it** `getQuoteAnalysis(quote, theoretical, { clientName, productType, bands })`, producing vanilla/barrier copy by productType, since the three-client scenario will use it repeatedly.
- **Client feedback (consequence) page**: the `Day3ClientResponsePanel` pattern just built in Day3 (Grep `function Day3ClientResponsePanel`), with avatar + name + accept/reject + lines; copy it directly into a generic `ClientResponsePanel`.
- **Product-selection page**: `ProductSelectionPanel` (already parameterized with products/title/accent/correctProductId), used by client ③.
- **Client-profile page**: the `Day3ClientArrivalPanel` pattern (profileRows + dialogue) copied into a generic version, consuming the client scenario data.

### C. What needs to be newly built (the main effort this time)
1. **Client scenario array** `day4Clients = [ {id, profile, taskType:"price"|"judge", correctProduct, mode:"vanilla"|"barrier", params:{spot,strike,barrier?,sigma,maturity}, theoretical(computed anchor), disclosureKey?, feedbackByOutcome, ...} × 3 ]`.
2. **Client queue scheduling**: add state `currentClientIndex`, `clientResults[]`; each client runs `arrival → (judge) → price → response`, and at the end `index++`, reaching 3 enters the graduation scorecard. Suggested stage naming `day4_client1_arrival / day4_client1_price / day4_client1_response / day4_client2_... / day4_scorecard`. Or smarter: use **one set of generic stages + index-driven** to avoid writing 3×N stages (recommended, saves code).
3. **Graduation scorecard panel** `Day4ScorecardPanel`: reads `clientResults`, per-order grading + overall review + Martin's summary.
4. Each client's **parameters and theoretical-price anchor**: precompute with the project's own binomial-tree formula (verification method below).

### D. How to compute each client's theoretical price (must match the calculator)
- Project formula: `u=e^(σ√Δt), d=1/u, p=(e^(rΔt)−d)/(u−d)`, discount `e^(−rΔt)`; barrier by **node knock-out** (`price<=barrier` zeroed out).
- vanilla steps N=3, barrier steps N=4 (`fixedSteps` in `BinomialPricingTool`).
- **Calibrated**: σ16%/T0.08/N3 → 185.94≈186 (Day2); σ30%/T0.25/N4/barrier21000 → vanilla 1111.73 / barrier 934.16 (Day3). After switching to new parameters for the new clients, recompute the anchor with this same method so the "static example / client's expected price" matches what the player's calculator computes.

### E. Hard rules (stressed repeatedly across handoffs, don't repeat these mistakes)
1. **A passing build ≠ it won't crash at runtime**. The `panels` object inside `MainPanel` **constructs the full JSX for every stage on each render**, so any stage referencing an undefined variable → the whole game blank-screens, and `npm run build` won't catch it.
2. When adding/passing a prop, **change both places together**: ① the call site `xxx={xxx}` ② the function signature destructuring `{ ..., xxx }`. Miss one and it crashes at runtime.
3. After finishing, run `npm run build` (under `trader-simulator/`) **and have the user test in the browser for real**, or use Playwright for a real test (see "Verification methods" below).
4. **Don't delete** the user's things bare; keep CBBC archived.

---

## What this session already finished (Day3, don't repeat / don't break)

1. **Day3 data changed to a "covid high-volatility" scenario**: σ 16%→**30%**, term 1 month→**3 months (T0.25)**, `vanillaPremium` 186→**1112**, `premium` 115→**934**. Reason: the old σ16%/1-month under N=4 made the barrier knock-out ineffective (barrier=vanilla) and the lesson would be pointless; 30%/3-month is what makes "the barrier is cheaper" show up (cheaper by ~178). The data-dashboard market card notes the real anchor for σ (2020-02-28 VHSI 32.7). **Day2 keeps the σ16% calm baseline unchanged**.
2. **Day3 got a "blind quote + consequence"**: new `getDay3QuoteAnalysis` (anchor 934, barrier-flavored copy), new stage `day3_client_response`, new `Day3ClientResponsePanel`, new action `toDay3MarketRun`; the `confirmDisclosure` Day3 branch reroutes to the client-feedback page; the report adds "your quote / client status", and shows "no deal · 0" on rejection.
3. **Fixed a lurking bug**: `confirmQuote` was hardcoded to jump to `day2_risk_disclosure`, causing Day3 to wrongly land in Day2 after quoting. Changed to branch by stage (Day3 → `day3_risk_disclosure`).
4. **Copy**: removed all "fire-sale" wording (Day2 + Day3 both changed to "the trading desk lost profit"), kept "giving it away" (the user said that's fine).
5. **Already ran the full Day3 flow twice with Playwright (Edge headless) (quote 1000 closes / 2000 rejected), zero errors, no blank screen, lines change with the quote, and the no-deal logic is correct.**

> ⚠️ `actions.startGame` is currently = `startDay3` (for testing, goes straight into Day3). **Change it back to `startDay1` before the official release** (Grep `startGame:`).

---

## Next to-do (in order)

1. **Confirm the three clients' specific setup with the user**: each client's name, direction, budget/risk clues, correct product, parameters (S₀/K/σ/T/barrier), theoretical-price anchor. How to plant client ③'s "judgment" clues.
2. Decide whether stages use "3×N hardcoded" or "generic stages + index-driven" (recommend the latter, saves code, easy to scale to N clients).
3. Merge/parameterize the quote-evaluation functions (unify vanilla + barrier), extract a generic `ClientArrivalPanel` / `ClientResponsePanel`.
4. Archive CBBC (day4Config + Day4-specific panels/functions/branches), build the new Day4 queue + graduation scorecard.
5. `npm run build` + Playwright/browser test the entire Day4 flow.
6. Update this file's status; change `startGame` back to `startDay1` before the official release.

---

## Verification methods (figured out this time, handy)
The project has no browser tooling installed. Temporarily `npm i playwright-core --no-save`, and drive the system Edge (`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`) headless: `chromium.launch({ executablePath: EDGE, headless: true })` → goto `http://127.0.0.1:5174/` (the dev server port; if 5173 is taken it auto-increments by +1) → click buttons with `page.locator('button:has-text("copy text")')` → screenshot as evidence. Uninstall and delete the temp script when done. It can click through a whole day end-to-end and catch blank screens and copy, far more reliable than "the build passed so it's fine".

Good luck. First read `HANDOFF.md`, `REVIEW-AND-CHANGES.md`, `HANDOFF-calculator-and-day3-dashboard.md` to fill in background, then start.

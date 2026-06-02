# Central Trader · Trading-Desk Simulator (Day 1–4) Project Review & Change Suggestions

> Review target: `trader-simulator-day1/src/Day1TraderSimulator.jsx`
> Reference material: `central-trader-en/` (classmate's math engine & visualization booth)
> Review perspective: business / product manager + financial-knowledge accuracy
> Date: 2026-05-31
> Purpose: this file is for another AI to modify the code directly per the checklist; every issue includes its file location and a concrete fix.

---

## 0. One-sentence conclusion

This is a **well-structured, well-paced, compliance-aware** gamified options-teaching project, and the four-day capability curve (vanilla options → binomial-tree pricing → barrier options → CBBCs) is designed quite professionally. The core binomial-tree pricing math is **correct**.

However, there is **1 financial-structure error that must be fixed (the size relationship between the CBBC call price and the strike is reversed)**, plus **a few cross-level numerical inconsistencies** (the same vanilla option is priced differently across days). After these are fixed, the project's financial rigor will improve significantly, enough to withstand questions from knowledgeable classmates/teachers.

---

## 1. Financial-knowledge accuracy review (key section)

### 🔴 Critical 1: The "strike vs. call price" size relationship for the Bear CBBC is reversed — ✅ Fixed (2026-05-31)

**Location**: `day4Config.market` (around lines 1068–1075)

```js
market: {
  underlying: "Hang Seng Index",
  spot: 21500,
  strike: 21200,          // ❌ strike below spot, and also below call price
  cbbcCallPrice: 22000,   // call price
  cbbcEntryCost: 80,
  vanillaPremium: 150,
  maturity: "1 month",
  path: [21500, 21780, 22050, 21600, 21100, 20750],
}
```

**Problem**: The real structure of HKEX CBBCs has a strict price ordering:

| Type | Correct ordering | MCE trigger |
|------|----------|----------|
| Bull | strike ≤ call price ≤ spot | underlying **falls** to call price |
| Bear | spot ≤ call price ≤ **strike** | underlying **rises** to call price |

A Bear CBBC requires **call price ≤ strike**. The current config has `strike 21200 < call price 22000`, which is **exactly reversed**, and the strike is also below the spot (21500); in a real market this is not a valid Bear CBBC.

> Note: this is an extension of the symmetric relationship taught in the manual, "the Bull danger line is below, the Bear danger line is above" — the call price's position is correct (22000 is above the spot ✓), but the strike's position is wrong.

**Fix actually adopted (decoupling approach, already implemented)**:

It was found that `market.strike` is **shared by two products** on Day 4 — it is both the Bear CBBC strike and the strike of the "vanilla Put comparison product" (the chart labels it "vanilla Put strike", premium 150). If we simply change `strike` to 22000, the CBBC structure is fixed, but the vanilla Put (spot 21500, strike 22000) would have 500 points of intrinsic value while selling for only 150 points, **creating a new arbitrage error**. We therefore adopted decoupling:

```js
market: {
  underlying: "Hang Seng Index",
  spot: 21500,
  strike: 21200,          // ✅ vanilla Put comparison-product strike (out-of-the-money Put, kept reasonable)
  cbbcStrike: 22000,      // ✅ new: the Bear CBBC's own strike (N-category Bear CBBC = call price, no residual value)
  cbbcCallPrice: 22000,   // call price (spot 21500 ≤ call price 22000 ≤ Bear CBBC strike 22000 ✓)
  cbbcEntryCost: 80,
  vanillaPremium: 150,
  maturity: "1 month",
  path: [21500, 21780, 22050, 21600, 21100, 20750],
}
```

Ordering verification: spot 21500 ≤ call price 22000 ≤ Bear CBBC strike 22000 ✓ (N-category Bear CBBC); vanilla Put strike 21200 < spot 21500 → out-of-the-money Put, premium 150 is reasonable ✓.

**Knock-on change**: in `getDay4MarketResult()` (around lines 1306–1324), the Bear CBBC not-knocked-out payoff was changed from `Math.max(market.strike - finalPrice, 0)` to `Math.max(market.cbbcStrike - finalPrice, 0)`; the vanilla Put still uses `market.strike`. This path touches 22050 ≥ 22000 partway through → triggers MCE, the Bear CBBC settlement is still `-cbbcEntryCost`, and the storyline is unchanged. Verified via `npm run build`. ✅

---

### 🟠 Medium 2: The "cost / payoff" scale of the CBBC is internally inconsistent — ✅ Fixed (2026-05-31)

**Location**: `getDay4MarketResult()` (lines 1306–1324) + `cbbcEntryCost: 80`

**Problem**: The code directly reuses the Put payoff formula `max(strike - finalPrice, 0)` for the Bear CBBC "not knocked out", but sets the cost to 80 points. If the strike is changed to 22000 per Critical 1, then this Bear CBBC already has about 500 points of "intrinsic value" relative to the spot (21500) at entry (strike − spot = 22000 − 21500), but the cost is labeled only 80 points — this is equivalent to paying 80 points to buy something immediately worth 500 points, **close to risk-free arbitrage**, which is financially inconsistent.

Root cause: CBBCs are not priced using a "premium"; they are more like a **leveraged linear tracking instrument** (price ≈ |strike − spot| × conversion ratio + financing cost), yet the code shoehorns it into an "option payoff − premium" framework.

**Two fixes, pick one**:

- **Option A (minimal change, recommended for teaching)**: keep the existing formula, but **clearly state** in the UI and manual that "cost/payoff are illustrative leveraged figures, not real conversion-ratio pricing", and put `cbbcEntryCost` and the not-knocked-out payoff on a comparable scale. For example, change the Bear CBBC not-knocked-out payoff to "the change relative to entry" rather than the absolute intrinsic value:
  ```js
  // not knocked out: leveraged P&L relative to the entry reference price (illustrative)
  const bearReferenceValue = Math.max(market.strike - market.spot, 0); // entry intrinsic ≈ 500
  const bearFinalValue = Math.max(market.strike - finalPrice, 0);       // settlement intrinsic
  const bearCbbcPnl = mceTriggered
    ? -market.cbbcEntryCost
    : (bearFinalValue - bearReferenceValue) /* leveraged change */ - 0;
  ```
  This way "right direction but not knocked out" earns the price-change portion, rather than 500 points appearing out of nowhere.

- **Option B (more intuitive)**: model the Bear CBBC fully as a "leveraged bearish exposure": set a leverage multiple `leverage` (e.g. 5×), cost = capital invested, not-knocked-out payoff = `leverage × (spot − finalPrice) / spot × capital invested`, knocked out = loss of all capital invested. This authentically reflects the "CBBCs react faster on the downside" selling point.

> Business-manager perspective: this item does not affect the storyline or the scoring logic, but **a knowledgeable classmate will see at a glance that the 80-point cost doesn't match the 500-point value**. We recommend at least doing the "illustrative" labeling of Option A + scale alignment.

> **Actually adopted: Option B**. Added `cbbcLeverage: 7`; the Bear CBBC not-knocked-out P&L = `cbbcEntryCost × leverage × underlying's decline ratio` (with `-cbbcEntryCost` as the floor); triggering MCE loses all capital invested. At the same time, "illustrative figure" disclosure was added in the UI (the Bear CBBC cost card is labeled "approx. 7× leverage, illustrative") and the manual (a new section "Price and leverage (teaching simplification)"). Verified to pass `npm run build`.

---

### 🟠 Medium 3: The same vanilla call option is priced inconsistently across days — ✅ Fixed (2026-05-31)

**Problem**: The three locations describe a **completely identical** contract (HSI, spot 21500, strike 22000, 1 month), yet the prices differ:

| Location | Field | Vanilla Call price |
|------|------|----------------|
| `day1Config.market.premium` | line 283 | ~~150~~ → **186** ✅ |
| `day2Config.quoteRules.theoreticalPrice` / `tree.theoreticalPrice` | lines 458 / 550 | **186** |
| `day3Config.market.vanillaPremium` | line 817 | ~~150~~ → **186** ✅ |

I verified by hand: the theoretical price computed from Day 2's binomial-tree parameters (up +2.65%, down −2.58%, r=2%, 3 steps, 1 month) ≈ **186.2**, so Day 2's 186 is correct. But Day 1/Day 3 describe the same contract as 150, which makes a player who plays continuously think, "yesterday it was 150, why is it 186 today?"

**Change suggestions (unify parameters, pick one)**:

- **Option A (recommended)**: change the Day 1 and Day 3 vanilla Call price uniformly to **186**, consistent with Day 2's model price; the Day 3 barrier option (down-out call) correspondingly changes to about **110–120** (still clearly below the vanilla Call, reflecting that "the discount comes from knock-out risk").
- **Option B**: adjust Day 2's binomial-tree parameters (e.g. lower sigma) so the theoretical price lands at 150, then unify all three at 150.

> After unifying, the cross-level narrative becomes more credible: Day 2 teaches "this Call is worth 186", and Day 3 can then naturally say "this same 186 Call is too expensive; the down-and-out knock-out version is only ~115".

---

### 🟡 Minor 4: The "barrier monitoring" for the barrier/CBBC is discrete (only checked at tree nodes / path points)

**Location**:
- Barrier tree `buildBarrierBinomialToolTree` (around line 3772): `knocked: price <= barrier`
- Day 3 settlement `getDay3MarketResult` (near line 1286): `market.path.findIndex(price => price <= barrier)`
- Day 4 MCE (line 1308): `market.path.findIndex(price => price >= cbbcCallPrice)`

**Problem**: Real barrier products/CBBCs are **continuously monitored** (knocked out / called the moment the line is touched at any intraday time). The code only checks at discrete path points / tree nodes, which **underestimates the knock-out probability** and therefore **overestimates the barrier option's value**. This is a standard teaching simplification and is itself acceptable.

**Suggestion**: don't change the formula, but add a line of disclosure on the "barrier option" and "CBBC" manual pages: "This simulation uses discrete observation points; real products are continuously monitored, so knock-outs occur more easily." This dovetails nicely with your existing "honest disclosure" style and is a professional detail that earns points.

---

### 🟡 Minor 5: The pricing model does not include the dividend yield q (inconsistent with the classmate's math engine)

**Location**: `buildVanillaBinomialToolTree` / `buildBarrierBinomialToolTree` (starting at lines 3667 / 3754), `growth = Math.exp(rate * dt)`.

**Problem**: The binomial tree's risk-neutral growth rate uses only the risk-free rate r and does not deduct the dividend yield q. Yet your classmate's `central-trader-en/analysis_report_step1-7.md` **specifically emphasizes** that the HSI dividend yield ≈ 3.5%; not including q systematically overestimates the Call by about 3%. When the two groups present externally, the inconsistent conventions will be noticed.

**Suggestion**:
- For teaching, the impact over a 1-month tenor is very small, so the simplification can be kept; but we recommend adding a line in the manual: "Teaching simplification: the dividend yield q is not considered for now; real HSI pricing needs to deduct the approximately 3.5% annualized dividend."
- If you want to unify conventions with the math engine, change the growth rate to `Math.exp((rate - q) * dt)` and introduce a `q` parameter (default 0.035).

---

### 🟡 Minor 6: The pricing-desk P&L is the naked-position P&L of "a single path, no hedging"

**Location**: `getDay2MarketResult` (starting at line 1218), `deskPnl = quote - payoff`.

**Explanation**: This treats "selling one option + watching one realized path" as the trading desk's P&L. A real trading desk delta-hedges, and the P&L comes from hedging error rather than direction. You have partly addressed this with the grade-B comment "the model is a quoting anchor, not a profit guarantee", which is well done.

**Suggestion (optional)**: in the Day 2 debrief, add a line: "A real trading desk hedges directional risk; what's shown here is the unhedged single-trade result." Don't change the logic, just add the conceptual note.

---

### ✅ Parts already verified correct (rest assured)

- **The binomial CRR implementation is correct**: `up = e^(σ√dt)`, `down = 1/up`, risk-neutral probability `p = (e^{rΔt} − d)/(u − d)`, layer-by-layer discounted backward induction — standard and correct (starting at line 3667).
- **Day 2 theoretical price 186** verified by hand ≈ 186.2 ✓, terminal payoffs all correct (1253 / 69 / 0 / 0).
- **The Down-and-Out Call structure is correct**: barrier 21000 < strike 22000 < …… and below the spot 21500, a standard regular down-and-out; the statements "no revival after knock-out" and "maximum loss is the premium" are accurate.
- **The risk-disclosure question bank is professionally designed**: each day has one "misleading statement" as a trap (e.g. "as long as it rises you're guaranteed to profit", "it auto-recovers after MCE"), with compliance teaching well in place.
- **The suitability logic (direction match + risk tolerance + whether MCE is understood)** is reasonably designed, and Day 4's "overly conservative vs. correct assessment" either-or closely mirrors real SFC suitability requirements.
- **"Maximum loss limited to the premium / capital invested"** is correct for both the buyer and the CBBC holder.

---

## 2. Business / product-manager perspective assessment

### 2.1 Alignment with the assignment's scoring dimensions (Content / Presentation / Application)

| Dimension | Current state | Suggestion |
|------|------|------|
| **Content** | Strong. Covers vanilla options, binomial tree, barrier, CBBC, suitability, risk disclosure | After fixing the financial errors above, the content depth is sufficient; you could add a "comparison table of similarities and differences between barrier options and CBBCs" as a wrap-up |
| **Presentation** | Strong. Trading-desk narrative + mentor Martin + stage timeline, good immersion | See 3.1 screen-recording script suggestion |
| **Application** | Medium. Currently uses fixed/teaching parameters, not real market data | See 2.3 integration with the math engine; introducing real HSI data can substantially raise the Application score |

### 2.2 Learning objectives and scope

- The four-day capability curve is very clear; we recommend **explicitly writing out each day's Learning Objective** in the project (currently implicit in the mentor's lines), to make it easier for the teacher to map to the score.
- Currently only **knock-out** is taught, not **knock-in**; only **down-and-out + upper call** is taught — the narrative is complete but the concept is not. See 4.1.

### 2.3 Integration with the classmate's "central-trader math engine" (strongly recommended)

This is the project's **biggest opportunity to gain points**. The two groups are currently siloed: you are the game frontend (teaching narrative), and the classmate is the math engine (BS-Merton, Greeks, volatility surface, real HSI/VHSI data). Per the architecture diagram in the classmate's plan, `api/game_interface.py` was designed from the start to feed JSON to the game team.

**Integration suggestions**:
1. **Unify pricing conventions**: change the "theoretical price" on Day 2/Day 3 to call the classmate's `bs_price` / binomial-tree result, instead of hard-coding 186/150. At minimum, ensure both sides quote the same contract consistently.
2. **Real-data feed**: the "market path" on Day 3/Day 4 can use real HSI segments the classmate has already scraped (2008/2015/2020 crises), upgrading the "fixed teaching path" to a "real historical path" and directly earning the Application score.
3. **Volatility linkage**: barrier products/CBBCs are sensitive to volatility, so you can cite the classmate's VHSI data to explain that "barriers are more easily triggered/called during high-volatility periods".
4. **Align terminology and units**: the classmate uses HK$ with a ×50/point multiplier; you use "points" throughout. We recommend clearly stating somewhere that "1 point = HK$50", and showing a HK-dollar amount once at the final settlement, making the P&L more tangible (and also consistent with the classmate's convention).

### 2.4 Naming and engineering nitpicks (non-financial)

- The filename `Day1TraderSimulator.jsx` already contains all four days of Day 1–4 content; the naming lags behind, so we recommend renaming it to `TraderSimulator.jsx`.
- The maturity-payoff copy in the Day 1 debrief is **hard-coded** as `max(22,400 - 22,000, 0)` (around line 3113); if you change the config it won't update in sync, so we recommend changing it to dynamically generate from the last value of `market.path` and `market.strike`.

---

## 3. Supplementary content suggestions

### 3.1 Screen-recording / demo script (matching the ≤12-minute video requirement)

We recommend one 1.5–2 minute segment per day, with a uniform structure: client speaks → read the requirement (direction + risk + budget) → choose the product → risk disclosure → run the path → debrief. Day 3's barrier knock-out and Day 4's Bear CBBC MCE are **the most dramatic shots** (the direction was right yet it went to zero) — focus the editing there.

### 3.2 Closing "product comparison table" (recommend adding a new manual page)

| Product | Directional view | Path dependence | Maximum loss | Early termination |
|------|--------|----------|----------|----------|
| Vanilla Call/Put | Yes | No (only looks at expiry) | Premium | None |
| Down-and-Out Call | Yes | Yes (invalidated on touching the lower barrier) | Premium | Knock-out |
| CBBC | Yes (leveraged) | Yes (called on touching the call price) | Capital invested | MCE |

### 3.3 Optional advanced levels (if time permits)

- **Day 5 (Knock-In)**: complete the barrier-option concept, contrasting with Knock-Out.
- **A Greeks lesson**: directly reuse the classmate's "Greek Zoo", covering Delta/Theta/Vega, and explaining "why barrier options are especially sensitive to volatility / when approaching the barrier".

---

## 4. "Executable change checklist" for the implementing AI (by priority)

> Each item below gives a file location and a concrete fix, and can be executed one by one. File: `src/Day1TraderSimulator.jsx`

- [x] **[🔴 Must fix] Fix the Bear CBBC structure** ✅ Modified (2026-05-31): in `day4Config.market`, **add** `cbbcStrike: 22000` as the Bear CBBC's own strike (N-category Bear CBBC strike = call price = 22000, making "spot 21500 ≤ call price 22000 ≤ strike 22000" hold), and change the Bear CBBC not-knocked-out payoff in `getDay4MarketResult()` from `market.strike` to reference `market.cbbcStrike`.
  - **Why not simply change `strike` to 22000**: `market.strike` is the strike of the **vanilla Put comparison product** on Day 4. If you directly change it to 22000, the vanilla Put (spot 21500, premium 150) would become deep in-the-money (intrinsic value 500 > premium 150), creating a new arbitrage error. We therefore adopted the **decoupling** approach: the Bear CBBC uses `cbbcStrike`, and the vanilla Put keeps `strike: 21200` (out-of-the-money Put, reasonable).
  - Verified via `npm run build` that compilation passes, with no diagnostics errors.
- [x] **[🟠 Recommended] Fix the CBBC cost/payoff scale** ✅ Modified (2026-05-31): adopted **Option B (leveraged linear bearish exposure)**.
  - Added `cbbcLeverage: 7` (illustrative leverage multiple) in `day4Config.market`.
  - In `getDay4MarketResult()`, the Bear CBBC not-knocked-out P&L was changed to: `capital invested (cbbcEntryCost) × leverage × underlying's decline ratio relative to entry`, with `-cbbcEntryCost` as the loss floor; triggering MCE still loses all capital invested. This fully eliminated the pseudo-arbitrage of "betting 80 points for 1250 points of intrinsic value".
  - The UI "Bear CBBC cost" card is labeled "approx. 7× leverage, illustrative"; the manual `cbbc_basics` gains a new section "Price and leverage (teaching simplification)", explaining that the real CBBC price ≈ |spot − strike| × conversion ratio + financing cost, and that this simulation uses illustrative leveraged figures.
  - Verified via `npm run build`. This market path still triggers MCE, and the storyline/scoring are unchanged.
- [x] **[🟠 Recommended] Unify the vanilla Call price** ✅ Modified (2026-05-31): changed `day1Config.market.premium` (line 283) and `day3Config.market.vanillaPremium` (line 817) from `150` to `186`, aligning with Day 2's binomial-tree theoretical price; and raised `day3Config.market.premium` (barrier price, line 816) from `90` to `115`, keeping it "clearly cheaper but not free".
  - Synchronously corrected two hard-coded `150 points` copy instances in the Day 1 lesson-1 "premium small example" panel to `186 points` (around lines 2616/2624).
  - All other P&L figures are computed dynamically from `market.premium` and update automatically; no leftover hard-coded values. Day 1 net P&L becomes `400 − 186 = +214`, Day 3 after knock-out becomes `0 − 115 = −115`, the storyline is unchanged.
  - Note: `day4Config.market.vanillaPremium` (150) is the **vanilla Put** with strike 21200, a different contract from this Call, and is kept unchanged.
  - Verified via `npm run build`.
- [x] **[🟡 Optional] Discrete-monitoring disclosure** ✅ Modified (2026-05-31): the Day 3 barrier-option manual "risk disclosure" section gains "This simulation demonstrates the path with discrete observation points; real barrier products are mostly continuously monitored, so knock-outs occur more easily"; the Day 4 CBBC manual "Mandatory Call Event (MCE)" section gains "This simulation uses discrete observation points; real CBBCs are continuously monitored, so calls occur more easily".
- [x] **[🟡 Optional] Dividend-yield disclosure** ✅ Covered via the data desk (2026-05-31): the newly added "Central data desk" (`Day2ResearchTerminalPanel`) index-overview card already displays q ≈ 3.5% and notes "real HSI pricing needs to deduct the approximately 3.5% dividend yield, otherwise the Call is systematically overestimated". Per the HANDOFF.md explanation, the manual entry is no longer added redundantly.
- [x] **[🟡 Optional] Day 2 hedging awareness** ✅ Modified (2026-05-31): in `Day2ReportPanel`, after the "simulated market path" block, added a teaching note: "A real trading desk hedges directional risk (e.g. flattening Delta with futures or reverse options); what's shown here is the unhedged single-trade result, used only to understand pricing P&L and not representative of the trading desk's true risk exposure".
- [ ] **[🟡 Optional] Dynamic copy**: change the Day 1 maturity-payoff copy (~line 3113) to dynamically generate from the last value of `market.path` and `market.strike`, avoiding hard-coding.
- [ ] **[🟡 Optional] File rename**: `Day1TraderSimulator.jsx` → `TraderSimulator.jsx` (remember to sync the import in `main.jsx`).
- [x] **[Integration] Interface with the math engine (step 1: enrich content with real data)** ✅ Completed (2026-05-31): in the Day 3 / Day 4 "market path" panels, added a green "real-world reference" card (the `RealDataContextCard` component) that binds the fictional teaching path to its corresponding real crisis, and notes that the data source is the CSVs scraped by the same group's math-engine team. See "Appendix A: Real-data enrichment layer" below. Follow-ups can continue: change pricing to call `bs_price`, replace the teaching path wholesale with real segments, and unify "1 point = HK$50".

---

## 5. Priority and impact assessment

| Priority | Issue | Consequence of not fixing | Change cost |
|--------|------|------------|----------|
| 🔴 High | Bear CBBC strike/call price reversed | Real financial-structure error, spotted immediately by the knowledgeable | Very low (change 1 number + verify) |
| 🟠 Medium | CBBC cost/payoff scale inconsistent | The figures look like arbitrage, professionalism discounted | Low–medium |
| 🟠 Medium | Same Call priced inconsistently across levels (150 vs 186) | Narrative contradiction, player confusion | Low (change 2–3 numbers) |
| 🟡 Low | Discrete monitoring / no q / no hedging / hard-coded copy | Detail rigor only, a reasonable simplification | Low |
| ⭐ Bonus | Integration with the math engine + real data | Misses substantial bonus points on the Application dimension | Medium–high |

---

## 6. Overall verdict

**Financial rigor (before fixes): B** — the core pricing math is correct and the compliance teaching is excellent, but the CBBC structure error + cross-level numerical inconsistencies are hard flaws.
**Financial rigor (after fixing per the checklist): A-** — enough to withstand classroom questions.
**Product / teaching design: A** — the design of the narrative, pacing, suitability, and risk disclosure is the biggest highlight of this project.
**Biggest point-gainer**: integration with the classmate's math engine, introducing real HSI/VHSI data, upgrading "teaching parameters" to "real application".

---

## Appendix A: Real-data enrichment layer (implemented, 2026-05-31)

### A.1 Design decision: why "overlay a real-world reference" rather than "replace the teaching path"

After examining the same group's real data, we found that the crash magnitudes of real crises are far larger than the game's teaching volatility band.
- The teaching path deliberately uses a mild ±2~3% volatility, so that the drama of "knock-out / MCE" lands exactly on the barrier line;
- The real COVID crash could fall −14% in a single week (in 2020-03 the HSI plunged from 24,000 to 21,700 within a week).

If we stuff real prices straight into the game path, it would **break through the carefully tuned barrier/call storyline**, and the game mechanics would instead become awkward.
We therefore adopted a **two-layer design**:
- **Teaching path** (kept): still a deterministic game driver, ensuring the knock-out/MCE storyline is clean and crisp;
- **Real-data layer** (new): real dates, real HSI levels, and real VHSI, shown as a "real-world reference" card in the path panel, **anchoring each fictional storyline to its corresponding real crisis**, with the data source credited.

This way we both enrich the content with real data (earning the Application score) and explicitly endorse the same group's math-engine team's data-scraping work, without breaking the game's feel.

### A.2 Implementation contents

- Added the `RealDataContextCard` component (a green "📡 real-world reference" card, with bullet points + a data-source line).
- `day3Config.market.marketContext`: binds the 2020 COVID crash "fall touches the barrier" storyline.
- `day4Config.market.marketContext`: binds the 2020 COVID "first spikes up to trigger MCE, then plunges" storyline.
- The Day 3 / Day 4 `mentor` voiceover synchronously adds real-crisis lead-ins, ensuring smooth narrative continuity.

### A.3 Real data cited (all verified line by line against the same group's CSVs ✓)

| Cited value | Real data | Source file |
|--------|----------|----------|
| 2020-02-17 HSI high 28,055 | high = 28,055.58 ✓ | `hsi_2020_covid.csv` |
| 2020-03-19 intraday low 21,139 | low = 21,139.26 ✓ | `hsi_2020_covid.csv` |
| 2020-03-23 close 21,696 | close = 21,696.13 ✓ | `hsi_2020_covid.csv` |
| 2020-03-19 VHSI 60.19 | close = 60.19 ✓ | `vhsi_history.csv` |

> Coincidental bonus point: the real COVID bottom (21,696) is almost exactly equal to the game's spot 21,500, so the "real-world reference" and the teaching scenario naturally match in magnitude, making the demo very persuasive.

### A.4 Verification

- `npm run build` passes; `getDiagnostics` reports no errors; `npm run dev` starts normally (Vite ready).
- The teaching path, the knock-out/MCE settlement logic, and the scoring were all unchanged, and the storyline is unchanged.

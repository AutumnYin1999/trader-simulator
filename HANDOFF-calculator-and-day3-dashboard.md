# Handoff Doc · Calculator Layering + Day3 Data Desk

> Written for the next Claude who picks this up
> Date: 2026-06-01
> Project: `trader-simulator-day1` — gamified options-teaching simulator (React single page, main file `src/Day1TraderSimulator.jsx` ~6600 lines, all logic in this one file)
> User: HKBU student, **communicates in Chinese**, conversational, clear, not too academic
> This file focuses on "this one big task". For overall project background see `HANDOFF.md` and `REVIEW-AND-CHANGES.md` in the same directory — read those two first.

---

## ⭐ Latest status (2026-06-01 continued session, must read, written for the next Claude after switching computers)

> The user is already tired; this section is the **current real progress**. "Sections 1–5" below are the earlier original plan/history — the approach is still worth referencing, but **treat this section as the source of truth for what's done**.

### This session finished both the first batch and the second batch, and also did a bunch of Day2 experience rework along the way

**Everything has passed `npm run build`. Day2 has been fully run through by the user in the browser ✅. Day3's code changes are done, but the user hasn't tested it live in the browser yet — next step is to test/tune starting from Day3.**

Checklist by topic (all in `src/Day1TraderSimulator.jsx`, **line numbers have all drifted, don't trust old line numbers, use Grep to locate by function name**):

1. **✅ First batch · data desk generalization**: extracted `Day2ResearchTerminalPanel` into a generic `ResearchTerminalPanel({ title, accent, taskText, cards, footerHint })`; `Day2ResearchTerminalPanel` / `Day3ResearchTerminalPanel` are thin wrappers around it. Added `day3ResearchCards` (4 cards: quote terminal / 🚧 barrier contract card / rate bulletin board / ⚠️ barrier risk card, the last two carry `isNew` → render a "🔓 NEW" badge).

2. **✅ First batch · Day3 data desk stage**: added `day3_research_terminal` (label `09:10 Barrier Data Desk`), inserted after `day3_lesson_knock_out` and before `day3_lesson_compare_vanilla`. Flow: knock-out lesson button → `toDay3ResearchTerminal` → data desk → `toDay3CompareVanilla` → calculator comparison. Registered in MainPanel `panels`.

3. **✅ Day2 stage order adjustment** (user request): changed to **handbook update → client visit → product confirmation → [data desk] → pricing desk** (the data desk moved from "before meeting the client" to "after product confirmation, before pricing"). Touches: `day2_handbook_updated` button changed to `meetDay2Client`, `day2_research_terminal` button changed to `toDay2TreeExplainer` (new action), `confirmProduct`'s day2 branch changed to go to `day2_research_terminal` first, time labels adjusted to stay monotonic.

4. **✅ Day2 pricing desk "blind quote + consequences" rework** (user request, option two · market slightly up):
   - **Removed all giveaways** from the quote area: live scoring label, the 4 value boxes (teaching anchor / model reference / simulated Payoff / trading-desk settlement), simulated path, estimated score. Kept only the quote input box + the "vanilla Call theoretical price" the calculator computes itself.
   - The quote box **defaults to empty** (`defaultQuote: ""`); if not filled, the bottom button is disabled showing "please fill in your quote first" (`BottomActionBar` gains a `selectedQuote` prop + a `quoteEntered` check).
   - `getQuoteAnalysis`'s five tiers of copy rewritten into **realistic narrative feedback**: too high → client says "I'll go shop around elsewhere" and walks off; a bit pricey → frowns and reluctantly closes the deal; reasonable → closes happily + Martin praises; too low → instant signature + Martin scolds "you sold a ticket worth X points dirt cheap, gave away N points to the client for free" (dynamically interpolating theoretical/quote).
   - The client response page `Day2ClientResponsePanel` dropped the "status bar" and the "theoretical price/profit" line (too much of a spoiler), replaced with a neutral "quote sent, awaiting market settlement".

5. **✅ Day2 new market playback page** (user request, mirroring Day1): new component `Day2MarketRunPanel` + new stage `day2_market_run` (label `09:46 Market Settlement`). Flow: client response → "view market settlement" (`toDay2MarketRun`) → [curve animation where the price auto-plays cell by cell along the path] → "view report" (`viewReport`→`evaluateDay2`→report). Wiring points: add `day2_market_run` button to `BottomActionBar`, add `day2_market_run` to the auto-play `useEffect`'s stage array, add an `isDay2Stage` branch to `marketPathLength`, change `viewReport`'s day2 branch to `day2_market_run`, add day2_market_run to mentorText, add to MainPanel panels. When the deal doesn't close (quoted too high), settlement shows "no deal · 0".

6. **✅ Second batch · merged calculator**: created `BinomialPricingTool({ mode, selectedQuote, quoteAnalysis, onUpdateQuote, onUpdateTheoretical })`, `mode="vanilla"`(Day2)/`"barrier"`(Day3). **Deleted the old `VanillaBinomialPricingTool` and `BarrierBinomialPricingTool`**. Both builders (vanilla/barrier) retained, selected by mode. barrier mode: parameter column adds a gold "barrier price" row + 🔓NEW badge, knock-out red/green coloring, bottom vanilla vs barrier comparison card, title BARRIER MODE. `Day2TreeExplainerPanel` uses `mode="vanilla"`, `Day3CompareVanillaPanel` uses `mode="barrier"`.

7. **✅ Volatility fix (important financial correctness)**: the original Day2/Day3 data desk VHSI was written as **24%**, but a player filling it in as-is computes ~401, which doesn't match the narrative anchor of 186. Determined that 186 corresponds to σ≈**16%**. Changed the "quote terminal" card VHSI on both days' data desks from **24%→16%** (also better fits a "calm market"), and added the σ symbol to the label (`VHSI volatility index σ`). Check: σ=16%, T=0.08, N=3 → theoretical price 185.94 ≈ 186, terminal payoffs 0/0/69/1253 ✓.

8. **✅ Step count N locked** (user request): N is no longer an editable input, changed to a read-only display (the "🔒 fixed" badge). `fixedSteps = isBarrier ? 6 : 3`, the default value is the fixed value, the steps row was removed from inputMeta. Day2 = 3 steps (recovers 186), Day3 = 6 steps (so the knock-out path is clear for the barrier).

### Next steps (continue from here tomorrow after switching computers)

1. **First walk through Day3 fully in the browser** (`npm run dev` → http://127.0.0.1:5173/). Focus on the merged barrier calculator: gold barrier row + 🔓NEW, knock-out red nodes / red-green links, vanilla vs barrier comparison card, N read-only at 6 steps, **no white screen** (a passing build ≠ runtime safe, see the white-screen lesson in Section 1).
2. Content after Day3 (client, product selection, risk disclosure, market path, report) — adjust as needed — **the user said "from now on adjust everything starting from Day3"**.
3. **Don't touch Day2** (already tested and passing).
4. Consider adding a "blind quote / consequences" or experience polish to Day3 like Day2's (if the user asks).
5. After changes, as usual run `npm run build` + have the user test live in the browser.

### Engineering notes
- Line numbers are all scrambled, **always use Grep to locate by function name / string**.
- When changing variables referenced by `panels` / `actionSets` in JSX, remember to change both "pass-in at the call site" and "destructure in the function signature" together, otherwise it white-screens at runtime while build doesn't catch it.
- Run `npm run build` under `trader-simulator-day1/`.

---

## 0. Why a new session was started

The last session's context got very large (repeatedly reading the 6600-line large file), causing frequent "tool call could not be parsed" errors (occasional formatting errors when I generate tool instructions, not a network issue). The user chose to "write a good handoff, pick it up in a new session with clean context". So your context is now clean — please work efficiently.

---

## 1. What's already been done this session (don't redo)

Everything has passed `npm run build`:

1. ✅ **Fixed the entry bug**: `actions.startGame` changed from `startDay2` back to `startDay1` (~line 6877). It had been temporarily wired to Day2 for testing.
2. ✅ **Fixed a serious white-screen bug**: `MainPanel` (function signature starting ~line 5938) and its call site (~line 6990) both omitted the `liveTheoretical` prop, causing **any action entering the game to white-screen** (`ReferenceError: liveTheoretical is not defined`). Added it in both places.
   - ⚠️**Lesson (important)**: `MainPanel` has a `panels` object internally that **fully constructs all stages' JSX on every render**. If any one stage references an undefined variable, the whole game white-screens immediately. A new prop must be **changed in both places at once**: ① pass `xxx={xxx}` when calling the component, ② destructure `{ ..., xxx }` in the function signature. Miss one and it crashes at runtime, and **`npm run build` doesn't catch this kind of error** (bundling doesn't check whether variables are defined). So after changes, always have the user test live in the browser.
3. ✅ **Task 3 disclosure copy** (added one risk-disclosure sentence each to the Day3 barrier handbook, the Day4 bull/bear certificate handbook, and the Day2 end-of-day report).
4. ✅ **Day2 data desk "challenge-ified" rework** (`Day2ResearchTerminalPanel`, ~line 3634):
   - Removed each card's "fill-in hint" (the card.hint render block) and the bottom "parameter quick-reference table" (the yellow block that handed out answers directly)
   - Changed the task description to "S₀ (underlying spot), K (strike), T (annualized maturity), r (risk-free rate), σ (annualized volatility)", and emphasized "the data cards only give raw quotes, not ready-made answers"
   - Kept each card's **data row** (the player has to map and hand-fill from the data themselves)
5. ✅ **Day2 calculator `VanillaBinomialPricingTool` defaults changed to minimum values** (~line 4069): spot 1000 / strike 1000 / rate -5 / sigma 1 / maturity 0.02 / steps 1. The player must copy the real parameters from the data desk and fill them in themselves.

---

## 2. This big task: goals and confirmed design decisions

The user's product instinct: **Day3 = Day2 + the barrier layer**. The hope is "the same familiar calculator grows a barrier-price parameter by Day3", and **the Day3 data desk also has one more barrier dimension than Day2's**, making Day3's content noticeably richer than Day2's, with an "unlock/level-up" feel. Also, while at it, remove the code duplication between the two components.

### Current state (two highly duplicated components)

| | Day2 `VanillaBinomialPricingTool` (4067-4315) | Day3 `BarrierBinomialPricingTool` (4317-4483) |
|---|---|---|
| Stage it lives in | `day2_tree_explainer` (`Day2TreeExplainerPanel` line 4560) | `day3_lesson_compare_vanilla` (`Day3CompareVanillaPanel` line 5052) |
| Parameters | spot,strike,rate,sigma,maturity,steps (6) | same 6 **+ barrier** (7) |
| steps cap | 3 | 6 |
| builder | `buildVanillaBinomialToolTree` (~3890) | `buildBarrierBinomialToolTree` (3969), a **superset** of vanilla (additionally computes barrierValue, knocked, links.alive) |
| tree render | nodes show payoff/optionValue, no coloring | nodes show KO YES/NO + red/green coloring, links colored by alive |
| bottom | **quote input area** (selectedQuote drives scoring, Day2-specific) | **vanilla vs barrier comparison card** (two theoretical prices side by side) |
| defaults | already changed to minimum values | still real values (21500 etc.) — to be changed to minimum values |
| linkage | has `onUpdateTheoretical` passing the theoretical price back to the parent | none |

### Design decisions already confirmed with the user

1. **Merge the calculators into one component**, suggested signature `BinomialPricingTool({ mode, selectedQuote, quoteAnalysis, onUpdateQuote, onUpdateTheoretical })`, `mode` = `"vanilla"`(Day2) / `"barrier"`(Day3).
   - **Shared top**: parameter input column + u/d/p info + tree SVG skeleton.
   - **The barrier row's "unlock feel"**: when mode=barrier, the parameter column adds a "barrier price" row, highlighted in **gold** + a **"🔓 added today / NEW" badge** (the user-chosen option: highlighted row + NEW badge, no animation).
   - **Tree render branches by mode**: barrier mode shows knock-out red coloring (reuse the existing node render at 4426-4452 + the links coloring at 4412-4423); vanilla mode reuses the existing simple nodes.
   - **Bottom branches by mode**: vanilla mode renders the Day2 quote input area (currently 4255-4312, depends on selectedQuote/quoteAnalysis/onUpdateQuote/marketPreview/pricingPreview, and keeps "teaching anchor / model reference" etc.); barrier mode renders the comparison card (currently 4455-4478).
   - **builder selection**: mode=barrier uses the barrier builder, vanilla uses the vanilla builder (or unify on the barrier builder — it's a superset — but don't show barrier-related fields in vanilla mode, and be careful that nodes don't misjudge knocked when vanilla has no barrier parameter; the safest is to keep both builders and select by mode).
   - **steps cap**: vanilla 3 / barrier 6 (keep the difference, put it in the mode check).
   - **`onUpdateTheoretical` linkage**: only needed in vanilla mode (Day2 quote-scoring linkage). barrier mode just doesn't pass it (the effect already null-checks).
2. **Defaults all set to minimum values** (the player fills them in themselves). The barrier mode's barrier default also uses its minimum value (the barrier min in inputMeta, currently 1000).
3. **Merge the data desk into a generic component**: change `Day2ResearchTerminalPanel`(3634) into `ResearchTerminalPanel({ title, accent, taskText, cards })`, with Day2 and Day3 passing different data. `researchCards`(3574) is kept for Day2, add `day3ResearchCards`.
4. **Add a Day3 data desk stage** `day3_research_terminal`, inserted **after `day3_lesson_knock_out` and before `day3_lesson_compare_vanilla` (the calculator)** — so that "look up the barrier parameters → immediately fill the calculator" flows continuously (this is exactly the break point Day2 didn't get right and the user complained about; Day3 nails it in one step).
5. **Maturity**: Day2 = 1 month (T≈0.08), Day3 = 3 months (T=0.25). Write these **real values** on the data cards for the player to look up; the calculator defaults are still minimum-value placeholders.
6. **Day3 data desk also feeds minimum values into the calculator**, the player looks up the parameters (including barrier) from the Day3 data desk and fills them in themselves.

### The Day3 data desk's 4 data cards (direction already settled with the user)

| Card | Icon | Key content | Real data source |
|---|---|---|---|
| Quote terminal | 📈 | spot S₀ 21,500; VHSI σ (can crank up to ~24%+, foreshadowing "high volatility → easier knock-out") | `vhsi_history.csv` |
| **Barrier contract card (new · core)** | 🚧 | product Down-and-Out Call; strike K 22,000; **barrier 21,000 ← the new parameter the player must look up**; knock-out type "deactivates on a downward touch"; **maturity T≈0.25 (3 months)**; can include a real option-chain snippet | `option_chain_current.csv` |
| Rate bulletin board | 🏦 | r = 2% (HIBOR reference) | teaching value |
| **Barrier risk card (new)** | ⚠️ | the barrier 21,000 is only ~2.3% below the spot 21,500, very close → easy to knock out; real reference: in 2020-03 the Hang Seng crashed to ~21,700, this kind of barrier would be breached; key point "the closer the barrier is set to the spot, the cheaper but the easier to knock out" | `hsi_2020_covid.csv` |

→ Of the 4, the "barrier contract card" and "barrier risk card" are brand-new Day3 content; the other two reuse the Day2 style. Continue Day2's challenge style of "no ready-made answers, no fill-in hints, no quick-reference table".

---

## 3. Suggested execution order (two batches, each with its own build + user browser test)

> ✅✅ Note: both the first and second batches below **have been completed in the 2026-06-01 continued session** (see the top "⭐ Latest status"). Kept below as an approach reference.

**First batch (low risk, do first) ✅ done: data desk generalization + Day3 data desk stage**
1. Refactor `Day2ResearchTerminalPanel` into a generic `ResearchTerminalPanel({ title, accent, taskText, cards })`; have Day2's render site (the `day2_research_terminal:` line in MainPanel, ~5992) pass in Day2's `researchCards` and the original task copy.
2. Add the `day3ResearchCards` data (see the 4-card table above).
3. Add `day3_research_terminal` to `day3Config.stages` (use a label like 09:10, keep the time order from going backwards; mentor writes one line like "look up the barrier price and other parameters before pricing a barrier product").
4. Insert into the Day3 stage flow: `day3_lesson_knock_out → day3_research_terminal → day3_lesson_compare_vanilla`. Need to change: ① the stage order array (if there is one; search around line `1164` where `day3_market_run` appears, there may be a fullWidth/order array, confirm); ② the corresponding "next step" action (search the jump just before `setCurrentStage("day3_lesson_compare_vanilla")`, change it to go to research_terminal first); ③ add `day3_research_terminal: <ResearchTerminalPanel .../>` to MainPanel's `panels`; ④ the BottomActionBar / advance-button chain.
5. `npm run build` + have the user walk through Day3 once in the browser.

**Second batch (high risk, do later) ✅ done: merge the calculator**
6. Create `BinomialPricingTool({ mode, ... })`, extract the shared skeleton of the Vanilla and Barrier components, with differences handled by `mode` branches (parameter row, barrier highlight+NEW, tree coloring, bottom, steps cap, builder, default minimum values).
7. Replace the `<VanillaBinomialPricingTool .../>`(4603) in `Day2TreeExplainerPanel`(4560) with `<BinomialPricingTool mode="vanilla" .../>` (keep its four props selectedQuote/quoteAnalysis/onUpdateQuote/onUpdateTheoretical).
8. Replace the `<BarrierBinomialPricingTool />`(5092) in `Day3CompareVanillaPanel`(5052) with `<BinomialPricingTool mode="barrier" />`.
9. Delete the old two component functions (after confirming there are no other references).
10. Change the Barrier defaults to minimum values; Day3 maturity data card to 3 months.
11. `npm run build` + have the user test live in the browser: the Day2 calculator (whether the quote linkage is still there) and the Day3 calculator (barrier highlight row, NEW badge, knock-out red nodes, comparison card all working).

> If the second batch's merge risk assessment comes out too high / the payoff isn't worth it, you can discuss stepping back with the user: **don't physically merge the components**, just add the barrier highlight row + NEW badge to `BarrierBinomialPricingTool`, change the defaults to minimum values, and change the maturity. The visible effect is the same, the code dedup is abandoned. Ask the user first.

---

## 4. Working conventions (must follow)

1. After finishing each batch, run `npm run build`, **and have the user test live in the browser** (a passing build ≠ no runtime crash, see the liveTheoretical lesson above).
2. When adding/passing a prop, change both **the pass-in at the call site** and **the destructure in the function signature** together.
3. When done, mark it in `HANDOFF.md` and `REVIEW-AND-CHANGES.md`, and update the status in this file.
4. **Do not change** the teaching narrative path `dayNConfig.market.path`, **do not change** the `scoringRules` structure.
5. Visual consistency: reuse `TerminalCard`/`TerminalHeader`/`cn()`, don't pull in a new UI library.
6. **Reduce parse errors**: keep "long Chinese explanations" and "tool calls" as separate as possible; write tool-call parameters concisely; don't pointlessly re-read the large file.

---

## 5. Quick reference for key code locations (relevant to this task)

- builders: `buildVanillaBinomialToolTree` ~3890; `buildBarrierBinomialToolTree` 3969
- calculators: `VanillaBinomialPricingTool` 4067; `BarrierBinomialPricingTool` 4317
- formula explainer: `BinomialFormulaPanel` 4485 (used by Day2)
- Day2 calculator host: `Day2TreeExplainerPanel` 4560 (contains formula panel + calculator, stage `day2_tree_explainer`)
- Day3 calculator host: `Day3CompareVanillaPanel` 5052 (stage `day3_lesson_compare_vanilla`)
- Day2 data desk: `Day2ResearchTerminalPanel` 3634; its data `researchCards` 3574
- Day2 data desk stage config: `day2_research_terminal` ~333; MainPanel render ~5992
- Day3 stages: 608-677
- MainPanel function: ~5938 (signature destructure); call site ~6990
- actions/stage jumps: around 6840-6940; `startGame` ~6877

Good luck. Read `HANDOFF.md` and `REVIEW-AND-CHANGES.md` first, then start; when unsure, read the code first, don't guess.

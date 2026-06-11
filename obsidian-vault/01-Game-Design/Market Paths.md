---
tags: [game-design, market-paths, reference]
---

The fixed, hand-tuned index paths each day replays; they are story beats, not random walks.

# Market Paths

The market never randomizes. Each day's `market.path` array is a carefully tuned teaching path, and HANDOFF.md forbids changing them: "these are carefully tuned story paths, and changing them breaks the drama of the knock-out".

| Day | Path | Line | Knocked out? | Final price | Story |
|---|---|---|---|---|---|
| 1 | [21500, 21800, 22100, 22400] | 269 | n/a | 22400 | Steady rally, call ends ITM, the happy path |
| 2 | [21500, 21680, 21940, 22140] | 556 | n/a | 22140 | Grind up, call ends just ITM (payoff 140 vs strike 22000) |
| 3 | [21500, 21820, 21460, 20950, 21680, 22400] | 828 | Yes, 4th point 20950 <= barrier 21000 | 22400 | Dip knocks the barrier out, then the market recovers; vanilla would pay 400, barrier pays 0 |
| 4 (current) | [] | 1275 | n/a | n/a | The graduation round has no market replay; quotes settle against theory |
| 4 (archived CBBC) | [21500, 21780, 22050, 21600, 21100, 20750] | 1113 | MCE at 22050 >= call price 22000 | 20750 | Bear contract called mid-path, kept only as `_ARCHIVED` |

## Why Day 3's path is the centerpiece

It teaches the whole point of [[Day 3 Barrier Options]] in one picture: the final price 22400 is great for a call buyer, but the product died at point 4 when 20950 breached the 21000 barrier. Ending well does not matter if you touched the line on the way. The knock-out check in code is `price <= barrier` (see [[buildBarrierBinomialToolTree]]).

## How paths render

`MarketRunPanel` (line 3641), `Day2MarketRunPanel` (line 5638), and `Day3MarketRunPanel` (line 6365) animate the path point by point using `visibleMarketSteps` state, then settle P&L:

- Day 1: payoff vs premium for the chosen product
- Day 2: desk P&L = quote received minus payoff paid (140), so any accepted quote above 140 leaves the desk ahead this time, with a note that real desks hedge delta
- Day 3: vanilla payoff vs barrier payoff side by side (400 vs 0), the knock-out moment highlighted

Day 3's panel adds a "Real-World Reference" card citing the 2020 COVID crash (HSI and VHSI csv files from the group's math-engine team), to anchor the teaching path in reality.

The paths feed `getDay2MarketResult` (line 1676) and `getDay3MarketResult` (line 1746), which in turn feed the [[Scoring System]].

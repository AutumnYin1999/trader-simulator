---
tags: [game-design, day3, barrier-options, knock-out]
---

Day 3 introduces path dependence: a down-and-out call that dies if the index touches the barrier.

# Day 3 Barrier Options

Config: `day3Config` (line 597). Title: "Barrier Options". Stage chain in [[Game Flow]].

## Lesson beats

1. The barrier as a red line in the contract: vanilla looks only at expiry, barrier also watches the path (`Day3BarrierConceptPanel`, line 6017)
2. Knock-out: touch the line and the product ends immediately, payoff zero (`Day3KnockOutPanel`, line 6103)
3. Compare vanilla vs barrier price in the calculator (`Day3CompareVanillaPanel`, line 6172): same contract, the barrier version is cheaper because the buyer takes knock-out risk

## The client

Ms. Chen (line 723): bullish, but finds the vanilla call too expensive and accepts extra conditions for a discount. Correct product: `down_out_call`. See [[Clients]].

## The numbers

Parameters: S0=21500, K=22000, barrier=21000, r=2%, sigma=30%, T=0.25, N=4. Computed live by the engine at module load (lines 4950 to 4960):

- Vanilla reference: 1112 ([[buildVanillaBinomialToolTree]])
- Down-and-out barrier: 934 ([[buildBarrierBinomialToolTree]])

The 178-point gap is the price of knock-out risk. Anchors table in [[Theoretical Price Anchors]].

## Quote, disclosure, market run

The player sources inputs at `Day3ResearchTerminalPanel` (line 4581), then quotes blind. Barrier quote bands are relative multiples: fair up to x1.183 of theoretical, rejection above x1.398 (`getDay3QuoteAnalysis`, line 1764, see [[Scoring System]]).

Risk disclosure must stress path dependence: a favorable final price does not guarantee a payoff. The manual also notes this simulation uses discrete observation points while real barrier products are mostly continuously monitored.

The market path `[21500, 21820, 21460, 20950, 21680, 22400]` (line 828) is the drama: the 4th point 20950 breaches the 21000 barrier, the option knocks out, then the index recovers to 22400. A vanilla call would have paid 400; the barrier pays 0. See [[Market Paths]]. The panel also shows a "Real-World Reference" card citing the 2020 COVID crash data (`hsi_2020_covid.csv`, `vhsi_history.csv`).

## Grading

`evaluateDay3` (line 8489) grades suitability (down_out_call A, vanilla_call B, up_out_call C, else D), disclosure, and path awareness into an overall grade, persisted via [[Progress Persistence]]. Day 4 ([[Day 4 Graduation Round]]) then reuses everything learned here.

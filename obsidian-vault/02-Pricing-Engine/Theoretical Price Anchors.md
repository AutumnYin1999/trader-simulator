---
tags: [pricing, anchors, reference, verified]
---

The verified theoretical prices every quote in the game is scored against, all computed at r=2%.

# Theoretical Price Anchors

These numbers are verified by actual computation (CLAUDE.md table) and recomputed live at module load, so config can never drift from the engine again.

| Client | Product | Parameters | Theoretical |
|---|---|---|---|
| Day 2 Mr. Wang | vanilla | S0=21500, K=22000, sigma=16%, T=0.08, N=3 | 185.94 -> 186 |
| Day 3 Ms. Chen | vanilla ref | S0=21500, K=22000, sigma=30%, T=0.25, N=4 | 1111.73 -> 1112 |
| Day 3 Ms. Chen | barrier | same plus barrier=21000 | 934.16 -> 934 |
| Day 4 Mr. Zhang | vanilla | S0=24000, K=24500, sigma=18%, T=0.08, N=3 | 297.06 -> 297 |
| Day 4 Ms. Li | barrier | S0=24000, K=24500, barrier=23000, sigma=28%, T=0.25, N=4 | 980.77 -> 981 (vanilla ref 1167.35 -> 1167) |
| Day 4 Mr. He | barrier | S0=25000, K=25500, barrier=23500, sigma=32%, T=0.25, N=4 | 1184.20 -> 1184 (vanilla ref 1411.24 -> 1411) |

## Where the overrides happen

Lines 4946 to 4970 of `src/Day1TraderSimulator.jsx`, right after the two builders are defined:

- `day2Config.quoteRules.theoreticalPrice` <- [[buildVanillaBinomialToolTree]] (186)
- `day3Config.market.premium` <- [[buildBarrierBinomialToolTree]] (934)
- `day3Config.market.vanillaPremium` <- vanilla builder (1112)
- `day4Clients[0..2].theoretical` <- the matching builder per client

## Why anchors matter

1. Scoring: every quote band in the [[Scoring System]] is an offset or multiple of these values
2. Cross-day consistency: the same contract once showed 150 on Day 1/3 but 186 on Day 2 (REVIEW-AND-CHANGES.md Medium 3); unifying on engine output fixed the "yesterday it was 150" plot hole
3. The barrier discount story: 1112 vanilla vs 934 barrier on Day 3 is the visible price of knock-out risk ([[Day 3 Barrier Options]])

## Conventions

r=2% everywhere, no dividend yield q (see [[CRR Binomial Model]]), vanilla N=3, barrier N=4, all values rounded with `Math.round` before display. Client context for each row is in [[Clients]].

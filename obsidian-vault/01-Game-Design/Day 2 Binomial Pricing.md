---
tags: [game-design, day2, pricing, binomial-tree]
---

Day 2 teaches model-based quoting: build a CRR tree, find the theoretical price, then quote with a margin.

# Day 2 Binomial Pricing

Config: `day2Config` (line 283). Title: "Pricing Desk". Stage chain in [[Game Flow]].

## Lesson beats

1. The quote anchor: a quote cannot come from gut feeling, the theoretical price is the desk's anchor
2. Binomial tree paths: up/down moves over 3 steps (`Day2TreePathsLessonPanel`, line 4121, rendered as a tap-to-expand accordion since commit 9196f91)
3. Backward pricing: terminal payoffs discounted back node by node (`Day2BackwardPriceLessonPanel`, line 4229)

The math itself is documented in [[CRR Binomial Model]].

## The data desk (research terminal)

`Day2ResearchTerminalPanel` (line 4563) is the "Central Data Desk": four info cards (market terminal with S0 21,500 and VHSI sigma, contract spec K 22,000 T 0.08, rates board r 2% HIBOR reference, index overview with q about 3.5% and N 3 steps). The player sources the pricing inputs themselves instead of being handed them. The cards cite the group's real data files (`vhsi_history.csv`, `option_chain_current.csv`). Note the q card explicitly says real pricing would deduct the dividend yield, the model here does not (see [[CRR Binomial Model]]).

## The client and the quote

Mr. Wang (line 423), a professional client, wants the same vanilla call as Day 1: S0=21500, K=22000, sigma=16%, T=0.08, N=3. The player fills the calculator (`BinomialPricingTool`, line 4989, vanilla mode), which computes the theoretical price 186 via [[buildVanillaBinomialToolTree]] and pushes it up into `liveTheoretical` state.

`Day2QuoteSliderPanel` (line 5504) lets the player pick a quote. Scoring bands are relative to `liveTheoretical` (see [[Scoring System]]): fair is theoretical +4 to +34, rejection above +74. Quoting is blind first; the client's reaction comes afterwards in `Day2ClientResponsePanel` (line 5599).

## Market run and grading

The fixed path `[21500, 21680, 21940, 22140]` (line 556, see [[Market Paths]]) ends at 22140, just above strike 22000, so the call pays 140. The desk P&L is quote minus payoff. A teaching note after the path explains real desks hedge delta; this is an unhedged illustration.

`evaluateDay2` (line 8448) combines the pricing grade (`getDay2PricingScore`, line 1693) with the risk-disclosure grade into an overall A to D, persisted via [[Progress Persistence]].

The Day 2 anchor 186 also back-fills Day 1's premium and Day 3's vanilla comparison, see [[Theoretical Price Anchors]].

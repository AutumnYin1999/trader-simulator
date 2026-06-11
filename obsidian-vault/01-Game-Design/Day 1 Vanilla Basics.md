---
tags: [game-design, day1, vanilla-options]
---

Day 1 teaches what an option is, then tests product suitability with the first client.

# Day 1 Vanilla Basics

Config: `day1Config` (line 4). Title: "Vanilla Option Basics". Stage chain in [[Game Flow]].

## Lesson beats

Mentor Martin walks the rookie through four micro-lessons before any client appears:

1. Options as the "right to choose" (premium buys a decision later)
2. Call is bullish, Put is bearish
3. Premium is the cost and the buyer's usual maximum loss
4. Vanilla rule: only the expiry price matters, no knock-out, contrast with [[Day 3 Barrier Options]]

Then the handbook updates (the in-game rulebook overlay) and the client arrives.

## The client

Ms. Li, a retail beginner (line 191): bullish on the Hang Seng Index, wants upside participation with capped downside, limited premium budget. Full roster in [[Clients]]. Note she is a different character from Day 4's Ms. Li.

## Product selection

`ProductSelectionPanel` (line 3483) offers `vanilla_call`, `vanilla_put`, `direct_index`, and a locked `barrier_option` teaser. Each card shows a [[Payoff Diagrams|payoff diagram]]. The correct pick is the vanilla call: bullish direction plus loss capped at the premium.

## Risk disclosure

`RiskDisclosurePanel` (line 3576): the player ticks what must be told to the client (e.g. "the premium can be fully lost", id `premium_fully_lost` at line 243). Picking correct items and avoiding misleading ones feeds the disclosure grade in [[Scoring System]].

## Market run and grading

`MarketRunPanel` (line 3641) replays the fixed path `[21500, 21800, 22100, 22400]` (line 269, see [[Market Paths]]). The index ends at 22400, above the 22000 strike, so the call expires in the money: payoff 400, premium 186 (aligned with the [[Theoretical Price Anchors|Day 2 anchor]]), client P&L +214.

`evaluateDay1` (line 8367) grades:

- vanilla_call: suitability A; overall A if disclosure A, B if disclosure C, else C
- vanilla_put: suitability D, overall D ("you chose a bearish product for a bullish client")
- direct_index: suitability C even though it made money, teaching that a good outcome does not equal a suitable recommendation

The grade is persisted via [[Progress Persistence]], then Day 2 unlocks.

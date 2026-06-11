---
tags: [game-design, day4, graduation, live-round]
---

Day 4 is the graduation exam: price for three clients in a row with tapering hints, then receive a scorecard.

# Day 4 Graduation Round

Config: `day4Config` (line 1266) with `day4Clients` (line 1150). Narrative: months after the Day 3 crash, the index has recovered to 24000 to 25000, so no parameters repeat and the player must recompute everything.

Day 4 was originally a CBBC chapter; it was cut on 2026-06-01 (user verdict: too hard to polish) and the code archived with `_ARCHIVED` suffixes (e.g. `getDay4CbbcMarketResult_ARCHIVED`, line 1837). See [[Project Overview]].

## The three clients

| # | Client | Task | Product | Parameters | Theoretical | Hints |
|---|---|---|---|---|---|---|
| 1 | Mr. Zhang (institutional) | Quote directly | Vanilla Call | S0 24000, K 24500, sigma 18%, T 0.08, N 3 | 297 | Demonstration |
| 2 | Ms. Li (budget-sensitive) | Quote directly | Barrier Call (down-out) | S0 24000, K 24500, barrier 23000, sigma 28%, T 0.25, N 4 | 981 (vanilla ref 1167) | Reduced |
| 3 | Mr. He (judgment) | Pick product, then quote | Player decides (correct: down-out call) | S0 25000, K 25500, barrier 23500, sigma 32%, T 0.25, N 4 | 1184 (vanilla ref 1411) | Minimal |

All theoreticals are computed live at module load (lines 4962 to 4970) by [[buildVanillaBinomialToolTree]] and [[buildBarrierBinomialToolTree]]; see [[Theoretical Price Anchors]]. Full profiles in [[Clients]].

## Flow

`day4_intro` (briefing) then per client: `day4_client_arrival` (profile and dialogue) -> `day4_judge` (client 3 only: `judgeProducts` choice among vanilla, down-out, up-out) -> `day4_pricing` (calculator plus quote box, `Day4PricingPanel` line 7324) -> `day4_client_response`. After all three: `day4_scorecard` (line 7394) and `day4_complete` graduation. State: `day4ClientIndex` and `day4Results` on the root component (see [[Architecture]]).

Quotes are blind: the player sees the client reaction only after submitting. For client 3 a wrong product pick grades D and the trade dies. Client 3's parameters come via data-desk style sourcing cards (`Day4SourcingCards`, line 7271) rather than a pre-filled card, echoing "hints taper off, you go solo at graduation".

## Scoring

`getDay4QuoteAnalysis(quote, client)` (line 1325) reuses the Day 2 vanilla bands (+4/+34/+74) or the Day 3 barrier bands (x1.183/x1.398) based on `client.mode`, see [[Scoring System]]. The scorecard averages the three per-client grades into the day grade, persisted via [[Progress Persistence]]. `day4Config.market.path` is an empty array (line 1275): the graduation round has no market replay, see [[Market Paths]].

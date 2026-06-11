---
tags: [game-design, clients, reference]
---

Every client in the game, their product, parameters, and theoretical price anchor.

# Clients

All prices are engine-computed at r=2% (see [[Theoretical Price Anchors]] and [[CRR Binomial Model]]).

| Day | Client | Type | Product | Parameters | Theoretical |
|---|---|---|---|---|---|
| 1 | Ms. Li | Retail beginner | Vanilla Call (suitability task) | S0 21500, K 22000, 1 month | premium shown as 186 |
| 2 | Mr. Wang | Professional | Vanilla Call (pricing task) | S0 21500, K 22000, sigma 16%, T 0.08, N 3 | 185.94 -> 186 |
| 3 | Ms. Chen | Budget-conscious | Down-and-Out Call | S0 21500, K 22000, barrier 21000, sigma 30%, T 0.25, N 4 | 934.16 -> 934 (vanilla ref 1111.73 -> 1112) |
| 4.1 | Mr. Zhang | Institutional, conservative | Vanilla Call | S0 24000, K 24500, sigma 18%, T 0.08, N 3 | 297.06 -> 297 |
| 4.2 | Ms. Li | Budget-sensitive | Barrier Call (down-out) | S0 24000, K 24500, barrier 23000, sigma 28%, T 0.25, N 4 | 980.77 -> 981 (vanilla ref 1167) |
| 4.3 | Mr. He | Small business owner, judgment test | Barrier Call (player must choose) | S0 25000, K 25500, barrier 23500, sigma 32%, T 0.25, N 4 | 1184.20 -> 1184 (vanilla ref 1411) |

Archived: Ms. Zhou (line 982), the CBBC client from the original Day 4, no longer reachable (see [[Day 4 Graduation Round]]).

## Where they live in code

- Day 1: `day1Config.clientProfile` (line 191), see [[Day 1 Vanilla Basics]]
- Day 2: `day2Config` client (line 423), see [[Day 2 Binomial Pricing]]
- Day 3: `day3Config` client (line 723), see [[Day 3 Barrier Options]]
- Day 4: `day4Clients` array (line 1150), see [[Day 4 Graduation Round]]

## Design pattern

Every client is a need-matching puzzle with three readable signals:

1. Market view (all are bullish on the HSI, so direction is never the trap)
2. Risk appetite and budget (this decides vanilla vs barrier)
3. Experience level (decides how much the mentor scaffolds)

Day 4 clients carry extra machine-readable fields: `taskType` (price or judge), `mode` (vanilla or barrier, which picks the [[Scoring System]] bands), `hintLevel`, `params` (calculator inputs), `theoretical`, `vanillaRef`, and for Mr. He a `judgeProducts` list with per-option feedback.

The two Ms. Li characters (Day 1 retail beginner, Day 4 budget-sensitive) share a name but have different profiles; treat them as distinct personas.

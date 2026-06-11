---
tags: [pricing, crr, binomial-tree, math]
---

The Cox-Ross-Rubinstein binomial model as implemented in the game, including the deliberate no-dividend simplification.

# CRR Binomial Model

Both pricers ([[buildVanillaBinomialToolTree]] and [[buildBarrierBinomialToolTree]]) implement standard Cox-Ross-Rubinstein:

```
dt = T / N
u  = e^(sigma * sqrt(dt))
d  = 1 / u
p  = (e^(r * dt) - d) / (u - d)      // risk-neutral up probability
discount per step = e^(-r * dt)
```

Terminal payoff for a call: `max(S_T - K, 0)`. Then backward induction: each node value is the discounted probability-weighted average of its two children. The root value is the theoretical price.

## Fixed step counts

- Vanilla: N = 3 (Day 2 and Day 4 client 1)
- Barrier: N = 4 (Day 3 and Day 4 clients 2 and 3)

The `steps` field is locked read-only in the calculator UI; the code clamps it to 1..6 defensively. CLAUDE.md treats these as architecture constraints. Small N keeps the tree drawable on screen, which is the whole teaching point of `BinomialTreeVisual` (line 4701) and the calculator tree.

## No dividend yield q, by design

The growth factor is `growth = exp(r * dt)` without the HSI dividend yield q (about 3.5%). This is a deliberate teaching simplification: the Day 2 data desk shows a q card and says "we are not computing q today" so students know the omission is conscious. To add q later, change growth to `exp((r - q) * dt)`. This is documented in CLAUDE.md and surfaced in [[Day 2 Binomial Pricing]].

## No-arbitrage check

Both builders return `noArbitrage: probability >= 0 && probability <= 1`. The calculator UI uses it to warn when the chosen r and sigma make p leave [0, 1].

## Standard teaching inputs

r = 2% everywhere ("HIBOR reference" on the data desk). Sigma varies by chapter: 16% (Day 2, corrected down from an earlier 24%), 30% (Day 3, COVID-era vol), 18% / 28% / 32% (Day 4 clients). Tenors: 0.08 years (about 1 month) for vanilla tasks, 0.25 (3 months) for barrier tasks.

All resulting anchors are tabulated in [[Theoretical Price Anchors]] and consumed by the [[Scoring System]].

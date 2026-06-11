---
tags: [pricing, code, vanilla, binomial-tree]
---

Walkthrough of the vanilla call pricer, the function every theoretical price in the game flows from.

# buildVanillaBinomialToolTree

Location: `src/Day1TraderSimulator.jsx` line 4768. Pure function, `params -> tree object`. The math is [[CRR Binomial Model]].

## Signature and steps

Input `params`: `{ spot, strike, rate, sigma, maturity, steps }`. `rate` and `sigma` arrive as percents and are divided by 100. `steps` is clamped to 1..6 (the UI locks it at 3 for vanilla).

1. Derive `dt`, `up`, `down`, `growth = exp(rate*dt)`, `probability = (growth-down)/(up-down)`, `discount = exp(-rate*dt)`
2. Build `stockTree`: for each step, nodes at `spot * up^upMoves * down^(step-upMoves)`, each with id `"step-upMoves"`
3. Terminal payoffs: `max(price - strike, 0)` at step N
4. Backward induction into `optionValues`: `discount * (p * child_up + (1-p) * child_down)`
5. Flatten to `nodes` with display extras: `optionValue`, `payoff`, `inTheMoney` (price > strike), and x/y coordinates for SVG layout (x spreads 10..90 across steps, y fans around 50)
6. Build `links` connecting each node to its up and down children

## Return value

```js
{ nodes, links, up, down, probability,
  noArbitrage,            // p within [0, 1]
  vanillaPrice }          // optionValues[0][0], the theoretical price
```

## Who calls it

- `BinomialPricingTool` (line 4989) in vanilla mode, recomputing on every input change and pushing `Math.round(tree.vanillaPrice)` up via `onUpdateTheoretical` into `liveTheoretical` (the Day 2 linkage fix, see [[Day 2 Binomial Pricing]])
- Module-load anchor overrides (lines 4946 to 4970): Day 2's 186, Day 3's vanilla reference 1112, Day 4 Mr. Zhang's 297, plus Day 4 vanilla refs, see [[Theoretical Price Anchors]]

## Guard rail

`checkDay2Params` (line 4973) compares calculator inputs against the standard Day 2 values with tolerances, so the game can nudge a player who wandered far from the contract being quoted. Day 4 disables this check via the `enableParamCheck` prop because its contracts differ.

The barrier sibling is [[buildBarrierBinomialToolTree]]; it duplicates this structure and adds knock-out logic.

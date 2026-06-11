---
tags: [pricing, code, barrier, knock-out, binomial-tree]
---

Walkthrough of the down-and-out call pricer: a CRR tree where knocked nodes are worth zero.

# buildBarrierBinomialToolTree

Location: `src/Day1TraderSimulator.jsx` line 4849. Same [[CRR Binomial Model]] scaffolding as [[buildVanillaBinomialToolTree]], plus a `barrier` parameter and knock-out logic. Used with N=4.

## The knock-out logic

Each stock node gets a flag when it is built:

```js
knocked: price <= barrier
```

Two value lattices run in parallel through backward induction:

- `vanillaValues`: plain call values, ignoring the barrier (this is where the on-screen "vanilla reference" price comes from)
- `barrierValues`: terminal payoff is zeroed when the terminal node is knocked; at interior nodes the value is forced to 0 whenever the node itself is knocked, otherwise it is the normal discounted expectation of the children

That interior zeroing is what makes the option path-dependent: any lattice path through a node at or below the barrier contributes nothing, even if the path later recovers. This mirrors the Day 3 story path where 20950 kills the product before the rally to 22400 (see [[Market Paths]]).

## Return value

```js
{ nodes,                 // each with vanillaValue, barrierValue, knocked
  links,                 // each with alive: !from.knocked && !to.knocked
  up, down, probability, noArbitrage,
  vanillaPrice,          // root of vanillaValues
  barrierPrice }         // root of barrierValues, the quoted theoretical
```

The `alive` flag on links lets the calculator UI grey out dead branches, and `knocked` nodes render in the danger color (see [[Theme System]]).

## Who calls it

- `BinomialPricingTool` (line 4989) in barrier mode (Day 3 and Day 4), showing barrier and vanilla prices side by side so the discount is visible
- Module-load anchor overrides (lines 4952 to 4970): Day 3's 934, Day 4 Ms. Li's 981 and Mr. He's 1184, see [[Theoretical Price Anchors]]

## Teaching notes baked around it

- Only down-and-out calls are modeled; the up-and-out option in [[Day 4 Graduation Round]] client 3's judgment menu is a distractor, never priced
- Discrete monitoring: the tree (and the game path) checks the barrier only at observation points; the manual discloses that real barrier products are mostly continuously monitored, making knock-out more likely
- Quote bands for barrier products are multiplicative (x1.183 / x1.398), see [[Scoring System]]

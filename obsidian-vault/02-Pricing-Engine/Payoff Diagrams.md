---
tags: [pricing, frontend, payoff, svg]
---

The small SVG payoff-at-expiry sketches drawn on every product card.

# Payoff Diagrams

`PayoffDiagram` (line 3443) renders a 200x86 SVG: a dashed zero line, a vertical strike marker, and a single payoff polyline. It appears on the product cards of `ProductSelectionPanel` (Day 1, Day 3, and Day 4 client 3's judgment menu).

## Kinds

`kindFromProduct` (line 3434) infers the kind from the product's id, term, and name strings:

| Kind | Trigger words | Path | Color token |
|---|---|---|---|
| call | default | flat then up: `M14,58 L100,58 L186,16` | `--pos` (green) |
| put | "put" or "bear" | down then flat: `M14,16 L100,58 L186,58` | `--accent` (coral) |
| index | "index" or "direct" | straight line: `M14,74 L186,8` | `--muted` (grey) |
| barrier | "barrier" or "cbbc" | call shape plus knock-out marker | `--notice` (amber) |

The barrier kind adds a dashed red vertical line at x=50 labeled "knock-out", visually telling the [[Day 3 Barrier Options]] story: same upside as a call, but with a kill line below. Colors come from the [[Theme System]] tokens.

## Design notes

- The shapes are payoff sketches, not plots: no axes scales, just "which way does this thing pay". That matches the Day 1 goal of teaching direction before math (see [[Day 1 Vanilla Basics]]).
- The barrier path reuses the call polyline; the knock-out marker is the only difference, reinforcing "a barrier call is a call with a condition attached".
- Accessibility: the SVG carries `role="img"` and an `aria-label` like "barrier payoff at expiry".

## Related visuals

- `BinomialTreeVisual` (line 4701): the static 3-step lesson tree for [[Day 2 Binomial Pricing]]
- The interactive calculator tree inside `BinomialPricingTool` (line 4989), drawn from the `nodes` and `links` returned by [[buildVanillaBinomialToolTree]] and [[buildBarrierBinomialToolTree]], including greyed dead branches after knock-out
- The market path charts in [[Market Paths]] panels

# trader-simulator · CLAUDE.md

## Project overview

React + Vite single-file game (`src/Day1TraderSimulator.jsx`, ~8500 lines).
A four-day options teaching simulator: Day1 basics → Day2 binomial-tree pricing → Day3 barrier options → Day4 three-client live round.

Start: `npm install && npm run dev` → http://127.0.0.1:5173/

## Architecture constraints (do not change casually)

- **All logic in a single file**: `src/Day1TraderSimulator.jsx`. Do not split into multiple files.
- **Pricing engine**: `buildVanillaBinomialToolTree` (line ~4489) / `buildBarrierBinomialToolTree` (line ~4570). CRR formula: `u=e^(σ√Δt), d=1/u, p=(e^(rΔt)-d)/(u-d)`, discounting `e^(-rΔt)`.
- **Binomial-tree number of steps is fixed**: vanilla N=3 (Day2), barrier N=4 (Day3/Day4). The `steps` field is locked read-only in the calculator UI.
- **No dividend yield q**: the calculator currently uses `growth=exp(r·dt)` (without q=3.5%) as a teaching simplification, done deliberately. The data desk already notes "we are not computing q today". To add q, change it to `exp((r-q)·dt)`.

## Theoretical-price anchors (verified by actual computation, r=2%)

| Client | Product | Parameters | Theoretical price |
|------|------|------|--------|
| Day2 Mr. Wang | vanilla | S0=21500/K=22000/σ=16%/T=0.08/N=3 | 185.94 ≈ 186 |
| Day3 Ms. Chen | vanilla ref | S0=21500/K=22000/σ=30%/T=0.25/N=4 | 1111.73 ≈ 1112 |
| Day3 Ms. Chen | barrier | same as above + barrier=21000 | 934.16 ≈ 934 |
| Day4 Mr. Zhang | vanilla | S0=24000/K=24500/σ=18%/T=0.08/N=3 | 297.06 ≈ 297 |
| Day4 Ms. Li | barrier | S0=24000/K=24500/barrier=23000/σ=28%/T=0.25/N=4 | 980.77 ≈ 981 |
| Day4 Mr. He | barrier | S0=25000/K=25500/barrier=23500/σ=32%/T=0.25/N=4 | 1184.20 ≈ 1184 |

## Known bugs

_No open bugs._

## Quote scoring bands (do not change the numbers casually)

**Day2 vanilla (theoretical=186)**: `fairLow=+4, fairHigh=+34, rejectAbove=+74` (absolute values)  
**Day3 barrier (theoretical=934)**: `fairHigh=×1.183, rejectAbove=×1.398` (relative multiples)  
**Day4 vanilla**: same bands as Day2 (+4/+34/+74)  
**Day4 barrier**: same bands as Day3 (×1.183/×1.398)

## Market path (fixed teaching path, not random)

| Day | Path | Knocked out? | Final price |
|-----|------|--------|--------|
| Day1 | [21500,21800,22100,22400] | N/A | 22400 (up, Call ITM) |
| Day2 | [21500,21680,21940,22140] | N/A | 22140 (up, Call OTM→slightly ITM) |
| Day3 | [21500,21820,21460,20950,21680,22400] | ✅ 4th point 20950≤21000 | 22400 (but already knocked out) |

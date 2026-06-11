---
tags: [game-design, scoring, grades]
---

How quotes and decisions become letter grades: fixed bands around the theoretical price plus disclosure checks.

# Scoring System

CLAUDE.md rule: do not change the band numbers casually, and do not change the structure of `scoringRules`, only values and linkage.

## Quote bands

### Vanilla (Day 2 and Day 4 client 1), absolute offsets

`getQuoteAnalysis(quote, theoretical, ...)` (line 1573). Bands relative to the live theoretical price (186 for Mr. Wang, 297 for Mr. Zhang):

| Quote vs theoretical | Verdict | Score | Accepted |
|---|---|---|---|
| below theoretical | Too low, desk gives money away | D | yes |
| +0 to +4 | Margin paper-thin | B- | yes |
| +4 to +34 | Fair, pricing discipline | A | yes |
| +34 to +74 | Pricey, client unhappy | C | yes |
| above +74 | Rejected, client walks | D | no |

Day 2 scoring follows `liveTheoretical` from the calculator (the old hard-coded-186 linkage bug is fixed, see HANDOFF.md Task 1 and [[Day 2 Binomial Pricing]]).

### Barrier (Day 3 and Day 4 clients 2 and 3), relative multiples

`getDay3QuoteAnalysis` (line 1764) and the barrier branch of `getDay4QuoteAnalysis` (line 1325):

| Quote vs theoretical | Verdict | Accepted |
|---|---|---|
| below theoretical | Too low (Day 4 scores C) | yes |
| up to x1.183 | Fair | yes |
| x1.183 to x1.398 | Pricey | yes |
| above x1.398 | Rejected ("I'd rather buy a vanilla call") | no |

For Day 3 theoretical = 934, so fair tops out near 1105 and rejection starts near 1306.

## Day grades

- `evaluateDay1` (line 8367): suitability x disclosure, see [[Day 1 Vanilla Basics]]
- `evaluateDay2` (line 8448): pricing score x disclosure; D in either gives D, A+A gives A
- `evaluateDay3` (line 8489): suitability x disclosure x path awareness, see [[Day 3 Barrier Options]]
- Day 4: per-client grades from `getDay4QuoteAnalysis` collected in `day4Results`, the scorecard derives the day grade, see [[Day 4 Graduation Round]]

## Grade to percent

`gradeToPercent` (line 1553) maps grades for the dashboard and the Supabase `score` column: A 95, A- 90, B 82, B- 78, C 68, D 50, unknown 60, none 0. See [[Progress Persistence]] and [[Database Schema]].

---
tags: [frontend, components, reference, line-numbers]
---

Inventory of every significant component in the single file, with approximate line numbers (current main branch; they drift).

# Component Map

All in `src/Day1TraderSimulator.jsx`. Render relationships in [[Architecture]]; locate by name when editing, not by stale line number.

## Chrome (always-on shell)

| Component | Line | Role |
|---|---|---|
| `StyleBlock` | 1994 | Design tokens, see [[Theme System]] |
| `GlobalAtmosphere` | 1985 | Background gradients |
| `TopBar` | 2187 | Sticky nav: back button, brand, day chip, handbook, account menu (dashboard, about, sign out) |
| `SideData` | 2133 | Facts strip under the TopBar: HSI, mode, product, topic, desk chips per day |
| `MentorPanel` | 2340 | Martin's typewriter dialogue (`TypewriterText`, line 1866) |
| `BottomActionBar` | 2365 | Stage-advancing buttons, pinned to viewport bottom |
| `HandbookOverlay` | 2747 | The in-game rulebook, entries unlock per day |
| `PrimaryButton` / `TerminalCard` / `TerminalHeader` | 2088 / 2111 / 2124 | Shared building blocks, the house style |

## Screens outside the day flow

| Component | Line | Role |
|---|---|---|
| `StartScreen` | 2820 | Title screen |
| `AuthScreen` | 2854 | Sign in / sign up, only when Supabase is configured, see [[Supabase Integration]] |
| `AboutPanel` | 7734 | About page |
| `ProgressDashboard` | 7781 | Day grades and replay buttons, see [[Progress Persistence]] |
| `MainPanel` | 7534 | The stage router, see [[Game Flow]] |

## Day panels

- Day 1 (lines 3039 to 4014): `WelcomePanel`, lesson panels, `ClientArrivalPanel`, `ProductSelectionPanel` (3483, reused by Days 3 and 4), `RiskDisclosurePanel` (3576, reused), `MarketRunPanel` (3641), `ReportPanel` (3908) with `ScoreBadge`, `CompletePanel`. Plus [[Payoff Diagrams|PayoffDiagram]] (3443).
- Day 2 (4015 to 5979): lesson panels, `ResearchTerminalPanel` (4460, generic data desk) wrapped by `Day2ResearchTerminalPanel` (4563) and `Day3ResearchTerminalPanel` (4581), `BinomialTreeVisual` (4701), the pricing engine ([[buildVanillaBinomialToolTree]] 4768, [[buildBarrierBinomialToolTree]] 4849), `BinomialPricingTool` (4989, mode-switched calculator), `BinomialFormulaPanel` (5374), `Day2QuoteSliderPanel` (5504), response, market run, report panels.
- Day 3 (5980 to 6645): concept and knock-out lessons, `Day3CompareVanillaPanel` (6172), `RealDataContextCard` (6302), market run (6365), report (6540).
- Day 4 archived CBBC (6646 to 7097): `*_ARCHIVED` panels, unreachable.
- Day 4 live round (7098 to 7533): `Day4BriefingPanel`, `Day4ClientProfilePanel` (7167), `Day4ParamCard` (7239), `Day4SourcingCards` (7271), `Day4PricingPanel` (7324), `Day4ClientResponsePanel` (7354), `Day4ScorecardPanel` (7394), `Day4GraduationPanel` (7501). See [[Day 4 Graduation Round]].

## Root

`Day1TraderSimulator` (7914): all state, actions, `evaluateDay1/2/3` (8367 / 8448 / 8489), `persistDayProgress` (8108), auth session wiring, and the final layout JSX. The whole file is about 9225 lines.

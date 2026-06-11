---
tags: [frontend, design-history, ui]
---

The five visual eras of the app, reconstructed from git history, and why each reskin happened.

# UI Evolution

The theme lives in one `StyleBlock` of CSS variables (see [[Theme System]]), which is what made five full reskins affordable. Git history tells the story (see [[Repos and Branches]] for branch context).

## Era 1: Neon cyberpunk terminal (initial demo)

The original Chinese-language demo (commit c24f5c6) leaned on hacker-terminal vibes: matrix rain (`MatrixCanvas`, still in the file at line 1938), glow lines, pulse dots, an opening curtain. Fun, but noisy and hard to read for long lessons.

## Era 2: Institutional dark terminal (90cd7ec)

"Refined institutional terminal finance theme": kept the dark trading-desk fantasy, dropped the noise. This era also brought the progress dashboard, account menu, and local persistence (3c0e65e), accessibility fixes for contrast, focus, and labels (672d379), and full Chinese-to-English translation (73d8355) including stripping em/en-dashes from copy (29f7431).

## Era 3: Light minimal (a69e423)

A light theme experiment on `feature/ui-redesign`, merged via PR #3. Cleaner, but it lost the desk atmosphere and contrast with the charts.

## Era 4: Indigo playful (176f46d)

"Fun, minimal redesign": indigo palette, rounded corners, and the switch to Plus Jakarta Sans. Also added [[Payoff Diagrams|payoff diagrams]] and condensed product cards (d35a7aa). Friendlier, but generic.

## Era 5: Bold dark coral (current, 3f74d80)

"Bold modern dark theme with warm coral/amber accent", the look documented in [[Theme System]]: near-black background, warm off-white ink, coral #ff7a4d accent, amber notices. Follow-ups polished it:

- db6ed93: readability and fit, darker tokens, light charts, compact tree
- 76249cf: TopBar nav, SideData facts strip, About page, focus glow, text spacing
- 9196f91: Day 2 tree-paths lesson collapsed into a tap-to-expand accordion
- ac74c31: BottomActionBar pinned to the viewport bottom so confirming never needs a scroll

## Pattern worth keeping

Each era neutered the previous one's effects with `display: none` or `content: none` instead of deleting markup (visible in `StyleBlock`). That keeps reskins reversible and diffs small, at the cost of dead chrome like `MatrixCanvas` lingering in the file. House components (`TerminalCard`, `TerminalHeader`, `PrimaryButton`, see [[Component Map]]) and the no-new-UI-library convention (HANDOFF.md) kept all five eras visually coherent within themselves.

---
tags: [frontend, theme, css, design-tokens]
---

The CSS variable design tokens behind the bold dark coral look, all defined in one StyleBlock.

# Theme System

`StyleBlock` (line 1994) injects a `<style>` tag with every design token as a CSS variable on `:root`. Tailwind (CDN, see [[Tech Stack]]) consumes them via arbitrary values like `bg-[var(--surface)]`, so retheming means editing one block. This is how the five reskins in [[UI Evolution]] stayed cheap.

## Tokens

| Variable | Value | Role |
|---|---|---|
| `--bg` | #0f1014 | Page background, near-black |
| `--bg-elev` | #16181f | Elevated background |
| `--surface` | #181b23 | Card surface |
| `--surface-2` | #20242e | Nested surface, chips, inputs |
| `--border` / `--border-strong` | white at 10% / 18% | Hairlines |
| `--ink` | #f4f1ea | Primary text, warm off-white |
| `--muted` / `--faint` | #a7a299 / #6f6b62 | Secondary and tertiary text |
| `--accent` | #ff7a4d | Coral, the brand accent |
| `--accent-strong` | #f25c2b | Button fill, hover target |
| `--accent-weak` | coral at 16% | Selection, soft fills |
| `--accent-2` / `--notice` | #fbbf24 | Amber, highlights and warnings |
| `--pos` / `--neg` | #4ade80 / #f87171 | P&L green and red |
| `--shadow` / `--shadow-pop` | layered black / coral glow | Card depth, primary button pop |

Semantic use: green for payoffs and ITM nodes, red for losses and knocked nodes, amber for barrier products and notices (see [[Payoff Diagrams]]).

## Typography

Body: Plus Jakarta Sans. Numbers and terminal chrome: JetBrains Mono with `font-variant-numeric: tabular-nums` via `.font-terminal` and `.num`. Loaded from Google Fonts in `index.html`.

## Atmosphere and motion

- `GlobalAtmosphere` (line 1985): two fixed radial gradients, coral from the top-left and amber from the top-right, over the flat background. The old `MatrixCanvas` rain (line 1938) survives in code but is unused chrome from the neon era.
- Keyframes: `fade-in-up` scene entrances (`.scene-enter`), `node-pop` for market path nodes, a blinking terminal cursor.
- Several legacy effect hooks (`.top-glow-line`, `.pulse-dot`, `.opening-curtain`, shine sweeps) are intentionally set to `display: none` or `content: none`, neutered rather than deleted.
- Focus glow: `:focus-visible` gets a 2px coral outline; `::selection` uses `--accent-weak`.
- `prefers-reduced-motion: reduce` collapses all animation durations to near zero.

Component usage of these tokens is mapped in [[Component Map]].

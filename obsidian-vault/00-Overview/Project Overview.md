---
tags: [overview, project]
---

What the trader-simulator project is: a gamified four-day options-teaching simulator for an HKBU derivatives course.

# Project Overview

Central Trader is a single-page game where the player joins a Hong Kong "Central" options trading desk as a rookie and learns derivatives by working four in-game days. It started as an HKBU Fin 7870 group assignment and now doubles as the playable booth for the [[Investfair Assignment]] video.

Live build: https://zeref007.github.io/trader-simulator/ (see [[Deployment]]).

## The four-day arc

| Day | Theme | Client | Core skill |
|---|---|---|---|
| 1 | [[Day 1 Vanilla Basics]] | Ms. Li (retail) | Match product to client view, disclose risk |
| 2 | [[Day 2 Binomial Pricing]] | Mr. Wang | Source inputs, price with a [[CRR Binomial Model]] tree, quote |
| 3 | [[Day 3 Barrier Options]] | Ms. Chen | Path dependence, knock-out, barrier discount |
| 4 | [[Day 4 Graduation Round]] | Mr. Zhang, Ms. Li, Mr. He | Judge, price, and quote three products solo |

Each day follows the same beat: mentor lessons, handbook update, client arrival, a decision task (product choice, quote, disclosure), a market run on a fixed path (see [[Market Paths]]), then a graded report (see [[Scoring System]]).

## Key history

- Day 4 was originally a CBBC (Callable Bull/Bear Contract) chapter. It was cut on 2026-06-01 and reworked into the three-client live round; the CBBC code survives in the file with `_ARCHIVED` suffixes (see HANDOFF-day4-live-round.md in the repo root).
- The whole app was translated from Chinese to English, then restyled several times (see [[UI Evolution]]).
- Theoretical prices were once hard-coded and inconsistent across days (150 vs 186); they are now computed live by the pricing engine at module load (see [[Theoretical Price Anchors]]).

## Tech in one line

React 19 + Vite 7 single-file app (`src/Day1TraderSimulator.jsx`, about 9225 lines), Tailwind via CDN, optional Supabase backend. Details in [[Tech Stack]] and [[Architecture]].

## Companion docs in the repo root

- `CLAUDE.md`, architecture constraints, anchors, scoring bands, paths
- `HANDOFF.md`, `HANDOFF-backend.md`, `HANDOFF-day4-live-round.md`, `HANDOFF-calculator-and-day3-dashboard.md`, session handoffs
- `REVIEW-AND-CHANGES.md`, the financial-accuracy review checklist
- `DEPLOY.md`, hosting guide
- `video-project/script-plan.md`, the video [[Script]] plan

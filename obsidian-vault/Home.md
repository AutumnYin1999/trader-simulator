---
tags: [moc, home]
---

Map of content for the trader-simulator knowledge vault. Start here.

# Central Trader, Knowledge Vault

A four-day options-teaching game built as a React + Vite single-file app. Play it live at https://zeref007.github.io/trader-simulator/. This vault documents the game design, the pricing math, the frontend, the backend, deployment, and the Investfair video project built on top of it.

## 00 Overview

- [[Project Overview]], what the project is and why it exists
- [[Architecture]], the single-file constraint and the render flow
- [[Tech Stack]], React, Vite, Tailwind CDN, Supabase

## 01 Game Design

- [[Game Flow]], the stage state machine across all four days
- [[Day 1 Vanilla Basics]], calls, puts, premium, suitability
- [[Day 2 Binomial Pricing]], CRR trees and the quote slider
- [[Day 3 Barrier Options]], knock-out logic and the crash path
- [[Day 4 Graduation Round]], three clients, blind quotes, scorecard
- [[Clients]], every client with parameters and anchors
- [[Scoring System]], quote bands and grade logic
- [[Market Paths]], the fixed teaching paths

## 02 Pricing Engine

- [[CRR Binomial Model]], the math that everything anchors on
- [[buildVanillaBinomialToolTree]], the vanilla pricer
- [[buildBarrierBinomialToolTree]], the knock-out pricer
- [[Theoretical Price Anchors]], the verified numbers
- [[Payoff Diagrams]], the small SVG payoff sketches

## 03 Frontend

- [[Theme System]], CSS variables and the coral dark theme
- [[Component Map]], every component with line numbers
- [[UI Evolution]], five visual eras and why each changed

## 04 Backend

- [[Supabase Integration]], auth gate and graceful fallback
- [[Database Schema]], profiles and progress tables with RLS
- [[Progress Persistence]], localStorage plus cloud dual-write

## 05 Deploy

- [[Deployment]], GitHub Pages, Vercel, and the legacy VM script
- [[Repos and Branches]], origin, fork, branches, PR history

## 06 Video Project

- [[Investfair Assignment]], the HKBU brief and rubric
- [[Video Pipeline]], narration manifest to TTS to Remotion
- [[Script]], where the video script lives

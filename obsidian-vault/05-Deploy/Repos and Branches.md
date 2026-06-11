---
tags: [deploy, git, repos, branches]
---

Where the code lives: the AutumnYin1999 origin, the ZEREF007 fork that hosts the live site, and the branch/PR history.

# Repos and Branches

## Remotes

- `origin`: https://github.com/AutumnYin1999/trader-simulator.git, the canonical repo (the teammate's account; the original handoffs were written on their Windows machine)
- Fork: ZEREF007/trader-simulator, which hosts the GitHub Pages build at https://zeref007.github.io/trader-simulator/ (see [[Deployment]])

The local checkout in this workspace tracks `origin` and works on `main`.

## Branches

| Branch | Purpose |
|---|---|
| `main` | Trunk; every deploy builds from here |
| `translate` | Chinese-to-English translation work (commit 73d8355 and copy cleanup 29f7431) |
| `feature/game-logic-fixes` | Financial-accuracy fixes from REVIEW-AND-CHANGES.md, merged as PR #1 |
| `feature/ui-redesign` | The light/indigo/coral restyles, merged as PR #3 (see [[UI Evolution]]) |
| `feature/backend-auth` | Supabase auth and cloud progress, merged as PR #4 (see [[Supabase Integration]]) |

## Notable history on main (oldest to newest)

1. c24f5c6 initial trader simulator demo, then Day 3 barrier lesson (ac91d69) and lesson expansion (d1624fc)
2. Server auto-deploy script (11cb8ac, the `ops/` folder in [[Deployment]])
3. Day 2 experience rework, merged calculators, Day 3 data desk (e35c1f1), Day 3 blind quoting and barrier recalibration (ffa33ae)
4. Day 4 rework: CBBC cut, three-client live round (b3d979f), client 3 sourcing cards (1fd1bef), entry point restored to Day 1 (ad677ee), see [[Day 4 Graduation Round]]
5. Full game logic audit and engine-driven theoreticals (7b64508, b815236), see [[Theoretical Price Anchors]]
6. Translation (73d8355), institutional theme (90cd7ec), dashboard and persistence (3c0e65e), a11y (672d379)
7. PR #3 ui-redesign and PR #4 backend-auth merges (5f74990, 257898f), Vercel config (127f01d), GH Pages base path (a314a49)
8. Coral theme era and UX pinning (3f74d80 through ac74c31), see [[UI Evolution]]

## Conventions

Commit style is loosely conventional (`feat(ui):`, `fix(ui):`, `chore(deploy):`). The repo also carries the session handoff docs listed in [[Project Overview]]; read them before large changes.

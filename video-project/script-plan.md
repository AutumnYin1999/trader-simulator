# Digital Investfair Video: Script Plan
**Product: Hang Seng Index Options (HKEX) + OTC Barrier Options**
**Format: KOL / YouTuber explainer with host cutout, driven by a live walkthrough of our own simulator (Central Trader)**
**Length: 12:00 total, delivered as 5 clips (each usable standalone)**
**Deadline: 26 June 2026 · wongcy@hkbu.edu.hk**

---

## Why this wins the rubric

| Rubric | How we hit it |
|---|---|
| Content: History | HSI futures (1986) and HSI options (1993) on HKEX; 1997 Asian Financial Crisis as the narrative frame; growth of HK structured products after 2002 |
| Content: Relevance | HSI options are Asia's flagship index derivatives; barrier options dominate HK retail structured products |
| Content: Market Data | HKEX derivatives ADV, HSI option open interest, contract specs (HK$50 per point, expiry cycle), vol levels used in the game (16-32%) |
| Content: Details | Contract mechanics, premium, strike, expiry, exercise style, knock-out level |
| Presentation: Innovation | The booth IS a playable web game (live URL), and the video is a KOL-style walkthrough of it |
| Presentation: Design/Flow | One continuous story (rookie trader's first week), 5 chapter clips, captions, payoff graphics |
| Application: Theory | CRR binomial pricing (u, d, p, discounting), payoff functions, knock-out logic, quote-vs-theoretical bands |
| Application: Case study | Three client cases from Day 4 (Mr. Zhang vanilla, Ms. Li barrier, Mr. He barrier) with real numbers |
| Application: Correctness | All prices verified in the engine: 186 / 1112 / 934 / 297 / 981 / 1184 |

**The one-line pitch:** "Don't just read about options. Walk the desk." Classmates (investors) can play the booth themselves at https://zeref007.github.io/trader-simulator/

---

## Host and voice (constraint + plan)

We cannot clone the Wolf of Wall Street actor's voice or use his likeness (real person, no consent). Instead:

- **Host persona: "Jordan Bull"**, an original high-energy 1990s Hong Kong broker character. Same genre energy (fast, cocky, motivational), zero impersonation.
- **Voice**: energetic TTS (edge-tts `en-US-ChristopherNeural` or `en-US-GuyNeural`; upgrade to an ElevenLabs stock voice if a key is provided). Short punchy sentences, sales cadence.
- **Cutout frame (YouTuber style)**: pick one
  - A. A groupmate records 8-10 short phone clips (reactions, pointing, "stay with me" beats); we chroma/crop into a corner PiP. Best for marks (real presenter).
  - B. Original cartoon broker avatar (suspenders, slick hair) as an animated corner cutout with mouth/bounce animation synced to audio. Fully automated.
- Jump cuts every 6-10 s, zoom punches on key numbers, caption highlights (word-level).

---

## Clip structure (12:00)

### Clip 1 · "Hong Kong, 1997" (0:00-2:00) - The Hook
- Cold open: archival-style title cards, ticker sounds. "October 1997. The Hang Seng loses a quarter of its value in four days."
- Host intro (cutout): "I'm Jordan Bull. I sell the only thing that makes money when everything's on fire: options."
- Product reveal: **HSI Options, listed on HKEX since 1993** (history beat #1); HSI futures since 1986.
- Stakes: "By the end of this video you'll price one yourself, to the point."
- Visual: game title screen -> login -> dashboard (innovation flex: our booth is a real product).

### Clip 2 · "The Ticket" (2:00-4:30) - Product 101 (Day 1 walkthrough)
- What is a call / put. Movie-ticket premium analogy (from the game's own lesson).
- Payoff diagrams on screen (the game's product cards): call hockey stick, put, index line.
- Client case #0: Mr. Wang, bullish, limited downside -> pick vanilla call, risk disclosure beat ("premium can go to zero").
- Market data beat: contract specs (HK$50 x index point, monthly expiries, European exercise), HKEX derivatives volume one-liner.
- Day 1 market run: price path to 22,400, call finishes ITM. "Direction right is not enough; you must out-earn the premium."

### Clip 3 · "The Price Is Built, Not Guessed" (4:30-7:30) - Theory core (Day 2)
- The CRR binomial tree on screen (the game's tree visual).
- Beats: up factor u = e^(sigma sqrt(dt)), d = 1/u, risk-neutral p = (e^(r dt) - d)/(u - d), discount e^(-r dt). Read them like a sales pitch, not a lecture.
- Backward induction animated through the game's tree: payoffs at expiry -> fold back -> **186 points** theoretical.
- Quote game: slider, fair band (+4 to +34), client fill at the desk. "Quote too fat, he walks. Too thin, you eat the risk."
- This clip carries the Application marks. Keep every formula on screen at least 4 s with captions.

### Clip 4 · "Cheaper, With a Tripwire" (7:30-10:00) - Exotics (Day 3)
- Ms. Chen wants protection but cheaper: enter the **knock-out barrier option** (OTC structured product; HK is one of the world's largest retail structured product markets - relevance beat).
- Same option vanilla = 1112 vs barrier = **934** (N=4 tree, barrier 21,000). Why cheaper: you sell back the crash scenarios.
- Drama beat: the game's fixed path dips to 20,950 -> KNOCKED OUT -> market rallies to 22,400 anyway. "She saved 178 points of premium and lost the whole position. That's the trade-off, on screen."
- Correctness beat: knock-out check is touch-or-cross at discrete fixings in our model.

### Clip 5 · "Graduation Day" (10:00-12:00) - Case studies + CTA
- Day 4 montage: three blind quotes.
  - Mr. Zhang: vanilla, S0 24,000 / K 24,500, sigma 18% -> **297**
  - Ms. Li: barrier 23,000, sigma 28% -> **981**
  - Mr. He: barrier 23,500, sigma 32% -> **1184**
- Scorecard reveal (A grade), progress dashboard, account sync ("your progress saves to the cloud").
- CTA: "Our booth is live. Scan the QR, make your first quote before the next class." QR + URL on screen.
- Risk disclaimer card + team credits (names/IDs) + data sources.

---

## Production pipeline (from the reference skills, proven)

1. `narration-manifest.json` = single source of truth (scene id, narration text, visual spec).
2. TTS: edge-tts -> per-scene MP3 + caption timestamps.
3. Browser scenes: voice-led Playwright recording of the live game (actions gated on audio time; auto re-syncs when script changes).
4. Animation scenes (intro cards, payoff zooms, QR outro): Remotion components.
5. Remotion composition assembles everything + word-highlight subtitles + host cutout track.
6. Render MP4 1920x1080; ffmpeg for any conversions.
- Optional: ViMax (HKUDS) to generate a 15 s cinematic 1997 intro if Gemini/Veo keys are provided; otherwise stylized Remotion title cards (zero keys needed).

## Group roles (5-8 people)
- 2x research (history + market data, sources slide)
- 1x script polish / narration QA
- 1x on-camera cutout host (or approve avatar route)
- 1x booth demo owner (game walkthrough QA, account demo)
- 1-2x editing/captions QA (we generate; they review)
- 1x deck + digital flyer + QR banner (supplement materials)

## Next steps (in order)
1. You approve/adjust this plan (esp. host route A vs B).
2. I verify market-data facts (HKEX specs, volumes) with sources.
3. I write the full narration manifest (every sentence, timed, ~1,500 words for 12 min).
4. Scaffold the video project from the reference skill, generate voiceover, preview narration-only.
5. Record game scenes against the live site, assemble, render v1 for review.

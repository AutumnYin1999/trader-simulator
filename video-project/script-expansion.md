# Script Expansion -> target 11:00-12:00
New scenes are ALL animation cards (no game re-recording needed for these).
Existing 37 game recordings stay valid. Current narration 6:40; this adds ~4:30 of new narration plus generous dwell to land 11:00-12:00.
Prefix new scene ids so they sort/insert cleanly. Voice: Andrew, energetic, per-scene prosody.

## OPENING BLOCK (before C1-1) ~70s

| id | type | visual | narration | rate |
|---|---|---|---|---|
| O-1 | animation TitleCard | "Central Trader" logo sting on dark, coral glow | Welcome to our Digital Investfair booth. | +4% |
| O-2 | animation TitleCard | "Digital Investfair · FIN 7870" | Today we are walking you through one derivatives product, end to end. | +5% |
| O-3 | animation ModuleOverview | Agenda list: 1 The Crash, 2 The Ticket, 3 The Price, 4 The Tripwire, 5 Graduation | Here is the plan. Five chapters. From a 1997 market crash, to pricing an option yourself, to advising three live clients. | +6% |
| O-4 | animation TitleCard | "The product: Hang Seng Index Options" subtitle "HKEX, since 1993" | Our product: the Hang Seng Index Option. Asia's flagship equity index derivative. | +5% |
| O-5 | animation StatCard | Big stat: "HK$50 per point" + "European · Cash-settled" | One contract. Fifty Hong Kong dollars a point. Cash settled, exercised only at expiry. Keep that in your pocket, we will use it. | +4% |
| O-6 | animation AnimatedText | "And we did not just make slides. We built a desk you can play." + avatar feature | And we did not just make slides. We built a trading desk you can actually play. Let me introduce your guide. | +8% |

## CHAPTER TITLE CARDS (one before each clip) ~5s each

| id | type | visual | narration | rate |
|---|---|---|---|---|
| T-1 | animation TitleCard | "Chapter 1 / Hong Kong, 1997" | Chapter one. The crash that built this market. | +3% |
| T-2 | animation TitleCard | "Chapter 2 / The Ticket" | Chapter two. What you are actually buying. | +3% |
| T-3 | animation TitleCard | "Chapter 3 / The Price Is Built, Not Guessed" | Chapter three. Where the price comes from. | +3% |
| T-4 | animation TitleCard | "Chapter 4 / Cheaper, With a Tripwire" | Chapter four. The exotic that cuts your premium. | +3% |
| T-5 | animation TitleCard | "Chapter 5 / Graduation Day" | Chapter five. Three clients. No hints. | +3% |

## HISTORY / MARKET-DATA DEPTH (insert into Clip 1, after C1-3) ~55s

| id | type | visual | narration | rate |
|---|---|---|---|---|
| H-1 | animation StatCard | "Oct 23, 1997" big + "HSI single-day drop" | On October twenty-third alone, the Hang Seng fell more than ten percent in a day. | -3% |
| H-2 | animation AnimatedText | "Defend the peg" + "HK$ rate spike to 280%" | To defend the dollar peg, Hong Kong let overnight rates explode. Borrowing money for one night cost two hundred and eighty percent. | +2% |
| H-3 | animation StatCard | "Aug 1998 · HKMA buys HK$120B" | A year later the government spent one hundred and twenty billion dollars buying stocks to break the speculators. It worked, and it later booked a profit. | +2% |
| H-4 | animation AnimatedText | "Why options? Volatility is the product." | In markets like that, direction is a coin flip. But volatility, fear itself, becomes the product. That is what an option sells. | +5% |

## RECAP TRANSITIONS (end of each clip) ~8s each

| id | type | visual | narration | rate |
|---|---|---|---|---|
| R-1 | animation AnimatedText | "So far: Call = bullish, loss capped at premium" | So far: a call is a bullish bet where your loss is capped at the premium. Simple. Now, how much should that premium be? | +5% |
| R-2 | animation AnimatedText | "So far: price = build the tree, fold it back" | So a fair price is not a guess. You build every future, then fold them back to today. Next: making it cheaper. | +5% |
| R-3 | animation AnimatedText | "So far: barrier = discount + knock-out risk" | A barrier trades a discount for a tripwire. That is the whole exotic in one sentence. Now, graduation. | +5% |

## CLOSING / RECAP / THANKS (after C5-9, before disclaimer) ~70s

| id | type | visual | narration | rate |
|---|---|---|---|---|
| Z-1 | animation ModuleOverview | Recap: 5 takeaways (call/put, premium, CRR price, barrier knock-out, suitability) | Let us bring it home. Five things you now know. Calls and puts. Why you pay a premium. How a binomial tree builds the price. What a knock-out barrier really costs. And why suitability comes first. | +3% |
| Z-2 | animation StatCard | "186 / 934 / 1184" the prices we built | And you did not just hear it, you watched us price every one of these, to the point. | +4% |
| Z-3 | animation AnimatedText | "Thank you, Professor Martin" warm card | A special thank you to Professor Martin, whose teaching is the inspiration behind this entire project, mentor and all. | -2% |
| Z-4 | animation AnimatedText | "Our booth is open" + URL | Our booth is open right now. The whole desk runs in your browser. | +6% |

## NOTES
- No team-member credits per user. Keep the Professor Martin thank-you (Z-3), the standout requested line.
- Avatar feature beats stay: C1-4, C1-5, C3-2, C4-2, C4-10, C5-8, plus O-6 and Z-3.
- Insertion order: O-1..O-6, T-1, C1-1..C1-3, H-1..H-4, C1-4..C1-10, R-1, T-2, C2-*, T-3, C3-*, R-2, T-4, C4-*, R-3, T-5, C5-1..C5-9, Z-1..Z-4, C5-10 (disclaimer), C5-11 (logo).
- Estimated new narration ~4:20; with chapter-card dwell and existing 6:40 -> ~11:00-11:45. Tune dwell to land >= 11:00.

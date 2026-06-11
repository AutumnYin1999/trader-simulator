---
tags: [video, script]
---
Full production narration script for the 12-minute Investfair video. One row = one scene = one screen state. Pipeline details: [[Video Pipeline]]. Assignment: [[Investfair Assignment]].

# Central Trader · Investfair Video, Full Narration Script
Host: "Jordan Bull" (original 90s broker persona, fast and punchy). Voice: edge-tts energetic male.
Target 12:00 at ~140 wpm. Each scene = one screen state (one sentence, one visual).
Sources: HKEX HSI Options contract page (specs, March 1993 launch); 1997 crisis figures per Wikipedia (Oct 20-23 1997 HSI -23%; overnight rate 8% to 23%, briefly 280%; HKMA HK$120B intervention Aug 1998, ~HK$30B profit via Tracker Fund). Game numbers verified in the pricing engine.

---

## CLIP 1 · "Hong Kong, 1997" (0:00-2:00) ~270 words

| id | visual | narration |
|---|---|---|
| C1-1 | Black screen, ticker tape sound, red numbers raining | October, nineteen ninety-seven. |
| C1-2 | Title card: HSI 13,601 with red arrow | In four trading days, the Hang Seng Index loses twenty-three percent of its value. |
| C1-3 | Title card: "Overnight rate: 8% -> 23% -> 280%" | Overnight interest rates jump from eight percent to twenty-three. At one point, two hundred and eighty. |
| C1-4 | Avatar cutout pops in, corner frame | And while everyone else is panicking, somebody on that trading floor is making money. Hi. I'm Jordan Bull. |
| C1-5 | Avatar full-frame, leans in | I'm going to show you the only product that turns panic into a paycheck. Options. |
| C1-6 | HKEX logo card + "HSI Options, since March 1993" | This is the Hang Seng Index Option. Listed on the Hong Kong exchange since March, nineteen ninety-three. The flagship index derivative of Asia. |
| C1-7 | Spec card: HK$50/point, European, cash-settled | Every point of the index is worth fifty Hong Kong dollars. European exercise. Cash settled. No shares change hands, just money. |
| C1-8 | Game title screen: "Central Trader" | But I'm not going to lecture you. I'm going to let you live it. We built a trading desk you can play. |
| C1-9 | Login -> dashboard, account appears | Real accounts. Real progress tracking. Four days from rookie to closer. |
| C1-10 | Dashboard 4 day cards, zoom on Day 1 | Day one starts now. Let's sell something. |

## CLIP 2 · "The Ticket" (2:00-4:30) ~345 words

| id | visual | narration |
|---|---|---|
| C2-1 | Day 1 lesson, mentor Martin card | Meet Martin. Twenty years on the desk. His first rule: read the client before you touch the product. |
| C2-2 | Call/put lesson cards | Two basic moves. A call is the right to buy at a fixed price. A put is the right to sell. |
| C2-3 | Premium lesson, movie ticket line highlighted | Neither right is free. You pay a premium. Think of a movie ticket. Buy it, you're in. Movie's terrible? No refunds. |
| C2-4 | Payoff diagram, call hockey stick | Here's the call's payoff. Flat, flat, flat, then up. Below the strike you lose only the ticket price. Above it, you participate. |
| C2-5 | Payoff diagram, put | The put is the mirror. It pays when the market falls. Insurance, basically. |
| C2-6 | Client card: Ms. Li | First client. Miz Li. She's bullish on the index, but she cannot stomach a big loss. |
| C2-7 | Product selection desk, 4 cards | Four shelves. Vanilla call. Vanilla put. Buy the index outright. And a locked barrier product, we'll earn that one later. |
| C2-8 | Select vanilla call, Selected badge | Bullish view plus capped downside equals vanilla call. Click. |
| C2-9 | Risk disclosure checklist | Before he signs, disclosure. If the option expires worthless, the entire premium is gone. We say it out loud. Compliance is not decoration. |
| C2-10 | Market run, path ticks up to 22,400 | Now the market runs. Twenty-one five. Twenty-two one. Twenty-two four at expiry. The call lands in the money. |
| C2-11 | Report card, client P&L | But look at the net line. Payoff minus premium. Direction right is not enough, you have to out-earn the ticket price. Remember that number. |
| C2-12 | Spec card overlay: HK$50 multiplier math | And in the real contract, every point is fifty Hong Kong dollars. Four hundred points of payoff is twenty thousand dollars. Per contract. |

## CLIP 3 · "The Price Is Built, Not Guessed" (4:30-7:30) ~415 words

| id | visual | narration |
|---|---|---|
| C3-1 | Day 2 intro, pricing desk | Day two. New client, Mister Wang. And today he wants a price. Not a feeling. A number. |
| C3-2 | Avatar cutout | Here's the secret nobody tells retail: an option price is not guessed. It is built. Branch by branch. |
| C3-3 | Tree lesson: Today 21,500 node | Start at today. Index at twenty-one thousand five hundred. |
| C3-4 | Up/down nodes appear | One step ahead, two futures. Up two point six five percent, or down two point five eight. That spread comes from volatility, sixteen percent a year. |
| C3-5 | Formula card: u and d | The up factor is e to the sigma root delta-t. The down factor is just one over it. |
| C3-6 | Formula card: p | And the chance of going up, the risk-neutral probability, is e to the r delta-t minus d, over u minus d. That's the whole machine. |
| C3-7 | Full 3-step tree | Three steps to expiry. Eight paths. Four final prices, from nineteen nine to twenty-three two. |
| C3-8 | Expiry payoffs highlighted | At expiry the payoff is simple. Final price minus strike of twenty-two thousand, or zero. Whichever is bigger. |
| C3-9 | Backward induction animation | Then we walk backwards. Each node is the discounted, probability-weighted average of its two children. Fold the future into the present. |
| C3-10 | Root node: 186 | And the tree hands us the answer. One hundred eighty-six points. That is the theoretical price of this call. |
| C3-11 | Quote slider, fair band | Now the sales part. Theory says one eighty-six. The desk needs margin. Quote between plus four and plus thirty-four over theoretical and the client fills. |
| C3-12 | Quote too high, client pushes back | Quote fat and he walks to the bank across the street. Quote thin and you ate the risk for free. |
| C3-13 | Fill confirmation | Two hundred ten. Filled. That spread between one eighty-six and two ten? That's the desk's lunch. |
| C3-14 | Day 2 market run + report | Market drifts to twenty-two one. Small payoff, smaller than the premium. The client learns. So do you. |

## CLIP 4 · "Cheaper, With a Tripwire" (7:30-10:00) ~345 words

| id | visual | narration |
|---|---|---|
| C4-1 | Day 3, client card Ms. Chen | Day three. Miz Chen. Sharp. She wants the same upside protection, but she calls our vanilla price expensive. |
| C4-2 | Avatar cutout, grin | So we go off the shelf. Over the counter. Welcome to structured products, Hong Kong's favorite aisle. |
| C4-3 | Barrier concept card | This is a knock-out barrier option. Same call, same strike, one extra clause. If the index ever touches twenty-one thousand, the contract dies. Instantly. |
| C4-4 | Side-by-side: vanilla 1112 vs barrier 934 | Price the vanilla on a four-step tree: one thousand one hundred twelve points. Price the barrier: nine hundred thirty-four. |
| C4-5 | Zoom on the difference | Same view, one hundred seventy-eight points cheaper. Why? Because she sold back the crash scenarios. The paths that touch the barrier pay nothing, so she doesn't pay for them. |
| C4-6 | Quote bands relative | Our quote band scales the same way. Fair up to about one point one eight times theoretical. Reject above one point four. |
| C4-7 | Market run starts, dips | Now watch the market. Up to twenty-one eight. Then down. Twenty-one four. Twenty thousand nine fifty. |
| C4-8 | KNOCKED OUT banner | Touch. Twenty-one thousand breached. Knocked out. Position terminated. |
| C4-9 | Path recovers to 22,400 | And then, of course, the market rallies to twenty-two four. She watches the move she predicted happen, with no position. |
| C4-10 | Avatar cutout, serious beat | That is the barrier trade-off in one chart. The discount is real, and so is the tripwire. A good desk sells both sentences. |
| C4-11 | Disclosure card | In our model the knock-out checks at discrete fixings. In the real OTC market, the term sheet defines exactly when the barrier observes. Read it. |

## CLIP 5 · "Graduation Day" (10:00-12:00) ~275 words

| id | visual | narration |
|---|---|---|
| C5-1 | Day 4 briefing | Day four. Martin steps back. Three clients, live quotes, no hints. |
| C5-2 | Client 1: Mr. Zhang card | Mister Zhang. Vanilla call, index at twenty-four thousand, strike twenty-four five, vol eighteen. The tree says two ninety-seven. |
| C5-3 | Quote + fill | Quote inside the band. Filled. |
| C5-4 | Client 2: Ms. Li card | Miz Li. Barrier at twenty-three thousand, vol twenty-eight. Nine eighty-one. |
| C5-5 | Client 3: Mr. He card | Mister He. Deeper barrier, vol thirty-two. Eleven eighty-four. Three products, three risk profiles, one machine. |
| C5-6 | Scorecard, grade A | The desk grades every quote. Suitability, pricing, disclosure. That's the whole job in three columns. |
| C5-7 | Progress dashboard, cloud sync | And everything you just watched is saved to your account. Four days, tracked. |
| C5-8 | Avatar cutout, final pitch | So here's my pitch. Don't just read about derivatives. Walk the desk. Price the tree. Get knocked out once, it's educational. |
| C5-9 | QR code + URL card | Our booth is live right now. Scan, sign up, and make your first quote before the next lecture. |
| C5-10 | Disclaimer + credits card | Educational simulator, not investment advice. Options involve risk, premiums can go to zero. Data: HKEX contract specifications. Built by our group, FIN 7870. |
| C5-11 | Logo sting | Central Trader. See you on the desk. |

---

## Edit notes
- Jump cut every scene boundary; zoom punch on every number reveal (186, 934, 1112, 297, 981, 1184).
- Word-highlight captions throughout (accessibility + rubric Readability).
- Avatar cutout: corner PiP except C1-5, C3-2, C4-2, C4-10, C5-8 (full/half frame beats).
- Music: synthwave/tape-deck bed, duck under narration; ticker SFX in C1; "knock" SFX at C4-8.
- On-screen formula cards stay >= 4 s (C3-5, C3-6).
- QR in C5-9 links to https://zeref007.github.io/trader-simulator/

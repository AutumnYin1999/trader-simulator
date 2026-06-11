#!/usr/bin/env python3
"""One-shot: insert the script-expansion animation scenes into the manifest
in the exact insertion order, with scene-group assignment for clip cutting.
Idempotent: strips any previously-inserted expansion ids before re-inserting."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MAN = ROOT / "narration-manifest.json"

# New entries keyed by id. All animation scenes. Narration text / rate / pitch
# taken verbatim from script-expansion.md. No em/en-dashes anywhere.
NEW = {
    # ---- OPENING BLOCK (before C1-1) ----
    "O-1": {
        "scene": "clip1-hook", "rate": "+4%",
        "text": "Welcome to our Digital Investfair booth.",
        "visual": {"component": "TitleCard", "enter": "fade-in",
                   "props": {"title": "Central Trader", "subtitle": "Digital Investfair"},
                   "emphasis": ["Central"]},
    },
    "O-2": {
        "scene": "clip1-hook", "rate": "+5%",
        "text": "Today we are walking you through one derivatives product, end to end.",
        "visual": {"component": "TitleCard", "enter": "fade-in",
                   "props": {"title": "Digital Investfair", "subtitle": "FIN 7870"}},
    },
    "O-3": {
        "scene": "clip1-hook", "rate": "+6%",
        "text": "Here is the plan. Five chapters. From a nineteen ninety-seven market crash, to pricing an option yourself, to advising three live clients.",
        "visual": {"component": "ModuleOverview", "props": {"items": [
            {"title": "1 The Crash", "desc": "Hong Kong, 1997"},
            {"title": "2 The Ticket", "desc": "what you are buying"},
            {"title": "3 The Price", "desc": "built, not guessed"},
            {"title": "4 The Tripwire", "desc": "the barrier exotic"},
            {"title": "5 Graduation", "desc": "three live clients"},
        ]}},
    },
    "O-4": {
        "scene": "clip1-hook", "rate": "+5%",
        "text": "Our product: the Hang Seng Index Option. Asia's flagship equity index derivative.",
        "visual": {"component": "TitleCard", "enter": "fade-in",
                   "props": {"title": "Hang Seng Index Options", "subtitle": "HKEX, since 1993"},
                   "emphasis": ["Hang", "Seng"]},
    },
    "O-5": {
        "scene": "clip1-hook", "rate": "+4%",
        "text": "One contract. Fifty Hong Kong dollars a point. Cash settled, exercised only at expiry. Keep that in your pocket, we will use it.",
        "visual": {"component": "StatCard",
                   "props": {"value": "HK$50 per point", "label": "European - Cash-settled"}},
    },
    "O-6": {
        "scene": "clip1-hook", "rate": "+8%",
        "text": "And we did not just make slides. We built a trading desk you can actually play. Let me introduce your guide.",
        "visual": {"component": "AnimatedText",
                   "props": {"text": "We built a desk you can play."},
                   "emphasis": ["desk"]},
    },

    # ---- CHAPTER TITLE CARDS ----
    "T-1": {
        "scene": "clip1-hook", "rate": "+3%",
        "text": "Chapter one. The crash that built this market.",
        "visual": {"component": "TitleCard", "enter": "pop-in",
                   "props": {"title": "Chapter 1", "subtitle": "Hong Kong, 1997"},
                   "emphasis": ["1"]},
    },
    "T-2": {
        "scene": "clip2-ticket", "rate": "+3%",
        "text": "Chapter two. What you are actually buying.",
        "visual": {"component": "TitleCard", "enter": "pop-in",
                   "props": {"title": "Chapter 2", "subtitle": "The Ticket"},
                   "emphasis": ["2"]},
    },
    "T-3": {
        "scene": "clip3-pricing", "rate": "+3%",
        "text": "Chapter three. Where the price comes from.",
        "visual": {"component": "TitleCard", "enter": "pop-in",
                   "props": {"title": "Chapter 3", "subtitle": "The Price Is Built, Not Guessed"},
                   "emphasis": ["3"]},
    },
    "T-4": {
        "scene": "clip4-barrier", "rate": "+3%",
        "text": "Chapter four. The exotic that cuts your premium.",
        "visual": {"component": "TitleCard", "enter": "pop-in",
                   "props": {"title": "Chapter 4", "subtitle": "Cheaper, With a Tripwire"},
                   "emphasis": ["4"]},
    },
    "T-5": {
        "scene": "clip5-graduation", "rate": "+3%",
        "text": "Chapter five. Three clients. No hints.",
        "visual": {"component": "TitleCard", "enter": "pop-in",
                   "props": {"title": "Chapter 5", "subtitle": "Graduation Day"},
                   "emphasis": ["5"]},
    },

    # ---- HISTORY / MARKET-DATA DEPTH (inside Clip 1, after C1-3) ----
    "H-1": {
        "scene": "clip1-hook", "rate": "-3%",
        "text": "On October twenty-third alone, the Hang Seng fell more than ten percent in a day.",
        "visual": {"component": "StatCard",
                   "props": {"value": "Oct 23, 1997", "label": "HSI single-day drop over 10%"}},
    },
    "H-2": {
        "scene": "clip1-hook", "rate": "+2%",
        "text": "To defend the dollar peg, Hong Kong let overnight rates explode. Borrowing money for one night cost two hundred and eighty percent.",
        "visual": {"component": "AnimatedText",
                   "props": {"text": "Defend the peg: rates spike to 280%."},
                   "emphasis": ["280%"]},
    },
    "H-3": {
        "scene": "clip1-hook", "rate": "+2%",
        "text": "A year later the government spent one hundred and twenty billion dollars buying stocks to break the speculators. It worked, and it later booked a profit.",
        "visual": {"component": "StatCard",
                   "props": {"value": "HK$120B", "label": "Aug 1998 - HKMA buys the market"}},
    },
    "H-4": {
        "scene": "clip1-hook", "rate": "+5%",
        "text": "In markets like that, direction is a coin flip. But volatility, fear itself, becomes the product. That is what an option sells.",
        "visual": {"component": "AnimatedText",
                   "props": {"text": "Why options? Volatility is the product."},
                   "emphasis": ["Volatility"]},
    },

    # ---- RECAP TRANSITIONS ----
    "R-1": {
        "scene": "clip1-hook", "rate": "+5%",
        "text": "So far: a call is a bullish bet where your loss is capped at the premium. Simple. Now, how much should that premium be?",
        "visual": {"component": "AnimatedText",
                   "props": {"text": "Call = bullish, loss capped at premium."},
                   "emphasis": ["Call"]},
    },
    "R-2": {
        "scene": "clip3-pricing", "rate": "+5%",
        "text": "So a fair price is not a guess. You build every future, then fold them back to today. Next: making it cheaper.",
        "visual": {"component": "AnimatedText",
                   "props": {"text": "Price = build the tree, fold it back."},
                   "emphasis": ["fold"]},
    },
    "R-3": {
        "scene": "clip4-barrier", "rate": "+5%",
        "text": "A barrier trades a discount for a tripwire. That is the whole exotic in one sentence. Now, graduation.",
        "visual": {"component": "AnimatedText",
                   "props": {"text": "Barrier = discount plus knock-out risk."},
                   "emphasis": ["Barrier"]},
    },

    # ---- CLOSING / RECAP / THANKS (after C5-9, before disclaimer C5-10) ----
    "Z-1": {
        "scene": "clip5-graduation", "rate": "+3%",
        "text": "Let us bring it home. Five things you now know. Calls and puts. Why you pay a premium. How a binomial tree builds the price. What a knock-out barrier really costs. And why suitability comes first.",
        "visual": {"component": "ModuleOverview", "props": {"items": [
            {"title": "Calls and puts", "desc": "the two basic bets"},
            {"title": "The premium", "desc": "why you pay up front"},
            {"title": "The tree", "desc": "a binomial price"},
            {"title": "The barrier", "desc": "what a knock-out costs"},
            {"title": "Suitability", "desc": "the client comes first"},
        ]}},
    },
    "Z-2": {
        "scene": "clip5-graduation", "rate": "+4%",
        "text": "And you did not just hear it, you watched us price every one of these, to the point.",
        "visual": {"component": "StatCard",
                   "props": {"value": "186 / 934 / 1184", "label": "the prices we built, to the point"}},
    },
    "Z-3": {
        "scene": "clip5-graduation", "rate": "-2%",
        "text": "A special thank you to Professor Martin, whose teaching is the inspiration behind this entire project, mentor and all.",
        "visual": {"component": "AnimatedText",
                   "props": {"text": "Thank you, Professor Martin."},
                   "emphasis": ["Martin"]},
    },
    "Z-4": {
        "scene": "clip5-graduation", "rate": "+6%",
        "text": "Our booth is open right now. The whole desk runs in your browser.",
        "visual": {"component": "AnimatedText",
                   "props": {"text": "Our booth is open. zeref007.github.io/trader-simulator"},
                   "emphasis": ["open"]},
    },
}

# Exact insertion order (NOTES line). Existing game/anim ids are referenced by
# range; we splice NEW ids around the existing sequence.
# Build the final ordered id list.
EXISTING = json.loads(MAN.read_text())
existing_by_id = {e["id"]: e for e in EXISTING if e["id"] not in NEW}

def rng(prefix, lo, hi):
    return [f"{prefix}{i}" for i in range(lo, hi + 1)]

order = []
order += ["O-1", "O-2", "O-3", "O-4", "O-5", "O-6"]
order += ["T-1"]
order += rng("C1-", 1, 3)
order += ["H-1", "H-2", "H-3", "H-4"]
order += rng("C1-", 4, 10)
order += ["R-1"]
order += ["T-2"]
order += [e["id"] for e in EXISTING if e["scene"] == "clip2-ticket"]
order += ["T-3"]
order += [e["id"] for e in EXISTING if e["scene"] == "clip3-pricing"]
order += ["R-2"]
order += ["T-4"]
order += [e["id"] for e in EXISTING if e["scene"] == "clip4-barrier"]
order += ["R-3"]
order += ["T-5"]
order += rng("C5-", 1, 9)
order += ["Z-1", "Z-2", "Z-3", "Z-4"]
order += ["C5-10", "C5-11"]

# Build entries in order. New ones constructed with canonical key ordering to
# match existing entries (id, sceneType, scene, text, visual, rate, pitch).
def build_new(eid):
    d = NEW[eid]
    e = {"id": eid, "sceneType": "animation", "scene": d["scene"],
         "text": d["text"], "visual": d["visual"]}
    if "rate" in d:
        e["rate"] = d["rate"]
    if "pitch" in d:
        e["pitch"] = d["pitch"]
    return e

result = []
seen = set()
for eid in order:
    if eid in seen:
        raise SystemExit(f"duplicate in order: {eid}")
    seen.add(eid)
    if eid in NEW:
        result.append(build_new(eid))
    else:
        if eid not in existing_by_id:
            raise SystemExit(f"missing existing id referenced in order: {eid}")
        result.append(existing_by_id[eid])

# Sanity: every existing id must be present exactly once
missing = set(existing_by_id) - seen
if missing:
    raise SystemExit(f"existing ids dropped from order: {sorted(missing)}")
assert len(result) == len(existing_by_id) + len(NEW), (len(result), len(existing_by_id), len(NEW))

MAN.write_text(json.dumps(result, indent=2) + "\n")
print(f"wrote {len(result)} entries ({len(NEW)} new, {len(existing_by_id)} existing)")
# Print the scene-group ordering check
from collections import Counter
print("scene counts:", dict(Counter(e["scene"] for e in result)))
# Confirm scene groups stay contiguous (required for clip cutting)
groups = []
for e in result:
    if not groups or groups[-1] != e["scene"]:
        groups.append(e["scene"])
print("scene block order:", groups)
assert groups == ["clip1-hook", "clip2-ticket", "clip3-pricing", "clip4-barrier", "clip5-graduation"], "scene blocks not contiguous!"
print("OK contiguous scene blocks")

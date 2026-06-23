#!/usr/bin/env python3
"""Generate voiceover + per-sentence captions with an ElevenLabs voice.

Usage: python scripts/gen-eleven.py <API_KEY> <VOICE_ID> [provider] [model] [floor]

Paces requests + retries on 429 (free-tier rate limits), checks credits
periodically, and stops before remaining < floor. Resumable.
"""
import sys, base64, json, time
from pathlib import Path
from dataclasses import asdict
sys.path.insert(0, "scripts")
from tts_adapters import ElevenLabsAdapter
from elevenlabs.client import ElevenLabs
from elevenlabs.core.api_error import ApiError

KEY = sys.argv[1]; VID = sys.argv[2]
PROVIDER = sys.argv[3] if len(sys.argv) > 3 else "ace"
MODEL = sys.argv[4] if len(sys.argv) > 4 else "eleven_turbo_v2_5"
FLOOR = int(sys.argv[5]) if len(sys.argv) > 5 else 600
PACE = 1.5  # seconds between scenes

manifest = json.load(open("narration-manifest.json"))
ad = Path(f"voiceover/{PROVIDER}"); cd = Path(f"captions/{PROVIDER}")
ad.mkdir(parents=True, exist_ok=True); cd.mkdir(parents=True, exist_ok=True)
client = ElevenLabs(api_key=KEY)


def retry(fn, what):
    for attempt in range(7):
        try:
            return fn()
        except ApiError as e:
            if getattr(e, "status_code", None) == 429:
                wait = 8 * (attempt + 1)
                print(f"  429 on {what}, backing off {wait}s"); time.sleep(wait); continue
            raise
    raise RuntimeError(f"gave up on {what} after retries")


def remaining():
    s = retry(lambda: client.user.subscription.get(), "subscription")
    return s.character_limit - s.character_count


rem = remaining(); print("start remaining:", rem)
done = 0
for e in manifest:
    i = e["id"]; mp3 = ad / f"{i}.mp3"; capf = cd / f"{i}.json"
    if mp3.exists() and mp3.stat().st_size > 0 and capf.exists():
        print("SKIP", i); continue
    text = e.get("text", "").strip()
    if not text:
        continue
    if done % 8 == 0:  # refresh credit view occasionally, not every scene
        rem = remaining()
    if rem - len(text) * 2 < FLOOR:
        print(f"STOP before {i}: remaining~{rem}, floor={FLOOR}"); break
    r = retry(lambda: client.text_to_speech.convert_with_timestamps(
        voice_id=VID, text=text, model_id=MODEL), f"tts {i}")
    mp3.write_bytes(base64.b64decode(r.audio_base_64))
    words = ElevenLabsAdapter._aggregate_chars_to_words(r.alignment, text)
    sents = ElevenLabsAdapter._aggregate_words_to_sentences(words, text)
    capf.write_text(json.dumps([asdict(s) for s in sents], indent=2))
    rem -= len(text)  # rough local decrement between refreshes
    done += 1
    print(f"OK {i} ({len(text)} ch)")
    time.sleep(PACE)
print("done. generated this run:", done, "| final remaining:", remaining())

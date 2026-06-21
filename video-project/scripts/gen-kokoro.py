#!/usr/bin/env python3
"""Generate voiceover + per-sentence captions with Kokoro (free, local).

Run inside an isolated env that has kokoro + soundfile, e.g.:
  uv run --python 3.12 --with kokoro --with soundfile scripts/gen-kokoro.py am_michael

Writes voiceover/kokoro/<id>.mp3 and captions/kokoro/<id>.json (same shape as the
edge/elevenlabs adapters: [{text,start,end,words:[{text,start,end}]}]). Resumable.
"""
import json, re, subprocess, sys, os
from pathlib import Path
import numpy as np, soundfile as sf
from kokoro import KPipeline

VOICE = sys.argv[1] if len(sys.argv) > 1 else "am_michael"
SR = 24000
GAP = 0.12  # seconds of silence between sentences
SENT = re.compile(r"(?<=[.!?])\s+")

manifest = json.load(open("narration-manifest.json"))
ad = Path("voiceover/kokoro"); cd = Path("captions/kokoro")
ad.mkdir(parents=True, exist_ok=True); cd.mkdir(parents=True, exist_ok=True)
pipe = KPipeline(lang_code="a")  # American English


def synth(text):
    chunks = [a for _, _, a in pipe(text, voice=VOICE)]
    return np.concatenate(chunks) if chunks else np.zeros(1, dtype="float32")


for e in manifest:
    i = e["id"]; mp3 = ad / f"{i}.mp3"; capf = cd / f"{i}.json"
    if mp3.exists() and mp3.stat().st_size > 0 and capf.exists():
        print("SKIP", i); continue
    sents = [s.strip() for s in SENT.split(e["text"].strip()) if s.strip()]
    audio = []; caps = []; t = 0.0
    for s in sents:
        a = synth(s); dur = len(a) / SR
        words = s.split(); tot = sum(len(w) for w in words) or 1
        wlist = []; wt = t
        for w in words:
            wd = dur * len(w) / tot
            wlist.append({"text": w, "start": round(wt, 3), "end": round(wt + wd, 3)})
            wt += wd
        caps.append({"text": s, "start": round(t, 3), "end": round(t + dur, 3), "words": wlist})
        audio.append(a); t += dur
        audio.append(np.zeros(int(GAP * SR), dtype=a.dtype)); t += GAP
    full = np.concatenate(audio)
    wav = f"/tmp/k_{i}.wav"; sf.write(wav, full, SR)
    subprocess.run(["ffmpeg", "-y", "-i", wav, "-q:a", "3", str(mp3)], capture_output=True)
    os.remove(wav)
    capf.write_text(json.dumps(caps, indent=2))
    print("OK", i, round(t, 2), "s")
print("done")

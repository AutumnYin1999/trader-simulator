#!/usr/bin/env python3
"""Clone a reference voice with VoxCPM and render voiceover + per-sentence captions.

Usage (isolated env):
  uv run --python 3.12 --with voxcpm --with soundfile scripts/gen-voxcpm.py \
      /tmp/voiceref.wav /tmp/voiceref.txt [ONLY_ID]

REF = a clean 10-20s wav of the target speaker; PROMPT = its transcript (zero-shot
cloning prompt). Optional ONLY_ID generates a single scene (for a quick test).
Writes voiceover/voxcpm/<id>.mp3 + captions/voxcpm/<id>.json. Resumable.
"""
import json, re, subprocess, sys, os
from pathlib import Path
import numpy as np, soundfile as sf
from voxcpm import VoxCPM

REF = sys.argv[1] if len(sys.argv) > 1 else "/tmp/voiceref.wav"
PROMPT = open(sys.argv[2]).read().strip() if len(sys.argv) > 2 and os.path.exists(sys.argv[2]) else ""
ONLY = sys.argv[3] if len(sys.argv) > 3 else None
SR = 16000; GAP = 0.12
SENT = re.compile(r"(?<=[.!?])\s+")

manifest = json.load(open("narration-manifest.json"))
ad = Path("voiceover/voxcpm"); cd = Path("captions/voxcpm")
ad.mkdir(parents=True, exist_ok=True); cd.mkdir(parents=True, exist_ok=True)
model = VoxCPM.from_pretrained("openbmb/VoxCPM-0.5B")


def synth(text):
    w = model.generate(text=text, prompt_wav_path=REF, prompt_text=PROMPT)
    return np.asarray(w, dtype="float32").reshape(-1)


for e in manifest:
    i = e["id"]
    if ONLY and i != ONLY:
        continue
    mp3 = ad / f"{i}.mp3"; capf = cd / f"{i}.json"
    if mp3.exists() and mp3.stat().st_size > 0 and capf.exists():
        print("SKIP", i); continue
    sents = [s.strip() for s in SENT.split(e["text"].strip()) if s.strip()]
    audio = []; caps = []; t = 0.0
    for s in sents:
        a = synth(s); dur = len(a) / SR
        words = s.split(); tot = sum(len(w) for w in words) or 1; wt = t; wl = []
        for w in words:
            wd = dur * len(w) / tot
            wl.append({"text": w, "start": round(wt, 3), "end": round(wt + wd, 3)}); wt += wd
        caps.append({"text": s, "start": round(t, 3), "end": round(t + dur, 3), "words": wl})
        audio.append(a); t += dur
        audio.append(np.zeros(int(GAP * SR), dtype="float32")); t += GAP
    full = np.concatenate(audio)
    wav = f"/tmp/vx_{i}.wav"; sf.write(wav, full, SR)
    subprocess.run(["ffmpeg", "-y", "-i", wav, "-q:a", "3", str(mp3)], capture_output=True); os.remove(wav)
    capf.write_text(json.dumps(caps, indent=2))
    print("OK", i, round(t, 2), "s")
print("done")

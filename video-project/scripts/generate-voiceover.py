#!/usr/bin/env python3
"""Generate provider-scoped voiceover + captions from a narration manifest."""
from __future__ import annotations
import argparse
import json
import sys
from dataclasses import asdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from tts_adapters import get_adapter


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--manifest", default="narration-manifest.json")
    p.add_argument("--provider", choices=["edge", "elevenlabs"], default="edge")
    p.add_argument("--voice-id", default="")
    p.add_argument("--out-root", default=".")
    args = p.parse_args()

    manifest = json.loads(Path(args.manifest).read_text())
    adapter = get_adapter(args.provider)

    audio_dir = Path(args.out_root) / "voiceover" / args.provider
    cap_dir = Path(args.out_root) / "captions" / args.provider
    audio_dir.mkdir(parents=True, exist_ok=True)
    cap_dir.mkdir(parents=True, exist_ok=True)

    for entry in manifest:
        audio_path = audio_dir / f"{entry['id']}.mp3"
        cap_path = cap_dir / f"{entry['id']}.json"
        _, sentences = adapter.synthesize(entry["text"], args.voice_id, audio_path)
        cap_path.write_text(json.dumps([asdict(s) for s in sentences], indent=2))
        print(f"OK {entry['id']} -> {audio_path}")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Render narration + subtitles ONLY — no recording, no animation — for fast QA.

Uses Remotion so the preview reuses the same word-aware `Subtitles` component as
the final video (single source of truth for subtitle styling and word highlight).
Requires `npm install` to have been run in the scaffolded project.
"""
from __future__ import annotations
import argparse
import json
import shutil
import subprocess
from pathlib import Path

FPS = 30


def probe_duration(mp3: Path) -> float:
    out = subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", str(mp3),
    ])
    return float(out.decode().strip())


PREVIEW_ROOT_TSX = '''\
import { Composition, AbsoluteFill, Audio, Sequence, registerRoot, staticFile } from "remotion";
import { Subtitles } from "./Subtitles";
import entries from "./preview-entries.json";

const TOTAL = (entries as any[]).reduce((a, e) => a + e.durationFrames, 0);

const Preview: React.FC = () => {
  let offset = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {(entries as any[]).map((e) => {
        const from = offset;
        offset += e.durationFrames;
        return (
          <Sequence key={e.id} from={from} durationInFrames={e.durationFrames}>
            <Audio src={staticFile(e.audioSrc)} />
            <Subtitles sentences={e.sentences} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

export const RemotionRoot: React.FC = () => (
  <Composition id="Preview" component={Preview} fps={__FPS__} width={1920} height={1080} durationInFrames={TOTAL} />
);

registerRoot(RemotionRoot);
'''


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--manifest", default="narration-manifest.json")
    p.add_argument("--provider", default="edge")
    p.add_argument("--out", default="out/preview.mp4")
    p.add_argument("--project", default=".", help="Project root containing src/, public/, package.json")
    args = p.parse_args()

    proj = Path(args.project).resolve()
    src = proj / "src"
    if not (src / "Subtitles.tsx").exists():
        raise SystemExit(f"missing {src/'Subtitles.tsx'} — run scaffold.py first")
    if not (proj / "node_modules").exists():
        raise SystemExit(f"missing {proj/'node_modules'} — run `npm install` in {proj} first")

    manifest = json.loads((proj / args.manifest).read_text())
    audio_dir = proj / "voiceover" / args.provider
    cap_dir = proj / "captions" / args.provider

    public = proj / "public"
    public.mkdir(exist_ok=True)
    public_audio = public / "voiceover" / args.provider
    public_audio.mkdir(parents=True, exist_ok=True)

    entries = []
    for entry in manifest:
        mp3 = audio_dir / f"{entry['id']}.mp3"
        cap_path = cap_dir / f"{entry['id']}.json"
        if not mp3.exists() or not cap_path.exists():
            raise SystemExit(f"missing assets for {entry['id']} — run generate-voiceover.py first")
        sentences = json.loads(cap_path.read_text())
        dur = probe_duration(mp3)
        frames = max(1, int(round(dur * FPS)))

        public_mp3 = public_audio / mp3.name
        if not public_mp3.exists() or public_mp3.stat().st_mtime < mp3.stat().st_mtime:
            shutil.copy(mp3, public_mp3)

        entries.append({
            "id": entry["id"],
            "durationFrames": frames,
            "audioSrc": f"voiceover/{args.provider}/{mp3.name}",
            "sentences": sentences,
        })

    (src / "preview-entries.json").write_text(json.dumps(entries, indent=2))
    (src / "PreviewRoot.tsx").write_text(PREVIEW_ROOT_TSX.replace("__FPS__", str(FPS)))

    out = (proj / args.out).resolve()
    out.parent.mkdir(parents=True, exist_ok=True)

    subprocess.run(
        ["npx", "--yes", "remotion", "render", "src/PreviewRoot.tsx", "Preview",
         str(out), "--public-dir", str(public)],
        cwd=str(proj), check=True,
    )
    print(f"Wrote {out}")


if __name__ == "__main__":
    main()

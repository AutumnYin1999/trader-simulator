#!/usr/bin/env bash
# Final audio master pass: normalize loudness to broadcast/web -16 LUFS, re-encode
# narration AAC at 192k, and move moov atom to the head for progressive streaming.
# Video is copied (NOT re-encoded) so the CRF-18 render quality is preserved.
# Usage: scripts/master-audio.sh in.mp4 out.mp4
set -e
IN="${1:?in.mp4}"; OUT="${2:?out.mp4}"
ffmpeg -y -i "$IN" -c:v copy \
  -af "loudnorm=I=-16:TP=-1.5:LRA=11" \
  -c:a aac -b:a 192k -movflags +faststart "$OUT"
echo "wrote $OUT"
ffprobe -v error -show_entries format=duration:stream=codec_name,pix_fmt -of default=nw=1 "$OUT" 2>/dev/null || true

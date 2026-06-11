#!/usr/bin/env bash
# Delegates: ffmpeg invocation (ffmpeg skill).
# Adds: settings tuned for Remotion OffthreadVideo at 1920x1080.
set -euo pipefail
IN="${1:?usage: webm-to-mp4.sh input.webm [output.mp4]}"
OUT="${2:-${IN%.webm}.mp4}"
ffmpeg -y -i "$IN" -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p -movflags +faststart "$OUT"
echo "Wrote $OUT"

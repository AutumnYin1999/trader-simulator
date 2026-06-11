#!/bin/bash
# Cuts out/final.mp4 into 5 per-clip MP4s at the composition clip boundaries
# (out/boundaries.json, produced by scripts/build-timeline.mjs).
# Re-encodes (crf 20) so cuts are frame-exact regardless of keyframe placement.
set -euo pipefail
cd "$(dirname "$0")/.."

node -e "
const b = require('./out/boundaries.json');
for (const c of b.boundaries) console.log(c.clip, c.startSec, c.endSec);
" | while read -r n start end; do
  echo "clip$n: $start -> $end"
  ffmpeg -y -v error -i out/final.mp4 -ss "$start" -to "$end" \
    -c:v libx264 -crf 20 -preset medium -pix_fmt yuv420p \
    -c:a aac -b:a 192k -movflags +faststart "out/clip$n.mp4"
done
echo "--- clip durations ---"
for f in out/clip1.mp4 out/clip2.mp4 out/clip3.mp4 out/clip4.mp4 out/clip5.mp4; do
  d=$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$f")
  echo "$f $d"
done

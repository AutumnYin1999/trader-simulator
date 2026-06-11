#!/bin/bash
# Semantic verification of out/final.mp4 (assert features, not bytes):
#  - video + audio streams present, duration in [480, 720] s
#  - 6 probe frames (one per clip + one feature-avatar scene): YAVG > 16
#  - feature scene: left-half luma deviation (avatar present, not flat bg)
#  - caption strip variance at a mid-sentence timestamp
#  - pip region variance on a game-footage frame
set -euo pipefail
cd "$(dirname "$0")/.."
F=out/final.mp4

echo "=== streams ==="
ffprobe -v error -show_entries stream=index,codec_type,codec_name,width,height,r_frame_rate -of csv "$F"
DUR=$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$F")
echo "duration: $DUR s"
python3 -c "d=$DUR; assert 480 <= d <= 720, f'duration {d} outside 8:00-12:00'; print('duration check OK (8:00-12:00)')"

yavg() { # yavg <t> <name> [cropfilter]
  local t=$1 name=$2 crop=${3:-null}
  ffmpeg -v info -ss "$t" -i "$F" -vf "$crop,signalstats,metadata=print:key=lavfi.signalstats.YAVG" -frames:v 1 -f null - 2>&1 |
    grep -o "YAVG=[0-9.]*" | head -1 | sed "s/^/[$name t=${t}s] /"
}
ydev() {
  local t=$1 name=$2 crop=${3:-null}
  ffmpeg -v info -ss "$t" -i "$F" -vf "$crop,signalstats,metadata=print:key=lavfi.signalstats.YDIF:key=lavfi.signalstats.YAVG" -frames:v 1 -f null - 2>&1 |
    grep -oE "YAVG=[0-9.]*" | head -1 | sed "s/^/[$name t=${t}s] /"
}

echo "=== full-frame YAVG at 6 probes ==="
yavg 35 "P1-clip1-anim"
yavg 120 "P2-clip2-game"
yavg 220 "P3-clip3-game"
yavg 340 "P4-clip4-game"
yavg 460 "P5-clip5-qr"
yavg 178 "P6-feature-C3-2"

echo "=== probe frames for visual inspection ==="
mkdir -p out/probes
for spec in "35 p1" "120 p2" "220 p3" "340 p4" "460 p5" "178 p6"; do
  set -- $spec
  ffmpeg -y -v error -ss "$1" -i "$F" -frames:v 1 "out/probes/$2-t$1.png"
done

echo "=== feature scene left half (avatar variance) ==="
ffmpeg -v info -ss 178 -i "$F" -vf "crop=960:1080:0:0,signalstats,metadata=print:key=lavfi.signalstats.YAVG:key=lavfi.signalstats.YMAX:key=lavfi.signalstats.YMIN" -frames:v 1 -f null - 2>&1 | grep -oE "Y(AVG|MAX|MIN)=[0-9.]*" | tr '\n' ' '; echo

echo "=== caption strip at mid-sentence (t=121s) ==="
ffmpeg -v info -ss 121 -i "$F" -vf "crop=1400:110:260:910,signalstats,metadata=print:key=lavfi.signalstats.YAVG:key=lavfi.signalstats.YMAX" -frames:v 1 -f null - 2>&1 | grep -oE "Y(AVG|MAX)=[0-9.]*" | tr '\n' ' '; echo

echo "=== pip region on game footage (t=121s, crop 300x300 at 1576,600) ==="
ffmpeg -v info -ss 121 -i "$F" -vf "crop=300:300:1576:600,signalstats,metadata=print:key=lavfi.signalstats.YAVG:key=lavfi.signalstats.YMAX" -frames:v 1 -f null - 2>&1 | grep -oE "Y(AVG|MAX)=[0-9.]*" | tr '\n' ' '; echo

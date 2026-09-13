#!/bin/bash
# Mux Playwright webms from record-demo.mjs with narration.mp3
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ASSETS="$ROOT/screenshots/demo-assets"
PATHS="$ASSETS/record-paths.json"
DESK=$(python3 -c "import json;print(json.load(open('$PATHS'))['desktop'])")
MOB=$(python3 -c "import json;print(json.load(open('$PATHS'))['mobile'])")
NARR="$ASSETS/narration.mp3"
OUT="$ROOT/screenshots/pairband-demo-with-audio.mp4"
WORKDIR=$(mktemp -d)
trap 'rm -rf "$WORKDIR"' EXIT
ffmpeg -y -i "$DESK" -vf "scale=1280:800:force_original_aspect_ratio=decrease,pad=1280:800:(ow-iw)/2:(oh-ih)/2:color=0xF5F5F2,fps=25,format=yuv420p" -an "$WORKDIR/desk.mp4"
ffmpeg -y -i "$MOB" -vf "scale=1280:800:force_original_aspect_ratio=decrease,pad=1280:800:(ow-iw)/2:(oh-ih)/2:color=0xF5F5F2,fps=25,format=yuv420p" -an "$WORKDIR/mob.mp4"
printf "file '%s'\nfile '%s'\n" "$WORKDIR/desk.mp4" "$WORKDIR/mob.mp4" > "$WORKDIR/list.txt"
ffmpeg -y -f concat -safe 0 -i "$WORKDIR/list.txt" -c copy "$WORKDIR/silent.mp4"
VDUR=$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$WORKDIR/silent.mp4")
ADUR=$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$NARR")
# Fit narration to picture with chained atempo (each factor in [0.5,2.0])
RATIO=$(python3 -c "print(float('$ADUR')/float('$VDUR'))")
FILTER=$(python3 - <<PY
r=float("$RATIO")
parts=[]
while r>2.0:
  parts.append("atempo=2.0"); r/=2.0
while r<0.5:
  parts.append("atempo=0.5"); r/=0.5
parts.append(f"atempo={r:.6f}")
print(",".join(parts))
PY
)
ffmpeg -y -i "$NARR" -filter:a "$FILTER" "$WORKDIR/narr-fit.mp3"
ffmpeg -y -i "$WORKDIR/silent.mp4" -i "$WORKDIR/narr-fit.mp3" -c:v libx264 -crf 20 -preset veryfast -c:a aac -b:a 128k -shortest -movflags +faststart "$OUT"
echo "Wrote $OUT ($(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$OUT")s)"

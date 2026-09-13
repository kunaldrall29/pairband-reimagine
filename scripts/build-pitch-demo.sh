#!/usr/bin/env bash
# Build a 2–4 minute Pairband pitch + product demo MP4.
# Requires: ffmpeg, ffprobe, edge-tts, python3, node (for record-demo.mjs)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ASSETS="$ROOT/screenshots/demo-assets"
SLIDES="$ASSETS/pitch-slides"
WORKDIR=$(mktemp -d)
trap 'rm -rf "$WORKDIR"' EXIT

NARR_TXT="$ASSETS/pitch-demo-narration.txt"
NARR_MP3="$ASSETS/pitch-demo-narration.mp3"
OUT="$ROOT/screenshots/pairband-pitch-demo.mp4"
PATHS="$ASSETS/record-paths.json"

echo "==> Render pitch slides"
python3 "$ROOT/scripts/render-pitch-slides.py"

echo "==> Ensure app is up"
if ! curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
  sh "$ROOT/startup.sh"
  for i in $(seq 1 60); do
    curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/ && break
    sleep 1
  done
fi

echo "==> Record product demo (desktop + mobile)"
node "$ROOT/scripts/record-demo.mjs"

DESK=$(python3 -c "import json;print(json.load(open('$PATHS'))['desktop'])")
MOB=$(python3 -c "import json;print(json.load(open('$PATHS'))['mobile'])")

echo "==> Generate narration (edge-tts)"
edge-tts --voice en-US-AndrewNeural --rate=-5% --file "$NARR_TXT" --write-media "$NARR_MP3"

ADUR=$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$NARR_MP3")
echo "Narration: ${ADUR}s"

# Target video length = narration length
# Section mix (fractions of total audio):
#   intro slides 28%  (cover, problem, solution, how)
#   desktop demo 42%
#   mobile demo  12%
#   outro slides 18%  (business, live, roadmap, close)

python3 - <<PY
import json, subprocess, os
adur = float("$ADUR")
parts = {
  "intro": 0.28,
  "desk": 0.42,
  "mob": 0.12,
  "outro": 0.18,
}
durs = {k: adur * v for k, v in parts.items()}
open("$WORKDIR/durs.json","w").write(json.dumps(durs))
print(durs)
PY

INTRO_DUR=$(python3 -c "import json;print(json.load(open('$WORKDIR/durs.json'))['intro'])")
DESK_DUR=$(python3 -c "import json;print(json.load(open('$WORKDIR/durs.json'))['desk'])")
MOB_DUR=$(python3 -c "import json;print(json.load(open('$WORKDIR/durs.json'))['mob'])")
OUTRO_DUR=$(python3 -c "import json;print(json.load(open('$WORKDIR/durs.json'))['outro'])")

echo "==> Build intro slideshow"
# 4 slides share intro duration equally
python3 - <<PY
import subprocess, json
slides = [
  "$SLIDES/01-cover.png",
  "$SLIDES/02-problem.png",
  "$SLIDES/03-solution.png",
  "$SLIDES/04-how.png",
]
total = float("$INTRO_DUR")
each = total / len(slides)
lst = "$WORKDIR/intro.txt"
with open(lst, "w") as f:
  for s in slides:
    f.write(f"file '{s}'\n")
    f.write(f"duration {each:.4f}\n")
  f.write(f"file '{slides[-1]}'\n")
subprocess.check_call([
  "ffmpeg","-y","-f","concat","-safe","0","-i",lst,
  "-vf","scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:color=0xF5F5F2,fps=25,format=yuv420p",
  "-c:v","libx264","-crf","18","-preset","veryfast","-t",f"{total:.4f}",
  "$WORKDIR/intro.mp4"
])
print("intro", total)
PY

echo "==> Normalize desktop + mobile product clips"
ffmpeg -y -i "$DESK" -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:color=0xF5F5F2,fps=25,format=yuv420p" -an "$WORKDIR/desk_raw.mp4"
ffmpeg -y -i "$MOB" -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:color=0xF5F5F2,fps=25,format=yuv420p" -an "$WORKDIR/mob_raw.mp4"

# Fit each to target duration via setpts (speed) or pad/trim
fit_clip() {
  local in="$1" out="$2" target="$3"
  local src
  src=$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$in")
  python3 - <<PY
import subprocess
src=float("$src"); target=float("$target")
# speed = src/target → setpts = target/src  (PTS multiplier)
# If source shorter than target, slow down (factor > 1); if longer, speed up.
factor = target / src if src > 0 else 1.0
# Clamp extreme speed changes for watchability
factor = max(0.55, min(1.85, factor))
# After speed change, trim/pad to exact target
subprocess.check_call([
  "ffmpeg","-y","-i","$in",
  "-filter:v",f"setpts={factor:.6f}*PTS,fps=25,format=yuv420p",
  "-an","$WORKDIR/_sped.mp4"
])
# pad or trim to exact length
subprocess.check_call([
  "ffmpeg","-y","-i","$WORKDIR/_sped.mp4",
  "-vf",f"tpad=stop_mode=clone:stop_duration=30",
  "-t",f"{target:.4f}",
  "-c:v","libx264","-crf","18","-preset","veryfast",
  "$out"
])
print("$in", "src", src, "target", target, "factor", factor)
PY
}

fit_clip "$WORKDIR/desk_raw.mp4" "$WORKDIR/desk.mp4" "$DESK_DUR"
fit_clip "$WORKDIR/mob_raw.mp4" "$WORKDIR/mob.mp4" "$MOB_DUR"

echo "==> Build outro slideshow"
python3 - <<PY
import subprocess
slides = [
  "$SLIDES/06-business.png",
  "$SLIDES/07-live.png",
  "$SLIDES/08-roadmap.png",
  "$SLIDES/09-close.png",
]
total = float("$OUTRO_DUR")
each = total / len(slides)
lst = "$WORKDIR/outro.txt"
with open(lst, "w") as f:
  for s in slides:
    f.write(f"file '{s}'\n")
    f.write(f"duration {each:.4f}\n")
  f.write(f"file '{slides[-1]}'\n")
subprocess.check_call([
  "ffmpeg","-y","-f","concat","-safe","0","-i",lst,
  "-vf","scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:color=0xF5F5F2,fps=25,format=yuv420p",
  "-c:v","libx264","-crf","18","-preset","veryfast","-t",f"{total:.4f}",
  "$WORKDIR/outro.mp4"
])
print("outro", total)
PY

echo "==> Concatenate sections"
printf "file '%s'\nfile '%s'\nfile '%s'\nfile '%s'\n" \
  "$WORKDIR/intro.mp4" "$WORKDIR/desk.mp4" "$WORKDIR/mob.mp4" "$WORKDIR/outro.mp4" \
  > "$WORKDIR/list.txt"
ffmpeg -y -f concat -safe 0 -i "$WORKDIR/list.txt" -c copy "$WORKDIR/silent.mp4"

echo "==> Mux narration"
ffmpeg -y -i "$WORKDIR/silent.mp4" -i "$NARR_MP3" \
  -c:v libx264 -crf 18 -preset veryfast \
  -c:a aac -b:a 160k \
  -shortest -movflags +faststart \
  "$OUT"

DUR=$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$OUT")
SIZE=$(du -h "$OUT" | cut -f1)
echo "Wrote $OUT (${DUR}s, $SIZE)"

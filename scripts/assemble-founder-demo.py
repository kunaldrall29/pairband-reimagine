#!/usr/bin/env python3
"""Build Pairband founder pitch + demo video at 1× speed (2–4 min)."""
from __future__ import annotations

import json
import re
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "screenshots" / "demo-assets"
SLIDES = ASSETS / "pitch-slides"
NARR_TXT = ASSETS / "founder-narration.txt"
NARR_DIR = ASSETS / "founder-narration-parts"
PATHS = ASSETS / "record-paths.json"
OUT = ROOT / "screenshots" / "pairband-pitch-demo.mp4"
PAPER = "0xF5F5F2"

SECTION_VISUAL = {
    "cover": "01-cover.png",
    "team": "02-team.png",
    "built": "03-built.png",
    "how": "04-how.png",
    "demo": "product",
    "made": "05-made.png",
    "business": "06-business.png",
    "future": "07-future.png",
    "live": "08-live.png",
    "thanks": "09-thanks.png",
}

VOICE = "en-US-GuyNeural"
RATE = "+8%"


def run(cmd: list[str]) -> None:
    print("+", " ".join(str(c) for c in cmd[:10]), "…" if len(cmd) > 10 else "")
    subprocess.check_call(cmd)


def probe(path: Path | str) -> float:
    return float(
        subprocess.check_output(
            [
                "ffprobe",
                "-v",
                "error",
                "-show_entries",
                "format=duration",
                "-of",
                "default=nw=1:nk=1",
                str(path),
            ],
            text=True,
        ).strip()
    )


def parse_sections(text: str) -> list[tuple[str, str]]:
    parts = re.split(r"^\[([a-z]+)\]\s*$", text.strip(), flags=re.M)
    out: list[tuple[str, str]] = []
    i = 1
    while i + 1 < len(parts):
        name, body = parts[i].strip(), parts[i + 1].strip()
        if name and body:
            out.append((name, body))
        i += 2
    return out


def synth_sections(sections: list[tuple[str, str]]) -> list[tuple[str, Path, float]]:
    NARR_DIR.mkdir(parents=True, exist_ok=True)
    result = []
    for name, body in sections:
        mp3 = NARR_DIR / f"{name}.mp3"
        txt = NARR_DIR / f"{name}.txt"
        txt.write_text(body + "\n")
        run(
            [
                "edge-tts",
                "--voice",
                VOICE,
                "--rate",
                RATE,
                "--file",
                str(txt),
                "--write-media",
                str(mp3),
            ]
        )
        dur = probe(mp3)
        print(f"  {name}: {dur:.2f}s")
        result.append((name, mp3, dur))
    return result


def scale_vf() -> str:
    return (
        f"scale=1280:720:force_original_aspect_ratio=decrease,"
        f"pad=1280:720:(ow-iw)/2:(oh-ih)/2:color={PAPER},"
        f"fps=25,format=yuv420p"
    )


def still_clip(png: Path, duration: float, dest: Path) -> None:
    run(
        [
            "ffmpeg",
            "-y",
            "-loop",
            "1",
            "-i",
            str(png),
            "-vf",
            scale_vf(),
            "-t",
            f"{duration:.4f}",
            "-c:v",
            "libx264",
            "-crf",
            "18",
            "-preset",
            "veryfast",
            "-pix_fmt",
            "yuv420p",
            str(dest),
        ]
    )


def product_clip(desk: Path, mob: Path, duration: float, dest: Path, work: Path) -> None:
    work.mkdir(parents=True, exist_ok=True)
    desk_n, mob_n = work / "desk.mp4", work / "mob.mp4"
    for src, out in ((desk, desk_n), (mob, mob_n)):
        run(
            [
                "ffmpeg",
                "-y",
                "-i",
                str(src),
                "-vf",
                scale_vf(),
                "-an",
                "-c:v",
                "libx264",
                "-crf",
                "18",
                "-preset",
                "veryfast",
                str(out),
            ]
        )
    lst = work / "prod.txt"
    lst.write_text(f"file '{desk_n}'\nfile '{mob_n}'\n")
    concat = work / "prod_concat.mp4"
    run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(lst), "-c", "copy", str(concat)])
    src_dur = probe(concat)
    if src_dur >= duration:
        run(
            [
                "ffmpeg",
                "-y",
                "-i",
                str(concat),
                "-t",
                f"{duration:.4f}",
                "-c:v",
                "libx264",
                "-crf",
                "18",
                "-preset",
                "veryfast",
                str(dest),
            ]
        )
    else:
        pad = duration - src_dur
        run(
            [
                "ffmpeg",
                "-y",
                "-i",
                str(concat),
                "-vf",
                f"tpad=stop_mode=clone:stop_duration={pad:.4f}",
                "-t",
                f"{duration:.4f}",
                "-c:v",
                "libx264",
                "-crf",
                "18",
                "-preset",
                "veryfast",
                str(dest),
            ]
        )


def concat_audio(mp3s: list[Path], dest: Path, work: Path) -> None:
    work.mkdir(parents=True, exist_ok=True)
    wavs = []
    for i, mp3 in enumerate(mp3s):
        wav = work / f"a{i}.wav"
        run(["ffmpeg", "-y", "-i", str(mp3), "-ar", "44100", "-ac", "1", str(wav)])
        wavs.append(wav)
    lst = work / "alist.txt"
    lst.write_text("".join(f"file '{w}'\n" for w in wavs))
    run(
        [
            "ffmpeg",
            "-y",
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            str(lst),
            "-codec:a",
            "libmp3lame",
            "-q:a",
            "4",
            str(dest),
        ]
    )


def main() -> None:
    run(["python3", str(ROOT / "scripts" / "render-pitch-slides.py")])
    # remove stale slides from older decks
    keep = set(SECTION_VISUAL.values()) - {"product"}
    for p in SLIDES.glob("*.png"):
        if p.name not in keep:
            p.unlink()
            print("removed stale", p.name)

    sections = parse_sections(NARR_TXT.read_text())
    print("==> Synthesize founder narration (1×, GuyNeural)")
    audio_parts = synth_sections(sections)
    total_audio = sum(d for _, _, d in audio_parts)
    print(f"Total narration: {total_audio:.1f}s")

    if not PATHS.exists():
        raise SystemExit("Missing record-paths.json — run node scripts/record-demo.mjs first")
    paths = json.loads(PATHS.read_text())
    desk = Path(paths.get("desktop") or paths["desk"])
    mob = Path(paths.get("mobile") or paths["mob"])

    with tempfile.TemporaryDirectory() as td:
        work = Path(td)
        video_clips: list[Path] = []
        audio_files: list[Path] = []

        for name, mp3, dur in audio_parts:
            visual = SECTION_VISUAL[name]
            clip = work / f"{name}.mp4"
            if visual == "product":
                product_clip(desk, mob, dur, clip, work / "prod")
            else:
                still_clip(SLIDES / visual, dur, clip)
            video_clips.append(clip)
            audio_files.append(mp3)

        vlist = work / "vlist.txt"
        vlist.write_text("".join(f"file '{p}'\n" for p in video_clips))
        silent = work / "silent.mp4"
        run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(vlist), "-c", "copy", str(silent)])

        full_mp3 = ASSETS / "founder-narration.mp3"
        concat_audio(audio_files, full_mp3, work / "audio")

        OUT.parent.mkdir(parents=True, exist_ok=True)
        run(
            [
                "ffmpeg",
                "-y",
                "-i",
                str(silent),
                "-i",
                str(full_mp3),
                "-c:v",
                "libx264",
                "-crf",
                "18",
                "-preset",
                "veryfast",
                "-c:a",
                "aac",
                "-b:a",
                "160k",
                "-shortest",
                "-movflags",
                "+faststart",
                str(OUT),
            ]
        )

    dur = probe(OUT)
    print(f"Wrote {OUT} ({dur:.1f}s, {OUT.stat().st_size / 1e6:.1f} MB)")
    if not (120 <= dur <= 240):
        raise SystemExit(f"Final duration {dur:.1f}s outside 2–4 minute target")


if __name__ == "__main__":
    main()

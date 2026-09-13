#!/usr/bin/env python3
"""Assemble Pairband pitch + product demo MP4 (target 2–4 minutes)."""
from __future__ import annotations

import json
import shutil
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "screenshots" / "demo-assets"
SLIDES = ASSETS / "pitch-slides"
NARR = ASSETS / "pitch-demo-narration.mp3"
PATHS = ASSETS / "record-paths.json"
OUT = ROOT / "screenshots" / "pairband-pitch-demo.mp4"
PAPER = "0xF5F5F2"


def run(cmd: list[str]) -> None:
    print("+", " ".join(cmd[:8]), "…" if len(cmd) > 8 else "")
    subprocess.check_call(cmd)


def probe(path: Path | str) -> float:
    out = subprocess.check_output(
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
    return float(out)


def scale_vf() -> str:
    return (
        f"scale=1280:720:force_original_aspect_ratio=decrease,"
        f"pad=1280:720:(ow-iw)/2:(oh-ih)/2:color={PAPER},"
        f"fps=25,format=yuv420p"
    )


def slideshow(slides: list[Path], duration: float, dest: Path) -> None:
    each = duration / len(slides)
    lst = dest.with_suffix(".txt")
    with lst.open("w") as f:
        for s in slides:
            f.write(f"file '{s}'\n")
            f.write(f"duration {each:.4f}\n")
        f.write(f"file '{slides[-1]}'\n")
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
            "-vf",
            scale_vf(),
            "-c:v",
            "libx264",
            "-crf",
            "18",
            "-preset",
            "veryfast",
            "-t",
            f"{duration:.4f}",
            str(dest),
        ]
    )


def fit_clip(src: Path, target: float, dest: Path, work: Path) -> None:
    sub = work / f"fit_{dest.stem}"
    sub.mkdir(parents=True, exist_ok=True)
    raw = sub / "raw.mp4"
    sped = sub / "sped.mp4"
    run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(src),
            "-vf",
            scale_vf(),
            "-an",
            str(raw),
        ]
    )
    src_dur = probe(raw)
    factor = target / src_dur if src_dur > 0 else 1.0
    factor = max(0.55, min(1.85, factor))
    run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(raw),
            "-filter:v",
            f"setpts={factor:.6f}*PTS,fps=25,format=yuv420p",
            "-an",
            str(sped),
        ]
    )
    run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(sped),
            "-vf",
            "tpad=stop_mode=clone:stop_duration=60",
            "-t",
            f"{target:.4f}",
            "-c:v",
            "libx264",
            "-crf",
            "18",
            "-preset",
            "veryfast",
            str(dest),
        ]
    )


def main() -> None:
    if not NARR.exists():
        raise SystemExit(f"Missing narration: {NARR}")
    if not PATHS.exists():
        raise SystemExit(f"Missing record paths: {PATHS}")

    paths = json.loads(PATHS.read_text())
    desk = Path(paths["desktop"])
    mob = Path(paths["mobile"])
    adur = probe(NARR)
    print(f"Narration {adur:.2f}s")

    # Keep total video length matched to narration.
    intro_d = adur * 0.26
    desk_d = adur * 0.44
    mob_d = adur * 0.12
    outro_d = adur * 0.18

    with tempfile.TemporaryDirectory() as td:
        work = Path(td)
        intro = work / "intro.mp4"
        desk_out = work / "desk.mp4"
        mob_out = work / "mob.mp4"
        outro = work / "outro.mp4"
        silent = work / "silent.mp4"

        slideshow(
            [
                SLIDES / "01-cover.png",
                SLIDES / "02-problem.png",
                SLIDES / "03-solution.png",
                SLIDES / "04-how.png",
                SLIDES / "05-why.png",
            ],
            intro_d,
            intro,
        )
        fit_clip(desk, desk_d, desk_out, work)
        fit_clip(mob, mob_d, mob_out, work)
        slideshow(
            [
                SLIDES / "06-business.png",
                SLIDES / "07-live.png",
                SLIDES / "08-roadmap.png",
                SLIDES / "09-close.png",
            ],
            outro_d,
            outro,
        )

        lst = work / "list.txt"
        lst.write_text(
            "\n".join(
                [
                    f"file '{intro}'",
                    f"file '{desk_out}'",
                    f"file '{mob_out}'",
                    f"file '{outro}'",
                ]
            )
            + "\n"
        )
        run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(lst), "-c", "copy", str(silent)])

        OUT.parent.mkdir(parents=True, exist_ok=True)
        run(
            [
                "ffmpeg",
                "-y",
                "-i",
                str(silent),
                "-i",
                str(NARR),
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
    size = OUT.stat().st_size
    print(f"Wrote {OUT} ({dur:.1f}s, {size/1e6:.1f} MB)")
    if not (120 <= dur <= 240):
        raise SystemExit(f"Duration {dur:.1f}s outside 2–4 minute target")


if __name__ == "__main__":
    main()

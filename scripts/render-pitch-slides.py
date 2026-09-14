#!/usr/bin/env python3
"""Render clean Pairband pitch slides (1280×720) for the founder demo video."""
from __future__ import annotations

import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "screenshots" / "demo-assets" / "pitch-slides"
BRAND = ROOT / "public" / "brand"
W, H = 1280, 720

PAPER = (245, 245, 242)
PAPER2 = (236, 236, 230)
INK = (26, 26, 26)
TEAL = (61, 155, 143)
TEAL2 = (44, 115, 105)
AMBER = (196, 165, 116)
MUTED = (107, 104, 96)
WHITE = (255, 255, 255)
RULE = (221, 220, 213)

FONT_REG = "/usr/share/fonts/truetype/macos/Inter-Regular.ttf"
FONT_MED = "/usr/share/fonts/truetype/macos/Inter-Medium.ttf"
FONT_SEMI = "/usr/share/fonts/truetype/macos/Inter-SemiBold.ttf"
FONT_BOLD = "/usr/share/fonts/truetype/macos/Inter-Bold.ttf"
FONT_MONO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"


def fnt(path: str, size: int) -> ImageFont.FreeTypeFont:
    if os.path.exists(path):
        return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def font(size: int, weight: str = "reg") -> ImageFont.FreeTypeFont:
    return fnt(
        {
            "reg": FONT_REG,
            "med": FONT_MED,
            "semi": FONT_SEMI,
            "bold": FONT_BOLD,
        }.get(weight, FONT_REG),
        size,
    )


def mono(size: int) -> ImageFont.FreeTypeFont:
    return fnt(FONT_MONO, size)


def new_slide() -> tuple[Image.Image, ImageDraw.ImageDraw]:
    img = Image.new("RGB", (W, H), PAPER)
    draw = ImageDraw.Draw(img)
    for y in range(H):
        a = int(12 * (1 - y / H))
        if a <= 0:
            break
        draw.line([(0, y), (W, y)], fill=(PAPER[0] - a // 3, PAPER[1], max(0, PAPER[2] - a // 5)))
    draw.rectangle([0, 0, 8, H], fill=TEAL)
    return img, draw


def footer(draw: ImageDraw.ImageDraw, page: str) -> None:
    draw.text((48, H - 40), "pairband.com  ·  Arc testnet", font=mono(14), fill=MUTED)
    bbox = draw.textbbox((0, 0), page, font=mono(14))
    draw.text((W - 48 - (bbox[2] - bbox[0]), H - 40), page, font=mono(14), fill=MUTED)


def paste_mark(img: Image.Image, xy: tuple[int, int], size: int = 56) -> None:
    mark = BRAND / "pair-mark.png"
    if not mark.exists():
        return
    m = Image.open(mark).convert("RGBA").resize((size, size), Image.Resampling.LANCZOS)
    img.paste(m, xy, m)


def paste_logo(img: Image.Image, name: str, xy: tuple[int, int], size: int) -> None:
    path = BRAND / name
    if not path.exists():
        return
    m = Image.open(path).convert("RGBA")
    m.thumbnail((size, size), Image.Resampling.LANCZOS)
    img.paste(m, xy, m)


def wrap(draw: ImageDraw.ImageDraw, text: str, f: ImageFont.ImageFont, max_w: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    cur = ""
    for w in words:
        trial = f"{cur} {w}".strip()
        if draw.textlength(trial, font=f) <= max_w:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def draw_wrapped(draw, text, xy, f, fill, max_w, gap=6) -> int:
    x, y = xy
    size = getattr(f, "size", 18)
    for line in wrap(draw, text, f, max_w):
        draw.text((x, y), line, font=f, fill=fill)
        y += size + gap
    return y


def eyebrow(draw, text: str, y: int = 40) -> None:
    draw.text((48, y), text, font=mono(15), fill=TEAL2)


# --- Slides ---


def slide_01_cover() -> Image.Image:
    img, draw = new_slide()
    paste_mark(img, (48, 48), 64)
    draw.text((128, 64), "PAIRBAND", font=font(26, "semi"), fill=INK)
    draw.text((48, 170), "USDC-NATIVE LAUNCHPAD ON ARC", font=mono(16), fill=TEAL2)
    draw.text((48, 220), "Cover the downside.", font=font(52, "bold"), fill=INK)
    draw.text((48, 288), "Keep the upside.", font=font(52, "bold"), fill=INK)
    draw_wrapped(
        draw,
        "Bonding curve → locked LP → on-chain book. Settlement on Arc, where USDC is gas.",
        (48, 380),
        font(20),
        MUTED,
        900,
    )
    draw.rounded_rectangle([48, 480, 380, 540], radius=12, fill=TEAL)
    draw.text((72, 498), "pairband.com  ·  live testnet", font=font(16, "semi"), fill=WHITE)
    footer(draw, "01 / 09")
    return img


def slide_02_team() -> Image.Image:
    img, draw = new_slide()
    eyebrow(draw, "02  ·  WHO WE ARE")
    draw.text((48, 78), "Built by operators who ship.", font=font(36, "bold"), fill=INK)

    # Kunal card
    draw.rounded_rectangle([48, 160, 616, 560], radius=18, fill=PAPER2, outline=RULE)
    draw.text((76, 190), "KUNAL", font=mono(14), fill=TEAL2)
    draw.text((76, 220), "Protocol engineer", font=font(26, "semi"), fill=INK)
    draw_wrapped(
        draw,
        "2× Stellar Community Fund awardee. Built Nectar Network and Policywright — markets and policy tooling that already run in production.",
        (76, 280),
        font(17),
        MUTED,
        500,
        8,
    )
    draw.text((76, 430), "nectarnetwork.fun", font=mono(13), fill=TEAL)
    draw.text((76, 458), "policywright.lemmalabs.space", font=mono(13), fill=TEAL)

    # Daksh card
    draw.rounded_rectangle([664, 160, 1232, 560], radius=18, fill=PAPER2, outline=RULE)
    draw.text((692, 190), "DAKSH", font=mono(14), fill=TEAL2)
    draw.text((692, 220), "Frontend engineer", font=font(26, "semi"), fill=INK)
    draw_wrapped(
        draw,
        "Co-awardee, Stellar Community Fund. Owns the Pairband desk — Discover, Trade, Launch — so the product feels as sharp as the contracts.",
        (692, 280),
        font(17),
        MUTED,
        500,
        8,
    )
    draw.text((692, 430), "UI · wallet UX · live tape", font=mono(13), fill=TEAL)

    footer(draw, "02 / 09")
    return img


def slide_03_built() -> Image.Image:
    img, draw = new_slide()
    eyebrow(draw, "03  ·  WHAT WE BUILT")
    draw.text((48, 78), "Pairband — a USDC launchpad", font=font(36, "bold"), fill=INK)
    draw.text((48, 128), "that does not abandon the market.", font=font(36, "bold"), fill=INK)

    points = [
        ("Create", "Launch a token on Arc for a $1 USDC fee."),
        ("Curve", "Fill a constant-product USDC bonding curve."),
        ("Graduate", "At $80 raised — locked pair, burned LP, on-chain book."),
        ("Trade", "Same ticket: book first, AMM residual at 0.30%."),
    ]
    for i, (t, b) in enumerate(points):
        x = 48 + (i % 2) * 600
        y = 220 + (i // 2) * 180
        draw.rounded_rectangle([x, y, x + 560, y + 150], radius=16, fill=PAPER2, outline=RULE)
        draw.text((x + 28, y + 28), f"{i+1:02d}", font=mono(14), fill=TEAL)
        draw.text((x + 28, y + 56), t, font=font(22, "semi"), fill=INK)
        draw_wrapped(draw, b, (x + 28, y + 96), font(16), MUTED, 500, 4)

    footer(draw, "03 / 09")
    return img


def slide_04_how() -> Image.Image:
    img, draw = new_slide()
    eyebrow(draw, "04  ·  HOW IT WORKS")
    draw.text((48, 78), "Architecture in one glance.", font=font(36, "bold"), fill=INK)

    # Flow boxes
    boxes = [
        ("Create", "Launchpad\n$1 USDC"),
        ("Curve", "Bonding\n1.0% + 0.5%"),
        ("Graduate", "AMM pair\nLP → dead"),
        ("Book", "On-chain\nCLOB"),
    ]
    y = 180
    for i, (title, body) in enumerate(boxes):
        x = 56 + i * 300
        draw.rounded_rectangle([x, y, x + 260, y + 160], radius=14, fill=PAPER2, outline=TEAL if i == 2 else RULE, width=2 if i == 2 else 1)
        draw.text((x + 24, y + 28), title, font=font(20, "semi"), fill=INK)
        by = y + 70
        for line in body.split("\n"):
            draw.text((x + 24, by), line, font=font(15), fill=MUTED)
            by += 24
        if i < len(boxes) - 1:
            draw.polygon([(x + 268, y + 75), (x + 288, y + 85), (x + 268, y + 95)], fill=TEAL)

    # Key points
    keys = [
        "USDC in / USDC out — quote and gas on Arc",
        "CCTP path so buyers can pay from connected chains",
        "Market orders walk the book; leftover hits the pair",
        "No unlock cliffs — LP is burned at graduation",
    ]
    for i, k in enumerate(keys):
        y = 390 + i * 48
        draw.ellipse([56, y + 8, 72, y + 24], fill=TEAL)
        draw.text((92, y), k, font=font(18), fill=INK)

    footer(draw, "04 / 09")
    return img


def slide_05_made() -> Image.Image:
    img, draw = new_slide()
    eyebrow(draw, "05  ·  HOW IT’S MADE")
    draw.text((48, 78), "Arc settlement. Uniswap-grade LP.", font=font(34, "bold"), fill=INK)

    cols = [
        (
            "Arc",
            [
                "USDC as gas + quote",
                "Testnet live today",
                "Same bytecode → mainnet",
                "CCTP domain for ingest",
            ],
        ),
        (
            "Uniswap-style AMM",
            [
                "Constant-product pair",
                "0.30% residual fee",
                "LP burned to 0xdead",
                "No unlock politics",
            ],
        ),
        (
            "Pairband stack",
            [
                "Launchpad + token",
                "On-chain order book",
                "Settler / CCTP path",
                "App that speaks the chain",
            ],
        ),
    ]
    for i, (title, items) in enumerate(cols):
        x = 48 + i * 400
        draw.rounded_rectangle([x, 170, x + 370, 560], radius=18, fill=PAPER2, outline=RULE)
        draw.text((x + 28, 200), title, font=font(22, "semi"), fill=TEAL2)
        for j, item in enumerate(items):
            draw.text((x + 28, 270 + j * 52), "▸  " + item, font=font(16), fill=INK)

    # small brand marks if present
    paste_logo(img, "arc-mark.jpg", (70, 500), 40)
    paste_logo(img, "usdc-mark.jpg", (470, 500), 40)

    footer(draw, "05 / 09")
    return img


def slide_06_business() -> Image.Image:
    img, draw = new_slide()
    eyebrow(draw, "06  ·  BUSINESS MODEL")
    draw.text((48, 78), "Fees in the asset everyone holds.", font=font(34, "bold"), fill=INK)

    fees = [
        ("$1", "Launch fee", "USDC on create"),
        ("1.0%", "Protocol", "Of curve volume"),
        ("0.5%", "Creator", "Of curve volume"),
        ("0.30%", "Post-grad", "AMM residual"),
    ]
    for i, (n, t, b) in enumerate(fees):
        x = 48 + i * 300
        draw.rounded_rectangle([x, 180, x + 280, 380], radius=16, fill=PAPER2)
        draw.text((x + 24, 210), n, font=font(40, "bold"), fill=TEAL)
        draw.text((x + 24, 280), t, font=font(20, "semi"), fill=INK)
        draw.text((x + 24, 320), b, font=font(15), fill=MUTED)

    draw_wrapped(
        draw,
        "We earn on real USDC volume — not emissions. Creators earn on their own markets. Graduation burns LP, so we never extract unlock value from trapped liquidity.",
        (48, 440),
        font(18),
        MUTED,
        1100,
    )
    footer(draw, "06 / 09")
    return img


def slide_07_future() -> Image.Image:
    img, draw = new_slide()
    eyebrow(draw, "07  ·  FUTURE WORK")
    draw.text((48, 78), "Mainnet. Then the network.", font=font(36, "bold"), fill=INK)

    phases = [
        ("Now", "Arc testnet", "Live create / buy / sell\npairband.com"),
        ("Sep 2026", "Mainnet", "26 September target\nSame bytecode"),
        ("Q4", "CCTP UX", "Pay from any chain\nSettle on Arc"),
        ("Next", "Creators", "Analytics, tooling\nDeeper book features"),
    ]
    for i, (when, title, body) in enumerate(phases):
        x = 48 + i * 300
        fill = (232, 244, 241) if i == 1 else PAPER2
        draw.rounded_rectangle([x, 180, x + 280, 480], radius=16, fill=fill)
        if i == 1:
            draw.rounded_rectangle([x, 180, x + 280, 480], radius=16, outline=TEAL, width=3)
        draw.text((x + 24, 210), when, font=mono(14), fill=TEAL2)
        draw.text((x + 24, 260), title, font=font(22, "semi"), fill=INK)
        by = 320
        for line in body.split("\n"):
            draw.text((x + 24, by), line, font=font(16), fill=MUTED)
            by += 28

    footer(draw, "07 / 09")
    return img


def slide_08_live() -> Image.Image:
    img, draw = new_slide()
    eyebrow(draw, "08  ·  LIVE NOW")
    draw.text((48, 140), "Check it out.", font=font(48, "bold"), fill=INK)
    draw.text((48, 230), "https://pairband.com", font=font(44, "bold"), fill=TEAL)
    draw_wrapped(
        draw,
        "Connect a wallet on Arc testnet. Create a token. Buy and sell on the live launchpad. Discover syncs on-chain markets.",
        (48, 330),
        font(20),
        MUTED,
        950,
    )
    draw.rounded_rectangle([48, 460, 360, 530], radius=12, fill=TEAL)
    draw.text((80, 482), "Open pairband.com →", font=font(18, "semi"), fill=WHITE)
    footer(draw, "08 / 09")
    return img


def slide_09_thanks() -> Image.Image:
    img, draw = new_slide()
    paste_mark(img, (W // 2 - 40, 140), 80)
    draw.text((W // 2 - 120, 250), "Thank you.", font=font(48, "bold"), fill=INK)
    draw.text((W // 2 - 280, 330), "Cover the downside. Launch the market.", font=font(22), fill=MUTED)
    draw.text((W // 2 - 100, 420), "pairband.com", font=font(24, "semi"), fill=TEAL)
    draw.text((W // 2 - 200, 480), "Kunal  ·  Daksh  ·  Arc testnet", font=mono(14), fill=MUTED)
    footer(draw, "09 / 09")
    return img


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    slides = [
        ("01-cover", slide_01_cover),
        ("02-team", slide_02_team),
        ("03-built", slide_03_built),
        ("04-how", slide_04_how),
        ("05-made", slide_05_made),
        ("06-business", slide_06_business),
        ("07-future", slide_07_future),
        ("08-live", slide_08_live),
        ("09-thanks", slide_09_thanks),
    ]
    for name, fn in slides:
        path = OUT / f"{name}.png"
        fn().save(path, "PNG", optimize=True)
        print(path)


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Render Pairband pitch slides as 1280×720 PNGs for the demo video."""
from __future__ import annotations

import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "screenshots" / "demo-assets" / "pitch-slides"
BRAND = ROOT / "public" / "brand"
W, H = 1280, 720

PAPER = (245, 245, 242)
PAPER2 = (235, 235, 230)
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
    path = {
        "reg": FONT_REG,
        "med": FONT_MED,
        "semi": FONT_SEMI,
        "bold": FONT_BOLD,
    }.get(weight, FONT_REG)
    return fnt(path, size)


def mono(size: int) -> ImageFont.FreeTypeFont:
    return fnt(FONT_MONO, size)


def new_slide() -> tuple[Image.Image, ImageDraw.ImageDraw]:
    img = Image.new("RGB", (W, H), PAPER)
    draw = ImageDraw.Draw(img)
    for y in range(H):
        a = int(14 * (1 - y / H))
        if a <= 0:
            break
        draw.line(
            [(0, y), (W, y)],
            fill=(PAPER[0] - a // 3, PAPER[1], max(0, PAPER[2] - a // 5)),
        )
    draw.rectangle([0, 0, 8, H], fill=TEAL)
    return img, draw


def footer(draw: ImageDraw.ImageDraw, page: str) -> None:
    draw.text((48, H - 42), "pairband.com  ·  Arc testnet", font=mono(15), fill=MUTED)
    bbox = draw.textbbox((0, 0), page, font=mono(15))
    tw = bbox[2] - bbox[0]
    draw.text((W - 48 - tw, H - 42), page, font=mono(15), fill=MUTED)


def paste_mark(img: Image.Image, xy: tuple[int, int], size: int = 56) -> None:
    mark = BRAND / "pair-mark.png"
    if not mark.exists():
        return
    m = Image.open(mark).convert("RGBA")
    m = m.resize((size, size), Image.Resampling.LANCZOS)
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


def draw_wrapped(draw, text, xy, f, fill, max_w, line_gap=8) -> int:
    x, y = xy
    size = getattr(f, "size", 18)
    for line in wrap(draw, text, f, max_w):
        draw.text((x, y), line, font=f, fill=fill)
        y += size + line_gap
    return y


def slide_cover() -> Image.Image:
    img, draw = new_slide()
    paste_mark(img, (48, 48), 64)
    draw.text((128, 64), "PAIRBAND", font=font(26, "semi"), fill=INK)
    draw.text((48, 150), "USDC-NATIVE LAUNCHPAD ON ARC", font=mono(17), fill=TEAL2)
    draw.text((48, 210), "Cover the downside.", font=font(52, "bold"), fill=INK)
    draw.text((48, 278), "Keep the upside.", font=font(52, "bold"), fill=INK)
    draw_wrapped(
        draw,
        "Pay USDC from any CCTP chain. Fill the Arc book. Tokens never leave.",
        (48, 360),
        font(22),
        MUTED,
        780,
    )
    draw.rounded_rectangle([48, 460, 430, 522], radius=12, fill=TEAL)
    draw.text((72, 478), "Live testnet  ·  pairband.com", font=font(17, "semi"), fill=WHITE)
    draw.text((48, 560), "Mainnet target  ·  26 September 2026", font=mono(15), fill=AMBER)
    footer(draw, "01 / 09")
    return img


def slide_problem() -> Image.Image:
    img, draw = new_slide()
    draw.text((48, 40), "01  ·  PROBLEM", font=mono(15), fill=TEAL2)
    draw.text((48, 78), "Launches price risk into the quote", font=font(32, "bold"), fill=INK)
    draw.text((48, 122), "and abandon markets after the curve.", font=font(32, "bold"), fill=INK)
    cards = [
        ("01", "Volatile quote", "ETH/SOL launches force gas-token risk on every fill."),
        ("02", "Liquidity that leaves", "Soft locks and cliffs let early LP exit."),
        ("03", "No post-curve structure", "Thin AMM only — no continuous on-chain book."),
        ("04", "Fragmented USDC UX", "CCTP moves USDC; launches still demand native gas."),
    ]
    x0, y0 = 48, 200
    for i, (n, title, body) in enumerate(cards):
        x = x0 + (i % 2) * 600
        y = y0 + (i // 2) * 200
        draw.rounded_rectangle([x, y, x + 560, y + 170], radius=16, fill=PAPER2, outline=RULE)
        draw.text((x + 24, y + 22), n, font=mono(17), fill=TEAL)
        draw.text((x + 24, y + 56), title, font=font(21, "semi"), fill=INK)
        draw_wrapped(draw, body, (x + 24, y + 96), font(16), MUTED, 500, 4)
    footer(draw, "02 / 09")
    return img


def slide_solution() -> Image.Image:
    img, draw = new_slide()
    draw.text((48, 40), "02  ·  SOLUTION", font=mono(15), fill=TEAL2)
    draw.text((48, 78), "Pairband — USDC curve, locked LP,", font=font(32, "bold"), fill=INK)
    draw.text((48, 122), "on-chain book.", font=font(32, "bold"), fill=INK)
    draw.text(
        (48, 175),
        "One ticket. One quote asset. Settlement on Arc — where USDC is gas.",
        font=font(18),
        fill=MUTED,
    )
    items = [
        ("USDC in & out", "Create, trade, and pay gas in USDC on Arc."),
        ("Honest graduation", "At $80 raised, pair mints. LP burns. No unlock cliff."),
        ("Book on the ticket", "On-chain book opens; residual hits the pair."),
        ("CCTP-ready", "Pay from CCTP chains, settle on Arc."),
    ]
    for i, (t, b) in enumerate(items):
        y = 230 + i * 90
        draw.ellipse([52, y + 8, 72, y + 28], fill=TEAL)
        draw.text((92, y), t, font=font(21, "semi"), fill=INK)
        draw.text((92, y + 34), b, font=font(16), fill=MUTED)
    footer(draw, "03 / 09")
    return img


def slide_how() -> Image.Image:
    img, draw = new_slide()
    draw.text((48, 40), "03  ·  HOW IT WORKS", font=mono(15), fill=TEAL2)
    draw.text((48, 78), "Curve. Pair. Lock.", font=font(40, "bold"), fill=INK)
    steps = [
        ("01", "Create on Arc", "Name, ticker, optional first buy. $1 USDC launch fee. 1B supply."),
        ("02", "Fill the USDC curve", "Constant-product. 1.0% protocol + 0.5% creator in USDC."),
        ("03", "Book, then pair", "At $80 — locked LP, on-chain book, AMM residual at 0.30%."),
    ]
    for i, (n, t, b) in enumerate(steps):
        x = 48 + i * 400
        draw.rounded_rectangle([x, 200, x + 370, 520], radius=18, fill=PAPER2, outline=RULE)
        draw.text((x + 28, 230), n, font=mono(18), fill=TEAL)
        draw.text((x + 28, 280), t, font=font(22, "semi"), fill=INK)
        draw_wrapped(draw, b, (x + 28, 340), font(16), MUTED, 310, 6)
    footer(draw, "04 / 09")
    return img


def slide_why() -> Image.Image:
    img, draw = new_slide()
    draw.text((48, 40), "05  ·  WHY PAIRBAND", font=mono(15), fill=TEAL2)
    draw.text((48, 78), "Market structure as the product.", font=font(34, "bold"), fill=INK)
    rows = [
        ("Quote asset", "Volatile gas token", "USDC (gas + quote)"),
        ("Graduation", "Optional / soft lock", "Hard threshold · LP burned"),
        ("Post-curve", "Thin AMM only", "On-chain book + AMM residual"),
        ("Fees", "Opaque token cuts", "Transparent USDC fees"),
        ("Settlement", "Single-chain silo", "Arc home · CCTP ingest"),
    ]
    y = 160
    draw.text((48, y), "Dimension", font=mono(13), fill=MUTED)
    draw.text((360, y), "Typical launchpad", font=mono(13), fill=MUTED)
    draw.text((780, y), "Pairband", font=mono(13), fill=TEAL2)
    y += 36
    draw.line([(48, y), (W - 48, y)], fill=RULE, width=1)
    y += 16
    for dim, typ, pb in rows:
        draw.text((48, y), dim, font=font(17, "semi"), fill=INK)
        draw.text((360, y), typ, font=font(16), fill=MUTED)
        draw.text((780, y), pb, font=font(16, "semi"), fill=TEAL2)
        y += 72
    footer(draw, "05 / 09")
    return img


def slide_business() -> Image.Image:
    img, draw = new_slide()
    draw.text((48, 40), "07  ·  BUSINESS MODEL", font=mono(15), fill=TEAL2)
    draw.text((48, 78), "Fees in the asset everyone already holds.", font=font(30, "bold"), fill=INK)
    fees = [
        ("$1", "Launch fee", "USDC on create"),
        ("1.0%", "Protocol", "Of curve volume"),
        ("0.5%", "Creator", "Of curve volume"),
        ("0.30%", "Post-grad AMM", "Pair residual"),
    ]
    for i, (n, t, b) in enumerate(fees):
        x = 48 + i * 300
        draw.rounded_rectangle([x, 180, x + 280, 360], radius=16, fill=PAPER2)
        draw.text((x + 24, 210), n, font=font(38, "bold"), fill=TEAL)
        draw.text((x + 24, 275), t, font=font(19, "semi"), fill=INK)
        draw.text((x + 24, 310), b, font=font(14), fill=MUTED)
    draw_wrapped(
        draw,
        "Protocol earns on curve volume — not emissions. Creators earn 0.5% of their own volume. Graduation burns LP — no unlock extraction.",
        (48, 420),
        font(17),
        MUTED,
        1100,
    )
    footer(draw, "06 / 09")
    return img


def slide_live() -> Image.Image:
    img, draw = new_slide()
    draw.text((48, 40), "09  ·  LIVE NOW", font=mono(15), fill=TEAL2)
    draw.text((48, 78), "Check it out on Arc testnet.", font=font(38, "bold"), fill=INK)
    draw.text((48, 150), "pairband.com", font=font(46, "bold"), fill=TEAL)
    draw_wrapped(
        draw,
        "Connect a wallet on Arc testnet. Create a token. Buy and sell on the live launchpad. Discover syncs on-chain markets.",
        (48, 230),
        font(19),
        MUTED,
        900,
    )
    checks = [
        "Launchpad, AMM factory, settler deployed",
        "Create / buy / sell broadcast on-chain by default",
        "Discover separates live markets from demo seed",
        "Docs at docs.pairband.com",
    ]
    for i, c in enumerate(checks):
        y = 340 + i * 48
        draw.text((48, y), "✓", font=font(20, "bold"), fill=TEAL)
        draw.text((88, y), c, font=font(19), fill=INK)
    footer(draw, "07 / 09")
    return img


def slide_roadmap() -> Image.Image:
    img, draw = new_slide()
    draw.text((48, 40), "10  ·  ROADMAP", font=mono(15), fill=TEAL2)
    draw.text((48, 78), "Mainnet readiness · 26 September 2026", font=font(30, "bold"), fill=INK)
    phases = [
        ("Now", "Arc testnet live", "pairband.com · contracts + app"),
        ("Mid Sep", "Hardening", "Load tests · security review"),
        ("26 Sep", "Mainnet launch", "Arc mainnet · same bytecode"),
        ("Q4", "Expand", "CCTP UX · creator tooling"),
    ]
    for i, (when, title, body) in enumerate(phases):
        x = 48 + i * 300
        fill = (232, 244, 241) if i == 2 else PAPER2
        draw.rounded_rectangle([x, 200, x + 280, 420], radius=16, fill=fill)
        if i == 2:
            draw.rounded_rectangle([x, 200, x + 280, 420], radius=16, outline=TEAL, width=3)
        draw.text((x + 24, 230), when, font=mono(15), fill=TEAL2)
        draw.text((x + 24, 280), title, font=font(20, "semi"), fill=INK)
        draw_wrapped(draw, body, (x + 24, 330), font(15), MUTED, 230, 4)
    footer(draw, "08 / 09")
    return img


def slide_close() -> Image.Image:
    img, draw = new_slide()
    paste_mark(img, (W // 2 - 40, 120), 80)
    draw.text((W // 2 - 280, 240), "Cover the downside.", font=font(40, "bold"), fill=INK)
    draw.text((W // 2 - 250, 300), "Launch the market.", font=font(40, "bold"), fill=INK)
    draw.text(
        (W // 2 - 300, 400),
        "Live on Arc testnet  ·  Mainnet 26 Sep 2026",
        font=font(17),
        fill=MUTED,
    )
    draw.rounded_rectangle([W // 2 - 160, 460, W // 2 + 160, 520], radius=12, fill=TEAL)
    label = "pairband.com"
    tw = draw.textlength(label, font=font(21, "semi"))
    draw.text((W // 2 - tw / 2, 478), label, font=font(21, "semi"), fill=WHITE)
    footer(draw, "09 / 09")
    return img


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    slides = [
        ("01-cover", slide_cover),
        ("02-problem", slide_problem),
        ("03-solution", slide_solution),
        ("04-how", slide_how),
        ("05-why", slide_why),
        ("06-business", slide_business),
        ("07-live", slide_live),
        ("08-roadmap", slide_roadmap),
        ("09-close", slide_close),
    ]
    for name, fn in slides:
        path = OUT / f"{name}.png"
        fn().save(path, "PNG", optimize=True)
        print(path)


if __name__ == "__main__":
    main()

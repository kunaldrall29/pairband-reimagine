# Pairband pitch materials

**[`Pairband-Pitch-Deck.pptx`](./Pairband-Pitch-Deck.pptx)** — investor / partner deck (paper · ink · teal).

**[`../../screenshots/pairband-pitch-demo.mp4`](../../screenshots/pairband-pitch-demo.mp4)** — **~3:25** founder pitch + working product demo at 1× speed (GuyNeural voiceover).

## Video structure

| # | Section | Content |
|---|---------|---------|
| 01 | Cover | Pairband — USDC launchpad on Arc |
| 02 | Who we are | **Kunal** (protocol, 2× SCF — Nectar Network, Policywright) & **Daksh** (frontend, co-awardee) |
| 03 | What we built | Create → curve → graduate → book |
| 04 | How it works | Architecture flow + key points |
| — | **Live demo** | Desktop + mobile product walkthrough |
| 05 | How it’s made | Arc + Uniswap-style AMM + Pairband stack |
| 06 | Business model | $1 · 1.0% + 0.5% · 0.30% |
| 07 | Future work | Mainnet 26 Sep 2026 → CCTP UX |
| 08 | Live CTA | **https://pairband.com** |
| 09 | Thanks | Close |

## Rebuild

```bash
python3 scripts/render-pitch-slides.py
node scripts/record-demo.mjs
python3 scripts/assemble-founder-demo.py
```

Slides land in `screenshots/demo-assets/pitch-slides/`. Narration script: `screenshots/demo-assets/founder-narration.txt`.

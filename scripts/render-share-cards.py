"""Render original typographic link cards. Requires Pillow and DejaVu Sans."""
import json
import os
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

SCALE = 2
FONT_DIR = Path(os.environ.get('SHARE_CARD_FONT_DIR', '/usr/share/fonts/truetype/dejavu'))
OUTPUT = Path(__file__).resolve().parent.parent / 'public' / 'social'
OUTPUT.mkdir(parents=True, exist_ok=True)


def font(size, bold=False):
    return ImageFont.truetype(str(FONT_DIR / ('DejaVuSans-Bold.ttf' if bold else 'DejaVuSans.ttf')), size * SCALE)


def render(card):
    image = Image.new('RGB', (1200 * SCALE, 630 * SCALE), '#0b0e14')
    draw = ImageDraw.Draw(image)
    accent = '#ff5266' if card['game'] == 'royal' else '#51c9ee' if card['game'] == 'reload' else '#b9a9ff'

    def box(bounds, fill, radius=0, outline=None):
        draw.rounded_rectangle(tuple(int(n * SCALE) for n in bounds), radius=radius * SCALE, fill=fill, outline=outline, width=2 * SCALE)

    def text(position, value, size, fill='#f5f6fa', bold=False):
        draw.text((position[0] * SCALE, position[1] * SCALE), value, font=font(size, bold), fill=fill, anchor='lt')

    box((0, 0, 1200, 12), accent)
    box((894, 88, 1136, 446), '#121924', 22, '#273345')
    # A small checklist motif echoes the product without pretending to be a save.
    for y, done in [(145, True), (231, True), (317, False)]:
        box((930, y, 966, y + 36), accent if done else '#121924', 7, accent)
        if done:
            draw.line([(939 * SCALE, (y + 18) * SCALE), (946 * SCALE, (y + 25) * SCALE), (958 * SCALE, (y + 11) * SCALE)], fill='#0b0e14', width=4 * SCALE)
        box((986, y + 6, 1098, y + 13), '#7e8c9d', 3)
        box((986, y + 25, 1068, y + 31), '#354255', 3)
    text((64, 57), 'PERSONA TRACKERS', 22, bold=True)
    label = 'ROYAL + RELOAD' if card['game'] == 'both' else 'PERSONA 5 ROYAL' if card['game'] == 'royal' else 'PERSONA 3 RELOAD'
    text((64, 129), label, 23, accent, True)
    title_font = font(60, True)
    lines = []
    for paragraph in card['title'].split('\n'):
        line = ''
        for word in paragraph.split():
            candidate = f'{line} {word}'.strip()
            if draw.textlength(candidate, font=title_font) > 780 * SCALE and line:
                lines.append(line)
                line = word
            else:
                line = candidate
        lines.append(line)
    if len(lines) > 3:
        raise ValueError(f"Share card title needs editing: {card['key']}")
    for i, line in enumerate(lines):
        text((60, 192 + i * 76), line, 60, bold=True)
    text((64, 458), card['subtitle'], 24, '#b9c4d2')
    box((64, 524, 1136, 526), '#293341')
    text((64, 559), 'FREE · NO ACCOUNT · NO ADS', 19, accent, True)
    text((821, 559), 'Unofficial fan tools', 20, '#b9c4d2')
    image.resize((1200, 630), Image.Resampling.LANCZOS).save(OUTPUT / f"{card['key']}.png", optimize=True)


for card in json.load(sys.stdin):
    render(card)

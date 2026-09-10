#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Regenerate the site's book-derived imagery straight from the vector PDF.

    python src/tools/build_assets.py

Why lossless WebP: these are typeset book pages — type and flat colour over
white — so lossless keeps every glyph edge pixel-perfect at a tiny size
(the 900px cover lands around 60–100KB, well within a hero budget).

Outputs (mirrored to assets/readme/ where the README links them):
  public/cover-hero.webp     900px  lossless  landing hero cover
  public/preview-<name>.webp 960px  lossless  landing preview grid
  public/page-<name>.jpg     960px  q95 4:4:4 full-size zoom view

The preview pages are chosen from the shipped PDF:
  toc        p2   the table of contents
  chapter    p4   the first chapter opener
  code       p54  the regex page with a dark code window
  workshop   p135 the 8-mini-project workshop opener
  interview  p144 the 50-interview-questions chapter opener

When the output settings change, bump ASSET_VER — the components append
?v=<ASSET_VER> to these URLs so every visitor drops any older cached copy.
"""
from __future__ import annotations

import pathlib
import shutil

import pymupdf
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[2]
PDF = ROOT / "public" / "pdf" / "JavaScript-Persian-Guide.pdf"

PUBLIC = ROOT / "public"
README_ASSETS = ROOT / "assets" / "readme"

COVER_WIDTH = 900
PREVIEW_WIDTH = 960
JPEG_QUALITY = 95          # plus 4:4:4 — no chroma subsampling on type

ASSET_VER = "2"

PREVIEW_PAGES = {
    "toc": 2,
    "chapter": 4,
    "code": 54,
    "workshop": 135,
    "interview": 144,
}


def render(pno: int, width: int) -> Image.Image:
    doc = pymupdf.open(PDF)
    page = doc[pno - 1]
    zoom = width / page.rect.width
    pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), alpha=False)
    img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    doc.close()
    return img


def main() -> int:
    README_ASSETS.mkdir(parents=True, exist_ok=True)

    cover = render(1, COVER_WIDTH)
    cover.save(PUBLIC / "cover-hero.webp", "WEBP", lossless=True, method=6)
    print(f"cover-hero.webp       {cover.size[0]}x{cover.size[1]}  "
          f"{(PUBLIC / 'cover-hero.webp').stat().st_size // 1024}KB lossless")

    for name, pno in PREVIEW_PAGES.items():
        img = render(pno, PREVIEW_WIDTH)
        webp = PUBLIC / f"preview-{name}.webp"
        img.save(webp, "WEBP", lossless=True, method=6)
        shutil.copyfile(webp, README_ASSETS / webp.name)

        jpg = PUBLIC / f"page-{name}.jpg"
        img.save(jpg, "JPEG", quality=JPEG_QUALITY, subsampling=0, optimize=True)
        shutil.copyfile(jpg, README_ASSETS / jpg.name)

        print(f"preview/page {name:<10} p{pno:<4} {img.size[0]}x{img.size[1]}  "
              f"webp {webp.stat().st_size // 1024}KB lossless · "
              f"jpg {jpg.stat().st_size // 1024}KB q{JPEG_QUALITY} 4:4:4")

    print(f"ASSET_VER = {ASSET_VER}  → components reference these as ?v={ASSET_VER}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

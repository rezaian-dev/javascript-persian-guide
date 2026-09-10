#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Render the online edition's page images from the typeset PDF.

    python src/tools/render_pages.py          # write public/book/pages/
    python src/tools/render_pages.py --check  # fail if the shipped pages are stale

The reader itself is a Next.js route (src/app/book) built from React +
Tailwind components; this script only rasterises the book's pages, which
the reader then serves as crisp, lazy-loaded images.

Chapter anchors and metadata come from the frozen chapter table in
src/edition/chapters.json — the React reader reads the same file.

Three numbers keep the pages honest rather than blurry:

*  **Width.** A page is painted at most `PAINT` CSS px wide, so the file carries `RENDER` px
   — 3x — and stays sharp on high-DPI displays without the browser ever upscaling.
*  **Format.** Lossless WebP. The pages are type and flat colour over a white ground; at this
   width lossless keeps every glyph edge pixel-perfect at ~125 KB a page, which
   matters when a reader loads 156 of them.
*  **Versioning.** The `?v=` cache-busting query on page URLs lives in
   src/lib/links.ts (pageImageUrl). Bump it whenever these render settings
   change so visitors drop older cached copies.
"""
from __future__ import annotations

import argparse
import io
import pathlib
import sys

import pymupdf
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[2]
EDITION_JSON = ROOT / "src" / "edition" / "chapters.json"  # read by the React reader
PDF = ROOT / "public" / "pdf" / "JavaScript-Persian-Guide.pdf"
PAGES_DIR = ROOT / "public" / "book" / "pages"

PAINT = 820        # CSS px a page is painted at, at most
RENDER = PAINT * 3  # px actually stored, for 3x displays
LOSSLESS = True


def render() -> int:
    doc = pymupdf.open(PDF)
    PAGES_DIR.mkdir(parents=True, exist_ok=True)
    total = 0
    for i, page in enumerate(doc, 1):
        zoom = RENDER / page.rect.width
        pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), alpha=False)
        img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
        buf = io.BytesIO()
        img.save(buf, "WEBP", lossless=LOSSLESS, method=6)
        (PAGES_DIR / f"p{i:03d}.webp").write_bytes(buf.getvalue())
        total += buf.getbuffer().nbytes
    n = doc.page_count
    doc.close()
    print(f"pages  : {n}")
    print(f"images : {total/1048576:.1f} MB  (avg {total/n/1024:.0f} KB)")
    print(f"written: {PAGES_DIR}")
    return 0


def check() -> int:
    if not PDF.exists():
        print(f"missing {PDF}")
        return 1
    doc = pymupdf.open(PDF)
    want = doc.page_count
    first_rect = doc[0].rect
    doc.close()
    have = len(list(PAGES_DIR.glob("p*.webp"))) if PAGES_DIR.exists() else 0
    if have != want:
        print(f"STALE — {have} page images, PDF has {want}")
        return 1
    first = Image.open(PAGES_DIR / "p001.webp")
    expect_h = RENDER * first_rect.height / first_rect.width
    if first.size[0] != RENDER or abs(first.size[1] - expect_h) > 2:
        print(f"STALE — first page is {first.size}, expected ~({RENDER}, {expect_h:.0f})")
        return 1
    print(f"OK — {have} pages at {first.size[0]}px")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true", help="fail if public/book/pages is stale")
    args = ap.parse_args()
    return check() if args.check else render()


if __name__ == "__main__":
    sys.exit(main())

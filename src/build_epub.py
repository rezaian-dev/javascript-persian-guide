#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build EPUB from markdown chapters - real, no fake data"""
import pathlib, re
from markdown_it import MarkdownIt
from ebooklib import epub

ROOT = pathlib.Path(__file__).parent
CH_DIR = ROOT / "chapters"
OUT_EPUB = ROOT.parent / "public" / "pdf" / "JavaScript-Persian-Guide.epub"

md = MarkdownIt("commonmark", {"html": True}).enable("table")

def parse_chapter(path):
    raw = path.read_text(encoding="utf-8")
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", raw, re.S)
    meta = {}
    body = raw
    if m:
        for ln in m.group(1).split("\n"):
            if ":" in ln:
                k,v = ln.split(":",1)
                meta[k.strip()] = v.strip()
        body = m.group(2)
    meta.setdefault("num", path.stem[:2])
    return meta, body

files = sorted(CH_DIR.glob("*.md"))
chapters = []
for f in files:
    meta, body = parse_chapter(f)
    chapters.append((meta, body, f))

# Create EPUB
book = epub.EpubBook()
book.set_identifier("js-persian-guide-es2025-1.0.0")
book.set_title("مرجع جامع JavaScript ES2025 — از مبانی تا معماری Production-Level")
book.set_language("fa")
book.add_author("محمدرضا رضائیان")
book.add_metadata("DC", "description", "کامل‌ترین مرجع فارسی JavaScript ES2025: ۳۸ فصل، ۱۵۶ صفحه، از مبانی تا معماری Production-Level")
book.add_metadata("DC", "publisher", "Persian Developer Handbook")
book.add_metadata("DC", "rights", "CC BY-NC-SA 4.0")

# Style
style = """
@font-face { font-family: Vazirmatn; src: url('fonts/Vazirmatn-Regular.ttf'); }
body { font-family: Vazirmatn, Tahoma, sans-serif; direction: rtl; text-align: right; line-height: 1.9; color: #1e293b; }
h1 { font-size: 1.8em; color: #a16207; border-bottom: 2px solid #eab308; padding-bottom: 8px; }
h2 { font-size: 1.4em; color: #0f172a; margin-top: 1.5em; }
h3 { font-size: 1.15em; color: #1e293b; }
pre { background: #1e293b; color: #f8f8f2; padding: 12px; border-radius: 8px; overflow-x: auto; direction: ltr; text-align: left; font-family: 'JetBrains Mono', monospace; font-size: 0.9em; white-space: pre-wrap; }
code { background: #fefce8; color: #713f12; padding: 1px 5px; border-radius: 4px; font-family: 'JetBrains Mono', monospace; direction: ltr; }
table { border-collapse: collapse; width: 100%; margin: 12px 0; }
th { background: #ca8a04; color: #000; padding: 8px; text-align: right; }
td { border-top: 1px solid #e2e8f0; padding: 7px; }
blockquote { border-right: 3px solid #fde68a; background: #fefce8; padding: 8px 12px; border-radius: 6px; margin: 12px 0; }
"""
css = epub.EpubItem(uid="style", file_name="style/style.css", media_type="text/css", content=style)
book.add_item(css)

# Cover - use existing cover image if exists, else create simple
# Add cover image
cover_path = ROOT / "cover-bg.jpg"
if cover_path.exists():
    with open(cover_path, "rb") as f:
        cover_data = f.read()
    cover_img = epub.EpubImage(uid="cover", file_name="images/cover.jpg", media_type="image/jpeg", content=cover_data)
    book.add_item(cover_img)

# Create chapters as epub items
epub_chapters = []
for idx, (meta, body, path) in enumerate(chapters):
    title = re.sub(r"<[^>]+>", "", meta.get("title",""))
    num = meta.get("num","")
    html_body = md.render(body)
    # Full HTML
    full_html = f"""<html dir="rtl" lang="fa"><head><meta charset="utf-8"/><link rel="stylesheet" href="../style/style.css"/></head><body>
<h1>{num} - {title}</h1>
{html_body}
</body></html>"""
    c = epub.EpubHtml(title=title, file_name=f"ch_{num}.xhtml", lang="fa", direction="rtl")
    c.content = full_html
    c.add_item(css)
    book.add_item(c)
    epub_chapters.append(c)

# TOC
book.toc = tuple(epub_chapters)
book.add_item(epub.EpubNcx())
book.add_item(epub.EpubNav())

# Spine
book.spine = ["nav"] + epub_chapters

# Write
OUT_EPUB.parent.mkdir(parents=True, exist_ok=True)
epub.write_epub(str(OUT_EPUB), book, {})
print(f"EPUB written -> {OUT_EPUB} ({OUT_EPUB.stat().st_size//1024} KB) - {len(epub_chapters)} chapters")

# Also count real pages from PDF for verification
try:
    from pypdf import PdfReader
    pdf_path = ROOT.parent / "docs" / "pdf" / "JavaScript-Persian-Guide.pdf"
    if pdf_path.exists():
        r = PdfReader(str(pdf_path))
        print(f"Real PDF pages: {len(r.pages)}")
except Exception as e:
    print(f"PDF count error: {e}")

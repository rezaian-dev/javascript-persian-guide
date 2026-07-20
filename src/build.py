# -*- coding: utf-8 -*-
"""
Build script: Markdown chapters  ->  styled HTML  ->  PDF (WeasyPrint)
Design: JavaScript Persian Guide — Vazirmatn + JetBrains Mono
"""
import re, html, pathlib, sys, time
from markdown_it import MarkdownIt
from pygments import highlight
from pygments.lexers import get_lexer_by_name, TextLexer
from pygments.formatters import HtmlFormatter
from weasyprint import HTML

ROOT = pathlib.Path(__file__).parent
CH_DIR = ROOT / "chapters"
OUT_PDF = ROOT.parent / "docs" / "pdf" / "JavaScript-Persian-Guide.pdf"
OUT_HTML = ROOT / "build" / "book.html"

PARTS = {
    "1": ("بخش یکم", "بنیادها و مدل ذهنی جاوااسکریپت"),
    "2": ("بخش دوم", "جاوااسکریپت مدرن و عمیق"),
    "3": ("بخش سوم", "پیشرفته، معماری و Production"),
    "4": ("بخش چهارم", "کارگاه، نکات طلایی و مصاحبه"),
}

CALLOUT_TITLES = {
    "note": "نکته",
    "tip": "نکته حرفه‌ای",
    "warn": "هشدار",
    "danger": "اشتباه رایج",
    "interview": "سؤالات مصاحبه (با پاسخ)",
    "project": "مینی‌پروژه",
    "exercise": "تمرین",
    "summary": "جمع‌بندی فصل",
    "compare": "مقایسه",
}

FA_DIGITS = str.maketrans("0123456789", "۰۱۲۳۴۵۶۷۸۹")

md = MarkdownIt("commonmark", {"html": True, "typographer": False}).enable("table").enable("strikethrough")

PRINT_MODE = "--print" in sys.argv
MAX_CODE_LINES = 42
BOOK_VERSION = "1.0.0"
EDITION = f"نسخه ۲۰۲۶ · ویرایش {BOOK_VERSION.translate(FA_DIGITS)}"
COVER_EDITION = "نسخه ۲۰۲۶"
formatter = HtmlFormatter(nowrap=True, noclasses=True, style="bw" if PRINT_MODE else "monokai")

def render_fence(self, tokens, idx, options, env):
    tok = tokens[idx]
    info = (tok.info or "").strip()
    lang = info.split(" ")[0] if info else "text"
    m = re.search(r'title="([^\"]*)"', info)
    title = m.group(1) if m else ""
    code = tok.content.rstrip("\n")
    try:
        lexer = get_lexer_by_name(lang)
    except Exception:
        lexer = TextLexer()
    body = highlight(code, lexer, formatter)
    body = re.sub(r'<span style="color: #ed007e; background-color: #1E0010">', '<span style="color: #f8f8f2">', body, flags=re.I)
    nlines = code.count("\n") + 1
    cls = "code"
    if nlines > MAX_CODE_LINES:
        raise SystemExit(f"code block '{title or lang}' has {nlines} lines (> {MAX_CODE_LINES}); split it")
    if "nohead" in info:
        return f'<div class="{cls} bare"><pre>{body}</pre></div>\n'
    label = html.escape(title) if title else (lang.upper() if lang != "text" else "")
    head = (
        '<div class="code-head"><span class="dots"><i></i><i></i><i></i></span>'
        f'<span class="fname">{label}</span></div>'
    )
    return f'<div class="{cls}">{head}<pre>{body}</pre></div>\n'

md.add_render_rule("fence", render_fence)

def render_table_open(self, tokens, idx, options, env):
    return '<div class="tbl-wrap"><table>'

def render_table_close(self, tokens, idx, options, env):
    return "</table></div>"

md.add_render_rule("table_open", render_table_open)
md.add_render_rule("table_close", render_table_close)

def render_heading_open(self, tokens, idx, options, env):
    tag = tokens[idx].tag
    if tag in ("h2", "h3"):
        return f'<{tag}><span class="hx"><span class="hx-t">'
    return f"<{tag}>"

def render_heading_close(self, tokens, idx, options, env):
    tag = tokens[idx].tag
    if tag in ("h2", "h3"):
        return f"</span></span></{tag}>\n"
    return f"</{tag}>\n"

md.add_render_rule("heading_open", render_heading_open)
md.add_render_rule("heading_close", render_heading_close)

def convert_tasklists(text: str) -> str:
    lines = text.split("\n")
    out, i = [], 0
    while i < len(lines):
        if re.match(r"^\s*- \[[ xX]\] ", lines[i]):
            out += ['<div class="checklist">', ""]
            while i < len(lines) and re.match(r"^\s*- \[[ xX]\] ", lines[i]):
                out.append(re.sub(r"^(\s*)- \[[ xX]\] ", r"\1- ", lines[i]))
                i += 1
            out += ["", "</div>"]
            continue
        out.append(lines[i]); i += 1
    return "\n".join(out)

def preprocess(text: str) -> str:
    text = convert_tasklists(text)
    out = []
    stack = []
    for line in text.split("\n"):
        m = re.match(r"^:::\s*([a-z]+)(?:\s+(.*))?$", line)
        if m:
            typ, title = m.group(1), (m.group(2) or "").strip()
            if typ == "cols":
                out.append('<div class="cols">')
                out.append("")
                stack.append("cols")
                continue
            if typ == "col":
                cls = "col"
                mm = re.match(r"^(good|bad)\s+(.*)$", title)
                if mm:
                    cls += " " + mm.group(1)
                    title = mm.group(2)
                out.append(f'<div class="{cls}"><div class="col-title">{html.escape(title)}</div>')
                out.append("")
                stack.append("col")
                continue
            if typ == "steps":
                out.append('<div class="steps">')
                out.append("")
                stack.append("steps")
                continue
            title = title or CALLOUT_TITLES.get(typ, "")
            out.append(f'<div class="callout callout-{typ}"><div class="callout-title">{html.escape(title)}</div>')
            out.append("")
            stack.append("callout")
            continue
        if line.strip() == ":::": 
            out.append("")
            out.append("</div>")
            if stack:
                stack.pop()
            continue
        out.append(line)
    return "\n".join(out)

def parse_chapter(path: pathlib.Path):
    raw = path.read_text(encoding="utf-8")
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", raw, re.S)
    meta = {}
    body = raw
    if m:
        for ln in m.group(1).split("\n"):
            if ":" in ln:
                k, v = ln.split(":", 1)
                meta[k.strip()] = v.strip()
        body = m.group(2)
    meta.setdefault("num", path.stem[:2])
    return meta, body

FIGURE_OPEN = r'<div class="(?:code|tbl-wrap|cols|flow|facts|diagram|steps)[ "]'
_P_BEFORE_FIGURE = re.compile(r'<p>((?:(?!</p>).)*?)</p>(\s*)(?=' + FIGURE_OPEN + ')', re.S)
_P_BEFORE_LIST = re.compile(r'<p>((?:(?!</p>).)*?[:：])</p>(\s*)(?=<(?:ul|ol)[ >])', re.S)
_LIST_BEFORE_FIGURE = re.compile(r'</(ul|ol)>(\s*)(?=' + FIGURE_OPEN + ')')

def keep_with_next(html_body: str) -> str:
    html_body = _P_BEFORE_FIGURE.sub(lambda m: f'<p class="keep-next">{m.group(1)}</p>{m.group(2)}', html_body)
    html_body = _P_BEFORE_LIST.sub(lambda m: f'<p class="keep-next">{m.group(1)}</p>{m.group(2)}', html_body)
    html_body = _LIST_BEFORE_FIGURE.sub(lambda m: f'</{m.group(1)}>{m.group(2)}', html_body)
    html_body = re.sub(r'<li>((?:(?!<li>).)*?)</li>\n</(ul|ol)>(\s*)(?=' + FIGURE_OPEN + ')',
                       lambda m: f'<li class="keep-next">{m.group(1)}</li>\n</{m.group(2)}>{m.group(3)}', html_body, flags=re.S)
    return html_body

def render_chapter(meta, body):
    num = meta["num"]
    cid = f"ch-{num}"
    html_body = keep_with_next(md.render(preprocess(body)))
    lead = f'<p class="lead">{md.renderInline(meta["lead"])}</p>' if meta.get("lead") else ""
    title_html = md.renderInline(meta["title"])
    fa_num = str(int(num)).translate(FA_DIGITS)
    run_title = html.escape(meta.get("short") or re.sub(r"<[^>]+>", "", title_html))
    return f"""
<section class="chapter" id="{cid}">
  <div class="chapter-head">
    <span class="chapter-num">{num}</span>
    <h1 class="chapter-title" data-num="{num}" data-label="فصل {fa_num} · {run_title}">{title_html}</h1>
  </div>
  {lead}
  {html_body}
</section>
"""

JS_LOGO = """<svg viewBox="0 0 32 32" width="{w}" height="{h}" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="6" fill="{bg}"/><g font-family="Arial Black, Arial, sans-serif" font-weight="900" text-anchor="middle" dominant-baseline="middle"><text x="16" y="20" font-size="16" fill="{fg}" letter-spacing="-0.5">JS</text></g></svg>"""

TS_LOGO = """<svg viewBox="0 0 128 128" width="{s}" height="{s}" xmlns="http://www.w3.org/2000/svg"><rect fill="#3178c6" height="128" rx="14" width="128"/><path clip-rule="evenodd" fill-rule="evenodd" fill="#fff" d="m74.2622 99.468v14.026c2.2724 1.168 4.9598 2.045 8.0625 2.629 3.1027.585 6.3728.877 9.8105.877 3.3503 0 6.533-.321 9.5478-.964 3.016-.643 5.659-1.702 7.932-3.178 2.272-1.476 4.071-3.404 5.397-5.786 1.325-2.381 1.988-5.325 1.988-8.8313 0-2.5421-.379-4.7701-1.136-6.6841-.758-1.9139-1.85-3.6159-3.278-5.1062-1.427-1.4902-3.139-2.827-5.134-4.0104-1.996-1.1834-4.246-2.3011-6.752-3.353-1.8352-.7597-3.4812-1.4975-4.9378-2.2134-1.4567-.7159-2.6948-1.4464-3.7144-2.1915-1.0197-.7452-1.8063-1.5341-2.3598-2.3669-.5535-.8327-.8303-1.7751-.8303-2.827 0-.9643.2476-1.8336.7429-2.6079s1.1945-1.4391 2.0976-1.9943c.9031-.5551 2.0101-.9861 3.3211-1.2929 1.311-.3069 2.7676-.4603 4.3699-.4603 1.1658 0 2.3958.0877 3.6928.263 1.296.1753 2.6.4456 3.911.8109 1.311.3652 2.585.8254 3.824 1.3806 1.238.5552 2.381 1.198 3.43 1.9285v-13.1051c-2.127-.8182-4.45-1.4245-6.97-1.819s-5.411-.5917-8.6744-.5917c-3.3211 0-6.4674.3579-9.439 1.0738-2.9715.7159-5.5862 1.8336-7.844 3.353-2.2578 1.5195-4.0422 3.4553-5.3531 5.8075-1.311 2.3522-1.9665 5.1646-1.9665 8.4373 0 4.1785 1.2017 7.7433 3.6052 10.6945 2.4035 2.9513 6.0523 5.4496 10.9466 7.495 1.9228.7889 3.7145 1.5633 5.375 2.323 1.6606.7597 3.0954 1.5486 4.3044 2.3668s2.1628 1.7094 2.8618 2.6736c.7.9643 1.049 2.06 1.049 3.2873 0 .9062-.218 1.7462-.655 2.5202s-1.1 1.446-1.9885 2.016c-.8886.57-1.9956 1.016-3.3212 1.337-1.3255.321-2.8768.482-4.6539.482-3.0299 0-6.0305-.533-9.0021-1.6-2.9715-1.066-5.7245-2.666-8.2591-4.799zm-23.5596-34.9136h18.2974v-11.5544h-51v11.5544h18.2079v51.4456h14.4947z"/></svg>"""

NODE_LOGO = """<svg viewBox="0 0 256 272" width="{w}" height="{h}" xmlns="http://www.w3.org/2000/svg"><path fill="#83CD29" d="M128 0L2 74v148l126 50 126-50V74L128 0z"/><path fill="#fff" d="M128 36L24 92v88l104 56 104-56V92L128 36z"/><path fill="#404137" d="M128 48l-88 48v80l88 48 88-48v-80l-88-48zm0 16l72 40v64l-72 40-72-40v-64l72-40z"/></svg>"""

BUN_LOGO = """<svg viewBox="0 0 32 32" width="{w}" height="{h}" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#fbf0df"/><text x="16" y="22" text-anchor="middle" font-family="monospace" font-weight="800" font-size="16" fill="#000">BUN</text></svg>"""

def cover_html():
    js = JS_LOGO.format(w=36, h=36, bg="#f7df1e", fg="#000")
    tech = "".join(
        f'<span class="tech t-{key}"><span class="tech-mark">{mark}</span><span class="tech-name">{name}</span></span>'
        for key, mark, name in (
            ("js", JS_LOGO.format(w=34, h=34, bg="#f7df1e", fg="#000"), "JavaScript ES2025"),
            ("ts", TS_LOGO.format(s=28), "TypeScript 6"),
            ("node", NODE_LOGO.format(w=30, h=32), "Node.js 22"),
            ("bun", BUN_LOGO.format(w=32, h=32), "Bun / Deno"),
        )
    )
    code_bg = html.escape(
        """// JavaScript — The Weird Parts, Mastered
const memo = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

const fib = memo((n) =>
  n <= 1 ? n : fib(n-1) + fib(n-2)
);

console.log(fib(40)); // ⚡ instant
// Closures · Event Loop · Prototypes
// Proxy · Generators · Performance"""
    )
    return f"""
<section class="cover">
  <pre class="cover-code">{code_bg}</pre>
  <div class="cover-glow g1"></div><div class="cover-glow g2"></div>
  <div class="cover-inner">
    <div class="cover-kicker">PERSIAN DEVELOPER HANDBOOK</div>
    <div class="cover-brand">{js}<span class="brand-txt">JavaScript <em>ES2025</em></span></div>
    <h1 class="cover-title">مرجع جامع و حرفه‌ای</h1>
    <div class="cover-frame">JavaScript</div>
    <div class="cover-line"></div>
    <p class="cover-sub">از مبانی تا معماری <span class="ltr">Production-Level</span></p>
    <div class="cover-tech">{tech}</div>
    <p class="cover-desc">راهنمایی برای جامعه توسعه‌دهندگان فارسی‌زبان، به‌سوی درک عمیق مدل ذهنی، موتور V8، الگوهای مدرن<br/>و استانداردهای واقعی صنعت در جاوااسکریپت — از کلژر تا کانکرنسی، از پراکسی تا پرفورمنس.</p>
    <div class="cover-stats"><span><b>۳۸</b> فصل کاربردی</span><i></i><span>پروژه <b>واقعی</b></span><i></i><span>آمادگی <b>مصاحبه FAANG</b></span></div>
  </div>
  <div class="cover-author"><div class="cover-author-card">
    <img src="author-sq.png" alt="نویسنده"/>
    <div class="ca-text">
      <div class="ca-name">مرجع جاوااسکریپت فارسی</div>
      <div class="ca-role">JavaScript Developer · گردآوری و تدوین حرفه‌ای</div>
      <div class="ca-tag">با هدف ارتقای سطح دانش JS در جامعه فارسی‌زبان</div>
    </div>
  </div></div>
  <div class="cover-foot"><div class="cover-foot-row"><span>{COVER_EDITION}</span><span class="ltr">JavaScript ES2025 · TypeScript · Node.js 22 · V8 Internals</span></div></div>
</section>
"""

def toc_html(chapters):
    items = []
    cur_part = None
    for meta in chapters:
        p = meta.get("part", "1")
        if p != cur_part:
            cur_part = p
            pn, pt = PARTS[p]
            items.append(f'<div class="toc-part"><span class="toc-part-name">{pn}</span> · {pt}</div>')
        ref = f'#ch-{meta["num"]}'
        items.append(
            f'<a class="toc-item" href="{ref}">'
            f'<span class="toc-row"><span class="toc-num">{meta["num"]}</span>'
            f'<span class="toc-title">{md.renderInline(meta["title"])}</span>'
            f'<span class="toc-leader"></span><span class="toc-page" data-ref="{ref}"></span></span>'
            f'</a>'
        )
    return f"""
<section class="toc">
  <h1 class="toc-heading">فهرست مطالب</h1>
  {''.join(items)}
</section>
"""

def closing_html():
    return f"""
<section class="closing">
  <div class="closing-card">
    <div class="closing-kicker">پایان مرجع</div>
    <h1>کدنویسی خوش! 🚀</h1>
    <p>اگر این کتاب برایتان مفید بود، آن را با توسعه‌دهندگان دیگر به اشتراک بگذارید. جاوااسکریپت زبانی است که با فهم عمیقش، هر فریم‌ورکی برایتان ساده می‌شود.</p>
    <div class="closing-tags"><span>JavaScript ES2025</span><span>TypeScript</span><span>Node.js 22</span><span>V8 Engine</span><span>Performance</span></div>
    <div class="closing-links">
      <div><span class="lbl">گیت‌هاب</span><a class="ltr" href="https://github.com/rezaian-dev">github.com/rezaian-dev</a></div>
      <div><span class="lbl">مرجع React 19</span><a class="ltr" href="https://github.com/rezaian-dev/react-19-persian-guide">react-19-persian-guide</a></div>
    </div>
    <div class="closing-author">گردآوری و تدوین حرفه‌ای · {EDITION}</div>
  </div>
</section>
"""

def build(pdf=True):
    t0 = time.time()
    files = sorted(CH_DIR.glob("*.md"))
    chapters = []
    sections = []
    for f in files:
        meta, body = parse_chapter(f)
        chapters.append(meta)
        sections.append(render_chapter(meta, body))
        print(f"  parsed {f.name}: {meta['title']}")

    css = (ROOT / "style.css").read_text(encoding="utf-8")
    if PRINT_MODE:
        css += "\n" + (ROOT / "style-print.css").read_text(encoding="utf-8")
    doc = f"""<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head><meta charset="utf-8"/>
<title>مرجع جامع و حرفه‌ای JavaScript</title>
<meta name="author" content="JavaScript Persian Guide"/>
<meta name="description" content="مرجع فارسی JavaScript ES2025 — از مبانی تا معماری Production-Level"/>
<meta name="keywords" content="JavaScript, ES2025, Persian, فارسی, TypeScript, Node.js, edition {BOOK_VERSION}"/>
<style>{css}</style>
</head>
<body>
{cover_html()}
{toc_html(chapters)}
{''.join(sections)}
{closing_html()}
</body></html>"""
    OUT_HTML.parent.mkdir(exist_ok=True)
    OUT_HTML.write_text(doc, encoding="utf-8")
    print(f"HTML written ({len(doc)//1024} KB) in {time.time()-t0:.1f}s")
    if pdf:
        t1 = time.time()
        OUT_PDF.parent.mkdir(parents=True, exist_ok=True)
        out = ROOT / "JavaScript-Persian-Guide-Print.pdf" if PRINT_MODE else OUT_PDF
        HTML(string=doc, base_url=str(ROOT)).write_pdf(str(out))
        print(f"PDF written -> {out} in {time.time()-t1:.1f}s")

if __name__ == "__main__":
    build(pdf="--html" not in sys.argv)

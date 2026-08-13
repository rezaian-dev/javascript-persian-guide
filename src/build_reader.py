#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""The online edition — all 38 chapters as readable HTML at public/book/.

    python src/build_reader.py          # write public/book/
    python src/build_reader.py --check  # fail if the shipped reader is stale

Unlike the typeset PDF (WeasyPrint, A4), the reader is *screen-first HTML*:
each Markdown chapter is rendered through the very same pipeline as the book
(`build.py`: MarkdownIt + pygments + the ::: callouts), then wrapped in a
dark reading shell — sticky bar with a chapter select, a table-of-contents
drawer, a scroll progress bar and prev/next navigation.

Every chapter gets an `id="ch-NN"` anchor so the site can deep-link to
`book/#ch-07`. All asset URLs are relative (../fonts, ../pdf, ../js-logo-*),
so the reader works both on GitHub Pages (under a basePath) and locally.
"""
from __future__ import annotations

import argparse
import html
import pathlib
import shutil
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import build as book  # noqa: E402  — reuse parse_chapter / render_chapter / PARTS

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "book"
FONTS_SRC = ROOT / "src" / "fonts"
FONTS_DST = ROOT / "public" / "fonts"

SITE = "https://rezaian-dev.github.io/javascript-persian-guide"
REPO = "https://github.com/rezaian-dev/javascript-persian-guide"
BOOK_TITLE = "مرجع فارسی JavaScript ES2025"

FA = "۰۱۲۳۴۵۶۷۸۹"


def fa(n: int | str) -> str:
    return "".join(FA[int(c)] if c.isdigit() else c for c in str(n))


def esc(s: str) -> str:
    return html.escape(s, quote=True)


CSS = """@font-face{font-family:Vazirmatn;src:url(../fonts/Vazirmatn-Regular.woff2) format("woff2");font-weight:400;font-display:swap}
@font-face{font-family:Vazirmatn;src:url(../fonts/Vazirmatn-Medium.woff2) format("woff2");font-weight:500;font-display:swap}
@font-face{font-family:Vazirmatn;src:url(../fonts/Vazirmatn-Bold.woff2) format("woff2");font-weight:700;font-display:swap}
@font-face{font-family:Vazirmatn;src:url(../fonts/Vazirmatn-ExtraBold.woff2) format("woff2");font-weight:800;font-display:swap}
@font-face{font-family:"JetBrains Mono";src:url(../fonts/JetBrainsMono-Regular.woff2) format("woff2");font-weight:400;font-display:swap}
@font-face{font-family:"JetBrains Mono";src:url(../fonts/JetBrainsMono-Bold.woff2) format("woff2");font-weight:700;font-display:swap}

:root{
  --bg:#111a30; --bg-2:#0e1729; --panel:#202b48; --panel-2:#182240;
  --line:hsla(0,0%,100%,.14); --line-2:hsla(0,0%,100%,.08);
  --ink:#f6f8fd; --sub:#b2bcd0; --faint:#8b95ad;
  --accent:247 223 30; --accent-2:34 211 238; --on-accent:#11130a;
  --code-bg:#141d33; --bar-h:60px;
}
*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth;scroll-padding-top:calc(var(--bar-h) + 14px);-webkit-text-size-adjust:100%}
body{margin:0;font-family:Vazirmatn,Tahoma,sans-serif;background:var(--bg);color:var(--ink);
  -webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;overflow-x:hidden}
body::before{content:"";position:fixed;inset:0;z-index:-1;pointer-events:none;
  background:radial-gradient(50rem 34rem at 88% -6%,rgb(var(--accent)/.13),transparent 62%),
             radial-gradient(46rem 32rem at 8% 2%,rgb(var(--accent-2)/.13),transparent 64%),
             linear-gradient(180deg,#0e1729,#111a30 40%,#16203c 100%)}
a{color:inherit}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.skip{position:fixed;top:.7rem;inset-inline-start:1rem;z-index:200;transform:translateY(-8rem);
  padding:.55rem .85rem;border-radius:.6rem;font-weight:800;text-decoration:none;
  background:rgb(var(--accent));color:var(--on-accent)}
.skip:focus{transform:none}
:focus-visible{outline:3px solid rgb(var(--accent));outline-offset:3px;border-radius:8px}

/* ---------- top bar ---------- */
.bar{position:sticky;top:0;z-index:90;background:rgba(17,26,48,.86);
  backdrop-filter:blur(16px) saturate(140%);-webkit-backdrop-filter:blur(16px) saturate(140%);
  border-bottom:1px solid var(--line-2)}
.bar-in{display:flex;align-items:center;gap:12px;min-height:var(--bar-h);
  width:min(1180px,calc(100% - 28px));margin-inline:auto}
.home{display:inline-flex;align-items:center;gap:6px;flex-shrink:0;text-decoration:none;
  font-size:13px;font-weight:700;color:var(--sub);padding:8px 10px;border-radius:10px;
  border:1px solid var(--line);background:rgba(32,43,72,.6);transition:color .16s,border-color .16s}
.home:hover{color:#fff;border-color:rgb(var(--accent)/.5)}
.home svg{width:16px;height:16px}
.ident{display:grid;line-height:1.3;min-width:0;margin-inline-end:auto}
.ident strong{font-size:14px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ident span{font-size:11.5px;color:var(--faint)}
.tools{display:flex;align-items:center;gap:8px;flex-shrink:0}
/* --- chapter select (shadcn/ui Select, vanilla) --- */
.select{position:relative}
.select-trigger{display:inline-flex;align-items:center;gap:8px;min-height:38px;padding:8px 12px;
  font-family:inherit;font-size:12.5px;font-weight:700;color:var(--sub);cursor:pointer;
  background:rgba(32,43,72,.7);border:1px solid var(--line);border-radius:10px;
  transition:color .16s,border-color .16s}
.select-trigger:hover{color:#fff;border-color:rgb(var(--accent)/.55)}
.select-trigger[aria-expanded="true"]{color:#fff;border-color:rgb(var(--accent)/.75)}
.select-value{max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.select-value.ph{color:var(--faint);font-weight:600}
.select-chevron{width:15px;height:15px;flex-shrink:0;opacity:.75;transition:transform .18s}
.select-trigger[aria-expanded="true"] .select-chevron{transform:rotate(180deg)}
.select-pop{position:absolute;top:calc(100% + 8px);inset-inline-end:0;z-index:120;
  width:min(370px,88vw);max-height:min(64vh,500px);overflow-y:auto;overscroll-behavior:contain;
  padding:6px;border:1px solid var(--line);border-radius:14px;background:var(--panel-2);
  box-shadow:0 26px 64px rgba(0,0,0,.5);animation:pop .16s ease}
.select-pop[hidden]{display:none}
.select-pop::-webkit-scrollbar{width:8px}
.select-pop::-webkit-scrollbar-thumb{background:hsla(0,0%,100%,.14);border-radius:8px}
@keyframes pop{from{opacity:0;transform:translateY(-6px) scale(.98)}to{opacity:1;transform:none}}
.select-label{padding:9px 10px 4px;font-size:11px;font-weight:800;letter-spacing:.03em;
  color:rgb(var(--accent))}
.select-item{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:9px;
  padding:8px 10px;border-radius:9px;cursor:pointer;font-size:13px;font-weight:600;color:var(--sub)}
.select-item .n{font-family:"JetBrains Mono",monospace;font-size:10.5px;font-weight:700;
  color:rgb(var(--accent))}
.select-item .t{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.select-item .check{width:15px;height:15px;visibility:hidden;color:rgb(var(--accent))}
.select-item.hl{background:hsla(0,0%,100%,.07);color:#fff}
.select-item[aria-selected="true"]{color:#fff}
.select-item[aria-selected="true"] .check{visibility:visible}
.icon{display:grid;place-items:center;width:38px;height:38px;border-radius:10px;cursor:pointer;
  border:1px solid var(--line);background:rgba(32,43,72,.7);color:var(--ink)}
.icon svg{width:19px;height:19px}
.icon:hover{border-color:rgb(var(--accent)/.5)}
.dl{display:inline-flex;align-items:center;gap:6px;text-decoration:none;font-size:12.5px;font-weight:800;
  padding:9px 13px;border-radius:10px;color:var(--on-accent);
  background:linear-gradient(135deg,rgb(var(--accent)),color-mix(in srgb,rgb(var(--accent)) 70%,rgb(var(--accent-2))));
  box-shadow:0 10px 26px rgb(var(--accent)/.22)}
.dl svg{width:16px;height:16px}
.progress{height:2px;background:transparent}
.progress i{display:block;height:100%;width:0;background:rgb(var(--accent));transition:width .12s linear}

@media (max-width:760px){
  .ident span{display:none}
  .select{display:none}
  .home span{display:none}
  .home{padding:9px}
}

/* ---------- table of contents ---------- */
.scrim{position:fixed;inset:0;z-index:95;background:rgba(6,10,22,.6);
  backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);animation:fade .2s ease}
.toc{position:fixed;z-index:96;inset-block:0;inset-inline-end:0;width:min(430px,90vw);
  display:flex;flex-direction:column;background:var(--panel-2);
  border-inline-start:1px solid var(--line);box-shadow:-30px 0 70px rgba(0,0,0,.42);
  animation:slide .32s cubic-bezier(.22,1,.36,1)}
.toc[hidden],.scrim[hidden]{display:none}
.toc-top{display:flex;align-items:center;justify-content:space-between;gap:10px;
  padding:16px 18px;border-bottom:1px solid var(--line-2)}
.toc-top strong{font-size:15px;font-weight:800}
.toc-body{overflow-y:auto;padding:8px 12px 22px;overscroll-behavior:contain}
.toc-part{margin-top:14px}
.toc-part h3{margin:0 0 8px;padding:0 6px;font-size:11.5px;font-weight:800;letter-spacing:.04em;
  color:rgb(var(--accent))}
.toc-part ol{list-style:none;margin:0;padding:0;display:grid;gap:2px}
.toc-part a{display:grid;grid-template-columns:auto 1fr;align-items:center;gap:10px;
  padding:9px 10px;border-radius:10px;text-decoration:none;transition:background .14s}
.toc-part a:hover{background:hsla(0,0%,100%,.06)}
.toc-part a.on{background:rgb(var(--accent)/.14)}
.toc-part .n{font-family:"JetBrains Mono",monospace;font-size:11px;font-weight:700;
  color:rgb(var(--accent));min-width:20px}
.toc-part .t{display:grid;line-height:1.45;min-width:0}
.toc-part .t{font-size:13.5px;font-weight:700}
.toc-part .t em{font-style:normal;font-size:11.5px;font-weight:500;color:var(--faint);
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

/* ---------- the book ---------- */
.book{width:min(820px,calc(100% - 24px));margin:26px auto 0;display:grid;gap:22px;overflow-anchor:none}
.part-div{text-align:center;margin:12px 0 -4px}
.part-div span{display:block;font-family:"JetBrains Mono",monospace;font-size:11px;font-weight:700;
  letter-spacing:.28em;color:rgb(var(--accent));margin-bottom:6px}
.part-div strong{font-size:clamp(20px,3.4vw,28px);font-weight:800}

.chapter{background:linear-gradient(165deg,rgba(32,43,72,.92),rgba(24,34,60,.78));
  border:1px solid var(--line-2);border-radius:18px;
  padding:clamp(20px,4vw,36px);box-shadow:0 18px 50px rgba(0,0,0,.28)}
.chapter-head{display:grid;gap:10px;margin-bottom:6px}
.chapter-num{font-family:"JetBrains Mono",monospace;font-size:12px;font-weight:700;
  color:var(--on-accent);background:linear-gradient(135deg,rgb(var(--accent)),rgb(var(--accent-2)));
  border-radius:8px;padding:4px 12px;width:max-content;letter-spacing:.12em}
.chapter-title{margin:0;font-size:clamp(22px,4vw,30px);font-weight:800;line-height:1.5}
.lead{margin:14px 0 4px;padding:12px 16px;border-radius:12px;font-size:14.5px;line-height:2.1;
  color:var(--ink);background:rgb(var(--accent)/.08);border:1px solid rgb(var(--accent)/.22);
  border-inline-start:3px solid rgb(var(--accent))}

.chapter h1:not(.chapter-title){font-size:18px;font-weight:800;margin:30px 0 10px;line-height:1.8}
.chapter h2{font-size:20px;font-weight:800;margin:34px 0 12px;line-height:1.8}
.chapter h3{font-size:16.5px;font-weight:800;margin:26px 0 10px;line-height:1.8}
.chapter h4{font-size:15px;font-weight:800;margin:20px 0 8px}
.hx{display:flex;align-items:center;gap:10px}
.hx::before{content:"";width:4px;align-self:stretch;border-radius:4px;flex-shrink:0;
  background:linear-gradient(rgb(var(--accent)),rgb(var(--accent-2)))}
h3 .hx::before{width:3px}
.chapter p{margin:12px 0;line-height:2.15}
.chapter a{color:rgb(var(--accent-2));text-decoration-thickness:1px;text-underline-offset:4px}
.chapter a:hover{color:#a5f3fc}
.chapter strong{color:#fff}
.chapter hr{border:none;border-top:1px dashed var(--line);margin:26px 0}
.chapter ul,.chapter ol{margin:12px 0;padding-inline-start:24px;line-height:2}
.chapter li{margin:7px 0}
.chapter li::marker{color:rgb(var(--accent));font-weight:800}
.chapter blockquote{margin:14px 0;padding:10px 18px;border-radius:12px;color:var(--sub);
  background:hsla(0,0%,100%,.04);border-inline-start:3px solid rgb(var(--accent-2)/.6)}
.chapter blockquote p{margin:8px 0}
.ltr{direction:ltr;unicode-bidi:isolate;font-family:"JetBrains Mono",Consolas,monospace}

/* inline code */
.chapter :not(pre)>code{font-family:"JetBrains Mono",Consolas,monospace;font-size:.84em;
  direction:ltr;unicode-bidi:embed;white-space:nowrap;
  background:rgb(var(--accent)/.12);color:#fde047;border:1px solid rgb(var(--accent)/.25);
  padding:2px 8px;border-radius:7px}

/* code windows (pygments monokai spans inherit their own colours) */
.code{margin:16px 0;border:1px solid var(--line);border-radius:14px;overflow:hidden;
  background:var(--code-bg);box-shadow:0 14px 36px rgba(0,0,0,.3)}
.code-head{display:flex;align-items:center;gap:10px;padding:9px 14px;
  background:hsla(0,0%,100%,.04);border-bottom:1px solid var(--line-2)}
.dots{display:flex;gap:6px}
.dots i{width:10px;height:10px;border-radius:50%}
.dots i:nth-child(1){background:#ff5f57}
.dots i:nth-child(2){background:#febc2e}
.dots i:nth-child(3){background:#28c840}
.fname{margin-inline-start:auto;font-family:"JetBrains Mono",monospace;font-size:12px;
  color:var(--sub);direction:ltr}
.code pre{margin:0;padding:16px;overflow-x:auto;direction:ltr;text-align:left;
  font-family:"JetBrains Mono",Consolas,monospace;font-size:13px;line-height:1.95}
.code pre::-webkit-scrollbar{height:8px}
.code pre::-webkit-scrollbar-thumb{background:hsla(0,0%,100%,.16);border-radius:8px}

/* tables */
.tbl-wrap{margin:16px 0;overflow-x:auto;border:1px solid var(--line);border-radius:14px}
.tbl-wrap table{width:100%;border-collapse:collapse;font-size:13.5px}
.tbl-wrap th{background:rgb(var(--accent)/.12);color:#fde047;font-weight:800;
  padding:10px 14px;border-bottom:1px solid var(--line);white-space:nowrap}
.tbl-wrap td{padding:10px 14px;border-bottom:1px solid var(--line-2);line-height:1.9}
.tbl-wrap tr:last-child td{border-bottom:none}
.tbl-wrap tbody tr:nth-child(even) td{background:hsla(0,0%,100%,.025)}

/* callouts */
.callout{margin:16px 0;padding:14px 16px;border-radius:14px;line-height:2;
  border:1px solid;background:hsla(0,0%,100%,.03)}
.callout p{margin:8px 0}
.callout-title{display:flex;align-items:center;gap:8px;font-weight:800;font-size:14px;margin-bottom:6px}
.callout-title::before{content:"";width:9px;height:9px;border-radius:50%;
  background:currentColor;box-shadow:0 0 10px currentColor;flex-shrink:0}
.callout-note{border-color:rgb(var(--accent)/.4)}
.callout-note .callout-title{color:#fde047}
.callout-tip{border-color:rgb(52 211 153/.4)}
.callout-tip .callout-title{color:#6ee7b7}
.callout-warn{border-color:rgb(251 146 60/.45)}
.callout-warn .callout-title{color:#fdba74}
.callout-danger{border-color:rgb(248 113 113/.45)}
.callout-danger .callout-title{color:#fca5a5}
.callout-interview{border-color:rgb(196 181 253/.45)}
.callout-interview .callout-title{color:#c4b5fd}
.callout-project{border-color:rgb(var(--accent-2)/.45)}
.callout-project .callout-title{color:#67e8f9}
.callout-exercise{border-color:rgb(125 211 252/.45)}
.callout-exercise .callout-title{color:#7dd3fc}
.callout-summary{border-color:rgb(110 231 183/.4)}
.callout-summary .callout-title{color:#6ee7b7}
.callout-compare{border-color:rgb(249 168 212/.4)}
.callout-compare .callout-title{color:#f9a8d4}

/* side-by-side columns */
.cols{display:grid;gap:12px;margin:16px 0}
@media (min-width:640px){.cols{grid-template-columns:1fr 1fr}}
.col{border:1px solid var(--line-2);border-radius:14px;padding:14px 16px;
  background:hsla(0,0%,100%,.02)}
.col-title{font-weight:800;font-size:13.5px;margin-bottom:6px}
.col.good{border-color:rgb(52 211 153/.4)}
.col.good .col-title{color:#6ee7b7}
.col.bad{border-color:rgb(248 113 113/.4)}
.col.bad .col-title{color:#fca5a5}

/* checklists */
.checklist ul{list-style:none;padding-inline-start:4px}
.checklist li{padding:9px 14px;border:1px solid var(--line-2);border-radius:10px;
  background:hsla(0,0%,100%,.02)}
.checklist li::marker{content:none}

/* flow diagrams (raw HTML in the chapters) */
.flow{display:flex;align-items:stretch;gap:8px;margin:16px 0;flex-wrap:wrap}
.box{flex:1 1 180px;border:1px solid rgb(var(--accent-2)/.35);background:rgb(var(--accent-2)/.07);
  border-radius:12px;padding:12px;font-size:13px;line-height:1.9;text-align:center}
.box b{display:block;color:#a5f3fc;margin-bottom:4px}
.box span{font-size:12px !important;color:var(--faint) !important}
.arrow{align-self:center;color:rgb(var(--accent));font-weight:900;font-size:18px}

/* prev / next / source */
.ch-nav{display:flex;gap:10px;margin-top:26px;padding-top:18px;flex-wrap:wrap;
  border-top:1px dashed var(--line)}
.ch-nav a{flex:1 1 200px;display:flex;align-items:center;justify-content:space-between;
  gap:8px;text-decoration:none;font-size:13px;font-weight:700;color:var(--sub);
  border:1px solid var(--line);border-radius:12px;padding:11px 14px;
  transition:border-color .16s,color .16s}
.ch-nav a:hover{color:#fff;border-color:rgb(var(--accent)/.5)}
.ch-nav a small{font-weight:500;color:var(--faint);font-size:11px}
.ch-nav .src{flex:1 1 100%;justify-content:center;font-size:12px;color:var(--faint);
  border-style:dashed}

/* ---------- end ---------- */
.end{width:min(820px,calc(100% - 24px));margin:34px auto 0;padding:26px 0 40px;
  border-top:1px solid var(--line-2);text-align:center}
.end p{margin:0 0 14px;font-size:14px;font-weight:700}
.end-cta{display:flex;flex-wrap:wrap;gap:9px;justify-content:center}
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:9px 16px;
  border-radius:11px;text-decoration:none;font-size:13px;font-weight:800;
  border:1px solid var(--line);background:rgba(32,43,72,.7);color:var(--ink)}
.btn.primary{border-color:transparent;color:var(--on-accent);
  background:linear-gradient(135deg,rgb(var(--accent)),color-mix(in srgb,rgb(var(--accent)) 70%,rgb(var(--accent-2))))}
.end small{display:block;margin-top:16px;font-size:11.5px;color:var(--faint)}

.to-top{position:fixed;inset-block-end:18px;inset-inline-start:18px;z-index:80;
  display:grid;place-items:center;width:44px;height:44px;border-radius:50%;cursor:pointer;
  border:1px solid var(--line);background:rgba(24,34,60,.9);color:var(--ink);
  backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);box-shadow:0 10px 28px rgba(0,0,0,.35)}
.to-top[hidden]{display:none}
.to-top svg{width:20px;height:20px}

@keyframes fade{from{opacity:0}to{opacity:1}}
@keyframes slide{from{transform:translateX(-100%);opacity:.4}to{transform:none;opacity:1}}
@media (prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  .toc,.scrim{animation:none}
}
"""

# Same controller as the Next.js handbook's reader, except the scroll-spy
# observes `.chapter` cards (this reader is HTML, not page images).
JS = """(() => {
  const toc = document.getElementById('toc');
  const scrim = document.getElementById('scrim');
  const btn = document.getElementById('toc-btn');
  const x = document.getElementById('toc-x');
  const jump = document.getElementById('jump');
  const bar = document.getElementById('bar');
  const top = document.getElementById('top');

  const open = () => {
    toc.hidden = false; scrim.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    toc.hidden = true; scrim.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  btn.addEventListener('click', () => (toc.hidden ? open() : close()));
  x.addEventListener('click', close);
  scrim.addEventListener('click', close);
  toc.addEventListener('click', (e) => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !toc.hidden) { close(); btn.focus(); }
  });

  /* --- chapter select (shadcn/ui Select behaviour: keyboard, check, outside-close) --- */
  if (jump && !jump.querySelector('select')) {
    const trigger = jump.querySelector('.select-trigger');
    const value = jump.querySelector('.select-value');
    const pop = jump.querySelector('.select-pop');
    const items = [...jump.querySelectorAll('.select-item')];
    let hl = -1;
    const setHl = (i) => {
      hl = i;
      items.forEach((it, k) => it.classList.toggle('hl', k === i));
      if (i >= 0) {
        // scroll the highlighted row inside the popover only — never the page
        const el = items[i], t = el.offsetTop, b = t + el.offsetHeight;
        if (t < pop.scrollTop) pop.scrollTop = t - 8;
        else if (b > pop.scrollTop + pop.clientHeight) pop.scrollTop = b - pop.clientHeight + 8;
      }
    };
    const setOpen = (o) => {
      pop.hidden = !o;
      trigger.setAttribute('aria-expanded', o ? 'true' : 'false');
      if (o) {
        const cur = items.findIndex((it) => it.getAttribute('aria-selected') === 'true');
        setHl(cur >= 0 ? cur : 0);
      } else setHl(-1);
    };
    const pick = (it) => {
      items.forEach((o) => o.setAttribute('aria-selected', o === it ? 'true' : 'false'));
      value.textContent = it.querySelector('.t').textContent;
      value.classList.remove('ph');
      setOpen(false);
      trigger.focus();
      document.querySelector(it.dataset.value)?.scrollIntoView({ block: 'start' });
    };
    trigger.addEventListener('click', () => setOpen(pop.hidden));
    items.forEach((it) => {
      it.addEventListener('click', () => pick(it));
      it.addEventListener('mousemove', () => setHl(items.indexOf(it)));
    });
    document.addEventListener('pointerdown', (e) => {
      if (!pop.hidden && !jump.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', (e) => {
      if (pop.hidden) {
        if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && document.activeElement === trigger) {
          e.preventDefault(); setOpen(true);
        }
        return;
      }
      if (e.key === 'Escape') { setOpen(false); trigger.focus(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); setHl((hl + 1) % items.length); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setHl((hl - 1 + items.length) % items.length); }
      else if (e.key === 'Home') { e.preventDefault(); setHl(0); }
      else if (e.key === 'End') { e.preventDefault(); setHl(items.length - 1); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (items[hl]) pick(items[hl]); }
    });
    // keep the trigger label in sync with the chapter on screen
    window.__selectSync = (id) => {
      const it = items.find((o) => o.dataset.value === '#' + id);
      if (!it) return;
      items.forEach((o) => o.setAttribute('aria-selected', o === it ? 'true' : 'false'));
      value.textContent = it.querySelector('.t').textContent;
      value.classList.remove('ph');
    };
  }

  top.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  let tick = false;
  const onScroll = () => {
    if (tick) return;
    tick = true;
    requestAnimationFrame(() => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
      top.hidden = window.scrollY < 900;
      tick = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // A hash landing happens before webfonts shift the column; once it has
  // settled, put the chapter head exactly under the bar.
  const settle = (hash) => {
    const el = hash && document.querySelector(hash);
    if (!el) return;
    let n = 0;
    const fix = () => {
      el.scrollIntoView({ block: 'start', behavior: 'auto' });
      if (++n < 3) setTimeout(fix, 220);
    };
    setTimeout(fix, 60);
  };
  if (location.hash) {
    addEventListener('load', () => settle(location.hash));
    settle(location.hash);
  }
  addEventListener('hashchange', () => settle(location.hash));

  // highlight the chapter currently on screen
  const heads = [...document.querySelectorAll('.chapter[id]')];
  const links = new Map([...document.querySelectorAll('.toc-part a')].map((a) => [a.getAttribute('href').slice(1), a]));
  if ('IntersectionObserver' in window && heads.length) {
    let active = null;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const a = links.get(en.target.id);
        if (!a || a === active) return;
        active?.classList.remove('on');
        a.classList.add('on');
        active = a;
        window.__selectSync?.(en.target.id);
      });
    }, { rootMargin: '-15% 0px -70% 0px' });
    heads.forEach((h) => io.observe(h));
  }
})();
"""


def load_chapters() -> list[tuple[pathlib.Path, dict, str]]:
    """Parse every chapter. Returns (path, meta, rendered section HTML)."""
    out = []
    for f in sorted(book.CH_DIR.glob("*.md")):
        meta, body = book.parse_chapter(f)
        out.append((f, meta, book.render_chapter(meta, body)))
    return out


def build_html(chapters: list[tuple[pathlib.Path, dict, str]]) -> str:
    by_part: dict[str, list[tuple[pathlib.Path, dict, str]]] = {}
    for item in chapters:
        by_part.setdefault(item[1].get("part", "1"), []).append(item)

    # ---- table of contents, grouped by part -------------------------------
    toc: list[str] = []
    for pid in sorted(by_part):
        pn, pt = book.PARTS[pid]
        toc.append(f'<section class="toc-part"><h3>{esc(pn)} · {esc(pt)}</h3><ol>')
        for _, meta, _ in by_part[pid]:
            toc.append(
                f'<li><a href="#ch-{meta["num"]}">'
                f'<span class="n">{fa(meta["num"])}</span>'
                f'<span class="t">{esc(meta["title"])}'
                f'<em>{esc(meta.get("subtitle", ""))}</em></span></a></li>'
            )
        toc.append("</ol></section>")

    # ---- chapter select (grouped, with check slot per row) ------------------
    nav: list[str] = []
    for pid in sorted(by_part):
        pn, pt = book.PARTS[pid]
        nav.append(f'<div class="select-label">{esc(pn)} · {esc(pt)}</div>')
        for _, meta, _ in by_part[pid]:
            label = esc(meta.get("short") or meta["title"])
            nav.append(
                f'<div class="select-item" role="option" id="jump-ch-{meta["num"]}" '
                f'data-value="#ch-{meta["num"]}" aria-selected="false">'
                f'<span class="n">{fa(meta["num"])}</span><span class="t">{label}</span>'
                f'<svg class="check" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
                f'stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
                f'<path d="M20 6 9 17l-5-5"/></svg></div>'
            )
    nav_chapters = "".join(nav)

    # ---- the chapters, with part dividers and prev/next --------------------
    parts: list[str] = []
    total = len(chapters)
    for i, (path, meta, section) in enumerate(chapters):
        if i == 0 or chapters[i - 1][1].get("part") != meta.get("part"):
            pn, pt = book.PARTS[meta.get("part", "1")]
            parts.append(
                f'<div class="part-div"><span>{esc(pn)}</span>'
                f"<strong>{esc(pt)}</strong></div>"
            )
        nav_links = []
        if i > 0:
            pm = chapters[i - 1][1]
            nav_links.append(
                f'<a href="#ch-{pm["num"]}"><span>→ فصل قبل</span>'
                f"<small>{esc(pm.get('short') or pm['title'])}</small></a>"
            )
        if i < total - 1:
            nm = chapters[i + 1][1]
            nav_links.append(
                f'<a href="#ch-{nm["num"]}"><span>فصل بعد ←</span>'
                f"<small>{esc(nm.get('short') or nm['title'])}</small></a>"
            )
        nav_links.append(
            f'<a class="src" href="{REPO}/blob/main/src/chapters/{path.name}" '
            f'target="_blank" rel="noopener">مشاهدهٔ سورس این فصل در گیت‌هاب ↗</a>'
        )
        # render_chapter closes its <section>; inject the nav just before it.
        assert section.rstrip().endswith("</section>")
        section = section.rstrip()[: -len("</section>")]
        parts.append(section + f'<nav class="ch-nav">{"".join(nav_links)}</nav>\n</section>\n')

    title = f"{BOOK_TITLE} — نسخهٔ آنلاین"
    desc = (
        f"خواندن آنلاین {BOOK_TITLE}؛ "
        f"{fa(total)} فصل، {fa(156)} صفحه، رایگان و بدون دانلود."
    )

    return f"""<!doctype html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="color-scheme" content="dark">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{SITE}/book/">
<meta name="theme-color" content="#111a30">
<meta property="og:type" content="book">
<meta property="og:locale" content="fa_IR">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{SITE}/book/">
<meta property="og:image" content="{SITE}/social-card.jpg">
<link rel="icon" type="image/png" sizes="64x64" href="../js-logo-64.png">
<link rel="icon" type="image/png" sizes="128x128" href="../js-logo-128.png">
<link rel="preload" href="../fonts/Vazirmatn-Regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="reader.css">
</head>
<body>
<a class="skip" href="#book">پرش به متن کتاب</a>

<header class="bar">
  <div class="bar-in">
    <a class="home" href="../" aria-label="بازگشت به صفحهٔ کتاب">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg>
      <span>صفحهٔ کتاب</span>
    </a>

    <div class="ident">
      <strong>{BOOK_TITLE}</strong>
      <span>نسخهٔ آنلاین · {fa(total)} فصل</span>
    </div>

    <div class="tools">
      <div class="select" id="jump">
        <button type="button" class="select-trigger" aria-haspopup="listbox" aria-expanded="false" aria-label="پرش به فصل">
          <span class="select-value ph">فهرست فصل‌ها…</span>
          <svg class="select-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
        </button>
        <div class="select-pop" role="listbox" aria-label="پرش به فصل" hidden>
          {nav_chapters}
        </div>
      </div>
      <button id="toc-btn" class="icon" type="button" aria-controls="toc" aria-expanded="false" aria-label="فهرست مطالب">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h10"/></svg>
      </button>
      <a class="dl" href="../pdf/JavaScript-Persian-Guide.pdf" download>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4M4 19v2h16v-2"/></svg>
        <span>PDF</span>
      </a>
    </div>
  </div>
  <div class="progress"><i id="bar"></i></div>
</header>

<div class="scrim" id="scrim" hidden></div>
<aside class="toc" id="toc" hidden aria-label="فهرست مطالب">
  <div class="toc-top">
    <strong>فهرست مطالب</strong>
    <button id="toc-x" class="icon" type="button" aria-label="بستن فهرست">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
    </button>
  </div>
  <div class="toc-body">{"".join(toc)}</div>
</aside>

<main class="book" id="book">
{"".join(parts)}
</main>

<footer class="end">
  <p>🎉 به پایان کتاب رسیدی — حالا وقتشه کد بزنی.</p>
  <div class="end-cta">
    <a class="btn primary" href="../pdf/JavaScript-Persian-Guide.pdf" download>دانلود PDF</a>
    <a class="btn" href="../pdf/JavaScript-Persian-Guide.epub" download>دانلود EPUB</a>
    <a class="btn" href="../">صفحهٔ کتاب</a>
  </div>
  <small>© ۲۰۲۶ محمدرضا رضائیان · CC BY-NC-SA 4.0 · رایگان و متن‌باز</small>
</footer>

<button id="top" class="to-top" type="button" aria-label="بازگشت به ابتدا" hidden>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 14 6-6 6 6"/></svg>
</button>

<script src="reader.js" defer></script>
</body>
</html>
"""


def copy_fonts() -> int:
    FONTS_DST.mkdir(parents=True, exist_ok=True)
    n = 0
    for woff2 in sorted(FONTS_SRC.glob("*.woff2")):
        shutil.copyfile(woff2, FONTS_DST / woff2.name)
        n += 1
    return n


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true", help="fail if public/book is stale")
    args = ap.parse_args()

    md_files = sorted(book.CH_DIR.glob("*.md"))
    if not md_files:
        raise SystemExit(f"no chapters in {book.CH_DIR}")

    if args.check:
        html_path = OUT / "index.html"
        if not html_path.exists():
            print("reader: MISSING")
            return 1
        body = html_path.read_text(encoding="utf-8")
        missing = [f.stem[:2] for f in md_files if f'id="ch-{f.stem[:2]}"' not in body]
        if missing:
            print(f"reader: STALE — missing anchors: {', '.join(missing)}")
            return 1
        for extra in ("reader.css", "reader.js"):
            if not (OUT / extra).exists():
                print(f"reader: STALE — missing {extra}")
                return 1
        print(f"reader: OK — {len(md_files)} anchors")
        return 0

    chapters = load_chapters()
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir(parents=True)
    (OUT / "index.html").write_text(build_html(chapters), encoding="utf-8")
    (OUT / "reader.css").write_text(CSS, encoding="utf-8")
    (OUT / "reader.js").write_text(JS, encoding="utf-8")
    n_fonts = copy_fonts()

    kb = (OUT / "index.html").stat().st_size // 1024
    print(f"chapters: {len(chapters)}")
    print(f"anchors : ch-01 … ch-{len(chapters):02d}")
    print(f"fonts   : {n_fonts} woff2 → public/fonts/")
    print(f"written : public/book/index.html ({kb} KB) + reader.css + reader.js")
    return 0


if __name__ == "__main__":
    sys.exit(main())

"use client";

/**
 * The online-edition reader shell — a faithful React rebuild of the old
 * standalone reader: sticky bar with chapter select + TOC drawer, progress
 * line, 156 lazy page images with chapter anchors, per-page zoom links,
 * end-of-book CTAs and a back-to-top control. All Tailwind, no custom CSS.
 *
 * The edition is *photography of a typeset book*: each page is a
 * full-resolution image (see src/tools/render_pages.py) wrapped in a link
 * that opens it in a new tab for free zooming.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUp, Download, ListTree } from "lucide-react";

import ChapterSelect from "@/components/reader/ChapterSelect";
import TocDrawer from "@/components/reader/TocDrawer";
import { PDF_URL, EPUB_URL, pageImageUrl } from "@/lib/links";
import { BOOK_META, PAGE_H, PAGE_W, TOTAL_PAGES, fa, type ReaderChapter } from "@/lib/reader-data";

type Props = {
  chapters: ReaderChapter[];
};

function chapterHash(n: number): string {
  return `#ch-${String(n).padStart(2, "0")}`;
}

export default function ReaderShell({ chapters }: Props) {
  const [tocOpen, setTocOpen] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  const barRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLButtonElement>(null);

  const byPage = useRef<Map<number, ReaderChapter>>(new Map(chapters.map((c) => [c.page, c])));

  /** Scroll a chapter head under the sticky bar (auto for jumps, smooth for TOC). */
  const goTo = useCallback((c: ReaderChapter, behavior: ScrollBehavior = "auto") => {
    history.replaceState(null, "", chapterHash(c.num));
    document.getElementById(`ch-${String(c.num).padStart(2, "0")}`)?.scrollIntoView({ block: "start", behavior });
  }, []);

  // ---- progress bar + back-to-top visibility (refs only, no re-render) ----
  useEffect(() => {
    let tick = false;
    const onScroll = () => {
      if (tick) return;
      tick = true;
      requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        if (barRef.current) barRef.current.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
        if (topRef.current) topRef.current.style.display = window.scrollY < 900 ? "none" : "grid";
        tick = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ---- lock body scroll while the drawer is open ----
  useEffect(() => {
    if (!tocOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [tocOpen]);

  // ---- hash landing: lazy images above the target decode late, so keep
  //      re-settling the chapter head under the bar a few times ----
  useEffect(() => {
    const settle = (hash: string) => {
      const el = hash && document.querySelector(hash);
      if (!el) return;
      let n = 0;
      const fix = () => {
        el.scrollIntoView({ block: "start", behavior: "auto" });
        if (++n < 3) setTimeout(fix, 220);
      };
      setTimeout(fix, 60);
    };
    if (location.hash) settle(location.hash);
    const onHash = () => settle(location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // ---- highlight the chapter currently on screen ----
  useEffect(() => {
    const heads = [...document.querySelectorAll<HTMLElement>("[data-ch-head]")];
    if (!("IntersectionObserver" in window) || heads.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (!en.isIntersecting) continue;
          const n = Number((en.target as HTMLElement).dataset.chHead);
          if (n) setActive(n);
        }
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    heads.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, []);

  const pages: React.ReactNode[] = [];
  for (let i = 1; i <= TOTAL_PAGES; i++) {
    const ch = byPage.current.get(i);
    if (ch) {
      pages.push(
        <div
          key={`ch-${ch.num}`}
          id={`ch-${String(ch.num).padStart(2, "0")}`}
          data-ch-head={ch.num}
          className="mb-1.5 mt-6 scroll-mt-[76px] rounded-2xl border border-white/15 bg-[linear-gradient(145deg,rgb(32_43_72_/_0.9),rgb(24_34_60_/_0.72))] p-[18px_20px]"
        >
          <span className="mb-1.5 block text-[11px] font-extrabold tracking-[0.05em] text-[#f7df1e]">{ch.partName}</span>
          <h2 className="m-0 text-[clamp(18px,2.6vw,23px)] font-extrabold leading-[1.4] text-[#f6f8fd]">
            {fa(String(ch.num).padStart(2, "0"))} · {ch.title}
          </h2>
          {ch.subtitle && <p className="mt-1.5 text-[13.5px] leading-[1.6] text-[#b2bcd0]">{ch.subtitle}</p>}
        </div>,
      );
    }
    const eager = i <= 2;
    pages.push(
      <figure key={`p-${i}`} id={`p-${String(i).padStart(3, "0")}`} className="relative m-0">
        <a
          data-zoom
          href={pageImageUrl(i)}
          target="_blank"
          rel="noopener"
          title={`بازکردن صفحهٔ ${fa(i)} در اندازهٔ کامل`}
          aria-label={`صفحهٔ ${fa(i)} — بازکردن تصویر در اندازهٔ کامل برای بزرگ‌نمایی`}
          className="group relative block rounded-xl outline-offset-[3px] focus-visible:outline-2 focus-visible:outline-[#f7df1e] [-webkit-tap-highlight-color:transparent]"
        >
          <img
            src={pageImageUrl(i)}
            width={PAGE_W}
            height={PAGE_H}
            alt={`صفحه ${fa(i)}`}
            decoding="async"
            loading={eager ? "eager" : "lazy"}
            fetchPriority={eager ? "high" : "auto"}
            className="block w-full rounded-xl border border-white/[0.08] bg-white shadow-[0_14px_40px_rgb(0_0_0_/_0.3)]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-2.5 end-2.5 z-[2] inline-flex items-center gap-1.5 rounded-[9px] border border-white/[0.08] bg-[#111a30]/[0.85] px-2.5 py-[5px] text-[11px] font-bold text-[#f6f8fd] opacity-80 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-[13px] flex-none">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3M11 8v6M8 11h6" />
            </svg>
            بزرگ‌نمایی
          </span>
        </a>
        <figcaption className="absolute bottom-[9px] start-[9px] rounded-md bg-[#111a30]/[0.8] px-[7px] py-[3px] font-mono text-[10px] font-bold text-[#b2bcd0] backdrop-blur-sm">
          {fa(i)}
        </figcaption>
      </figure>,
    );
  }

  return (
    <div className="relative min-h-svh bg-[#111a30] text-[#f6f8fd]">
      {/* ambient backdrop, like the old reader */}
      <span
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(50rem_34rem_at_88%_-6%,rgb(247_223_30_/_0.16),transparent_62%),radial-gradient(46rem_32rem_at_8%_2%,rgb(34_211_238_/_0.16),transparent_64%),linear-gradient(180deg,#0e1729,#111a30_40%,#16203c)]"
      />

      <a
        href="#pages"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-3 focus:z-[200] focus:rounded-[10px] focus:bg-[#f7df1e] focus:px-3.5 focus:py-2 focus:text-[13px] focus:font-extrabold focus:text-[#11130a]"
      >
        پرش به متن کتاب
      </a>

      {/* ---------- sticky bar ---------- */}
      <header className="sticky top-0 z-[90] border-b border-white/[0.08] bg-[#111a30]/[0.86] backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex min-h-[60px] w-[min(1180px,calc(100%-28px))] items-center gap-3">
          <Link
            href="/"
            data-reader-home
            className="inline-flex shrink-0 items-center gap-1.5 rounded-[10px] border border-white/15 bg-[#202b48]/60 px-2.5 py-2 text-[13px] font-bold text-[#b2bcd0] transition-colors hover:border-[#f7df1e]/50 hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden="true">
              <path d="m14 6-6 6 6 6" />
            </svg>
            <span className="hidden md:inline">صفحهٔ کتاب</span>
          </Link>

          <div className="me-auto grid min-w-0 leading-[1.3]">
            <strong className="truncate text-[14px] font-extrabold">{BOOK_META.title}</strong>
            <span className="hidden text-[11.5px] text-[#8b95ad] md:block">
              نسخهٔ آنلاین · {fa(TOTAL_PAGES)} صفحه
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <ChapterSelect chapters={chapters} active={active} onPick={(c) => goTo(c, "auto")} />
            <button
              id="toc-btn"
              type="button"
              aria-controls="toc"
              aria-expanded={tocOpen}
              aria-label="فهرست مطالب"
              onClick={() => setTocOpen((o) => !o)}
              className="grid size-[38px] place-items-center rounded-[10px] border border-white/15 bg-[#202b48]/70 text-[#f6f8fd] transition-colors hover:border-[#f7df1e]/50"
            >
              <ListTree className="size-[19px]" aria-hidden="true" />
            </button>
            <a
              href={PDF_URL}
              download
              className="inline-flex items-center gap-1.5 rounded-[10px] bg-[linear-gradient(135deg,#f7df1e,#b7db5c)] px-[13px] py-[9px] text-[12.5px] font-extrabold text-[#11130a] shadow-[0_10px_26px_rgb(247_223_30_/_0.22)]"
            >
              <Download className="size-4" aria-hidden="true" />
              PDF
            </a>
          </div>
        </div>
        <div className="h-0.5">
          <div ref={barRef} className="h-full w-0 bg-[#f7df1e] transition-[width] duration-100 ease-linear" />
        </div>
      </header>

      <TocDrawer
        open={tocOpen}
        active={active}
        onClose={() => setTocOpen(false)}
        onNavigate={(c) => goTo(c, "smooth")}
      />

      {/* ---------- the pages ---------- */}
      <main id="pages" className="mx-auto mt-6 grid w-[min(820px,calc(100%-24px))] gap-4 [overflow-anchor:none]">
        <p data-zoom-hint className="mb-5 rounded-xl border border-white/[0.08] bg-[#202b48]/[0.5] px-4 py-3 text-[13px] leading-[2] text-[#b2bcd0]">
          📖 نسخهٔ آنلاین، تصویرِ صفحه‌های حروف‌چینی‌شدهٔ کتاب است و متن آن قابل انتخاب نیست. برای بزرگ‌نمایی و زوم آزاد،
          روی هر صفحه کلیک کنید تا تصویرِ تمام‌اندازه در تب جدید باز شود؛ برای متنِ قابل انتخاب و جست‌وجو، نسخهٔ{" "}
          <a href={PDF_URL} download className="font-bold text-[#f7df1e] no-underline [border-bottom:1px_dashed_#f7df1e] hover:opacity-80">
            PDF
          </a>{" "}
          یا{" "}
          <a href={EPUB_URL} download className="font-bold text-[#f7df1e] no-underline [border-bottom:1px_dashed_#f7df1e] hover:opacity-80">
            EPUB
          </a>{" "}
          را بردارید.
        </p>
        {pages}
      </main>

      {/* ---------- end of book ---------- */}
      <footer className="mx-auto w-[min(820px,calc(100%-24px))] border-t border-white/[0.08] pb-10 pt-[26px] text-center">
        <p className="mb-3.5 text-[14px] font-bold">
          پایان کتاب — {fa(TOTAL_PAGES)} صفحه، {fa(chapters.length)} فصل.
        </p>
        <div className="flex flex-wrap justify-center gap-2.5">
          <a
            href={PDF_URL}
            download
            className="inline-flex min-h-[42px] items-center justify-center rounded-[11px] bg-[linear-gradient(135deg,#f7df1e,#b7db5c)] px-4 py-[9px] text-[13px] font-extrabold text-[#11130a] no-underline"
          >
            دانلود PDF
          </a>
          <a
            href={EPUB_URL}
            download
            className="inline-flex min-h-[42px] items-center justify-center rounded-[11px] border border-white/15 bg-[#202b48]/70 px-4 py-[9px] text-[13px] font-extrabold text-[#f6f8fd] no-underline"
          >
            دانلود EPUB
          </a>
          <Link
            href="/"
            className="inline-flex min-h-[42px] items-center justify-center rounded-[11px] border border-white/15 bg-[#202b48]/70 px-4 py-[9px] text-[13px] font-extrabold text-[#f6f8fd] no-underline"
          >
            صفحهٔ کتاب
          </Link>
        </div>
        <small className="mt-4 block text-[11.5px] text-[#8b95ad]">© ۲۰۲۶ محمدرضا رضائیان · CC BY-NC-SA 4.0</small>
      </footer>

      <button
        ref={topRef}
        type="button"
        aria-label="بازگشت به ابتدا"
        style={{ display: "none" }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-[18px] start-[18px] z-[80] grid size-11 place-items-center rounded-full border border-white/15 bg-[#18223c]/[0.9] text-[#f6f8fd] shadow-[0_10px_28px_rgb(0_0_0_/_0.35)] backdrop-blur-md motion-reduce:transition-none"
      >
        <ArrowUp className="size-5" aria-hidden="true" />
      </button>
    </div>
  );
}

/**
 * README / social banner for the Persian JavaScript ES2025 handbook.
 *
 * A fixed 1280×640 (2:1) canvas, exported losslessly to PNG at 3×
 * (3840×1920) via the /banner route — see tools/banner/README.md.
 *
 * Identity: the widely-recognised JavaScript "JS" mark (yellow square,
 * black glyphs) drawn from its precise vector geometry; brand colour
 * #F7DF1E on the site's deep-slate palette. Persian copy stays Persian —
 * the subtitle carries no English jargon — while the decorative code is
 * real, valid JavaScript: the faint background lines come from the book's
 * own cover snippet, and the mini editor card states the book's verified
 * figures (38 chapters, 156 pages, free forever).
 */

import { asset } from "@/lib/links";

/** The JavaScript "JS" badge — exact vector geometry (viewBox 630×630). */
export function JSBadge({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 630 630" role="img" aria-label="JavaScript" className={className}>
      <rect width="630" height="630" fill="#f7df1e" />
      <path
        fill="#11130a"
        d="m423.2 492.19c12.69 20.72 29.2 35.95 58.4 35.95 24.53 0 40.2-12.26 40.2-29.2 0-20.3-16.1-27.49-43.1-39.3l-14.8-6.35c-42.72-18.2-71.1-41-71.1-89.2 0-44.4 33.83-78.2 86.7-78.2 37.64 0 64.7 13.1 84.2 47.4l-46.1 29.6c-10.15-18.2-21.1-25.37-38.1-25.37-17.34 0-28.33 11-28.33 25.37 0 17.76 11 24.95 36.4 35.95l14.8 6.34c50.3 21.57 78.7 43.56 78.7 93 0 53.3-41.87 82.5-98.1 82.5-54.98 0-90.5-26.2-107.88-60.54zm-209.13 5.13c9.3 16.5 17.76 30.45 38.1 30.45 19.45 0 31.72-7.61 31.72-37.2v-201.3h59.2v202.1c0 61.3-35.94 89.2-88.4 89.2-47.4 0-74.85-24.53-88.81-54.075z"
      />
    </svg>
  );
}

const STATS = [
  { icon: "📚", label: "۳۸ فصل" },
  { icon: "📄", label: "۱۵۶ صفحه" },
  { icon: "💻", label: "۱۷۳ پنجرهٔ کد" },
  { icon: "🏷️", label: "ویرایش ۱.۰.۰" },
];

/** Traffic-light dots for the mini editor card. */
function Dots() {
  return (
    <span className="flex items-center gap-1.5" aria-hidden="true">
      <i className="size-2.5 rounded-full bg-[#f87171]" />
      <i className="size-2.5 rounded-full bg-[#fbbf24]" />
      <i className="size-2.5 rounded-full bg-[#34d399]" />
    </span>
  );
}

/**
 * The banner. Sizes are locked to the 1280×640 design grid so the
 * exported PNG is pixel-stable; readability at GitHub's real display
 * widths (880/930px) is asserted by the export script.
 */
export default function ReadmeBanner() {
  return (
    <div
      dir="rtl"
      data-banner
      className="relative flex h-[640px] w-[1280px] flex-col overflow-hidden bg-[#0e1730] font-sans text-white"
    >
      {/* ---- background art ---- */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[6px] bg-linear-to-r from-[#22d3ee] via-[#fde047] to-[#f7df1e]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 start-[-140px] size-[560px] rounded-full bg-[radial-gradient(circle,rgb(247_223_30_/_0.16),transparent_65%)]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-52 end-[-120px] size-[620px] rounded-full bg-[radial-gradient(circle,rgb(34_211_238_/_0.12),transparent_65%)]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* faint, real code from the book's own cover, peeking behind the editor card */}
      <span
        aria-hidden="true"
        dir="ltr"
        className="absolute left-10 top-14 select-none font-mono text-[15px] leading-8 text-white/[0.07]"
      >
        const memo = (fn) =&gt; {'{'}
        <br />
        &nbsp;&nbsp;const cache = new Map();
        <br />
        &nbsp;&nbsp;return (...args) =&gt; {'{'} /* … */ {'}'}
      </span>
      <span
        aria-hidden="true"
        dir="ltr"
        className="absolute bottom-[172px] left-16 select-none font-mono text-[15px] leading-8 text-white/[0.06]"
      >
        export default memo;
      </span>

      {/* ---- main ---- */}
      <div data-banner-main className="relative z-10 flex flex-1 items-center gap-10 px-16 pb-2 pt-14">
        <div className="flex min-w-0 flex-1 flex-col items-start">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-[#f7df1e]/40 bg-[#f7df1e]/10 px-5 py-2 text-[20px] font-bold text-[#fde047]">
            📘 راهنمای فارسی · رایگان و متن‌باز
          </span>

          <h1 className="mt-6 text-[54px] font-extrabold leading-[1.14] tracking-tight">
            مرجع فارسی
            <span
              dir="ltr"
              className="mt-1 block bg-linear-to-br from-[#f7df1e] via-[#fde047] to-[#fef08a] bg-clip-text text-right font-mono text-[62px] font-bold leading-[1.1] text-transparent [text-shadow:0_0_40px_rgb(247_223_30_/_0.25)]"
            >
              JavaScript ES2025
            </span>
          </h1>

          <p className="mt-5 max-w-[560px] text-[25px] font-semibold leading-[1.85] text-[#dbe3f2]">
            از مبانی زبان تا معماری و کد آمادهٔ محصول — با زبان ساده و مثال‌های واقعی
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {STATS.map((s) => (
              <span
                key={s.label}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-[20px] font-bold text-white"
              >
                <span aria-hidden="true">{s.icon}</span>
                {s.label}
              </span>
            ))}
          </div>
        </div>

        {/* visual column: mini editor card + the JS mark, layered for depth */}
        <div className="relative h-[396px] w-[400px] shrink-0">
          {/* editor card */}
          <div
            dir="ltr"
            className="absolute right-0 top-0 w-[320px] overflow-hidden rounded-2xl border border-white/10 bg-[#111b36] shadow-[0_36px_80px_-24px_rgb(0_0_0_/_0.8)]"
          >
            <div className="flex items-center gap-3 border-b border-white/[0.07] bg-white/[0.04] px-4 py-2.5">
              <Dots />
              <span className="font-mono text-[12.5px] font-bold text-white/45">guide.js</span>
            </div>
            <pre className="px-4 py-3.5 text-start font-mono text-[15px] leading-7 text-[#dbe3f2]">
              <code>
                <span className="text-[#b6a1fb]">const</span> <span className="text-[#22d3ee]">book</span> = {'{'}
                <br />
                &nbsp;&nbsp;chapters: <span className="text-[#fde047]">38</span>,
                <br />
                &nbsp;&nbsp;pages: <span className="text-[#fde047]">156</span>,
                <br />
                &nbsp;&nbsp;free: <span className="text-[#34d399]">true</span>,
                <br />
                {'}'};
              </code>
            </pre>
          </div>

          {/* JS mark overlapping the card corner */}
          <div className="absolute bottom-6 left-0 z-10">
            <span
              aria-hidden="true"
              className="absolute inset-[-40px] rounded-full bg-[radial-gradient(circle,rgb(247_223_30_/_0.32),transparent_66%)] blur-xl"
            />
            <div className="relative">
              <JSBadge className="block h-[212px] w-[212px] rounded-[18px] shadow-[0_40px_90px_-24px_rgb(6_10_24_/_0.9),0_0_70px_-18px_rgb(247_223_30_/_0.55)]" />
              <span
                dir="ltr"
                className="absolute -bottom-9 left-1/2 -translate-x-1/2 rounded-lg border border-[#f7df1e]/35 bg-[#111a30]/90 px-3.5 py-1.5 font-mono text-[16px] font-bold text-[#fde047] backdrop-blur"
              >
                ES2025
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ---- footer: its own section, everything below the divider ---- */}
      <div className="relative px-16 pb-12">
        <div data-banner-divider className="h-px w-full bg-white/15" />
        <div data-banner-footer className="mt-7 flex items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <img
              src={asset("/author.webp")}
              alt="محمدرضا رضائیان"
              width={60}
              height={60}
              data-banner-avatar
              className="size-[60px] rounded-full border-2 border-[#f7df1e]/60 object-cover"
            />
            <div className="leading-tight">
              <div className="text-[24px] font-extrabold">محمدرضا رضائیان</div>
              <div className="mt-1 text-[18px] font-medium text-[#a6b2cb]">
                نویسنده · <span dir="ltr" className="font-mono">rezaian-dev</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2.5">
            <span dir="ltr" className="font-mono text-[19px] font-bold text-[#fde047]">
              rezaian-dev.github.io/javascript-persian-guide
            </span>
            <span className="flex items-center gap-3 text-[19px] font-bold text-[#dbe3f2]">
              <span className="rounded-lg border border-white/15 bg-white/[0.06] px-3.5 py-1.5">📕 PDF</span>
              <span className="rounded-lg border border-white/15 bg-white/[0.06] px-3.5 py-1.5">📗 EPUB</span>
              <span className="rounded-lg border border-white/15 px-3.5 py-1.5 text-[18px] text-[#a6b2cb]">⚖️ CC BY-NC-SA 4.0</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

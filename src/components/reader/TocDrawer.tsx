"use client";

/**
 * The table-of-contents drawer — slides in from the inline-end edge,
 * closes on scrim click, Escape or choosing a chapter. Body scroll is
 * locked while open.
 */
import { useEffect } from "react";
import { m, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

import { PART_GROUPS, fa, type ReaderChapter } from "@/lib/reader-data";

const sheet = {
  hidden: { x: "-100%", opacity: 0.4 },
  show: {
    x: "0%",
    opacity: 1,
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: { x: "-100%", opacity: 0.4, transition: { duration: 0.25, ease: "easeIn" as const } },
};

type Props = {
  open: boolean;
  active: number | null;
  onClose: () => void;
  onNavigate: (chapter: ReaderChapter) => void;
};

export default function TocDrawer({ open, active, onClose, onNavigate }: Props) {
  // Escape closes and returns focus to the toggle button.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        document.getElementById("toc-btn")?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <m.button
            type="button"
            aria-label="بستن فهرست"
            className="fixed inset-0 z-[95] bg-[#060a16]/60 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            tabIndex={-1}
          />
          <m.aside
            id="toc"
            aria-label="فهرست مطالب"
            variants={sheet}
            initial="hidden"
            animate="show"
            exit="exit"
            className="fixed inset-y-0 end-0 z-[96] flex w-[min(430px,90vw)] flex-col border-s border-white/15 bg-[#182240] shadow-[30px_0_70px_rgb(0_0_0_/_0.42)] motion-reduce:transition-none"
          >
            <div className="flex items-center justify-between gap-2.5 border-b border-white/[0.08] px-[18px] py-4">
              <strong className="text-[15px] font-extrabold text-[#f6f8fd]">فهرست مطالب</strong>
              <button
                type="button"
                onClick={onClose}
                aria-label="بستن فهرست"
                className="grid size-[38px] place-items-center rounded-[10px] border border-white/15 bg-[#202b48]/70 text-[#f6f8fd] transition-colors hover:border-[#f7df1e]/50"
              >
                <X className="size-[18px]" aria-hidden="true" />
              </button>
            </div>

            <div className="overscroll-contain overflow-y-auto p-3 pb-[22px]">
              {PART_GROUPS.map((part) => (
                <section key={part.num} className="mt-3.5">
                  <h3 className="mb-2 px-1.5 text-[11.5px] font-extrabold tracking-[0.04em] text-[#f7df1e]">
                    بخش {fa(part.num)} · {part.name}
                  </h3>
                  <ol className="grid list-none gap-0.5 p-0">
                    {part.chapters.map((c) => {
                      const on = c.num === active;
                      return (
                        <li key={c.num}>
                          <a
                            href={`#ch-${String(c.num).padStart(2, "0")}`}
                            aria-current={on ? "true" : undefined}
                            onClick={(e) => {
                              e.preventDefault();
                              onNavigate(c);
                              onClose();
                            }}
                            className={`grid grid-cols-[auto_1fr_auto] items-center gap-2.5 rounded-[10px] px-2.5 py-[9px] no-underline transition-colors hover:bg-white/[0.06] ${
                              on ? "bg-[#f7df1e]/[0.14]" : ""
                            }`}
                          >
                            <span dir="ltr" className="min-w-5 font-mono text-[11px] font-bold text-[#f7df1e]">
                              {fa(String(c.num).padStart(2, "0"))}
                            </span>
                            <span className="grid min-w-0 leading-[1.45]">
                              <span className="truncate text-[13.5px] font-bold text-[#f6f8fd]">{c.title}</span>
                              <span className="truncate text-[11.5px] font-medium text-[#8b95ad]">{c.subtitle}</span>
                            </span>
                            <span className="whitespace-nowrap text-[10.5px] text-[#8b95ad]">ص {fa(c.page)}</span>
                          </a>
                        </li>
                      );
                    })}
                  </ol>
                </section>
              ))}
            </div>
          </m.aside>
        </>
      )}
    </AnimatePresence>
  );
}

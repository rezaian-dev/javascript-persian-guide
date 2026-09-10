"use client";

/**
 * Chapter jump — a shadcn/ui-style Select built with Tailwind utilities.
 *
 * Keyboard model (mirrors the old vanilla reader): arrows move the
 * highlight inside the popover only — never the page — Enter/Space picks,
 * Escape closes and returns focus to the trigger, outside click closes.
 */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

import { PART_GROUPS, fa, type ReaderChapter } from "@/lib/reader-data";

type Props = {
  chapters: ReaderChapter[];
  active: number | null;
  onPick: (chapter: ReaderChapter) => void;
};

export default function ChapterSelect({ chapters, active, onPick }: Props) {
  const [open, setOpen] = useState(false);
  const [hl, setHl] = useState(-1);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const activeIndex = chapters.findIndex((c) => c.num === active);
  const current = activeIndex >= 0 ? chapters[activeIndex] : null;

  // Reset highlight to the current chapter whenever the popover opens.
  useEffect(() => {
    if (open) setHl(activeIndex >= 0 ? activeIndex : 0);
  }, [open, activeIndex]);

  // Scroll the highlighted row inside the popover only — never the page.
  useLayoutEffect(() => {
    if (!open || hl < 0) return;
    const el = itemRefs.current[hl];
    const pop = popRef.current;
    if (!el || !pop) return;
    const top = el.offsetTop;
    const bottom = top + el.offsetHeight;
    if (top < pop.scrollTop) pop.scrollTop = top - 8;
    else if (bottom > pop.scrollTop + pop.clientHeight) pop.scrollTop = bottom - pop.clientHeight + 8;
  }, [hl, open]);

  // Global keys while open + outside pointerdown close.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setHl((h) => (h + 1) % chapters.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHl((h) => (h - 1 + chapters.length) % chapters.length);
      } else if (e.key === "Home") {
        e.preventDefault();
        setHl(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setHl(chapters.length - 1);
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const it = chapters[hl];
        if (it) {
          onPick(it);
          setOpen(false);
          triggerRef.current?.focus();
        }
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (!popRef.current?.contains(e.target as Node) && !triggerRef.current?.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open, hl, chapters, onPick]);

  let idx = -1;

  return (
    <div className="relative hidden shrink-0 md:block">
      <button
        ref={triggerRef}
        type="button"
        data-select-trigger
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="پرش به فصل"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className={`inline-flex min-h-[38px] items-center gap-2 rounded-[10px] border bg-[#202b48]/70 px-3 py-2 text-[12.5px] font-bold transition-colors ${
          open ? "border-[#f7df1e]/75 text-white" : "border-white/15 text-[#b2bcd0] hover:border-[#f7df1e]/55 hover:text-white"
        }`}
      >
        <span className={`max-w-[200px] truncate ${current ? "text-inherit" : "font-semibold text-[#8b95ad]"}`}>
          {current ? current.title : "فهرست فصل‌ها…"}
        </span>
        <ChevronDown
          className={`size-[15px] shrink-0 opacity-75 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          ref={popRef}
          role="listbox"
          aria-label="پرش به فصل"
          aria-activedescendant={hl >= 0 ? `jump-ch-${chapters[hl]?.num}` : undefined}
          className="absolute end-0 top-[calc(100%+8px)] z-[120] max-h-[min(64vh,500px)] w-[min(370px,88vw)] overflow-y-auto overscroll-contain rounded-[14px] border border-white/15 bg-[#182240] p-1.5 shadow-[0_26px_64px_rgb(0_0_0_/_0.5)]"
        >
          {PART_GROUPS.map((part) => (
            <div key={part.num}>
              <div className="px-2.5 pb-1 pt-2.5 text-[11px] font-extrabold tracking-[0.03em] text-[#f7df1e]">
                بخش {fa(part.num)} · {part.name}
              </div>
              {part.chapters.map((c) => {
                idx += 1;
                const i = idx;
                const selected = c.num === active;
                return (
                  <div
                    key={c.num}
                    ref={(el) => {
                      itemRefs.current[i] = el;
                    }}
                    id={`jump-ch-${c.num}`}
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      onPick(c);
                      setOpen(false);
                      triggerRef.current?.focus();
                    }}
                    onMouseMove={() => setHl(i)}
                    className={`grid cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-2.5 rounded-[9px] px-2.5 py-2 text-[13px] font-semibold transition-colors ${
                      hl === i ? "bg-white/[0.07] text-white" : "text-[#b2bcd0]"
                    } ${selected ? "text-white" : ""}`}
                  >
                    <span dir="ltr" className="font-mono text-[10.5px] font-bold text-[#f7df1e]">
                      {fa(String(c.num).padStart(2, "0"))}
                    </span>
                    <span className="min-w-0 truncate">{c.title}</span>
                    <Check className={`size-[15px] ${selected ? "text-[#f7df1e]" : "invisible"}`} aria-hidden="true" />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

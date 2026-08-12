"use client";

import Link from "next/link";
import { m, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { BookOpen, Download, Check, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Magnetic from "@/components/motion/Magnetic";
import { asset, BOOK_URL, PDF_URL } from "@/lib/links";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: "easeOut" as const } },
};

export default function Hero() {
  const stageRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [9, -9]), { stiffness: 120, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-11, 11]), { stiffness: 120, damping: 18 });

  return (
    <section className="flex min-h-svh items-center pb-16 pt-32 md:pt-40" id="top">
      <div className="container grid items-center gap-12 lg:grid-cols-[1.06fr_0.8fr] lg:gap-16">
        <m.div variants={container} initial="hidden" animate="show">
          <m.div variants={item}>
            <Badge variant="outline" className="gap-2 px-4 py-2 text-[13px] text-sub">
              <i className="size-2 animate-pulse-dot rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
              ویرایش ۲۰۲۶ · JavaScript ES2025 · رایگان و متن‌باز
            </Badge>
          </m.div>

          <m.h1
            variants={item}
            dir="ltr"
            className="mt-6 text-end font-mono text-[clamp(40px,7.6vw,84px)] font-extrabold leading-[1.06] tracking-tight"
          >
            JavaScript
            <span className="grad-text block">ES2025</span>
          </m.h1>

          <m.p variants={item} className="mt-5 max-w-xl text-lg font-semibold leading-9 text-sub md:text-xl">
            از Scope و Closure تا Event Loop، موتور V8 و معماری Production.‏
          </m.p>

          <m.p variants={item} className="mt-3 max-w-xl text-[15px] leading-7 text-muted-foreground">
            یاد می‌گیری موتور چطور فکر می‌کند، چرا{" "}
            <code className="whitespace-nowrap rounded-md border border-border bg-secondary/60 px-1.5 py-0.5 font-mono text-[13px] text-primary-soft">
              Promise
            </code>{" "}
            قبل از{" "}
            <code className="whitespace-nowrap rounded-md border border-border bg-secondary/60 px-1.5 py-0.5 font-mono text-[13px] text-primary-soft">
              setTimeout
            </code>{" "}
            اجرا می‌شود و کِی کدت Leak می‌دهد — ۳۸ فصل، ۱۵۶ صفحه.
          </m.p>

          <m.div variants={item} className="mt-8 flex flex-wrap gap-3">
            <Magnetic>
              <Button asChild size="lg">
                <Link href={BOOK_URL}>
                  <BookOpen /> مطالعه آنلاین
                </Link>
              </Button>
            </Magnetic>
            <Magnetic>
              <Button asChild size="lg" variant="outline">
                <a href={PDF_URL} download>
                  <Download /> دانلود PDF
                </a>
              </Button>
            </Magnetic>
          </m.div>

          <m.div variants={item} className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Check className="size-4 text-primary" /> ۳۸ فصل ساختاریافته</span>
            <span className="flex items-center gap-1.5"><Sparkles className="size-4 text-primary" /> آنلاین · PDF · EPUB</span>
            <span className="flex items-center gap-1.5"><Check className="size-4 text-primary" /> مجوز CC BY-NC-SA 4.0</span>
          </m.div>
        </m.div>

        <m.div
          ref={stageRef}
          className="relative mx-auto w-full max-w-[360px]"
          style={{ perspective: 1400 }}
          initial={{ opacity: 0, scale: 0.86, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.25, ease: "easeOut" }}
          onMouseMove={(e) => {
            const r = stageRef.current?.getBoundingClientRect();
            if (!r) return;
            mx.set((e.clientX - r.left) / r.width);
            my.set((e.clientY - r.top) / r.height);
          }}
          onMouseLeave={() => {
            mx.set(0.5);
            my.set(0.5);
          }}
        >
          <div
            className="absolute inset-0 -z-10 rounded-full bg-[radial-gradient(circle,rgb(247_223_30_/_0.24),rgb(34_211_238_/_0.12)_45%,transparent_70%)] blur-[30px]"
            aria-hidden="true"
          />

          <m.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}>
            <m.div className="animate-float rounded-[22px] border border-input shadow-[0_50px_130px_-30px_rgb(6_10_24_/_0.7),0_0_90px_-30px_rgb(247_223_30_/_0.4)] motion-reduce:animate-none">
              {/* Three pre-rendered widths ship in public/. next/image can't
                  optimize on Pages (`images.unoptimized`), so drive the srcset
                  directly instead of serving the 900 px master to phones. */}
              <img
                src={asset("/cover-hero.webp")}
                srcSet={`${asset("/cover-hero-480.webp")} 480w, ${asset("/cover-hero-720.webp")} 720w, ${asset("/cover-hero.webp")} 900w`}
                sizes="(max-width: 640px) 78vw, 360px"
                alt="جلد مرجع فارسی JavaScript ES2025"
                width={900}
                height={1274}
                fetchPriority="high"
                decoding="async"
                className="h-auto w-full rounded-[22px]"
              />
            </m.div>
          </m.div>

          <span className="absolute top-[8%] -start-1.5 animate-float rounded-full border border-input bg-popover/85 px-3.5 py-2 text-xs font-bold shadow-xl backdrop-blur-md [animation-delay:0.3s] motion-reduce:animate-none">
            📖 ۳۸ فصل
          </span>
          <span className="absolute top-[46%] -end-1.5 animate-float rounded-full border border-input bg-popover/85 px-3.5 py-2 text-xs font-bold shadow-xl backdrop-blur-md [animation-delay:1s] motion-reduce:animate-none">
            ⚡ Event Loop
          </span>
          <span className="absolute bottom-[6%] start-2 animate-float rounded-full border border-input bg-popover/85 px-3.5 py-2 text-xs font-bold shadow-xl backdrop-blur-md [animation-delay:1.7s] motion-reduce:animate-none">
            💛 رایگان
          </span>
        </m.div>
      </div>

      <m.a
        href="#stats"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.28em] text-faint md:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        aria-label="پیمایش به پایین"
      >
        <span className="flex h-8 w-[22px] justify-center rounded-full border-[1.5px] border-input pt-1.5">
          <i className="h-2 w-[3px] animate-wheel rounded-sm bg-primary" />
        </span>
        scroll
      </m.a>
    </section>
  );
}

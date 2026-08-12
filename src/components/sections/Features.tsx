"use client";

import { Brain, Sparkles, RefreshCw, Gauge, ShieldCheck, GraduationCap } from "lucide-react";

import SectionHeader from "@/components/layout/SectionHeader";
import Reveal from "@/components/motion/Reveal";
import TiltCard from "@/components/motion/TiltCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FEATURES = [
  { icon: Brain, title: "مدل ذهنی زبان، روشن", text: "می‌فهمی موتور چطور فکر می‌کند: `Scope`، `Closure`، `this` و Prototype — نه فقط چه سینتکسی بنویسی." },
  { icon: Sparkles, title: "همگام با ES2025", text: "قابلیت‌های مدرن مثل `using`، متدهای Set و `Promise.withResolvers` کنار مرزبندی روشن با کد Legacy." },
  { icon: RefreshCw, title: "ناهمگامی عمیق", text: "‏`Event Loop`، صف Microtask، `Promise` و `async/await`؛ می‌دانی چرا ترتیب اجرا همان است که هست." },
  { icon: Gauge, title: "V8 و Performance", text: "‏Hidden Class‏، بهینه‌سازی TurboFan‏، ‏Garbage Collection‏ و شکار Memory Leak با نگاه عملی." },
  { icon: ShieldCheck, title: "امنیت و تست", text: "XSS‏، Prototype Pollution‏، مدیریت خطا و تست مدرن؛ کدی که در Production قابل دفاع باشد." },
  { icon: GraduationCap, title: "کارگاه و مصاحبه", text: "هشت مینی‌پروژه، بیست نکتهٔ طلایی و سی‌وسه جعبهٔ پرسش مصاحبه از Junior تا Senior." },
];

export default function Features() {
  return (
    <section className="py-24 md:py-32" id="features">
      <div className="container">
        <SectionHeader
          eyebrow="Why this guide"
          title={<>مدل ذهنی، <span className="grad-text">نه حفظ API</span></>}
          lead="هر مفهوم اول روی مدل اجرای موتور می‌نشیند؛ بعد در کد واقعی و مینی‌پروژه پیاده می‌شود."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 0.08}>
              <TiltCard className="h-full">
                <Card className="h-full">
                  <CardHeader>
                    <span className="mb-1 grid size-12 place-items-center rounded-[14px] border border-primary/25 bg-linear-to-br from-primary/15 to-sky/10 text-primary-soft">
                      <f.icon className="size-6" />
                    </span>
                    <CardTitle className="text-[17px]">{f.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 text-[13.5px] leading-7 text-muted-foreground">
                    {f.text.split("`").map((p, j) =>
                      j % 2 === 1 ? (
                        <code key={j} className="rounded-md border border-border bg-secondary/60 px-1.5 py-0.5 font-mono text-xs text-primary-soft">{p}</code>
                      ) : (
                        <span key={j}>{p}</span>
                      )
                    )}
                  </CardContent>
                </Card>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

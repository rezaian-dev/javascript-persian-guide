import { Zap } from "lucide-react";

const ITEMS = [
  "Closure",
  "Event Loop",
  "Promise",
  "Async/Await",
  "Prototype",
  "this",
  "ESM",
  "Destructuring",
  "Generator",
  "Proxy",
  "Map & Set",
  "V8",
  "Hoisting",
  "TDZ",
  "Optional Chaining",
  "Strict Mode",
];

function Row() {
  return (
    <>
      {ITEMS.map((t) => (
        <span
          key={t}
          dir="ltr"
          className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-border bg-secondary/50 px-4 py-2.5 font-mono text-[13px] text-sub"
        >
          <Zap className="size-3.5 text-primary" />
          {t}
        </span>
      ))}
    </>
  );
}

export default function Marquee() {
  return (
    <div className="marquee-mask mt-16 overflow-hidden border-y border-border bg-secondary/30 py-6" aria-hidden="true">
      <div dir="ltr" className="flex w-max animate-marquee gap-3.5 hover:[animation-play-state:paused] motion-reduce:animate-none">
        <Row />
        <Row />
      </div>
    </div>
  );
}

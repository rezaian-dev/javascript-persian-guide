export type Chapter = { n: number; title: string; subtitle: string; slug: string };

export type Part = {
  id: string;
  emoji: string;
  label: string;
  range: string;
  tagline: string;
  outcome: string;
  chapters: Chapter[];
};

export const PARTS: Part[] = [
  {
    id: "part-1",
    emoji: "🌱",
    label: "بنیادها و مدل ذهنی",
    range: "فصل‌های ۱ تا ۱۲",
    tagline: "انواع داده، Scope، توابع، Closure، اشیا، Prototype، ‏this‏ و مقدمهٔ ناهمگام.",
    outcome: "ساخت مدل ذهنی و درک رفتار پایه.",
    chapters: [
      { n: 1, title: "معرفی JS و نقشه راه", subtitle: "تاریخچه، اکوسیستم، موتور V8 و چگونه این کتاب را بخوانیم", slug: "01-intro" },
      { n: 2, title: "محیط توسعه مدرن", subtitle: "Bun, pnpm, ESM, Biome و VS Code که Seniorها استفاده می‌کنند", slug: "02-setup" },
      { n: 3, title: "انواع داده و نوع", subtitle: "Primitive vs Object، Coercion، Equality و مدل حافظه", slug: "03-types-values" },
      { n: 4, title: "متغیرها و Scope", subtitle: "دلایل منسوخ شدن var و let و const چگونه کار می‌کنند، و Scope Chain چیست", slug: "04-variables-scope" },
      { n: 5, title: "عملگرها و کنترل جریان", subtitle: "Optional Chaining، Nullish Coalescing، و کد تخت", slug: "05-operators-control" },
      { n: 6, title: "توابع — قلب JS", subtitle: "Declaration، Expression، Arrow، First-Class و مدل ذهنی تابع به‌عنوان مقدار", slug: "06-functions" },
      { n: 7, title: "کلژر و Scope Chain", subtitle: "کوله‌پشتی تابع، ماژول خصوصی، Memoization و چرا React Hooks کلژر است", slug: "07-closures-scope-chain" },
      { n: 8, title: "اشیا و پروتوتایپ", subtitle: "Prototype Chain، __proto__، کلاس فقط قند است", slug: "08-objects-prototypes" },
      { n: 9, title: "آرایه‌ها", subtitle: "Mutating vs Non-Mutating، متدهای ES2023/2024، و پرفورمنس", slug: "09-arrays" },
      { n: 10, title: "رشته‌ها و Regex", subtitle: "رشته immutable، Emoji و Regex مدرن", slug: "10-strings-regex" },
      { n: 11, title: "this — راز بزرگ", subtitle: "Default، Implicit، Explicit، new و Arrow — و باگ گم شدن this", slug: "11-this-binding" },
      { n: 12, title: "مقدمه Async", subtitle: "تک‌نخی ولی غیربلاک، Callback، Promise و ۳ حالت آن", slug: "12-async-intro" },
    ],
  },
  {
    id: "part-2",
    emoji: "🧩",
    label: "JavaScript مدرن و عمیق",
    range: "فصل‌های ۱۳ تا ۲۴",
    tagline: "‏Destructuring‏، ‏Promise‏، ‏Event Loop‏، ماژول، ‏Proxy‏، ‏DOM‏ و ‏API‏های مرورگر.",
    outcome: "تسلط بر الگوها و قابلیت‌های مدرن.",
    chapters: [
      { n: 13, title: "Destructuring و Spread", subtitle: "الگوهای مدرن برای کد تمیز", slug: "13-destructuring-spread" },
      { n: 14, title: "Iterator و Generator", subtitle: "پروتکل تکرار، yield", slug: "14-iterators-generators" },
      { n: 15, title: "Promise و Async/Await", subtitle: "از تئوری تا الگوهای Production", slug: "15-promise-async-await" },
      { n: 16, title: "Event Loop", subtitle: "Call Stack، Microtask، Macrotask", slug: "16-event-loop-concurrency" },
      { n: 17, title: "ماژول‌ها ESM/CJS", subtitle: "Tree Shaking، Dynamic Import", slug: "17-modules-esm-cjs" },
      { n: 18, title: "کلاس‌ها و OOP", subtitle: "Private Fields، Inheritance، Mixins", slug: "18-classes-oop" },
      { n: 19, title: "مدیریت خطا", subtitle: "Error Types، Cause، الگوهای Production", slug: "19-error-handling" },
      { n: 20, title: "Map و Set", subtitle: "Map، Set، WeakMap، WeakSet", slug: "20-collections-map-set" },
      { n: 21, title: "Proxy و Reflect", subtitle: "Intercept، Validation، Reactive", slug: "21-proxy-reflect" },
      { n: 22, title: "برنامه‌نویسی فانکشنال", subtitle: "Pure، Immutable، Composition", slug: "22-functional-programming" },
      { n: 23, title: "DOM و BOM", subtitle: "Virtual DOM نیست، DOM واقعی را بفهم", slug: "23-dom-bom" },
      { n: 24, title: "Fetch و Storage", subtitle: "از fetch تا IndexedDB و Cache API", slug: "24-fetch-api-storage" },
    ],
  },
  {
    id: "part-3",
    emoji: "🏗️",
    label: "مهندسی و Production",
    range: "فصل‌های ۲۵ تا ۳۲",
    tagline: "‏Performance‏، ‏V8‏، حافظه، امنیت، تست، ‏Tooling‏، ‏TypeScript‏ و معماری.",
    outcome: "طراحی کد پایدار و قابل نگهداری.",
    chapters: [
      { n: 25, title: "پرفورمنس", subtitle: "V8، Deopt، Memory، Benchmark", slug: "25-performance-optimization" },
      { n: 26, title: "حافظه و GC", subtitle: "Heap، Stack، Mark & Sweep، WeakRef", slug: "26-memory-gc" },
      { n: 27, title: "امنیت", subtitle: "XSS، CSRF، Prototype Pollution، CSP", slug: "27-security" },
      { n: 28, title: "تست‌نویسی", subtitle: "Vitest، Playwright، TDD", slug: "28-testing" },
      { n: 29, title: "ابزارها و باندلر", subtitle: "Vite، Turbopack، Biome", slug: "29-tooling-bundlers" },
      { n: 30, title: "TypeScript", subtitle: "از JSDoc تا TS 6", slug: "30-typescript-interop" },
      { n: 31, title: "الگوها و معماری", subtitle: "Module، Singleton، Observer، Clean Architecture", slug: "31-patterns-architecture" },
      { n: 32, title: "متاپروگرامینگ", subtitle: "Reflect، Proxy، Decorator، Symbol", slug: "32-meta-programming" },
    ],
  },
  {
    id: "part-4",
    emoji: "🚀",
    label: "کارگاه و آمادگی شغلی",
    range: "فصل‌های ۳۳ تا ۳۸",
    tagline: "ترفندها، مینی‌پروژه‌ها، اشتباهات رایج، مصاحبه، واژه‌نامه و نقشه راه.",
    outcome: "تثبیت آموخته‌ها و آمادگی پروژه.",
    chapters: [
      { n: 33, title: "نکات طلایی", subtitle: "ترفندهایی که در Code Review می‌درخشی", slug: "33-tips-tricks" },
      { n: 34, title: "کارگاه پروژه‌ها", subtitle: "از Debounce تا Kanban", slug: "34-workshop" },
      { n: 35, title: "اشتباهات رایج", subtitle: "از == تا Memory Leak", slug: "35-mistakes" },
      { n: 36, title: "پرسش‌های مصاحبه", subtitle: "با پاسخ‌های ۱ تا ۲ دقیقه‌ای", slug: "36-interview" },
      { n: 37, title: "واژه‌نامه", subtitle: "۱۴۰ اصطلاح کلیدی JS", slug: "37-glossary" },
      { n: 38, title: "نقشه راه", subtitle: "از JS به معماری و آینده", slug: "38-roadmap-next" },
    ],
  },
];

export const TOTAL_CHAPTERS = PARTS.reduce((sum, p) => sum + p.chapters.length, 0);

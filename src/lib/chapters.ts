export type Chapter = { n: number; title: string; subtitle: string };

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
      { n: 1, title: "معرفی JS و نقشه راه", subtitle: "تاریخچه، اکوسیستم، موتور V8 و چگونه این کتاب را بخوانیم" },
      { n: 2, title: "محیط توسعه مدرن", subtitle: "Bun, pnpm, ESM, Biome و VS Code که Seniorها استفاده می‌کنند" },
      { n: 3, title: "انواع داده و نوع", subtitle: "Primitive vs Object، Coercion، Equality و مدل حافظه" },
      { n: 4, title: "متغیرها و Scope", subtitle: "دلایل منسوخ شدن var و let و const چگونه کار می‌کنند، و Scope Chain چیست" },
      { n: 5, title: "عملگرها و کنترل جریان", subtitle: "Optional Chaining، Nullish Coalescing، و کد تخت" },
      { n: 6, title: "توابع — قلب JS", subtitle: "Declaration، Expression، Arrow، First-Class و مدل ذهنی تابع به‌عنوان مقدار" },
      { n: 7, title: "کلژر و Scope Chain", subtitle: "کوله‌پشتی تابع، ماژول خصوصی، Memoization و چرا React Hooks کلژر است" },
      { n: 8, title: "اشیا و پروتوتایپ", subtitle: "Prototype Chain، __proto__، کلاس فقط قند است" },
      { n: 9, title: "آرایه‌ها", subtitle: "Mutating vs Non-Mutating، متدهای ES2023/2024، و پرفورمنس" },
      { n: 10, title: "رشته‌ها و Regex", subtitle: "رشته immutable، Emoji و Regex مدرن" },
      { n: 11, title: "this — راز بزرگ", subtitle: "Default، Implicit، Explicit، new و Arrow — و باگ گم شدن this" },
      { n: 12, title: "مقدمه Async", subtitle: "تک‌نخی ولی غیربلاک، Callback، Promise و ۳ حالت آن" },
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
      { n: 13, title: "Destructuring و Spread", subtitle: "الگوهای مدرن برای کد تمیز" },
      { n: 14, title: "Iterator و Generator", subtitle: "پروتکل تکرار، yield" },
      { n: 15, title: "Promise و Async/Await", subtitle: "از تئوری تا الگوهای Production" },
      { n: 16, title: "Event Loop", subtitle: "Call Stack، Microtask، Macrotask" },
      { n: 17, title: "ماژول‌ها ESM/CJS", subtitle: "Tree Shaking، Dynamic Import" },
      { n: 18, title: "کلاس‌ها و OOP", subtitle: "Private Fields، Inheritance، Mixins" },
      { n: 19, title: "مدیریت خطا", subtitle: "Error Types، Cause، الگوهای Production" },
      { n: 20, title: "Map و Set", subtitle: "Map، Set، WeakMap، WeakSet" },
      { n: 21, title: "Proxy و Reflect", subtitle: "Intercept، Validation، Reactive" },
      { n: 22, title: "برنامه‌نویسی فانکشنال", subtitle: "Pure، Immutable، Composition" },
      { n: 23, title: "DOM و BOM", subtitle: "Virtual DOM نیست، DOM واقعی را بفهم" },
      { n: 24, title: "Fetch و Storage", subtitle: "از fetch تا IndexedDB و Cache API" },
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
      { n: 25, title: "پرفورمنس", subtitle: "V8، Deopt، Memory، Benchmark" },
      { n: 26, title: "حافظه و GC", subtitle: "Heap، Stack، Mark & Sweep، WeakRef" },
      { n: 27, title: "امنیت", subtitle: "XSS، CSRF، Prototype Pollution، CSP" },
      { n: 28, title: "تست‌نویسی", subtitle: "Vitest، Playwright، TDD" },
      { n: 29, title: "ابزارها و باندلر", subtitle: "Vite، Turbopack، Biome" },
      { n: 30, title: "TypeScript", subtitle: "از JSDoc تا TS 6" },
      { n: 31, title: "الگوها و معماری", subtitle: "Module، Singleton، Observer، Clean Architecture" },
      { n: 32, title: "متاپروگرامینگ", subtitle: "Reflect، Proxy، Decorator، Symbol" },
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
      { n: 33, title: "نکات طلایی", subtitle: "ترفندهایی که در Code Review می‌درخشی" },
      { n: 34, title: "کارگاه پروژه‌ها", subtitle: "از Debounce تا Kanban" },
      { n: 35, title: "اشتباهات رایج", subtitle: "از == تا Memory Leak" },
      { n: 36, title: "پرسش‌های مصاحبه", subtitle: "با پاسخ‌های ۱ تا ۲ دقیقه‌ای" },
      { n: 37, title: "واژه‌نامه", subtitle: "۱۴۰ اصطلاح کلیدی JS" },
      { n: 38, title: "نقشه راه", subtitle: "از JS به معماری و آینده" },
    ],
  },
];

export const TOTAL_CHAPTERS = PARTS.reduce((sum, p) => sum + p.chapters.length, 0);

---
num: 01
part: 1
title: معرفی جاوااسکریپت و نقشه راه ۲۰۲۶ — از صفر تا بازار کار
short: معرفی JS و نقشه راه
subtitle: تاریخچه، اکوسیستم، موتور V8 و چگونه این کتاب را بخوانیم
lead: جاوااسکریپت تنها زبانی است که اگر عمیق بفهمی، هر فریم‌ورک، هر شغل و هر پروژه‌ای برایت ساده می‌شود. این فصل قطب‌نمای کل مسیر است.
---

## 🎯 اهداف یادگیری این فصل

بعد از این فصل می‌توانی:

- توضیح دهی JS چیست و چرا ۱۲ سال محبوب‌ترین زبان جهان است
- موتور V8 را در سطح معماری بکشی: Parser → Ignition → TurboFan
- تفاوت Runtimeها (Node, Bun, Deno) را با عدد و دلیل بگویی
- نقشه راه شخصی خودت را از صفر تا استخدام ترسیم کنی

## 🤔 چرا باید JS را عمیق یاد گرفت؟ (اتصال به بازار کار)

در بازار ایران و جهان، ۷۸٪ آگهی‌های فرانت‌اند و ۴۵٪ بک‌اند به JS/TS اشاره می‌کنند. اما نکته مهم: شرکت‌های خوب (دیجی‌کالا، اسنپ، تپسی، و در جهان FAANG) دیگر `map` و `filter` نمی‌پرسند — **مدل ذهنی** می‌پرسند:

> "چرا `setTimeout(0)` بعد از `Promise.then` اجرا می‌شود؟"
> "چرا کلژر باعث Memory Leak می‌شود؟"

این‌ها را فقط کسی جواب می‌دهد که موتور را فهمیده، نه کسی که API حفظ کرده.

:::note مدل ذهنی طلایی کتاب — حفظ کن
**JS = (Primitiveها در Stack + Objects در Heap) × (Lexical Scope + Closure) × (Event Loop + Queue)**

تمام کتاب بسط همین فرمول است. هر فصل یک ضلع را عمیق می‌کند.
:::

## 📖 تاریخچه — از ۱۰ روز تا ES2025

- **1995:** برندان آیک در نت‌اسکیپ JS را در ۱۰ روز ساخت — نامش Mocha بود، بعد LiveScript، بعد JavaScript (فقط برای بازاریابی جاوا).
- **2008:** گوگل V8 را ساخت — JS از 10 برابر کندتر از C++ به 2 برابر رسید.
- **2009:** Node.js — JS از مرورگر به سرور رفت.
- **2015 (ES6):** بزرگ‌ترین انقلاب — `let/const`, Arrow, Class, Promise, Module.
- **2022-2025:** `at()`, `toSorted()`, `Object.groupBy()`, `Promise.withResolvers()`, Decorators, `using`, Set Methods — زبانی بالغ.

## 🔬 موتور V8 چگونه فکر می‌کند؟ — عمیق

<div class="flow">
<div class="box"><b>1. Parser</b>کد متنی → AST (Abstract Syntax Tree)<br/><span style="font-size:8pt;color:#64748b">بررسی سینتکس</span></div>
<span class="arrow">→</span>
<div class="box"><b>2. Ignition</b>AST → Bytecode (قابل حمل)<br/><span style="font-size:8pt;color:#64748b">اجرای اولیه، بدون بهینه</span></div>
<span class="arrow">→</span>
<div class="box"><b>3. TurboFan</b>Bytecode داغ → Machine Code بهینه<br/><span style="font-size:8pt;color:#64748b">با فرضیات نوع</span></div>
</div>

### مفهوم کلیدی: Hidden Class و Inline Cache

V8 برای هر شیء یک Hidden Class مخفی می‌سازد — مثل نقشه.

```js title="hidden-class.js"
// ✅ یک Hidden Class — سریع (Monomorphic)
const p1 = { x: 1, y: 2 };
const p2 = { x: 3, y: 4 }; // همان نقشه

// ❌ دو Hidden Class — کند (Polymorphic)
const p3 = { y: 5, x: 6 }; // ترتیب متفاوت → نقشه جدید → deopt!

// قانون طلایی: همیشه ویژگی‌ها را به یک ترتیب بساز
class Point {
  constructor(x,y) { this.x = x; this.y = y; } // همیشه x بعد y
}

```

### Deoptimization — قاتل پرفورمنس

```js title="deopt.js"
function add(a,b) { return a + b; }
add(1,2); add(1,2); add(1,2); // V8: "a,b همیشه number" → کد ماشین بهینه
add("1","2"); // 💥 فرض شکست → کد بهینه دور ریخته → بازگشت به Bytecode کند

// در DevTools: --allow-natives-syntax
// %HaveSameMap(p1,p2) → true

```

:::tip حرفه‌ای — از V8 Team
> "کد Monomorphic تا 100 برابر سریع‌تر از Megamorphic است. آرایه را با یک نوع پر کن، شیء را با ترتیب ثابت بساز، و تابع را با انواع ثابت صدا بزن."

این یک جمله، حقوق Senior را می‌سازد.
:::

## 🗺️ اکوسیستم ۲۰۲۶ — چه چیزی یاد بگیریم؟

| لایه | انتخاب ۲۰۲۶ | چرا؟ | جایگزین |
|---|---|---|---|
| Runtime | **Bun 1.2** برای Dev، **Node 22 LTS** برای Prod | Bun TS Native و 3x سریع‌تر | Deno 2 برای امنیت |
| Package Manager | **pnpm** | 70% دیسک کمتر، سریع‌تر | Bun PM |
| Bundler | **Vite 6 (Rolldown)** | ESM Native، HMR 50ms | Turbopack |
| Linter/Formatter | **Biome** | 25x سریع‌تر از ESLint+Prettier | ESLint 9 |
| Test | **Vitest + Playwright** | سازگار با Vite، سریع | Jest قدیمی |
| Type | **TypeScript 6** | استاندارد استخدام | JSDoc |

## 🧠 چگونه این کتاب را بخوانیم؟ — روش مدرن یادگیری

این کتاب بر اساس ۴ اصل علم یادگیری طراحی شده:

### 1. Active Recall — به‌جای هایلایت، بپرس

بعد از هر بخش، کتاب از تو می‌پرسد — جواب را قبل از دیدن فکر کن.

> ❓ چرا `typeof null === "object"` است؟ (جواب: باگ روز اول که برای سازگاری ماند)

### 2. Spaced Repetition — فصل ۳۷ واژه‌نامه

۱۴۰ اصطلاح را در ۷ روز مرور کن — هر روز ۲۰ تا. اپ Anki بساز.

### 3. Feynman Technique — به یک بچه توضیح بده

بعد از فصل Closure، سعی کن به یک دوست غیرفنی بگویی: "کلژر یعنی کوله‌پشتی که تابع با خود می‌برد."

### 4. Project-Based — فصل ۳۴

هر مفهوم را در ۸ مینی‌پروژه پیاده کن — از Debounce تا Kanban.

:::cols
:::col 📘 مسیر صفر تا استخدام (پیشنهادی)
**ماه ۱:** فصل ۱-۱۲ — روزی ۱ فصل + تمرین<br/>
**ماه ۲:** فصل ۱۳-۲۴ — Event Loop و Proxy را با نقاشی بکش<br/>
**ماه ۳:** فصل ۲۵-۳۲ — هر فصل یک PR با تست<br/>
**ماه ۴:** فصل ۳۳-۳۸ — ۵۰ پرسش مصاحبه را ضبط کن و گوش بده
:::
:::col 🚀 چک‌لیست فهم عمیق
- [ ] می‌توانی مدل ذهنی فصل را روی کاغذ بکشی؟
- [ ] می‌توانی ۳ اشتباه رایج آن را نام ببری؟
- [ ] می‌توانی آن را در پروژه واقعی استفاده کنی؟
- [ ] می‌توانی در مصاحبه ۲ دقیقه توضیح دهی؟
:::
:::

## 🛠️ ستاپ صفر — همین الان

```bash
# 1. Bun نصب
curl -fsSL https://bun.sh/install | bash

# 2. پروژه
mkdir js-deep && cd js-deep
bun init -y
bun add -d vitest biome

# 3. biome.json
echo '{"formatter":{"indentWidth":2},"linter":{"enabled":true}}' > biome.json

# 4. تست کن
echo "console.log('JS is love 💛')" > index.js
bun index.js
```

:::interview
**Junior — تفاوت Java و JavaScript؟** هیچ! نام JS فقط بازاریابی بود — مثل Car و Carpet.

**Mid — چرا JS تک‌نخی است اما 1000 درخواست همزمان هندل می‌کند؟** چون I/O به libuv / Web API می‌رود؛ JS فقط Callback را در Queue می‌گذارد — Event Loop.

**Senior — JIT چیست و چرا Deopt مهم است؟** JIT کامپایل در زمان اجراست. V8 فرض خوش‌بینانه می‌گیرد (مثلاً "این تابع همیشه number می‌گیرد")؛ اگر فرض بشکند، کد بهینه دور ریخته می‌شود (Deopt) و پرفورمنس سقوط می‌کند. درک این موضوع تفاوت 60fps و 10fps در انیمیشن است.
:::

## ✅ جمع‌بندی و اتصال

- JS از یک اسکریپت ۱۰ روزه به پلتفرم جهان تبدیل شد.
- V8 با Hidden Class و TurboFan آن را سریع کرد — و تو با کد Monomorphic به آن کمک می‌کنی.
- اکوسیستم ۲۰۲۶: Bun + pnpm + Vite + Biome + Vitest + TS.
- روش یادگیری: Active Recall + پروژه.

**فصل بعد:** محیط توسعه مدرن را می‌چینیم — از `type: module` تا `biome.json` — تا از روز اول حرفه‌ای باشی.

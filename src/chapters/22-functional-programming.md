---
num: 22
part: 2
title: برنامه‌نویسی فانکشنال در JS
short: برنامه‌نویسی فانکشنال
subtitle: Pure، Immutable، Composition
lead: فانکشنال کدت را قابل تست، قابل پیش‌بینی و بدون باگ می‌کند.
---

## 🎯 اهداف یادگیری این فصل

بعد از این فصل می‌توانی:

- مدل ذهنی اصلی فصل را روی کاغذ بکشی و برای یک Junior توضیح دهی
- ۳ اشتباه رایج این مبحث را در Code Review تشخیص دهی
- آن را در یک پروژه واقعی (با تست) پیاده‌سازی کنی
- در مصاحبه FAANG، ۲ دقیقه با مثال و trade-off توضیح دهی

## 🤔 چرا این فصل برای بازار کار حیاتی است؟

این فصل پایه‌ای است که در ۹۰٪ مصاحبه‌های Mid/Senior پرسیده می‌شود. شرکت‌های بزرگ به‌جای حفظ API، **درک عمیق** می‌خواهند. اگر این فصل را سطحی بخوانی، در فصل‌های بعد (Event Loop، Performance، Architecture) گیر می‌کنی.

:::note مدل ذهنی این فصل
> قبل از خواندن کد، سعی کن یک تشبیه دنیای واقعی برای این مفهوم بسازی — مثلاً Closure = کوله‌پشتی، Prototype = زنجیر، Event Loop = آشپز تک‌نخی با پیشخوان سفارش‌ها.
:::



## Pure Function

```js title="pure.js"
let count = 0;
function inc() { count++; return count; } // ❌ Impure
function incPure(count) { return count + 1; } // ✅ Pure

```

## Immutability

```js title="immutable-fp.js"
const user = { name:"Ali", age:25 };
const user2 = { ...user, age: 26 };

```

## Composition و Pipe

```js title="composition.js"
const pipe = (...fns) => (x) => fns.reduce((v,f)=> f(v), x);
const toUpper = s => s.toUpperCase();
const exclaim = s => s + "!";
const greet = s => `Hello ${s}`;
const shoutGreet = pipe(greet, toUpper, exclaim);
shoutGreet("ali"); // "HELLO ALI!"

```

## Currying

```js title="currying.js"
const curry = (fn) => {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args);
    return (...next) => curried(...args, ...next);
  };
};
const add = (a,b,c) => a+b+c;
const curriedAdd = curry(add);
curriedAdd(1)(2)(3); // 6

```

:::tip چرا FP در JS؟
چون React، Redux، RxJS همه FP هستند.
:::

:::interview
**Mid — Pure Function چیست؟** تابعی که خروجی فقط به ورودی بستگی دارد و side effect ندارد.
:::


---

## 🧪 تمرین فعال — برای جا افتادن عمیق

### تمرین ۱ — Feynman Technique
سعی کن مفهوم اصلی این فصل را به یک دوست غیرفنی در ۲ دقیقه توضیح دهی — بدون کلمات تخصصی. اگر گیر کردی، یعنی هنوز عمیق نفهمیده‌ای — دوباره بخوان.

### تمرین ۲ — Active Recall
کتاب را ببند و این سوال‌ها را جواب بده:
- مدل ذهنی این فصل چیست؟ آن را نقاشی کن.
- ۲ اشتباه رایج این مبحث چیست و راه‌حلش؟
- یک مثال بازار کار که این مفهوم در آن حیاتی است؟

### تمرین ۳ — چالش بازار کار
یک مینی‌پروژه کوچک بساز که این مفهوم را در عمل نشان دهد — با Vitest تست بنویس و در گیت‌هاب پوش کن. این رزومه تو می‌شود.

## ✅ چک‌لیست فهم عمیق

- [ ] می‌توانی مدل ذهنی را روی کاغذ بکشی؟
- [ ] می‌توانی ۳ اشتباه رایج را نام ببری و درست کنی؟
- [ ] می‌توانی آن را در پروژه واقعی با تست پیاده کنی؟
- [ ] می‌توانی در مصاحبه ۲ دقیقه با trade-off توضیح دهی؟

:::tip روش مطالعه مدرن — Spaced Repetition
این فصل را امروز بخوان، فردا ۱۰ دقیقه مرور کن، ۳ روز بعد دوباره، و ۷ روز بعد یک‌بار دیگر — با Anki. این روش ۳ برابر ماندگاری را بیشتر می‌کند.
:::

## 🔗 اتصال به فصل بعد

فصل بعد بسط همین مدل ذهنی است — اگر این فصل را عمیق فهمیده باشی، فصل بعد فقط یک لایه جدید روی همین پایه است.


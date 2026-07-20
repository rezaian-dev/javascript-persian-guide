---
num: 32
part: 3
title: متاپروگرامینگ پیشرفته
short: متاپروگرامینگ
subtitle: Reflect، Proxy، Decorator، Symbol
lead: کدی که کد می‌نویسد — متاپروگرامینگ مرز بین کتابخانه و فریم‌ورک است.
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



## Symbol

```js title="symbol.js"
const sym1 = Symbol("desc");
const sym2 = Symbol("desc");
sym1 === sym2 // false

const obj = {
  [Symbol.iterator]: function*() { yield 1; yield 2; },
  get [Symbol.toStringTag]() { return "MyObj"; }
};
Object.prototype.toString.call(obj); // "[object MyObj]"

```

## Decorator — ES2024

```js title="decorator.js"
function logged(target, context) {
  return class extends target { constructor(...args) { console.log(`Creating ${context.name}`); super(...args); } };
}
@logged
class User { constructor(name) { this.name=name; } }

function memo(target, context) {
  const cache = new Map();
  return function(...args) { const key = JSON.stringify(args); if (cache.has(key)) return cache.get(key); const res = target.apply(this, args); cache.set(key,res); return res; };
}
class Calculator { @memo fib(n) { return n<=1 ? n : this.fib(n-1)+this.fib(n-2); } }

```

## Tagged Templates

```js title="dsl.js"
function sql(strings, ...values) {
  const query = strings.reduce((acc,str,i)=> acc+str+(values[i] ? `$${i+1}` : ''), '');
  return { query, values };
}
const q = sql`SELECT * FROM users WHERE id = ${1}`;

```

:::interview
**Senior — Decorator چیست؟** تابعی که کلاس/متد را wrap و رفتار اضافه می‌دهد.
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


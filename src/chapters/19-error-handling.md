---
num: 19
part: 2
title: مدیریت خطا — حرفه‌ای
short: مدیریت خطا
subtitle: Error Types، Cause، الگوهای Production
lead: کد بدون خطا وجود ندارد؛ کد حرفه‌ای کدی است که خطا را درست مدیریت می‌کند.
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



## انواع خطا

```js title="errors.js"
throw new Error("generic");
throw new TypeError("type wrong");
try { lowLevel(); } catch (err) { throw new Error("High level", { cause: err }); }

```

## Try/Catch

```js title="try-catch.js"
try { risky(); } catch (err) { if (err instanceof TypeError) {} else throw err; } finally { cleanup(); }

async function fetchData() {
  try { const res = await fetch('/api'); if (!res.ok) throw new Error(`HTTP ${res.status}`); return await res.json(); }
  catch (err) { console.error(err.cause ?? err); throw err; }
}

```

## الگوهای Production

```js title="prod-errors.js"
function tryCatch(fn) { try { return [null, fn()]; } catch (e) { return [e, null]; } }

class AppError extends Error {
  constructor(message, { status=500, code="UNKNOWN" }={}) { super(message); this.status=status; this.code=code; this.name="AppError"; }
}

```

:::interview
**Mid — تفاوت throw "error" و throw new Error؟** رشته stack ندارد.
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


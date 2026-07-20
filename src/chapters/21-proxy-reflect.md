---
num: 21
part: 2
title: Proxy و Reflect — متاپروگرامینگ
short: Proxy و Reflect
subtitle: Intercept، Validation، Reactive
lead: Proxy به تو اجازه می‌دهد رفتار پیش‌فرض شیء را بازنویسی کنی — پایه Vue 3 Reactivity.
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



## Proxy چیست؟

```js title="proxy.js"
const target = { name: "Ali", age: 25 };
const proxy = new Proxy(target, {
  get(t, prop, receiver) { console.log(`get ${String(prop)}`); return Reflect.get(t, prop, receiver); },
  set(t, prop, value, receiver) { console.log(`set ${String(prop)}=${value}`); return Reflect.set(t, prop, value, receiver); }
});
proxy.name; // log

```

## کاربردها

```js title="proxy-uses.js"
const validated = new Proxy({}, {
  set(t, p, v) { if (p === "age" && (typeof v !== "number" || v < 0)) throw new TypeError("Invalid age"); return Reflect.set(t,p,v); }
});

const negArray = new Proxy([1,2,3], {
  get(t,p) { const idx = Number(p); if (idx < 0) return t[t.length + idx]; return Reflect.get(t,p); }
});
negArray[-1]; // 3

function reactive(obj) {
  return new Proxy(obj, {
    get(t,p,recv) { track(t,p); return Reflect.get(t,p,recv); },
    set(t,p,v,recv) { const res = Reflect.set(t,p,v,recv); trigger(t,p); return res; }
  });
}

```

:::warn پرفورمنس
Proxy کندتر از دسترسی مستقیم است؛ فقط جایی که متاپروگرامینگ لازم است.
:::

:::interview
**Senior — چرا Vue 3 از Proxy استفاده می‌کند؟** چون آرایه و ویژگی جدید را هم intercept می‌کند.
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


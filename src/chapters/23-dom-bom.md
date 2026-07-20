---
num: 23
part: 2
title: DOM و BOM — جاوااسکریپت در مرورگر
short: DOM و BOM
subtitle: Virtual DOM نیست، DOM واقعی را بفهم
lead: حتی اگر با React کار می‌کنی، باید DOM واقعی را بفهمی.
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



## DOM چیست؟

```js title="dom.js"
const el = document.querySelector("#app");
const div = document.createElement("div");
div.textContent = "Hello";
el.appendChild(div);
el.append(div, "text", document.createElement("span"));

```

## Event — Bubbling و Capturing

```js title="event.js"
el.addEventListener("click", handler, { capture: false });
document.querySelector("#list").addEventListener("click", (e) => {
  if (e.target.matches(".item")) console.log("clicked", e.target.dataset.id);
});
e.stopPropagation();

```

## BOM

```js title="bom.js"
window.innerWidth; window.scrollY;
history.pushState({}, "", "/new-url");
localStorage.setItem("key", "value");
document.cookie = "token=abc; Max-Age=3600; Secure; SameSite=Strict";

```

## Performance DOM

```js title="perf-dom.js"
const frag = document.createDocumentFragment();
for (let i=0; i<1000; i++) { const div = document.createElement("div"); div.textContent = i; frag.appendChild(div); }
el.appendChild(frag);

```

:::interview
**Junior — تفاوت innerHTML و textContent؟** innerHTML HTML را parse و XSS خطر دارد؛ textContent فقط متن.
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


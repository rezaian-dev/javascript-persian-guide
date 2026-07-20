<a id="top"></a>

<div align="center">

<img src="./docs/assets/page-cover.jpg" alt="مرجع جامع JavaScript — از مبانی تا معماری Production-Level" width="660" />

</div>

<div dir="rtl" align="center">

# 📘 مرجع جامع JavaScript ES2025

**از مبانی تا معماری Production-Level** — کامل‌ترین مرجع فارسی JavaScript مدرن، پروژه‌محور و بر پایه مدل ذهنی درست.

<sub>ویرایش ۱.۰.۰ · ۲۰۲۶</sub>

</div>

<div dir="ltr" align="center">

![JavaScript](https://img.shields.io/badge/JavaScript-ES2025-f7df1e?style=for-the-badge&logo=javascript&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Chapters](https://img.shields.io/badge/38_chapters-4_parts-0f172a?style=for-the-badge)
![License](https://img.shields.io/badge/CC--BY--NC--SA-4.0-888888?style=for-the-badge)

<br>

[![📘 دانلود PDF](https://img.shields.io/badge/📘_Download_PDF-ES2025-2563eb?style=for-the-badge&logo=adobeacrobatreader&logoColor=white)](./docs/pdf/JavaScript-Persian-Guide.pdf)
[![🌐 صفحه معرفی](https://img.shields.io/badge/🌐_Live_site-preview_%26_downloads-eab308?style=for-the-badge&logo=githubpages&logoColor=black)](./docs/index.html)

</div>

---

<div dir="rtl">

## ✨ چرا این مرجع؟

### 🧠 مدل ذهنی، نه حفظ API

هر فصل با «چرا» شروع می‌شود: Closure چیست، Event Loop چگونه کار می‌کند، چرا `this` گم می‌شود و چرا `[] == ![]` true است. بعد از این کتاب می‌توانید پیش‌بینی کنید JS چه کار می‌کند — نه حدس بزنید.

### ⚡ به‌روز با ES2025 و V8

همه قابلیت‌های مدرن پوشش داده شده: `Object.groupBy`، `Promise.withResolvers`، `Array.fromAsync`، Decorators، `using`، Set Methods، `structuredClone`، `AbortSignal.timeout` — هرچه پایدار است آموزش داده می‌شود.

### 🔬 ۲۰ اشتباه رایج، کالبدشکافی‌شده

در ۲۰ جعبه «اشتباه رایج»: کد غلط، دلیل درست فکر کردن، و نسخه صحیح کنار هم. دقیقاً همان چیزهایی که در Code Review گرفته می‌شوند.

### 🚀 پلی تا Production

معماری Clean، تست با Vitest و Playwright، امنیت و CSP، XSS، Prototype Pollution، Web Vitals، Performance و V8 Internals؛ در انتها ۵۰ پرسش مصاحبه FAANG از Junior تا Senior.

</div>

---

<div dir="rtl">

## 📌 کتاب در یک نگاه

| شاخص | مقدار | شاخص | مقدار |
|:--|:--:|:--|:--:|
| فصل در ۴ بخش | ۳۸ | نکته طلایی | ۳۰ |
| مینی‌پروژه در کارگاه | ۸ | اشتباه رایج با راه‌حل | ۲۰ |
| پرسش مصاحبه | ۵۰ | مدخل واژه‌نامه | ۱۴۰ |

</div>

---

<div dir="rtl">

## 🎯 برای چه کسی است؟

| ✅ مناسب شماست اگر… | ⚠️ فعلاً نروید سراغش اگر… |
|:--|:--|
| با HTML/CSS آشنایید و می‌خواهید JS را عمیق و از پایه یاد بگیرید | تازه با متغیر آشنا شده‌اید؛ از فصل ۱ شروع کنید |
| کد می‌نویسید ولی «چرا this گم شد؟» برایتان جعبه سیاه است | فقط یک اسنیپت آماده می‌خواهید؛ این کتاب تفکر می‌دهد |
| می‌خواهید Event Loop، Closure، Proxy و Performance را بفهمید | با فریم‌ورک کار می‌کنید ولی JS پایه را نخوانده‌اید؛ اول این کتاب |
| برای مصاحبه FAANG آماده می‌شوید یا Code Review تیم را جدی‌تر می‌کنید |  |

</div>

---

<div dir="rtl">

## 🗺️ مسیرهای خواندن

| مسیر | فصل‌ها | چه چیزی می‌گیرید |
|:--|:--|:--|
| **مبتدی تا متوسط** | ۱ تا ۱۲ | مدل ذهنی، انواع داده، Scope، Closure، this، Prototype، Promise |
| **سطح پیشرفته** | ۱۳ تا ۲۴ | ESM، Generator، Event Loop، Proxy، FP، DOM، Fetch |
| **Production** | ۲۵ تا ۳۲ | Performance، GC، Security، Test، Tooling، TS، Architecture |
| **کارگاه و مصاحبه** | ۳۳ تا ۳۸ | ۳۰ نکته، ۸ پروژه، ۲۰ اشتباه، ۵۰ پرسش، واژه‌نامه |

</div>

---

<div dir="rtl">

## 🛠️ ساخت از سورس

```bash
cd src
pip install -r requirements.txt
python build.py --html   # فقط HTML
python build.py          # PDF رنگی
python build.py --print  # PDF سیاه‌سفید
```

خروجی در `docs/pdf/` و `src/build/` تولید می‌شود.

</div>

---

<div dir="rtl">

## 👤 نویسنده و مجوز

گردآوری و تدوین با هدف کمک به جامعه توسعه‌دهندگان فارسی‌زبان — با الگوبرداری از مرجع حرفه‌ای React 19.

مجوز: CC BY-NC-SA 4.0 — استفاده غیرتجاری با ذکر منبع آزاد است.

</div>

---

<div dir="rtl" align="center">

**کدنویسی خوش!** 🚀💛

```js
console.log("JavaScript is love — when you understand it deeply");
```

</div>

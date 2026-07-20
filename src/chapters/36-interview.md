---
num: 36
part: 4
title: ۵۰ پرسش مصاحبه — از Junior تا Senior
short: پرسش‌های مصاحبه
subtitle: با پاسخ‌های ۱ تا ۲ دقیقه‌ای
lead: مصاحبه JS فقط سوال نیست — مدل ذهنی می‌خواهد. ۵۰ پرسش FAANG.
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



## Junior (۱-۱۰)

**۱. تفاوت let و var؟** var function-scope و hoist با undefined؛ let block-scope و TDZ.
**۲. === vs ==؟** === بدون coercion.
**۳. null vs undefined؟** undefined پیش‌فرض؛ null عمدی خالی.
**۴. this چیست؟** مرجع شیء فراخوانی‌کننده؛ Arrow از بیرون.
**۵. Closure چیست؟** تابع + محیط lexical.
**۶. Promise چیست؟** نتیجه آینده async.
**۷. تفاوت map و forEach؟** map آرایه جدید؛ forEach void.
**۸. typeof null؟** "object" — باگ تاریخی.
**۹. Event Bubbling؟** انتشار از فرزند به والد.
**۱۰. use strict؟** حالت سخت‌گیرانه.

## Mid (۱۱-۳۰)

**۱۱. Event Loop؟** Stack → Microtask → Macrotask → Render.
**۱۲. چرا [] == ![] true؟** ![] → false → "" == false → 0==0.
**۱۳. call, apply, bind؟** call/apply فوراً، bind تابع جدید.
**۱۴. Prototype Chain؟** زنجیره جستجو تا null.
**۱۵. Map vs Object؟** Map کلید هر نوع، بدون pollution.
**۱۶. Debounce vs Throttle؟** Debounce بعد سکوت؛ Throttle هر X ms.
**۱۷. async/await؟** Syntax sugar روی Promise.
**۱۸. چرا forEach با async نه؟** منتظر Promise نمی‌ماند.
**۱۹. Shallow vs Deep؟** Shallow سطح اول؛ Deep همه — structuredClone.
**۲۰. WeakMap؟** کلیدهای ضعیف — مانع GC نمی‌شود.
**۲۱. Proxy؟** Intercept رفتار شیء.
**۲۲. Symbol؟** کلید یکتا.
**۲۳. slice vs splice؟** slice غیرجهشی، splice جهشی.
**۲۴. toSorted چرا بهتر؟** Immutable.
**۲۵. AbortController؟** کنسل fetch.
**۲۶. structuredClone vs JSON؟** اولی Date, Map, circular را هم clone می‌کند.
**۲۷. Object.groupBy؟** گروه‌بندی — ES2024.
**۲۸. at(-1)؟** اندیس منفی — ES2022.
**۲۹. ?? vs ||؟** ?? فقط null/undefined.
**۳۰. import()؟** Dynamic import — code splitting.

## Senior (۳۱-۵۰)

**۳۱. Hidden Classes؟** بهینه‌سازی V8؛ ترتیب ویژگی مهم.
**۳۲. Deoptimization؟** دور ریختن کد بهینه وقتی فرض می‌شکند.
**۳۳. Monomorphic vs Polymorphic؟** Monomorphic یک نوع — سریع.
**۳۴. Micro vs Macro؟** Micro بعد هر task؛ Macro هر بار یکی.
**۳۵. چرا setTimeout(0) بعد Promise؟** Promise microtask.
**۳۶. Memory Leakها؟** Global, Closure, EventListener, setInterval, Detached DOM.
**۳۷. Prototype Pollution؟** آلوده کردن Object.prototype.
**۳۸. XSS؟** تزریق اسکریپت از innerHTML ناامن.
**۳۹. CSP؟** Header منابع مجاز.
**۴۰. WeakRef vs WeakMap؟** WeakRef اشاره ضعیف؛ WeakMap دیکشنری با کلید ضعیف.
**۴۱. Decorator؟** Wrap کلاس/متد.
**۴۲. using؟** آزادسازی خودکار — ES2024.
**۴۳. any vs unknown؟** any TS خاموش؛ unknown امن.
**۴۴. satisfies؟** چک نوع بدون تحمیل — بهتر از as.
**۴۵. Tree Shaking؟** حذف کد استفاده‌نشده با ESM.
**۴۶. Composition vs Inheritance؟** Composition انعطاف‌پذیرتر.
**۴۷. Observer؟** Pub/Sub.
**۴۸. race vs any؟** race اولین settle؛ any اولین fulfill.
**۴۹. FinalizationRegistry؟** فهمیدن GC.
**۵۰. چگونه JS را سریع‌تر کنیم؟** Monomorphic، hidden class یکسان، for به‌جای forEach در hot path، Worker.

:::tip مصاحبه
برای Senior همیشه با مثال و trade-off جواب بده.
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


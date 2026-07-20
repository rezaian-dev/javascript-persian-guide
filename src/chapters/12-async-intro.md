---
num: 12
part: 1
title: مقدمه Async — از Callback Hell تا Promise — چرا JS بلاک نمی‌شود
short: مقدمه Async
subtitle: تک‌نخی ولی غیربلاک، Callback، Promise و ۳ حالت آن
lead: جاوااسکریپت تک‌نخی است — یک Call Stack دارد — ولی با Event Loop و Queue، می‌تواند هزاران درخواست را بدون بلاک هندل کند. این فصل درد Callback را می‌فهمیم تا قدر Promise را بدانیم.
---

## 🎯 اهداف یادگیری

- توضیح دهی چرا JS تک‌نخی است ولی بلاک نمی‌شود — با Event Loop
- Callback Hell را با مثال ۳ سطحی بکشی و ۳ مشکل آن را بگویی
- Promise را با ۳ حالت Pending/Fulfilled/Rejected توضیح دهی
- `Promise.all`, `allSettled`, `race`, `any` را با تفاوت fail-fast توضیح دهی

## 🧠 مدل ذهنی: JS = آشپز تک‌نخی با پیشخوان

تصور کن یک آشپز (Call Stack) فقط یک غذا را همزمان می‌پزد، ولی سفارش‌های زمان‌بر (setTimeout, fetch) را به پیشخوان (Web APIs) می‌دهد و ادامه می‌دهد — وقتی غذا آماده شد، پیشخوان زنگ می‌زند (Queue) و آشپز بعداً آن را سرو می‌کند.

```js title="single-thread.js"
console.log("1 — سفارش نان");
setTimeout(()=> console.log("2 — نان آماده — بعد از 1 ثانیه"), 1000); // به پیشخوان
console.log("3 — سفارش سالاد — فوری");
// خروجی: 1,3,2 — نه 1,2,3! چون آشپز منتظر نان نمی‌ماند — غیربلاک

```

## Callback Hell — ساختار تودرتوی عمیق

قبل از Promise، فقط Callback داشتیم — و کد هرم می‌شد:

```js title="callback-hell-deep.js"
getUser(id, (err, user) => {
  if (err) return handle(err);
  getPosts(user.id, (err, posts) => {
    if (err) return handle(err);
    getComments(posts[0].id, (err, comments) => {
      if (err) return handle(err);
      console.log(comments); // 3 سطح تو در تو! — ساختار تودرتوی عمیق
    });
  });
});

// مشکلات:
// 1. خوانایی فاجعه — هرم
// 2. Error handling تکراری — هر سطح if (err)
// 3. Inversion of Control — کنترل را به تابع دیگر می‌دهی — اگر آن تابع 2 بار callback را صدا بزند، چی؟

```

## 🤝 Promise — قول آینده — راه‌حل

Promise شیئی است که قول می‌دهد آینده یک مقدار (یا خطا) را بدهد — و فقط یک‌بار قولش را می‌شکند (settle).

```js title="promise-deep.js"
const promise = new Promise((resolve, reject) => {
  // کار async — مثل fetch
  setTimeout(()=> {
    if (success) resolve(data); // قول موفق
    else reject(error); // قول شکست
  }, 1000);
});

promise
  .then(data => console.log("موفق:", data)) // وقتی resolve شد
  .catch(err => console.error("شکست:", err)) // وقتی reject شد
  .finally(()=> console.log("همیشه — تمیزکاری"));

// زنجیره — تخت — نه هرم!
getUser(id)
  .then(user => getPosts(user.id)) // return Promise — زنجیره
  .then(posts => getComments(posts[0].id))
  .then(comments => console.log(comments))
  .catch(err => handle(err)); // یک catch برای همه!

```

<div class="flow">
<div class="box"><b>Pending</b>در انتظار — قول داده ولی هنوز نه<br/>اولیه</div>
<span class="arrow">→</span>
<div class="box"><b>Fulfilled</b>resolve(value)<br/>موفق — مقدار دارد</div>
<span class="arrow">→</span>
<div class="box"><b>Rejected</b>reject(reason)<br/>شکست — خطا دارد</div>
</div>

**قانون طلایی:** Promise فقط یک‌بار settle می‌شود — بعد از آن تغییر نمی‌کند (immutable) — مثل شکستن قول — دیگر نمی‌توانی پس بگیری.

## 🛠️ Promise API — ۵ متد که باید حفظ باشی

```js title="promise-api-deep.js"
// ساخت فوری
Promise.resolve(42); // Promise موفق فوری — برای تست
Promise.reject("err"); // Promise شکست فوری

// ترکیب — مهم‌ترین
Promise.all([p1,p2,p3]); // همه موفق → [v1,v2,v3]، یکی شکست → همان خطا — fail-fast
Promise.allSettled([p1,p2,p3]); // همیشه موفق → [{status:"fulfilled",value:v1}, {status:"rejected",reason:e}] — برای batch
Promise.race([p1,p2]); // اولین settle (موفق یا شکست) — برای timeout
Promise.any([p1,p2]); // اولین موفق — ES2021 — اگر همه شکست → AggregateError

// مثال واقعی — Timeout
function withTimeout(promise, ms) {
  const timeout = new Promise((_,rej)=> setTimeout(()=> rej(new Error("Timeout")), ms));
  return Promise.race([promise, timeout]); // هر کدام زودتر
}
await withTimeout(fetch('/api'), 3000); // اگر 3 ثانیه طول کشید، خطا

```

:::tip حرفه‌ای — all vs allSettled
> `Promise.all` اگر یکی شکست بخورد، بقیه را کنسل نمی‌کند — فقط نتیجه را زودتر برمی‌گرداند — ولی Promiseهای دیگر در پس‌زمینه ادامه دارند! برای کنسل واقعی از `AbortController` استفاده کن (فصل 15).
:::

## 🧪 تمرین فعال

**تمرین ۱:** یک `delay(ms)` بنویس که Promise برمی‌گرداند و بعد از ms resolve می‌شود — با `new Promise`.

**تمرین ۲:** ۳ Promise بساز که 2 تا موفق و 1 شکست — با `all`, `allSettled`, `race`, `any` تست کن و خروجی را پیش‌بینی کن.

**چالش بازار کار:** یک `retry(fn, times)` بنویس که fn (که Promise برمی‌گرداند) را تا times بار retry کند — با exponential backoff.

:::interview
**Junior — Promise چیست؟** شیئی که نتیجه آینده یک عملیات async را نمایندگی می‌کند — با 3 حالت Pending/Fulfilled/Rejected.

**Mid — تفاوت `race` و `any`؟** `race` اولین settle (حتی reject) را برمی‌گرداند؛ `any` اولین fulfill را، و اگر همه reject شدند AggregateError می‌دهد — `any` برای "اولین موفق" بهتر است.

**Senior — چرا `Promise.all` بقیه را کنسل نمی‌کند؟** چون Promiseها از قبل شروع شده‌اند — `all` فقط نتیجه را زودتر برمی‌گرداند؛ برای کنسل واقعی باید `AbortController` را به fetch پاس دهی و `abort()` کنی.

**Senior — تفاوت Callback و Promise در Inversion of Control؟** در Callback کنترل را به تابع دیگر می‌دهی — اگر آن تابع 2 بار callback را صدا بزند یا اصلاً صدا نزند، باگ — در Promise، تو کنترل را نگه می‌داری و فقط یک‌بار settle می‌شود — امن‌تر.
:::

## ✅ چک‌لیست

- [ ] می‌توانی با تشبیه آشپز، تک‌نخی ولی غیربلاک را توضیح دهی؟
- [ ] Callback Hell را با ۳ مشکلش می‌گویی؟
- [ ] ۳ حالت Promise و قانون immutable بودن را می‌گویی؟
- [ ] تفاوت `all`, `allSettled`, `race`, `any` را با fail-fast توضیح می‌دهی؟

**فصل بعد:** وارد بخش دوم می‌شویم — JS مدرن — از Destructuring تا Event Loop عمیق.

---
num: 07
part: 1
title: کلژر و زنجیره Scope — مهم‌ترین مفهوم JS
short: کلژر و Scope Chain
subtitle: کوله‌پشتی تابع، ماژول خصوصی، Memoization و چرا React Hooks کلژر است
lead: اگر کسی به تو بگوید JS را در یک کلمه بگو، بگو Closure. کلژر یعنی تابع + محیطی که در آن متولد شده — و این محیط حتی بعد از مرگ والد، زنده می‌ماند.
---

## 🎯 اهداف یادگیری

- کلژر را با نقاشی Stack/Heap توضیح دهی
- ۴ کاربرد واقعی: ماژول خصوصی، Factory، Memo، Once
- باگ حلقه var را با ۳ روش حل کنی و بگویی چرا let درست است
- توضیح دهی چرا کلژر می‌تواند Memory Leak بدهد

## 🧠 مدل ذهنی: تابع = کد + کوله‌پشتی

هر تابع هنگام تولد، یک کوله‌پشتی از متغیرهای بیرونش برمی‌دارد — و هر جا برود، کوله‌پشتی با اوست.

```js title="closure-backpack.js"
function makeCounter() {
  let count = 0; // در Heap می‌ماند — چون کسی به آن اشاره دارد!
  return function() { // این تابع کوله‌پشتی count را دارد
    return ++count;
  };
}

const c1 = makeCounter(); // جعبه جدید + count=0
c1(); // 1 — کوله‌پشتی c1
c1(); // 2 — همان کوله‌پشتی
const c2 = makeCounter(); // جعبه جدید جدا + count=0
c2(); // 1 — کوله‌پشتی c2 — مستقل!

```

<div class="flow">
<div class="box"><b>Lexical Env</b>متغیرها + مرجع به Parent<br/>هر {} یک Env</div>
<span class="arrow">→</span>
<div class="box"><b>Closure</b>تابع + زنجیره Env<br/>کوله‌پشتی</div>
<span class="arrow">→</span>
<div class="box"><b>Heap</b>تا تابع زنده است، Env هم زنده است<br/>GC نمی‌شود</div>
</div>

:::note تشبیه دنیای واقعی
تابع مثل بچه‌ای است که از خانه والد بیرون می‌رود ولی کلید خانه والد را در جیب دارد — هر وقت خواست برمی‌گردد و از یخچال والد برمی‌دارد! این کلید، Closure است.
:::

## 🎁 ۴ کاربرد واقعی — که در بازار کار هر روز استفاده می‌شود

### ۱. ماژول خصوصی — بدون کلاس

```js title="private-module.js"
const Bank = (() => {
  let balance = 0; // خصوصی — بیرون دسترسی نیست!
  return {
    deposit: (n) => balance += n,
    withdraw: (n) => balance -= n,
    get: () => balance
  };
})();
Bank.deposit(100);
Bank.balance // undefined — خصوصی! ✅
Bank.get() // 100

```

### ۲. Factory — کارخانه تابع‌ساز

```js title="factory.js"
const makeMultiplier = (x) => (y) => x*y;
const double = makeMultiplier(2); // کوله‌پشتی x=2
const triple = makeMultiplier(3); // کوله‌پشتی x=3
double(5); // 10
triple(5); // 15

// کاربرد: لاگر با prefix
const makeLogger = (prefix) => (msg) => console.log(`[${prefix}] ${msg}`);
const errorLog = makeLogger("ERROR");
errorLog("fail"); // [ERROR] fail

```

### ۳. Memoization — کش هوشمند

```js title="memo-deep.js"
function memo(fn) {
  const cache = new Map(); // کوله‌پشتی cache
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log("from cache");
      return cache.get(key);
    }
    const res = fn(...args);
    cache.set(key, res);
    return res;
  };
}

const fib = memo((n) => n<=1 ? n : fib(n-1)+fib(n-2));
fib(40); // بار اول کند
fib(40); // بار دوم فوری — از cache

```

### ۴. Once — فقط یک‌بار

```js title="once.js"
const once = (fn) => {
  let done = false, result;
  return (...args) => {
    if (!done) { result = fn(...args); done = true; }
    return result;
  };
};

const init = once(()=> console.log("init once"));
init(); // init once
init(); // هیچ — چون done=true

```

## 🐛 باگ معروف حلقه — عمیق

```js title="loop-deep.js"
// ❌ با var — یک i مشترک
for (var i=0; i<3; i++) {
  setTimeout(()=> console.log(i), 100); // 3,3,3
}
// چرا؟ var یک i دارد — هر سه callback به همان i اشاره می‌کنند که در پایان 3 شده

// ✅ با let — هر تکرار binding جدا (per-iteration) — ES6
for (let i=0; i<3; i++) {
  setTimeout(()=> console.log(i), 100); // 0,1,2 — هر تکرار جعبه جدا
}

// ✅ با IIFE — قدیمی
for (var i=0; i<3; i++) {
  ((j)=> setTimeout(()=> console.log(j),100))(i); // j کپی i
}

```

:::tip حافظه — کلژر می‌تواند Leak بدهد
```js
function leak() {
  const big = new Array(1e6).fill("*"); // 1M
  return () => console.log(big[0]); // big هیچ‌وقت GC نمی‌شود چون closure نگهش داشته!
}
// راه‌حل: فقط چیزی که نیاز داری نگه دار
function noLeak() {
  const big = new Array(1e6).fill("*");
  const first = big[0]; // فقط first
  return () => console.log(first); // big آزاد می‌شود
}

```
در DevTools → Memory → Heap Snapshot بگیر — اگر closure بزرگ می‌بینی، leak داری.
:::

## 🧪 تمرین فعال

**تمرین ۱:** یک `makeCounter` بساز که `inc()`, `dec()`, `get()` داشته باشد — با closure.

**تمرین ۲:** باگ حلقه را با let حل کن و با نقاشی توضیح بده چرا let per-iteration است.

**چالش بازار کار:** یک `debounce` با closure بساز — تایمر را در closure نگه دار.

:::interview
**Mid — کلژر چیست؟** تابعی که به متغیرهای scope بیرونی حتی بعد از اتمام آن scope دسترسی دارد — چون Env در Heap می‌ماند.

**Senior — چرا کلژر در لوپ با var مشکل دارد؟** چون var یک binding دارد و هر سه callback به همان i اشاره می‌کنند که 3 شده؛ let برای هر تکرار binding جدا می‌سازد (spec ES6).

**Senior — فرق Closure و Scope Chain؟** Scope Chain زنجیره جستجوی متغیر در زمان اجراست؛ Closure نتیجه نگه داشتن آن زنجیره توسط تابع بعد از خروج از scope است — مثل کلید خانه والد.

**Senior — چرا React Hooks کلژر است؟** چون `useState` مقدار state را در closure نگه می‌دارد و `useEffect` callback آن closure را می‌بیند — به همین دلیل dependency array لازم است.
:::

## ✅ چک‌لیست

- [ ] می‌توانی Closure را با کوله‌پشتی توضیح دهی؟
- [ ] ۴ کاربرد واقعی را با کد می‌نویسی؟
- [ ] باگ حلقه var را با ۳ روش حل می‌کنی؟
- [ ] می‌توانی Memory Leak با closure را تشخیص دهی؟

**فصل بعد:** Prototype — زنجیری که همه اشیا به آن وصل‌اند.

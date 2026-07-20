---
num: 04
part: 1
title: متغیرها، Scope و Hoisting — از صفر تا TDZ و Lexical
short: متغیرها و Scope
subtitle: دلایل منسوخ شدن var و let و const چگونه کار می‌کنند، و Scope Chain چیست
lead: جایی که متغیر را تعریف می‌کنی، سرنوشت باگ، امنیت و پرفورمنس کدت را تعیین می‌کند. این فصل را اگر عمیق بفهمی، ۵۰٪ باگ‌های JS برای همیشه حل می‌شود.
---

## 🎯 اهداف یادگیری

- تفاوت var/let/const را با مدل حافظه و Hoisting توضیح دهی
- TDZ را نقاشی کنی و بگویی چرا `typeof` در TDZ خطا می‌دهد
- Lexical Scope را با مثال closure توضیح دهی
- ۳ قانون طلایی تعریف متغیر برای Production بگویی

## 🤔 چرا Scope مهم‌ترین مفهوم بعد از Type است؟

در مصاحبه Senior همیشه می‌پرسند:

> "چرا `for(var i...) setTimeout` 3,3,3 چاپ می‌کند ولی با let درست است؟"

جواب فقط Scope است. Scope تعیین می‌کند متغیر کجا زنده است، کجا می‌میرد، و چه کسی به آن دسترسی دارد — پایه Closure، Module و Private.

## 🧠 مدل ذهنی: Scope = جعبه‌های تودرتو

تصور کن کدت جعبه‌های تودرتو است — هر `{}` یک جعبه جدید.

- **Global Scope:** بزرگ‌ترین جعبه — همه می‌بینند — خطرناک
- **Function Scope:** جعبه تابع — var اینجا زندگی می‌کند
- **Block Scope:** جعبه `{}` — let/const اینجا — امن

```js title="scope-visual.js"
let global = "من همه‌جا هستم";

function outer() {
  let outerVar = "من در outer";
  {
    let blockVar = "من فقط در این {}";
    console.log(blockVar); // ✅ می‌بیند
    console.log(outerVar); // ✅ جعبه والد را می‌بیند
    console.log(global);   // ✅ Global را می‌بیند
  }
  console.log(blockVar); // ❌ ReferenceError — جعبه فرزند را نمی‌بیند!
}

```

<div class="flow">
<div class="box"><b>Global</b>window, globalThis<br/>همه می‌بینند — خطر pollution</div>
<span class="arrow">→</span>
<div class="box"><b>Function</b>var اینجا<br/>قدیمی، function-scope</div>
<span class="arrow">→</span>
<div class="box"><b>Block</b>let/const اینجا<br/>مدرن، امن، قابل پیش‌بینی</div>
</div>

## چرا var منسوخ شد؟ — ۳ ایراد اساسی

### ایراد اساسی ۱: Hoisting با undefined

```js title="var-hoist.js"
console.log(x); // undefined — نه خطا! چرا؟ چون JS کد را این‌طور می‌بیند:
var x = 10;

// در واقع:
var x; // Hoist به بالا — مقدار undefined
console.log(x); // undefined
x = 10;

```

### ایراد اساسی ۲: Function-Scope نه Block-Scope

```js title="var-block.js"
if (true) {
  var y = 10;
}
console.log(y); // 10 — از if بیرون آمد! 
// با let:
if (true) {
  let z = 10;
}
console.log(z); // ReferenceError — امن ✅

```

### ایراد اساسی ۳: باگ معروف حلقه

```js title="loop-bug.js"
for (var i=0; i<3; i++) {
  setTimeout(()=> console.log(i), 100);
}
// 3,3,3 — نه 0,1,2! چرا؟
// چون var یک i دارد و هر سه callback به همان i اشاره می‌کنند که در پایان 3 شده

// ✅ با let — هر تکرار binding جدا (per-iteration)
for (let i=0; i<3; i++) {
  setTimeout(()=> console.log(i), 100); // 0,1,2
}

// ✅ قدیمی با IIFE
for (var i=0; i<3; i++) {
  ((j)=> setTimeout(()=> console.log(j),100))(i);
}

```

:::danger در Code Review رد می‌شوی اگر var بنویسی
از 2015 به بعد، هیچ دلیل موجهی برای var نیست. ESLint قانون `no-var` دارد — فعال کن.
:::

## ⚡ TDZ — ناحیه مرده زمانی

Temporal Dead Zone — فاصله بین شروع بلاک و خط تعریف let/const. دسترسی در TDZ خطا می‌دهد — عمداً! برای گرفتن باگ.

```js title="tdz-deep.js"
{
  // TDZ برای a شروع — از اینجا تا خط تعریف
  // console.log(a); // ReferenceError: Cannot access 'a' before initialization
  // typeof a; // حتی typeof هم خطا می‌دهد در TDZ! (برخلاف var)

  let a = 10; // TDZ تمام
  console.log(a); // 10
}

// چرا TDZ خوب است؟ چون باگ را زود می‌گیرد
// با var: undefined ساکت می‌ماند و باگ پنهان می‌ماند
// با let: فوراً خطا — fail-fast

```

## 🧠 Lexical Scope — Scope در زمان نوشتن، نه اجرا

Scope در زمان نوشتن کد (lexical) تعیین می‌شود، نه زمان اجرا (dynamic) — برخلاف `this`.

```js title="lexical-deep.js"
const name = "global";

function outer() {
  const name = "outer";
  function inner() {
    console.log(name); // "outer" — نزدیک‌ترین جعبه lexical
  }
  return inner;
}

const fn = outer();
fn(); // "outer" — نه "global"! چون inner در outer نوشته شده، نه در global صدا زده شده

// تشبیه: Scope مثل آدرس خونه در شناسنامه — هر جا بری، شناسنامه‌ات با توست
// تابع هر جا صدا زده شود، Scope محل تولدش را با خود می‌برد — این می‌شود Closure (فصل بعد)

```

## 🔒 const به معنی Immutable نیست!

```js title="const-deep.js"
const user = { name: "Ali" };
user.name = "Reza"; // ✅ مجاز — مرجع ثابت، محتوا نه
// user = {} // ❌ خطا — مرجع عوض نمی‌شود

const arr = [1,2];
arr.push(3); // ✅ مجاز — محتوا عوض می‌شود

// برای immutability واقعی:
Object.freeze(user); // سطحی — تودرتو را freeze نمی‌کند
// یا
import { produce } from "immer";
const next = produce(user, draft => { draft.name = "Reza"; }); // immutable واقعی

```

:::tip قانون طلایی Seniorها
> همیشه پیش‌فرض `const`، اگر نیاز به reassign بود `let`، هرگز `var` ننویس. این قانون ساده 90% باگ‌های scope را حذف می‌کند و کدت را قابل پیش‌بینی می‌کند.
:::

## 🧪 تمرین فعال

**تمرین ۱ — پیش‌بینی:**
```js
console.log(a); var a=1;
console.log(b); let b=2;

```

**تمرین ۲ — باگ حلقه را با ۳ روش حل کن:** با let، با IIFE، با forEach.

**چالش بازار کار:** یک ماژول `counter.js` بساز که count خصوصی دارد و فقط `inc()` و `get()` export می‌کند — بدون کلاس، فقط با Closure و let.

:::interview
**Junior — hoisting چیست؟** بالا کشیده شدن تعریف var و function declaration به ابتدای scope. let/const هم hoist می‌شوند ولی در TDZ می‌مانند و دسترسی خطا می‌دهد.

**Mid — چرا `typeof` در TDZ خطا می‌دهد؟** چون TDZ برای گرفتن باگ طراحی شده — حتی `typeof` هم نباید به متغیر نرسیده دسترسی دهد.

**Senior — چرا IIFE در ES5 لازم بود؟** چون var block-scope نداشت؛ برای ساخت scope خصوصی از `(function(){})()` استفاده می‌کردند. الان با بلاک `{}` و let نیازی نیست — IIFE منسوخ.

**Senior — تفاوت Scope و Context (this)؟** Scope در زمان نوشتن تعیین می‌شود (lexical) و متغیرها را پیدا می‌کند؛ Context (this) در زمان اجرا و بر اساس نحوه فراخوانی تعیین می‌شود.
:::

## ✅ چک‌لیست فهم عمیق

- [ ] می‌توانی ۳ ایراد اساسی var را با مثال بگویی؟
- [ ] می‌توانی TDZ را نقاشی کنی؟
- [ ] می‌توانی باگ حلقه var را با let حل کنی و توضیح دهی چرا let per-iteration binding می‌سازد؟
- [ ] می‌توانی توضیح دهی چرا const به معنی immutable نیست؟

**فصل بعد:** وارد قلب JS می‌شویم — تابع — که هم مقدار است، هم شیء، هم کلژر، هم کارخانه.

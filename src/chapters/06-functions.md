---
num: 06
part: 1
title: توابع — قلب جاوااسکریپت — ۴ چهره یک مفهوم
short: توابع — قلب JS
subtitle: Declaration، Expression، Arrow، First-Class و مدل ذهنی تابع به‌عنوان مقدار
lead: اگر به تو بگویند فقط یک فصل از JS را عمیق بخوان، این فصل را بخوان. تابع در JS فقط تابع نیست؛ مقدار است، شیء است، کلژر است، کارخانه است. اگر تابع را بفهمی، JS را فهمیده‌ای.
---

## 🎯 اهداف یادگیری

- ۴ روش تعریف تابع و تفاوت Hoisting آن‌ها را بگویی
- ۴ چیزی که Arrow Function ندارد را حفظ باشی
- First-Class Function را با ۳ مثال (callback, return, property) توضیح دهی
- `this` در Arrow vs Function را با مثال setTimeout بگویی

## 🧠 مدل ذهنی: تابع = ماشین + کوله‌پشتی + کارخانه

- **ماشین:** ورودی → خروجی (Pure)
- **کوله‌پشتی:** Closure — متغیرهای بیرون را با خود می‌برد
- **کارخانه:** با `new` شیء می‌سازد
- **شیء:** خودش ویژگی دارد (`fn.value = 0`)

## 📦 ۴ روش تعریف — عمیق

```js title="func-deep.js"
// 1. Declaration — Hoist می‌شود — قابل صدا زدن قبل از تعریف
console.log(add(1,2)); // 3 — کار می‌کند!
function add(a,b) { return a+b; }

// 2. Expression — Hoist نمی‌شود — باید بعد از تعریف صدا بزنی
// console.log(add2(1,2)); // ReferenceError
const add2 = function(a,b) { return a+b; };

// 3. Arrow — this, arguments, prototype, super ندارد — سبک‌تر
const add3 = (a,b) => a+b;
const add3Block = (a,b) => { return a+b; }; // با {} نیاز به return

// 4. Function Constructor — هرگز! — eval مخفی
const add4 = new Function('a','b','return a+b'); // ❌ امنیت + پرفورمنس فاجعه

```

### چرا Arrow Function ۴ چیز ندارد؟

چون سبک‌تر و برای callback ساخته شده — نه برای متد و سازنده.

```js title="arrow-limits.js"
const user = {
  name: "Ali",
  // ❌ Arrow به‌عنوان متد — this ندارد!
  greetArrow: () => console.log(this.name), // this = window — نه user!

  // ✅ Function به‌عنوان متد — this دارد
  greet() { console.log(this.name); }, // this = user

  // ✅ Arrow داخل متد — this را از متد می‌گیرد — عالی برای setTimeout
  greetTimeout() {
    setTimeout(() => {
      console.log(this.name); // "Ali" — this از greetTimeout
    }, 100);
  }
};

```

## 🎁 First-Class — تابع به‌عنوان مقدار

در JS تابع یک شهروند درجه یک است — مثل عدد و رشته:

```js title="first-class-deep.js"
// 1. می‌تواند آرگومان باشد — callback
[1,2,3].map(x => x*2);
setTimeout(()=> console.log("hi"), 100);

// 2. می‌تواند برگردانده شود — factory, closure
const makeAdder = (n) => (x) => x+n; // تابع، تابع می‌سازد
const add5 = makeAdder(5);
add5(10); // 15 — add5 کوله‌پشتی n=5 را دارد

// 3. می‌تواند ویژگی داشته باشد — شیء است!
function counter() { return counter.value++; }
counter.value = 0;
counter(); // 0
counter(); // 1

// 4. می‌تواند در آرایه و شیء باشد
const ops = {
  add: (a,b)=> a+b,
  mul: (a,b)=> a*b
};
ops.add(2,3); // 5

```

## 🔧 پارامترها — Rest, Default, Destructuring

```js title="params-deep.js"
function sum(a, b=0, ...rest) { // default + rest
  console.log(a, b, rest);
  return a + b + rest.reduce((s,x)=>s+x,0);
}
sum(1); // 1,0,[]
sum(1,2,3,4); // 1,2,[3,4] → 10

// Spread — باز کردن
const arr = [1,2];
sum(...arr, 3,4); // 1,2,3,4

// پارامتر نام‌دار — بهترین برای 3+ پارامتر
function createUser({ name, email, role="user", verified=false }={}) {
  return { name, email, role, verified };
}
createUser({ name:"Ali", email:"a@test.com" }); // خوانا — ترتیب مهم نیست

```

## 🧪 تمرین فعال

**تمرین ۱:** تابعی بنویس `once(fn)` که fn را فقط یک‌بار اجرا کند — با Closure.

**تمرین ۲:** باگ زیر را حل کن:
```js
const obj = { value:10, get: () => this.value };
obj.get(); // undefined — چرا؟ درست کن

```

**چالش بازار کار:** یک `memo` بساز که نتیجه تابع را کش کند — با Map و Closure — مثل فصل ۷.

:::interview
**Junior — تفاوت declaration و expression؟** declaration hoist می‌شود و قبل از تعریف قابل صدا زدن؛ expression نه — باید بعد از تعریف.

**Mid — چرا Arrow Function برای متد کلاس مناسب نیست؟** چون هر نمونه یک کپی جدا از Arrow می‌سازد (روی prototype نیست) و حافظه بیشتر؛ به‌علاوه `this` ثابت و `super` ندارد.

**Senior — چرا `new Function` خطرناک است؟** چون مثل `eval` رشته را به‌عنوان کد اجرا می‌کند — XSS و عدم بهینه‌سازی V8.

**Senior — تفاوت `function` و Arrow در `arguments`؟** function `arguments` شبه‌آرایه دارد؛ Arrow ندارد — باید از `...rest` استفاده کنی.
:::

## ✅ چک‌لیست

- [ ] ۴ روش تعریف و Hoisting آن‌ها را می‌فهمی؟
- [ ] ۴ چیز که Arrow ندارد را حفظی؟
- [ ] First-Class را با ۳ مثال می‌گویی؟
- [ ] باگ `this` در setTimeout را با Arrow حل می‌کنی؟

**فصل بعد:** Closure — کوله‌پشتی که تابع با خود می‌برد — مهم‌ترین مفهوم JS.

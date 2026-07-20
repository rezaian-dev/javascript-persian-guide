---
num: 05
part: 1
title: عملگرها و کنترل جریان — از if تا الگوهای مدرن ۲۰۲۵
short: عملگرها و کنترل جریان
subtitle: Optional Chaining، Nullish Coalescing، و کد تخت
lead: کد تمیز، کد تخت است — بدون تو در توی عمیق. این فصل یاد می‌گیری چطور با عملگرهای مدرن، کدت را امن و خوانا کنی.
---

## 🎯 اهداف یادگیری

- تفاوت `??` و `||` را با مثال `0` توضیح دهی
- `?.` را برای ۳ سطح تودرتو استفاده کنی
- کد تو در تو را با Early Return تخت کنی
- Destructuring با default و rename را حرفه‌ای استفاده کنی

## 🧠 مدل ذهنی: کد تخت = کد قابل فهم

مغز انسان ۷±2 چیز را همزمان نگه می‌دارد. کد تو در تو با ۴ if، مغز را خسته می‌کند.

```js
// ❌ تو در تو — سخت
function process(user) {
  if (user) {
    if (user.active) {
      if (user.age >= 18) {
        return doWork(user);
      }
    }
  }
}

// ✅ تخت — Early Return — آسان
function processFlat(user) {
  if (!user) return null;
  if (!user.active) return "inactive";
  if (user.age < 18) return "underage";
  return doWork(user); // منطق اصلی — بدون تو در تو
}

```

## ⚡ عملگرهای مدرن ۲۰۲۶ — که باید حفظ باشی

### Optional Chaining `?.` — پایان Cannot read property

```js title="optional.js"
const city = user?.address?.city ?? "نامشخص";
const len = arr?.[0]?.name?.length; // حتی برای آرایه و تابع
const result = fn?.(); // اگر fn تابع بود، صدا بزن

// قدیمی:
// const city = user && user.address && user.address.city;
// جدید:
const cityNew = user?.address?.city; // کوتاه، امن، خوانا

```

### Nullish Coalescing `??` — فقط null/undefined

```js title="nullish.js"
const count = inputCount ?? 10; // اگر inputCount=0، همان 0 می‌ماند — درست
const count2 = inputCount || 10; // ❌ 0 را هم 10 می‌کند — باگ!

// جدول:
0 ?? 10 // 0 — چون 0 null/undefined نیست
0 || 10 // 10 — چون 0 falsy است
"" ?? "default" // "" — رشته خالی می‌ماند
"" || "default" // "default" — falsy

// قانون: برای مقدار پیش‌فرض عدد/رشته، همیشه ?? — نه ||

```

### Logical Assignment — ES2021

```js title="logical-assign.js"
let a = null;
a ??= 10; // a = a ?? 10 → 10
a ||= 20; // a = a || 20 → 10 می‌ماند چون truthy
a &&= 30; // اگر truthy بود، 30

// کاربرد واقعی:
user.settings ??= {}; // اگر settings نداشت، بساز

```

### Numeric Separator

```js title="separator.js"
const price = 1_000_000_000; // خواناتر از 1000000000
const mask = 0b1111_0000_1010;

```

## 🎁 Destructuring — فراتر از `const {name} = user`

```js title="destructure-pro.js"
const user = { id:1, name:"Ali", address:{ city:"Tehran" }, scores:[90,85,95], role: undefined };

// Rename + Default + Nested + Rest
const {
  name: userName, // rename
  age = 18, // default
  address: { city }, // nested
  scores: [first, ...rest], // array rest
  role = "user" // default اگر undefined
} = user;

// Swap بدون متغیر موقت
let x=1, y=2;
[x,y] = [y,x]; // جادو!

// پارامتر نام‌دار — بهترین برای تابع با ۳+ پارامتر
function createUser({ name, email, role="user", verified=false }={}) {
  return { name, email, role, verified };
}
createUser({ name:"Ali", email:"ali@test.com" }); // خوانا — ترتیب مهم نیست

```

## 🔀 کنترل جریان — از if تا Pattern Matching

```js title="control-pro.js"
// به‌جای if-else زنجیره‌ای:
const getRoleText = (role) => ({
  admin: "مدیر کل",
  editor: "ویراستار",
  user: "کاربر عادی"
}[role] ?? "ناشناس");

// به‌جای switch طولانی:
const handlers = {
  click: () => console.log("click"),
  hover: () => console.log("hover"),
  scroll: () => console.log("scroll")
};
const handle = (type) => (handlers[type] ?? (()=> console.log("unknown")))();

// for...of vs for...in
for (const key in obj) { /* ❌ کلیدها + prototype — برای object */ }
for (const val of arr) { /* ✅ مقدارها — برای آرایه */ }
for (const [k,v] of Object.entries(obj)) { /* ✅ کلید+مقدار */ }

```

:::warn هشدار — for...in برای آرایه ممنوع
`for...in` ترتیب تضمینی ندارد و کلیدهای prototype را هم می‌آورد. همیشه `for...of` یا `forEach` برای آرایه.
:::

## 🧪 تمرین فعال

**تمرین ۱:** یک تابع `getUserCity(user)` بنویس که با `?.` و `??` شهر را برگرداند یا "نامشخص" — بدون if.

**تمرین ۲:** کد زیر را با Early Return تخت کن:
```js
function save(user) {
  if (user) {
    if (user.valid) {
      if (user.age >= 18) {
        db.save(user);
      }
    }
  }
}

```

**چالش:** یک تابع `formatPrice(price)` بنویس که با `Intl.NumberFormat("fa-IR")` قیمت را فارسی کند و اگر price null بود، "رایگان" برگرداند — با `??`.

:::interview
**Mid — تفاوت `??` و `||`؟** `||` هر falsy (0,"",false) را جایگزین می‌کند؛ `??` فقط null/undefined — برای مقدار پیش‌فرض عددی، `??` امن‌تر.

**Senior — چرا `obj?.a?.b` از `obj && obj.a && obj.a.b` بهتر است؟** کوتاه‌تر، امن‌تر، short-circuit دقیق‌تر، و برای تابع `fn?.()` و آرایه `arr?.[0]` هم کار می‌کند — در حالی که `&&` برای تابع و آرایه خطرناک است.
:::

## ✅ چک‌لیست

- [ ] تفاوت `??` و `||` را با مثال 0 می‌فهمی؟
- [ ] می‌توانی کد تو در تو را با Early Return تخت کنی؟
- [ ] Destructuring با rename و default را حرفه‌ای استفاده می‌کنی؟

**فصل بعد:** قلب JS — تابع — که ۴ چهره دارد.

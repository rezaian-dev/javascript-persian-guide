---
num: 03
part: 1
title: انواع داده و سیستم نوع — جایی که ۸۰٪ باگ‌ها متولد می‌شود
short: انواع داده و نوع
subtitle: Primitive vs Object، Coercion، Equality و مدل حافظه
lead: جاوااسکریپت فقط ۸ نوع داده دارد، اما همین ۸ نوع اگر با مدل حافظه فهمیده نشود، هر روز باگ می‌دهد. این فصل را ۲ بار بخوان.
---

## 🎯 اهداف یادگیری

- ۸ نوع داده را با `typeof` و مدل Stack/Heap توضیح دهی
- تفاوت Value vs Reference را روی کاغذ بکشی
- جدول Truthy/Falsy را حفظ باشی و `==` را برای همیشه کنار بگذاری
- `Object.is` و `===` را با مثال `NaN` و `-0` مقایسه کنی

## 🧠 مدل ذهنی: Stack vs Heap

تصور کن حافظه دو انبار است:

- **Stack (پشته):** کوچک، سریع، منظم — مثل کشوهای مرتب. Primitiveها اینجا هستند. LIFO.
- **Heap (توده):** بزرگ، کند، نامنظم — مثل انبار. Objects اینجا هستند. GC تمیز می‌کند.

```js title="stack-heap-visual.js"
let a = 10;           // a در Stack: 10
let b = a;            // b در Stack: کپی 10 — مستقل
b = 20;
console.log(a); // 10 — چون کپی بود

let obj1 = { x: 10 }; // obj1 در Stack: آدرس 0x123 → {x:10} در Heap
let obj2 = obj1;      // obj2 در Stack: همان آدرس 0x123 — مشترک!
obj2.x = 20;
console.log(obj1.x); // 20 — چون هر دو به یک خانه Heap اشاره می‌کنند

```

<div class="flow">
<div class="box"><b>Stack</b>Primitive + Reference (آدرس)<br/>سریع، ثابت</div>
<span class="arrow">→</span>
<div class="box"><b>Heap</b>Object واقعی<br/>کند، پویا، GC</div>
<span class="arrow">→</span>
<div class="box"><b>===</b>برای Object فقط آدرس را چک می‌کند!</div>
</div>

:::note تشبیه دنیای واقعی
Primitive مثل فتوکپی برگه — هر کسی نسخه خودش را دارد. Object مثل لینک گوگل‌داک — همه یک سند را ادیت می‌کنند.
:::

## 📦 ۸ نوع داده — عمیق

```js title="types-deep.js"
typeof 42;              // "number" — IEEE 754 double
typeof 42n;             // "bigint" — برای اعداد بزرگ
typeof "hi";            // "string" — UTF-16
typeof true;            // "boolean"
typeof undefined;       // "undefined" — مقدار پیش‌فرض
typeof Symbol("id");    // "symbol" — کلید یکتا
typeof null;            // "object" —  باگ 1995 که ماند!
typeof {};              // "object"
typeof (()=>{});        // "function" — شیء قابل صدا زدن

// چک امن null
value === null // ✅
typeof value === "object" && value !== null // اگر واقعاً object می‌خواهی

```

### باگ تاریخی `typeof null`

در نسخه اول JS، مقدارها با ۳ بیت type tag ذخیره می‌شدند: `000` برای object، و `null` همه بیت‌ها ۰ بود — پس موتور فکر کرد object است! برای سازگاری هیچ‌وقت فیکس نشد.

## Coercion — چالش‌های تبدیل ضمنی JS

JS سعی می‌کند خودش نوع را تبدیل کند — و همین باگ می‌سازد.

```js title="coercion-deep.js"
"5" + 3   // "53"  — + اگر یکی رشته باشد، رشته را ترجیح می‌دهد
"5" - 3   // 2     — - فقط عدد می‌فهمد → "5" را به 5 تبدیل

[] + []   // ""    — [].toString() → "" → "" + "" → "";
[] + {}   // "[object Object]" — [].toString() + {}.toString()
{} + []   // 0 در کنسول کروم! چون {} به‌عنوان بلاک خالی parse می‌شود، بعد +[] → +"" → 0

Boolean([]) // true — آرایه خالی truthy است! فقط 8 مقدار falsy داریم
Boolean("") // false

```

| مقدار | Boolean | توضیح |
|---|---|---|
| `false, 0, -0, 0n, "", null, undefined, NaN` | falsy | فقط این ۸ تا |
| بقیه — حتی `[]`, `{}`, `"0"` | truthy | همه truthy |

:::danger اشتباه مرگبار — در Code Review رد می‌شوی
```js
// ❌
if (user.age == 0) { /* "0" == 0 → true — کاربر با سن "0" رشته‌ای هم قبول می‌شود! */ }

// ✅
if (user.age === 0) { /* فقط عدد 0 */ }
if (Number(user.age) === 0) { /* اگر می‌خواهی تبدیل کنی، صریح */ }

```
**قانون طلایی این کتاب: همیشه `===` و `!==` — هرگز `==` و `!=`**
:::

## ⚖️ Equality — سه روش مقایسه

```js title="equality-deep.js"
// 1. === — Strict Equality (بدون Coercion)
NaN === NaN // false
-0 === +0   // true

// 2. Object.is — دقیق‌ترین (ES6)
Object.is(NaN, NaN) // true — درست!
Object.is(-0, +0)   // false — فرق می‌گذارد!
Object.is(NaN, NaN) // true

// 3. == — Abstract Equality (با Coercion) — هرگز استفاده نکن!
// [] == ![] → true — چرا؟
// ![] → false
// [] == false → [].toString() == false → "" == false → 0 == 0 → true

```

### مقایسه عمیق اشیا

```js title="deep-equal.js"
// ❌
{ a:1 } === { a:1 } // false — آدرس متفاوت

// ✅ روش‌های درست
JSON.stringify({a:1}) === JSON.stringify({a:1}) // کار می‌کند ولی Date/Function را خراب می‌کند
structuredClone // برای کپی عمیق
// یا
import { isEqual } from 'lodash-es';
isEqual({a:1}, {a:1}) // true — عمیق

// بهترین: مقایسه با id
users.find(u => u.id === other.id) // به‌جای مقایسه کل شیء

```

## 🧪 تمرین فعال — Active Recall

**تمرین ۱ — پیش‌بینی کن، بعد اجرا کن:**
```js
console.log([] + []); // ?
console.log([] + {}); // ?
console.log({} + []); // ? (در کنسول و در فایل فرق دارد!)
console.log(Boolean([])); // ?
console.log(Boolean("0")); // ?

```

**تمرین ۲ — باگ پیدا کن:**
```js
function isEmpty(arr) {
  if (arr == false) return true; // باگ کجاست؟ arr=[] → true ولی arr=[0] هم true می‌شود!
}
// درست:
function isEmptySafe(arr) {
  return Array.isArray(arr) && arr.length === 0;
}

```

**چالش بازار کار:** تابعی بنویس `deepClone` که `structuredClone` را شبیه‌سازی کند — با Map برای circular reference.

:::interview
**Junior — تفاوت null و undefined؟** undefined یعنی متغیر تعریف شده ولی مقدار نگرفته (پیش‌فرض JS)؛ null یعنی تو عمداً گفتی "هیچ" — قرارداد تیمی.

**Mid — چرا `[] == ![]` true است؟** زنجیره Coercion: `![]` → false → `[] == false` → `"" == false` → `0 == 0` → true.

**Senior — چرا `Object.is` بهتر از `===` برای `NaN` است؟** چون `===` برای `NaN` false می‌دهد (باگ IEEE 754) ولی `Object.is(NaN,NaN)` true — و برای `-0` vs `+0` هم دقیق‌تر است. در Redux و React برای مقایسه state از `Object.is` استفاده می‌شود.

**Senior — تفاوت Value vs Reference در پارامتر تابع؟**
```js
function foo(obj) { obj.x = 10; obj = {x:20}; }
let o = {x:1}; foo(o); console.log(o.x) // 10 — چون obj کپی آدرس است، تغییر ویژگی روی Heap اثر دارد ولی reassign فقط کپی Stack را عوض می‌کند.

```
:::

## ✅ چک‌لیست فهم عمیق

- [ ] می‌توانی Stack vs Heap را روی کاغذ بکشی و توضیح دهی چرا `obj2=obj1` مشترک است؟
- [ ] جدول ۸ falsy را حفظی؟
- [ ] می‌توانی `[] + {}` را مرحله‌به‌مرحله Coercion کنی؟
- [ ] می‌توانی توضیح دهی چرا همیشه `===`؟

**فصل بعد:** وارد Scope می‌شویم — جایی که `var` می‌میرد و `let` با TDZ متولد می‌شود.

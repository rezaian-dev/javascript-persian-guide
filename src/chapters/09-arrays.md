---
num: 09
part: 1
title: آرایه‌ها — فراتر از لیست — شیء خاص با ترفندها
short: آرایه‌ها
subtitle: Mutating vs Non-Mutating، متدهای ES2023/2024، و پرفورمنس
lead: آرایه در JS اصلاً آرایه نیست — یک شیء با کلیدهای عددی و ویژگی length جادویی است. اگر این را بفهمی، می‌فهمی چرا `arr[10]=100` حفره می‌سازد و چرا `toSorted` بهتر از `sort` است.
---

## 🎯 اهداف یادگیری

- توضیح دهی چرا آرایه در JS شیء است و حفره‌دار می‌شود
- جدول Mutating vs Non-Mutating را حفظ باشی و در React فقط Non-Mutating استفاده کنی
- `toSorted`, `toSpliced`, `with`, `groupBy` را با مثال بگویی
- `for...of` vs `for...in` vs `forEach` را با trade-off توضیح دهی

## 🧠 مدل ذهنی: آرایه = شیء + length جادویی

```js title="array-truth.js"
typeof [] // "object" — آرایه شیء است!;
[] instanceof Array // true
Array.isArray([]) // true — امن‌ترین چک (instanceof در iframe مشکل دارد)

const arr = [1,2,3];
arr[10] = 100; // [1,2,3, empty×7, 100] — حفره‌دار! length=11
// arr در واقع: {0:1, 1:2, 2:3, 10:100, length:11} + prototype Array

// حفره چیست؟ empty slot — نه undefined!
[1,,3].map(x=> x*2) // [2, empty, 6] — map حفره را رد می‌کند!

```

## ⚖️ دو دسته متد — مهم‌ترین جدول این فصل

| جهشی (Mutating) — ❌ در React/Redux | غیرجهشی (Non-mutating) — ✅ |
|---|---|
| push, pop, shift, unshift — اصلی را عوض می‌کند | map, filter, slice — کپی جدید |
| splice, sort, reverse — اصلی را عوض می‌کند | **toSpliced, toSorted, toReversed, with** — ES2023 — کپی جدید |

```js title="immutable-deep.js"
// ❌ قدیمی — جهشی — باعث باگ رندر در React
const arr = [3,1,2];
arr.sort((a,b)=>a-b); // arr اصلی عوض شد — React نمی‌فهمد!
arr.splice(1,1); // arr اصلی عوض شد

// ✅ مدرن ES2023 — غیرجهشی — امن برای React
const sorted = arr.toSorted((a,b)=>a-b); // arr اصلی سالم، sorted جدید
const removed = arr.toSpliced(1,1); // حذف بدون جهش
const replaced = arr.with(0, 100); // جایگزینی ایندکس 0 — بدون جهش

// قانون طلایی React: هیچ‌وقت آرایه/شیء state را جهش نده — همیشه کپی جدید

```

## 🚀 متدهای قدرتمند — که باید حفظ باشی

```js title="array-pro.js"
const users = [
  {id:1, name:"Ali", active:true, score:90, role:"admin"},
  {id:2, name:"Sara", active:false, score:85, role:"user"},
  {id:3, name:"Reza", active:true, score:95, role:"user"}
];

// زنجیره تمیز — خوانا
users.filter(u=>u.active).map(u=>u.name).join(", "); // "Ali, Reza"

// reduce — قدرتمندترین — هر چیزی می‌سازد
const total = users.reduce((sum,u)=>sum+u.score,0); // 275
const byId = users.reduce((acc,u)=> (acc[u.id]=u, acc), {}); // {1:{...},2:{...}}

// groupBy — ES2024 — گروه‌بندی بدون lodash
const grouped = Object.groupBy(users, u=> u.active ? "active" : "inactive");
// { active: [{...},{...}], inactive: [{...}] }

// find, some, every — جستجو
users.find(u=>u.id===2); // {id:2...}
users.some(u=>u.score>90); // true — حداقل یکی
users.every(u=>u.score>80); // true — همه

// flat, flatMap — تخت کردن
[1,[2,[3]]].flat(2); // [1,2,3] — عمق 2;
[1,2,3].flatMap(x=>[x,x*2]); // [1,2,2,4,3,6] — map + flat

// from — ساخت آرایه از هر چیز
Array.from({length:5}, (_,i)=> i+1); // [1,2,3,4,5] — range
Array.from("hello"); // ["h","e","l","l","o"]

```

## 🔄 حلقه‌ها — کدام سریع‌تر، کدام خواناتر؟

```js title="loops-deep.js"
// ✅ for...of — بهترین برای آرایه — خوانا + break دارد
for (const user of users) {
  if (user.score < 80) break; // می‌توانی break کنی
  console.log(user.name);
}

// ✅ forEach — وقتی نمی‌خواهی break/return کنی
users.forEach((u,i)=> console.log(i, u.name));
// ❌ forEach نمی‌تواند break/await کند!

// ❌ for...in — برای آرایه هرگز! — کلیدهای رشته‌ای + prototype
for (const key in users) {} // "0","1","2" — رشته! + اگر کسی Array.prototype را آلوده کند، آن هم می‌آید!

// ✅ for کلاسیک — سریع‌ترین — برای پرفورمنس میلیونی
for (let i=0; i<users.length; i++) {
  console.log(users[i]);
}
// بنچمارک: for > for...of > forEach (تفاوت در 1M آیتم ~10ms — در 99% موارد خوانایی مهم‌تر)

```

:::tip پرفورمنس — قانون
> خوانایی را فدای میکرو بهینه‌سازی نکن مگر در hot path با 1M+ آیتم. `for...of` در 99% موارد کافی و خواناست.
:::

## 🧪 تمرین فعال

**تمرین ۱:** آرایه `[1,2,2,3,3,3]` را unique کن — با `Set` و با `filter`.

**تمرین ۲:** با `reduce` یک `groupBy` دستی بساز — قبل از اینکه `Object.groupBy` را ببینی.

**چالش بازار کار:** یک `virtual list` بساز که 100k آیتم را بدون lag نمایش دهد — فقط 20 آیتم visible را رندر کن (فصل 34).

:::interview
**Mid — تفاوت slice و splice؟** slice غیرجهشی و کپی برمی‌گرداند (با اندیس منفی هم کار می‌کند)؛ splice جهشی و آرایه اصلی را تغییر می‌دهد و آرایه حذف‌شده‌ها را برمی‌گرداند.

**Senior — چرا `toSorted` بهتر از `sort` است؟** چون immutable است و با مدل React/Redux سازگار — `sort` آرایه اصلی را جهش می‌دهد و باعث باگ رندر می‌شود چون reference عوض نمی‌شود و React فکر می‌کند تغییری نکرده.

**Senior — چرا `Array.isArray` بهتر از `instanceof Array`؟** چون `instanceof` در iframe یا realm متفاوت false می‌دهد — هر iframe Array خودش را دارد؛ `Array.isArray` cross-realm امن است.
:::

## ✅ چک‌لیست

- [ ] می‌توانی توضیح دهی چرا آرایه شیء است و حفره چیست؟
- [ ] جدول Mutating vs Non-Mutating را حفظی و در React فقط Non-Mutating؟
- [ ] `toSorted`, `toSpliced`, `with`, `groupBy` را با مثال می‌گویی؟
- [ ] تفاوت `for...of` و `for...in` را با trade-off می‌گویی؟

**فصل بعد:** رشته‌ها — که immutable هستند و با Unicode درست کار کردن، خودش یک مهارت است.

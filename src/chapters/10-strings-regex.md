---
num: 10
part: 1
title: رشته‌ها و Regex — از Template Literal تا Unicode
short: رشته‌ها و Regex
subtitle: رشته immutable، Emoji و Regex مدرن
lead: رشته در JS immutable است — هر بار که `+` می‌کنی، رشته جدید می‌سازی. و با Unicode درست کار کردن، خودش یک مهارت Senior است — چون `"😀".length === 2`!
---

## 🎯 اهداف یادگیری

- Template Literal و Tagged Template را با مثال SQL امن توضیح دهی
- ۵ متد مدرن رشته (`at`, `replaceAll`, `isWellFormed`) را بگویی
- Regex با Named Groups و Lookbehind بنویسی
- توضیح دهی چرا `"😀".length === 2` و راه‌حلش چیست

## 🧠 مدل ذهنی: رشته = آرایه‌ای از UTF-16 Code Units — نه کاراکتر!

JS رشته را با UTF-16 ذخیره می‌کند — هر کاراکتر 1 یا 2 Code Unit.

```js title="unicode.js"
"a".length // 1 — یک Code Unit
"😀".length // 2 — چرا؟ چون 😀 خارج از BMP است و 2 Surrogate می‌خواهد!;
[..."😀"].length // 1 — Spread با iterator درست می‌شمارد — چون iterator با Code Point کار می‌کند، نه Code Unit

// راه‌حل مدرن — ES2024:
"a\uD800".isWellFormed() // false — lone surrogate
"a\uD800".toWellFormed() // "a�" — جایگزین با �

// برای طول واقعی — Intl.Segmenter (ES2022):
const segmenter = new Intl.Segmenter("fa", { granularity: "grapheme" });
[...segmenter.segment("سلام 😀")].length // تعداد گرافیم واقعی

```

## 🎁 Template Literal — فراتر از `${}`

```js title="template-pro.js"
const name = "Ali";
const msg = `Hi ${name},
You have ${2+3} messages.;
`; // چندخطی + interpolation — بدون \n

// Tagged Template — DSL می‌سازد!
function highlight(strings, ...values) {
  return strings.reduce((acc,str,i)=>
    acc + str + (values[i] ? `<b>${values[i]}</b>` : ''), '');
}
const html = highlight`Hello ${name}, you are ${"admin"}`;
// "Hello <b>Ali</b>, you are <b>admin</b>"

// کاربرد واقعی — SQL امن — جلوی Injection
function sql(strings, ...values) {
  const query = strings.reduce((acc,str,i)=> acc+str+(values[i] ? `$${i+1}` : ''), '');
  return { query, values }; // پارامتر جدا — امن
}
const userId = 1;
const q = sql`SELECT * FROM users WHERE id = ${userId}`;
// { query: "SELECT * FROM users WHERE id = $1", values: [1] } — امن!

// Raw — بدون escape
String.raw`C:\path\to\file`; // "C:\\path\\to\\file" — نه "C:\path"

```

## ⚡ متدهای مدرن — که باید حفظ باشی

```js title="string-pro.js"
"hello".at(-1); // "o" — ES2022 — اندیس منفی — به‌جای str[str.length-1]
"  hi  ".trim(); // "hi"
"  hi  ".trimStart(); "  hi  ".trimEnd();
"js".padStart(5,"*"); // "***js" — برای جدول
"js".padEnd(5,"-"); // "js---"

"ab".repeat(3); // "ababab"
"hello world".replaceAll("l","L"); // "heLLo worLd" — ES2021 — به‌جای /l/g

// Match — امن با Optional Chaining
"test@example.com".match(/@(.+)/)?.[1]; // "example.com" — اگر match نبود، undefined — نه خطا

```

## 🔍 Regex مدرن — از 2018 تا 2024

```js title="regex-pro.js"
// Flags — پرچم‌ها
/re/g  // global — همه
/re/i  // case-insensitive
/re/m  // multiline — ^ و $ برای هر خط
/re/s  // dotAll — . شامل \n هم می‌شود — ES2018
/re/u  // unicode — برای emoji درست
/re/v  // unicodeSets — ES2024 — برای \p{}
/re/y  // sticky — از lastIndex شروع

// Named Groups — ES2018 — به‌جای m[1], m[2]
const re = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const { groups } = "2026-09-07".match(re);
groups.year // "2026" — خوانا!

// Lookbehind — ES2018 — قبل و بعد را چک کن بدون اینکه جزو match باشد
/(?<=\$)\d+/.exec("$100")[0]; // "100" — بعد از $ — Lookbehind
/\d+(?=\$)/.exec("100$")[0]; // "100" — قبل از $ — Lookahead

// hasIndices — ES2022 — اندیس دقیق match
const m = /a(b)/d.exec("ab");
m.indices // [[0,2],[1,2]] — اندیس کل و گروه‌ها

// matchAll — ES2020 — همه matchها با groups
[..."test1 test2".matchAll(/test(\d)/g)].map(m=>m[1]); // ["1","2"] — به‌جای حلقه exec

```

:::warn Unicode — در مصاحبه می‌پرسند
> چرا `/./` emoji را درست نمی‌گیرد؟ چون `.` بدون `u` flag، surrogate را جدا می‌بیند؛ با `/./u` یا `/./v` درست کار می‌کند.
:::

## 🧪 تمرین

**تمرین ۱:** تابعی بنویس `reverseString(str)` که emoji را درست برعکس کند — با `[...str].reverse().join("")`.

**تمرین ۲:** یک Regex بنویس که ایمیل را با Named Groups بگیرد: `(?<user>.*)@(?<domain>.*)`.

**چالش:** یک Tagged Template `safeHtml` بساز که `<`, `>`, `&` را escape کند — جلوی XSS.

:::interview
**Mid — تفاوت `match` و `matchAll`؟** `match` با `/g` فقط آرایه رشته‌ها برمی‌گرداند؛ `matchAll` iterator از match objects با groups و indices — برای parsing.

**Senior — چرا `"😀".length === 2`؟** چون JS UTF-16 است و emoji خارج BMP 2 Code Unit می‌خواهد؛ برای طول واقعی از `[...str].length` یا `Intl.Segmenter`.

**Senior — تفاوت `/u` و `/v` flag؟** `/u` unicode mode؛ `/v` unicodeSets mode (ES2024) — برای `\p{}` و set operations مثل `[\p{Letter}&&\p{Script=Latin}]`.
:::

## ✅ چک‌لیست

- [ ] Tagged Template برای SQL امن می‌سازی؟
- [ ] `at(-1)` و `replaceAll` را به‌جای قدیمی استفاده می‌کنی؟
- [ ] Regex با Named Groups و Lookbehind می‌نویسی؟
- [ ] توضیح می‌دهی چرا emoji length 2 است و راه‌حلش؟

**فصل بعد:** `this` — رازی که با ۴ قانون حل می‌شود.

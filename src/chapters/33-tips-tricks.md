---
num: 33
part: 4
title: ۳۰ نکته و ترفند طلایی
short: نکات طلایی
subtitle: ترفندهایی که در Code Review می‌درخشی
lead: نکات کوچک، تفاوت Junior و Senior را می‌سازد.
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



## ۱. Nullish Coalescing

```js
const count = input ?? 10;

```

## ۲. Destructuring با Rename

```js
const { name: userName, age=18 } = user;

```

## ۳. حذف ویژگی بدون Mutation

```js
const { password, ...safe } = user;

```

## ۴. تبدیل به Boolean با !!

```js
!!"hello" // true

```

## ۵. Swap

```js
[a,b] = [b,a];

```

## ۶. Unique آرایه

```js
[...new Set(arr)]

```

## ۷. GroupBy جدید

```js
Object.groupBy(users, u=> u.role);

```

## ۸. at(-1)

```js
arr.at(-1)

```

## ۹. Promise.all موازی

```js
const [user, posts] = await Promise.all([fetchUser(), fetchPosts()]);

```

## ۱۰. AbortSignal.timeout

```js
fetch(url, { signal: AbortSignal.timeout(3000) });

```

## ۱۱. structuredClone

```js
const deep = structuredClone(obj);

```

## ۱۲. Proxy Validation

```js
new Proxy(obj, { set(t,p,v){ if(p==="age" && v<0) throw Error(); return Reflect.set(t,p,v); }});

```

## ۱۳. Currying

```js
const multiply = a=> b=> a*b;
const double = multiply(2);

```

## ۱۴. Pipe

```js
const pipe = (...fns) => x => fns.reduce((v,f)=> f(v), x);

```

## ۱۵. Optional Chaining

```js
user?.address?.city ?? "نامشخص"

```

## ۱۶. Numeric Separator

```js
1_000_000

```

## ۱۷. Object.hasOwn

```js
Object.hasOwn(obj, "key")

```

## ۱۸. Array.from Range

```js
Array.from({length:5}, (_,i)=> i+1)

```

## ۱۹. toSorted Immutable

```js
arr.toSorted((a,b)=> a-b)

```

## ۲۰. Intl فرمت فارسی

```js
new Intl.NumberFormat("fa-IR").format(1000000) // "۱٬۰۰۰٬۰۰۰"

```

## ۲۱. crypto.randomUUID

```js
crypto.randomUUID()

```

## ۲۲. WeakMap Private

```js
const priv = new WeakMap();

```

## ۲۳. Generator Lazy

```js
function* gen() { let i=0; while(true) yield i++; }

```

## ۲۴. Early Return

```js title="early-return.js"
function getUser(user) {
  if (!user) return null;
  return user.name;
}
```

:::tip حرفه‌ای
این نکات را چاپ کن و کنار مانیتور بچسبان.
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


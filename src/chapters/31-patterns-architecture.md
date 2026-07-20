---
num: 31
part: 3
title: الگوها و معماری تمیز
short: الگوها و معماری
subtitle: Module، Singleton، Observer، Clean Architecture
lead: الگوها راه‌حل‌های اثبات‌شده برای مشکلات تکراری هستند.
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



## الگوهای خلاقانه

```js title="patterns.js"
class DB {
  static #instance;
  constructor() { if (DB.#instance) return DB.#instance; DB.#instance = this; this.connection = "connected"; }
}
const createUser = (type) => { if (type==="admin") return new Admin(); return new User(); };

class QueryBuilder {
  #query = {};
  select(fields) { this.#query.select = fields; return this; }
  where(cond) { this.#query.where = cond; return this; }
  build() { return this.#query; }
}

```

## الگوهای رفتاری

```js title="behavioral.js"
class EventEmitter {
  #events = new Map();
  on(event, fn) { if (!this.#events.has(event)) this.#events.set(event, []); this.#events.get(event).push(fn); }
  emit(event, ...args) { this.#events.get(event)?.forEach(fn=> fn(...args)); }
}

const strategies = { credit: (a) => a*1.02, paypal: (a) => a*1.03 };
const pay = (method, amount) => strategies[method](amount);

```

## Clean Architecture

<div class="flow">
<div class="box"><b>Domain</b>Entity</div>
<span class="arrow">→</span>
<div class="box"><b>Application</b>Use Cases</div>
<span class="arrow">→</span>
<div class="box"><b>Infrastructure</b>DB, API</div>
</div>

```js title="clean.js"
export class User {
  constructor(name,email) { if (!email.includes("@")) throw new Error("Invalid email"); this.name=name; this.email=email; }
}
export const createUser = async ({ userRepo }, { name,email }) => {
  const user = new User(name,email); await userRepo.save(user); return user;
};

```

:::interview
**Senior — تفاوت Singleton و Module؟** Module خودش Singleton است.
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


---
num: 08
part: 1
title: اشیا و پروتوتایپ — راز ارث‌بری JS
short: اشیا و پروتوتایپ
subtitle: Prototype Chain، __proto__، کلاس فقط قند است
lead: در JS کلاس وجود ندارد — فقط شیء و لینک به شیء دیگر. اگر Prototype را بفهمی، می‌فهمی چرا `{}.toString` کار می‌کند در حالی که تو تعریفش نکرده‌ای.
---

## 🎯 اهداف یادگیری

- Prototype Chain را از `{}` تا `null` نقاشی کنی
- تفاوت `__proto__` و `prototype` را با مثال `new` توضیح دهی
- کلاس را به Prototype تبدیل کنی — بفهمی قند است
- `Object.create(null)` و Composition را به‌جای ارث‌بری عمیق استفاده کنی

## 🧠 مدل ذهنی: هر شیء یک لینک مخفی دارد

هر شیء یک لینک پنهان `[[Prototype]]` دارد — مثل زنجیر.

```js title="proto-visual.js"
const animal = { eats: true };
const dog = { barks: true };
Object.setPrototypeOf(dog, animal); // dog.__proto__ = animal

dog.barks // true — خودش دارد
dog.eats  // true — ندارد، از prototype می‌خواند
dog.toString // از Object.prototype

// زنجیره: dog → animal → Object.prototype → null (پایان)

```

<div class="flow">
<div class="box"><b>dog</b>barks<br/>خودش</div>
<span class="arrow">→</span>
<div class="box"><b>animal</b>eats<br/>prototype</div>
<span class="arrow">→</span>
<div class="box"><b>Object.prototype</b>toString, hasOwnProperty</div>
<span class="arrow">→</span>
<div class="box"><b>null</b>پایان زنجیر</div>
</div>

:::note تشبیه
Prototype مثل دفترچه راهنمای خانوادگی — اگر خودت بلد نیستی، از پدر می‌پرسی، اگر پدر هم بلد نیست از پدربزرگ — تا null که می‌گوید "نمی‌دانم".
:::

## 🔧 Constructor و new — ۴ کار مخفی new

```js title="new-deep.js"
function User(name) {
  this.name = name; // this = شیء جدید
}
User.prototype.greet = function() { return `Hi ${this.name}`; };

const u = new User("Ali");
u.greet(); // Hi Ali

// new چه می‌کند؟ (مهم برای مصاحبه)
function myNew(Constructor, ...args) {
  const obj = {}; // 1. {} می‌سازد
  Object.setPrototypeOf(obj, Constructor.prototype); // 2. __proto__ را وصل می‌کند
  const result = Constructor.apply(obj, args); // 3. this را bind می‌کند
  return result instanceof Object ? result : obj; // 4. اگر return شیء نبود، this را برمی‌گرداند
}

```

## 🍬 کلاس — فقط Syntax Sugar

```js title="class-sugar.js"
class User {
  #password; // private field — ES2022 — واقعاً خصوصی!
  constructor(name, password) { this.name = name; this.#password = password; }
  greet() { return `Hi ${this.name}`; }
  static createAnon() { return new User("Anonymous","123"); }
}

// زیر کاپوت همان prototype است:
typeof User // "function" — کلاس تابع است!
User.prototype.greet // function — متد روی prototype است
Object.getPrototypeOf(new User("Ali")) === User.prototype // true

// Private field واقعاً خصوصی — برخلاف _field که قرارداد است
const u = new User("Ali","secret");
u.#password // SyntaxError — بیرون دسترسی نیست!
u._password // اگر _ بود، دسترسی داشت — فقط قرارداد

```

## 🧩 Composition over Inheritance

```js title="composition-deep.js"
// ❌ ارث‌بری عمیق — شکننده — تغییر والد همه را می‌شکند
class Animal {}
class Bird extends Animal {}
class FlyingBird extends Bird {}
class Parrot extends FlyingBird {} // 4 سطح!

// ✅ Composition — انعطاف‌پذیر — مثل لگو
const canEat = { eat() { console.log("eating"); } };
const canWalk = { walk() { console.log("walking"); } };
const canFly = { fly() { console.log("flying"); } };

const person = { ...canEat, ...canWalk, name: "Ali" };
person.eat(); person.walk();

const bird = { ...canEat, ...canFly, name: "Parrot" };
bird.eat(); bird.fly();

// یا با Mixin کلاس
const Flyable = Base => class extends Base { fly() { console.log("flying"); } };
const Eatable = Base => class extends Base { eat() { console.log("eating"); } };
class Parrot extends Flyable(Eatable(Object)) {}

```

:::tip قانون طلایی
> Composition over Inheritance — تا جایی که می‌توانی از ترکیب استفاده کن، نه ارث‌بری عمیق. ارث‌بری فقط برای "is-a" واقعی — مثل `Admin is a User`.
:::

## 🧪 تمرین

**تمرین ۱:** زنجیره `[]` را نقاشی کن: `[] → Array.prototype → Object.prototype → null` — چرا `[].map` کار می‌کند؟

**تمرین ۲:** یک `myNew` بنویس که `new` را شبیه‌سازی کند.

**چالش:** با `Object.create(null)` یک دیکشنری امن بساز که `__proto__` pollution نشود.

:::interview
**Junior — prototype چیست؟** شیئی که به‌عنوان الگو برای اشیای دیگر استفاده می‌شود؛ اگر ویژگی در خود شیء نبود، از prototype می‌خواند.

**Mid — تفاوت `__proto__` و `prototype`؟** `prototype` ویژگی تابع سازنده است که برای اشیای ساخته شده با `new` به‌عنوان `__proto__` قرار می‌گیرد؛ `__proto__` ویژگی خود شیء است که به والد اشاره می‌کند — منسوخ، از `Object.getPrototypeOf` استفاده کن.

**Senior — چرا کلاس‌ها در JS ارث‌بری کلاسیک نیستند؟** چون ارث‌بری JS delegation است نه کپی؛ `this` همیشه به شیء فراخوانی‌کننده اشاره می‌کند، نه جایی که متد تعریف شده — برخلاف Java که کپی می‌کند.
:::

## ✅ چک‌لیست

- [ ] Prototype Chain را تا null نقاشی می‌کنی؟
- [ ] ۴ کار new را می‌گویی؟
- [ ] کلاس را به prototype تبدیل می‌کنی؟
- [ ] Composition را به‌جای ارث‌بری عمیق استفاده می‌کنی؟

**فصل بعد:** آرایه‌ها — که در JS اصلاً آرایه نیستند، بلکه شیء خاص هستند!

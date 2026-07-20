---
num: 11
part: 1
title: this — راز بزرگ — با ۴ قانون حل می‌شود
short: this — راز بزرگ
subtitle: Default، Implicit، Explicit، new و Arrow — و باگ گم شدن this
lead: `this` در JS پویا است، نه ایستا — مقدارش در زمان فراخوانی تعیین می‌شود، نه نوشتن (به‌جز Arrow). اگر ۴ قانون را بفهمی، دیگر هیچ‌وقت گیج نمی‌شوی — و باگ معروف React را هم حل می‌کنی.
---

## 🎯 اهداف یادگیری

- ۴ قانون this را با ترتیب اولویت بگویی: new > bind > implicit > default
- تفاوت Arrow و Function در this را با مثال setTimeout توضیح دهی
- ۳ راه‌حل گم شدن this را بگویی: call/bind/arrow wrapper
- در کلاس، چرا `inc = () =>` امن‌تر از `inc()` است را توضیح دهی

## 🧠 مدل ذهنی: this = کسی که تابع را صدا زده — نه جایی که نوشته شده

```js title="this-mental.js"
function greet() { console.log(this.name); }

const ali = { name:"Ali", greet };
const sara = { name:"Sara", greet };

ali.greet(); // "Ali" — this = ali — چون ali صدا زده
sara.greet(); // "Sara" — this = sara — چون sara صدا زده
greet(); // "" یا undefined — چون کسی صدا نزده — default

// تشبیه: this مثل ضمیر "من" — هر کسی "من" می‌گوید، به خودش اشاره دارد

```

## 📜 ۴ قانون — به ترتیب اولویت

```js title="this-4rules.js"
// 1. Default — بدون شیء — در strict mode undefined، وگرنه window
function foo() { console.log(this); }
foo(); // window (غیر strict) یا undefined (strict)

// 2. Implicit — از روی شیء قبل نقطه — obj.foo()
const obj = { name:"Ali", greet() { console.log(this.name); } };
obj.greet(); // "Ali" — this = obj — چون obj قبل نقطه است

// 3. Explicit — با call/apply/bind — تو صریح می‌گویی this چیست
function greet() { console.log(this.name); }
greet.call({name:"Sara"}); // "Sara" — call فوراً اجرا
greet.apply({name:"Reza"}); // "Reza" — apply آرایه می‌گیرد
const bound = greet.bind({name:"Bound"}); // bind تابع جدید می‌سازد — اجرا نمی‌کند
bound(); // "Bound"

// 4. new — this = شیء جدید — بالاترین اولویت
function User(name) { this.name = name; }
new User("Ali").name // "Ali" — this = {}

```

**ترتیب اولویت:** `new` > `bind/call/apply` > `obj.foo()` > `default` — اگر چند قانون همزمان بود، اولویت بالاتر برنده.

## 🏹 Arrow Function — this ندارد! — از بیرون می‌گیرد

Arrow `this` خودش را ندارد — از scope بیرونی (lexical) می‌گیرد و هیچ‌وقت عوض نمی‌شود — حتی با call/bind.

```js title="arrow-this-deep.js"
const obj = {
  name: "Ali",
  arrow: () => console.log(this.name), // ❌ this = window — چون arrow در global نوشته شده!
  method() {
    const arrow = () => console.log(this.name); // ✅ this = obj — چون arrow در method نوشته شده و method this=obj دارد
    arrow();
  }
};
obj.method(); // "Ali"

// اثبات: Arrow با call عوض نمی‌شود
const arrow = () => console.log(this.name);
arrow.call({name:"Sara"}); // همچنان window — نه Sara! — چون Arrow this ندارد که عوض شود

```

## 🐛 باگ معروف — گم شدن this — و ۳ راه‌حل

```js title="lost-this.js"
const user = {
  name: "Ali",
  greet() { console.log(this.name); }
};

const fn = user.greet; // فقط تابع جدا شد — شیء نه!
fn(); // undefined — this گم شد! — چون fn بدون obj صدا زده شد — default

// راه‌حل ۱: call/apply در لحظه
fn.call(user); // "Ali"

// راه‌حل ۲: bind — تابع جدید با this ثابت
const bound = user.greet.bind(user);
bound(); // "Ali" — همیشه

// راه‌حل ۳: Arrow wrapper — this را از بیرون می‌گیرد
setTimeout(()=> user.greet(), 100); // "Ali" — Arrow this را از بیرون (user) می‌گیرد

// راه‌حل ۴: در کلاس — field arrow — مدرن‌ترین
class Counter {
  count = 0;
  inc() { this.count++; } // ❌ اگر به‌عنوان callback پاس داده شود، this گم می‌شود
  incArrow = () => { this.count++; } // ✅ همیشه امن — چون Arrow this را از constructor می‌گیرد
}
const c = new Counter();
setTimeout(c.inc, 100); // ❌ NaN — this=undefined
setTimeout(c.incArrow, 100); // ✅ کار می‌کند — this=c

```

:::danger باگ React — که هر Junior می‌خورد
```js
class App {
  handleClick() { console.log(this); } // this = undefined در onClick
}
<button onClick={app.handleClick}> // ❌ this گم شد!

// ✅
class App {
  handleClick = () => { console.log(this); } // Arrow field — this همیشه نمونه
}

```
:::

## 🧪 تمرین

**تمرین ۱:** خروجی را پیش‌بینی کن:
```js
const obj = { name:"Ali", foo: function() { return ()=> this.name; } };
const bar = obj.foo();
bar(); // ?
bar.call({name:"Sara"}); // ?

```

**تمرین ۲:** یک `bind` دستی بنویس — تابعی که تابع و this را بگیرد و تابع جدید با this ثابت برگرداند.

**چالش بازار کار:** یک `EventEmitter` بساز که `on` و `emit` دارد و `this` در listener درست باشد — با Arrow یا bind.

:::interview
**Junior — this چیست؟** مرجعی که تابع هنگام فراخوانی به آن وصل می‌شود؛ مقدارش بسته به نحوه فراخوانی تعیین می‌شود، نه محل تعریف — به‌جز Arrow که lexical است.

**Mid — تفاوت call و apply و bind؟** call/apply فوراً اجرا می‌کنند؛ bind تابع جدید می‌سازد. call آرگومان‌ها را جدا می‌گیرد (`call(obj, a,b)`)، apply آرایه (`apply(obj, [a,b])`).

**Senior — چرا Arrow Function با call/apply this عوض نمی‌شود؟** چون Arrow در spec `[[ThisMode]]: lexical` دارد — اصلاً `this` ندارد که bind شود؛ `this` را از Env بیرونی می‌خواند.

**Senior — چرا در کلاس `inc = () =>` حافظه بیشتر می‌گیرد؟** چون هر نمونه یک کپی جدا از Arrow می‌سازد (روی instance) نه روی prototype — برای 1000 نمونه، 1000 تابع. ولی برای callback امن‌تر است — trade-off.
:::

## ✅ چک‌لیست

- [ ] ۴ قانون this را با اولویت می‌گویی؟
- [ ] تفاوت Arrow و Function در this را با setTimeout توضیح می‌دهی؟
- [ ] ۳ راه‌حل گم شدن this را می‌گویی؟
- [ ] باگ React onClick را با Arrow field حل می‌کنی؟

**فصل بعد:** Async — چرا JS تک‌نخی است ولی 1000 کار همزمان می‌کند؟

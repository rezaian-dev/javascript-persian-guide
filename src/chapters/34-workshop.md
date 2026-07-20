---
num: 34
part: 4
title: کارگاه ۸ مینی‌پروژه
short: کارگاه پروژه‌ها
subtitle: از Debounce تا Kanban
lead: یادگیری بدون پروژه، فراموشی است.
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



## پروژه ۱: Debounce Search

```js title="debounce.js"
function debounce(fn, delay) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(()=> fn(...args), delay); };
}
const input = document.querySelector("#search");
input.addEventListener("input", debounce(async (e)=>{ const results = await fetch(`/api/search?q=${e.target.value}`).then(r=>r.json()); render(results); }, 300));

```

## پروژه ۲: Memoization

```js title="memo.js"
function memo(fn, { max=100 }={}) {
  const cache = new Map();
  return (...args) => { const key = JSON.stringify(args); if (cache.has(key)) return cache.get(key); const res = fn(...args); if (cache.size >= max) cache.delete(cache.keys().next().value); cache.set(key,res); return res; };
}

```

## پروژه ۳: EventEmitter

```js title="emitter.js"
class EventEmitter {
  #events = new Map();
  on(e,fn){ (this.#events.get(e) ?? this.#events.set(e,[]).get(e)).push(fn); return ()=> this.off(e,fn); }
  off(e,fn){ const arr=this.#events.get(e); if(arr) this.#events.set(e, arr.filter(f=>f!==fn)); }
  emit(e,...args){ this.#events.get(e)?.forEach(fn=>fn(...args)); }
}

```

## پروژه ۴: Promise Pool

```js title="pool.js"
async function pool(tasks, concurrency=3) {
  const results = []; const executing = new Set();
  for (const task of tasks) {
    const p = task().then(res=> { executing.delete(p); return res; });
    executing.add(p); results.push(p);
    if (executing.size >= concurrency) await Promise.race(executing);
  }
  return Promise.all(results);
}

```

## پروژه ۵: Virtual List

```js title="virtual.js"
function renderVirtual({ container, items, itemHeight, visibleCount }) {
  let start = 0;
  container.addEventListener("scroll", ()=>{ start = Math.floor(container.scrollTop / itemHeight); const end = Math.min(start+visibleCount, items.length); container.innerHTML = items.slice(start,end).map(i=> `<div style="height:${itemHeight}px">${i}</div>`).join(""); });
}

```

## پروژه ۶: Undo/Redo با Proxy

```js title="undo.js"
function withHistory(obj) {
  const history = [structuredClone(obj)]; let index = 0;
  const proxy = new Proxy(obj, { set(t,p,v) { const res = Reflect.set(t,p,v); history.splice(index+1); history.push(structuredClone(t)); index++; return res; } });
  return { state: proxy, undo() { if(index>0) { index--; Object.assign(proxy, history[index]); } }, redo() { if(index<history.length-1) { index++; Object.assign(proxy, history[index]); } } };
}

```

## پروژه ۷: Fetch با Retry

```js title="fetch-pro.js"
const cache = new Map();
async function smartFetch(url, { retries=3, ttl=60000 }={}) {
  const cached = cache.get(url);
  if (cached && Date.now()-cached.time < ttl) return cached.data;
  for (let i=0; i<retries; i++) {
    try { const res = await fetch(url, { signal: AbortSignal.timeout(5000) }); if (!res.ok) throw new Error(`HTTP ${res.status}`); const data = await res.json(); cache.set(url, { data, time: Date.now() }); return data; }
    catch (e) { if (i===retries-1) throw e; await new Promise(r=> setTimeout(r, 1000*2**i)); }
  }
}

```

## پروژه ۸: Kanban

```js title="kanban.js"
const board = { todo: [{id:1, title:"Task 1"}], doing: [], done: [] };
function move(taskId, from, to) { const idx = board[from].findIndex(t=> t.id===taskId); if (idx===-1) return; const [task] = board[from].splice(idx,1); board[to].push(task); save(board); render(board); }

```

:::project چالش اضافه
هر پروژه را با تست Vitest و TypeScript بازنویسی کن.
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


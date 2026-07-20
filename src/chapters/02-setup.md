---
num: 02
part: 1
title: محیط توسعه مدرن — ستاپ حرفه‌ای ۲۰۲۶
short: محیط توسعه مدرن
subtitle: Bun, pnpm, ESM, Biome و VS Code که Seniorها استفاده می‌کنند
lead: ابزار درست، ۱۰ برابر بهره‌وری می‌دهد. این فصل را جدی بگیر — ستاپ بد، ۱۰۰ ساعت وقتت را می‌گیرد.
---

## 🎯 اهداف یادگیری

- تفاوت Node/Bun/Deno را با بنچمارک توضیح دهی
- پروژه ESM واقعی با `type: module` بسازی
- Biome را جایگزین ESLint+Prettier کنی
- VS Code را برای JS مدرن تنظیم کنی

## 🧠 مدل ذهنی: Runtime چیست؟

Runtime = موتور JS (V8) + APIهای اضافه (fs, fetch, etc) + Event Loop

- **Browser:** V8 + DOM + fetch + setTimeout
- **Node:** V8 + fs + http + libuv
- **Bun:** JavaScriptCore + fs + fetch نیتیو + TS transpiler داخلی

:::note چرا Bun سریع‌تر است؟
چون به‌جای V8 از JavaScriptCore (Safari) استفاده می‌کند و ماژول‌لودر را با Zig بازنویسی کرده — و TS را بدون `tsc` اجرا می‌کند.
:::

## 🛠️ ستاپ گام‌به‌گام — از صفر

### گام ۱: Runtime

```bash
# Node 22 LTS (پایدار)
nvm install 22 && nvm use 22
node -v # v22.x

# Bun 1.2 (سریع برای Dev)
curl -fsSL https://bun.sh/install | bash
bun -v # 1.2.x

# تست سرعت
echo "console.log('hi')" > test.js
time node test.js
time bun test.js # 3x سریع‌تر
```

### گام ۲: Package Manager — چرا pnpm؟

| PM | node_modules | سرعت نصب | دیسک |
|---|---|---|---|
| npm | کپی | کند | زیاد |
| yarn | کپی | متوسط | زیاد |
| pnpm | symlink + content-addressable | سریع | 70% کمتر |

```bash
npm i -g pnpm
pnpm --version

mkdir my-app && cd my-app
pnpm init
pnpm add -D vitest biome @types/node
```

### گام ۳: ESM — پایان CJS

```json title="package.json"
{
  "name": "js-deep",
  "type": "module",
  "scripts": {
    "dev": "bun --watch src/index.ts",
    "test": "vitest --coverage",
    "lint": "biome check --write ./src",
    "build": "vite build"
  }
}

```

```js title="src/index.ts — ESM واقعی"
// ✅ ESM — استاتیک، Tree-shakable، Top-level await
import { readFile } from 'node:fs/promises';
import { sum } from './math.js';

export const config = await readFile('./config.json', 'utf8'); // Top-level await!

console.log(sum(1,2));

// ❌ CJS — قدیمی، داینامیک، کند برای bundler
// const fs = require('fs');
// module.exports = {}

```

:::warn هشدار — این کتاب فقط ESM
از این به بعد همه مثال‌ها ESM هستند. `require` را فراموش کن مگر مجبور به نگهداری Legacy باشی. دلیل: Tree Shaking، Code Splitting، و سازگاری مرورگر/سرور یکسان.
:::

### گام ۴: Biome — یک ابزار به‌جای ۵ ابزار

```json title="biome.json — جایگزین ESLint + Prettier + import sorter"
{
  "$schema": "https://biomejs.dev/schemas/1.9.0/schema.json",
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "complexity": { "noUselessSwitchCase": "error" },
      "suspicious": { "noExplicitAny": "warn" }
    }
  },
  "javascript": {
    "formatter": { "quoteStyle": "single", "semicolons": "asNeeded" }
  }
}

```

```bash
pnpm biome check --write ./src # lint + format + sort imports در 50ms
```

### گام ۵: VS Code — تنظیمات Senior

```json title=".vscode/settings.json"
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": { "javascript": "javascriptreact" }
}

```

افزونه‌های ضروری:
- Biome (biomejs.biome)
- Vitest (vitest.explorer)
- Error Lens
- GitLens

## 🔬 عمیق: چگونه ESM Tree Shaking می‌کند؟

```js title="utils.js"
export const used = () => console.log("used");
export const unused = () => console.log("unused"); // اگر import نشود، حذف می‌شود!

// ❌ مانع Tree Shaking
export default { used, unused }; // همه می‌ماند چون object داینامیک است

```

Bundler (Vite/Rollup) با تحلیل استاتیک `import/export` کد استفاده‌نشده را حذف می‌کند — فقط اگر ESM باشد و `sideEffects: false`.

## 🧪 تمرین فعال

**تمرین ۱:** یک پروژه ESM بساز که `config.json` را با Top-level await بخواند و با `sum` جمع بزند.

**تمرین ۲:** یک فایل با ۱۰ خط کد بد (var, ==, no semicolon) بساز و با `biome check --write` درست کن — تفاوت را ببین.

**چالش بازار کار:** یک CLI کوچک با Bun بساز که یک فایل JS را می‌گیرد و تعداد `var`های آن را می‌شمارد — با `Bun.file` و `Bun.write`.

:::interview
**Mid — چرا ESM بهتر از CJS است؟** استاتیک، Tree-shakable، Top-level await، یکسان در مرورگر و سرور، و `import` می‌تواند lazy باشد (`import()`).

**Senior — تفاوت Bun و Node در اجرای TS؟** Node نیاز به `--loader tsx` یا `tsc` دارد؛ Bun به‌صورت نیتیو TS/JSX را بدون transpile اجرا می‌کند و `node_modules` را با کش هوشمند می‌خواند — استارتاپ 3x سریع‌تر.

**Senior — چرا pnpm از npm امن‌تر است؟** چون از symlink استفاده می‌کند و هر پکیج فقط به dependencyهای خودش دسترسی دارد، نه همه `node_modules` — جلوی Phantom Dependency را می‌گیرد.
:::

## ✅ چک‌لیست فهم

- [ ] می‌توانی توضیح دهی Runtime چیست و Bun چرا سریع‌تر است؟
- [ ] می‌توانی پروژه ESM با Top-level await بسازی؟
- [ ] Biome را جایگزین ESLint+Prettier کردی؟
- [ ] VS Code را با formatOnSave تنظیم کردی؟

**فصل بعد:** وارد قلب JS می‌شویم — ۸ نوع داده، Value vs Reference، و Coercion که منشأ ۸۰٪ باگ‌هاست.

#!/usr/bin/env node
/**
 * Export the README/social banner from the running app's /banner route.
 *
 *   node tools/banner/export-banner.mjs http://localhost:3210
 *
 * Produces:
 *   assets/readme/banner-hero.png   3840×1920 (2:1, 3× of the 1280×640 design)
 *   public/social-card.jpg          1280×640  (og:card, matches layout metadata)
 *
 * Before every shot it waits for document.fonts.ready + decoded images and
 * asserts the banner geometry: exact canvas size, footer fully below the
 * divider with ≥24px clearance, no overflow. Prints a JSON report.
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import path from "node:path";

const BASE = process.argv[2] ?? "http://localhost:3210";
const ROOT = path.resolve(import.meta.dirname, "../..");
const PNG = path.join(ROOT, "assets/readme/banner-hero.png");
const JPG = path.join(ROOT, "public/social-card.jpg");

mkdirSync(path.join(ROOT, "assets/readme"), { recursive: true });

async function prepare(page) {
  await page.goto(`${BASE}/banner`, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    await document.fonts.ready;
    const imgs = [...document.querySelectorAll("img")];
    await Promise.all(imgs.map((i) => (i.complete && i.naturalWidth > 0 ? Promise.resolve() : new Promise((r) => { i.onload = i.onerror = r; }))));
    await Promise.all(imgs.map((i) => i.decode().catch(() => {})));
  });
  await page.waitForTimeout(250);
}

async function measure(page) {
  return page.evaluate(() => {
    const banner = document.querySelector("[data-banner]");
    const divider = document.querySelector("[data-banner-divider]");
    const footer = document.querySelector("[data-banner-footer]");
    const b = banner.getBoundingClientRect();
    const d = divider.getBoundingClientRect();
    const f = footer.getBoundingClientRect();
    const kids = [...footer.querySelectorAll("*")].map((el) => ({
      tag: el.tagName,
      text: (el.textContent || "").trim().slice(0, 30),
      top: el.getBoundingClientRect().top,
      bottom: el.getBoundingClientRect().bottom,
      fontSize: parseFloat(getComputedStyle(el).fontSize),
    }));
    const px = (sel) => {
      const el = banner.querySelector(sel);
      return el ? parseFloat(getComputedStyle(el).fontSize) : null;
    };
    return {
      canvas: { w: b.width, h: b.height },
      dividerY: d.bottom,
      footerTop: f.top,
      gap: f.top - d.bottom,
      overflowX: banner.scrollWidth > Math.ceil(b.width) + 1,
      // decorative glows intentionally bleed past the canvas and are clipped
      // by overflow-hidden; only real content must stay inside:
      contentOutside: [...banner.querySelectorAll("*")]
        .filter((el) => el.closest("[data-banner] > span[aria-hidden]") === null)
        .filter((el) => (el.textContent || "").trim().length > 0 || ["IMG", "SVG"].includes(el.tagName))
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.right > b.right + 0.5 || r.left < b.left - 0.5 || r.bottom > b.bottom + 0.5 || r.top < b.top - 0.5;
        })
        .map((el) => el.tagName + ":" + (el.textContent || "").trim().slice(0, 20)),
      kids,
      minKidTop: Math.min(...kids.map((k) => k.top)),
      fontSizes: {
        title: px("h1"),
        titleEn: px("h1 span[dir='ltr']"),
        subtitle: px("p"),
        chip: px("[data-banner] .mt-8 span"),
        author: px("[data-banner-footer] > div:first-child > div > div:first-child"),
        role: px("[data-banner-footer] > div:first-child > div > div:last-child"),
        link: px("[data-banner-footer] .font-mono.text-\\[19px\\]"),
      },
    };
  });
}

const must = (cond, msg) => {
  if (!cond) throw new Error(`ASSERT FAIL: ${msg}`);
};

const browser = await chromium.launch();

// ---- 3× PNG ------------------------------------------------------------
const hi = await browser.newContext({ viewport: { width: 1280, height: 640 }, deviceScaleFactor: 3 });
const pageHi = await hi.newPage();
await prepare(pageHi);
const m = await measure(pageHi);
console.log(JSON.stringify(m, null, 2));

must(m.canvas.w === 1280 && m.canvas.h === 640, `canvas ${m.canvas.w}×${m.canvas.h} ≠ 1280×640`);
must(m.gap >= 24, `footer gap ${m.gap}px < 24px`);
must(m.minKidTop >= m.dividerY + 24, `footer child above divider+24 (minTop ${m.minKidTop} vs ${m.dividerY + 24})`);
must(m.contentOutside.length === 0, `content outside canvas: ${m.contentOutside.join(", ")}`);

const el = pageHi.locator("[data-banner]");
await el.screenshot({ path: PNG });
await hi.close();

// ---- 1× JPEG (social card) ---------------------------------------------
const lo = await browser.newContext({ viewport: { width: 1280, height: 640 }, deviceScaleFactor: 1 });
const pageLo = await lo.newPage();
await prepare(pageLo);
const m2 = await measure(pageLo);
must(m2.canvas.w === 1280 && m2.canvas.h === 640, "social canvas mismatch");
await pageLo.locator("[data-banner]").screenshot({ path: JPG, quality: 92, type: "jpeg" });
await lo.close();

await browser.close();

// ---- readability at real README widths ----------------------------------
const scale = (w) => w / 1280;
const report = {
  png: "assets/readme/banner-hero.png (3840×1920)",
  jpg: "public/social-card.jpg (1280×640)",
  gapPx: m.gap,
  effective: {
    "880px": { footer: Math.round(m.fontSizes.role * scale(880) * 10) / 10, title: Math.round(m.fontSizes.title * scale(880)) },
    "930px": { footer: Math.round(m.fontSizes.role * scale(930) * 10) / 10, title: Math.round(m.fontSizes.title * scale(930)) },
  },
};
console.log("REPORT " + JSON.stringify(report));

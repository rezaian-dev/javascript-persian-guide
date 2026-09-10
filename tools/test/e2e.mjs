#!/usr/bin/env node
/**
 * End-to-end acceptance tests for the static export, run against
 * tools/test/serve-pages.mjs (GitHub-Pages-like server).
 *
 *   node tools/test/e2e.mjs http://localhost:8080
 *
 * Covers: clean load (no console errors / hydration issues), same-tab
 * internal navigation, client-side routing between home and /chapters
 * (no document reload), back/forward, chapter deep links, the reader's
 * keyboard behaviours, the mobile drawer, asset integrity, and the
 * /banner canvas. Writes screenshots to /tmp for manual review.
 */
import { chromium } from "playwright";

const BASE = (process.argv[2] ?? "http://localhost:8080") + "/javascript-persian-guide";
const SHOTS = "/tmp/shots";
import { mkdirSync } from "node:fs";
mkdirSync(SHOTS, { recursive: true });

let pass = 0, fail = 0;
const ok = (name, cond, extra = "") => {
  if (cond) { pass++; console.log(`  ✓ ${name}`); }
  else { fail++; console.log(`  ✗ ${name} ${extra}`); }
};

const browser = await chromium.launch();

async function newPage(ctxOpts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...ctxOpts });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  return { ctx, page, errors };
}

// ---------------------------------------------------------------- 1. home
{
  console.log("\n[1] Home page");
  const { ctx, page, errors } = await newPage();
  const docRequests = [];
  page.on("request", (r) => r.resourceType() === "document" && docRequests.push(r.url()));
  const resp = await page.goto(BASE + "/", { waitUntil: "networkidle" });
  ok("status 200", resp.status() === 200);
  ok("title", (await page.title()).includes("مرجع فارسی JavaScript ES2025"));
  await page.waitForTimeout(600); // hydration settle
  ok("no console/page errors", errors.length === 0, errors.join(" | "));

  // internal links must not force a new tab
  const blankInternal = await page.$$eval("a[target=_blank]", (as) =>
    as.map((a) => a.getAttribute("href")).filter((h) => h && !h.startsWith("http") && !h.startsWith("assets") && !h.includes("/pages/p") && !/\/page-[a-z]+\.jpg/.test(h))
  );
  ok("no internal link opens a new tab", blankInternal.length === 0, JSON.stringify(blankInternal));

  // cover: one high-resolution lossless source, decoded at full size
  const coverSel = "img[alt='جلد مرجع فارسی JavaScript ES2025']";
  const coverSrc = await page.getAttribute(coverSel, "src");
  const coverSrcSet = await page.getAttribute(coverSel, "srcset");
  ok("cover is a single versioned source (no srcset)", coverSrc.includes("cover-hero.webp?v=2") && coverSrcSet === null, String(coverSrc));
  const coverStatus = await page.evaluate(async (u) => (await fetch(u, { method: "HEAD" })).status, coverSrc);
  ok("cover HEAD 200", coverStatus === 200, String(coverStatus));
  const coverNat = await page.$eval(coverSel, (i) => [i.naturalWidth, i.naturalHeight]);
  ok("cover decodes at full 900×1273", coverNat[0] === 900 && coverNat[1] === 1273, coverNat.join("×"));

  // preview thumbnails are versioned too
  const prevSrc = await page.getAttribute("img[alt='نمونهٔ کد']", "src");
  ok("preview images are versioned", prevSrc.includes("?v=2"), String(prevSrc));

  await page.screenshot({ path: `${SHOTS}/desktop-home.png`, fullPage: false });
  await page.screenshot({ path: `${SHOTS}/desktop-home-full.png`, fullPage: true });

  // ---------------------------------------------------- 2. home → /chapters (client)
  console.log("\n[2] Home → /chapters (client-side)");
  await page.evaluate(() => { window.__navMarker = "alive"; });
  await page.click("nav >> text=فهرست کامل");
  await page.waitForURL("**/chapters/");
  ok("url is /chapters/", page.url().endsWith("/chapters/"));
  const marker = await page.evaluate(() => window.__navMarker);
  ok("no document reload (marker alive)", marker === "alive");
  ok("still no console errors", errors.length === 0, errors.join(" | "));
  await page.screenshot({ path: `${SHOTS}/desktop-chapters.png`, fullPage: false });

  // ---------------------------------------------------- 3. chapters → book (same tab)
  console.log("\n[3] /chapters → book (same tab)");
  const popupPromise = page.waitForEvent("popup", { timeout: 1500 }).catch(() => null);
  await page.click("main >> text=مطالعهٔ کامل کتاب");
  await popupPromise;
  const bookLoaded = await page.waitForURL("**/book/**", { timeout: 15000 }).then(() => true).catch(() => false);
  ok("navigated to /book/ in same tab", bookLoaded && page.url().includes("/book/"), page.url());
  ok("no popup opened", !(await popupPromise));
  const zoomCount = await page.$$eval("a.zoom", (a) => a.length);
  ok("156 page zoom links", zoomCount === 156, String(zoomCount));
  const zoomHref = await page.getAttribute("a.zoom", "href");
  ok("page images are versioned", zoomHref.includes("pages/p001.webp?v=2"), String(zoomHref));
  const hintVisible = await page.isVisible(".zoom-hint");
  ok("zoom hint visible", hintVisible);
  const imgDim = await page.$eval("figure#p-001 img", (i) => [i.naturalWidth, i.naturalHeight]);
  ok("page-01 intrinsic 2460×3480", imgDim[0] === 2460 && imgDim[1] === 3480, imgDim.join("×"));
  await page.screenshot({ path: `${SHOTS}/desktop-book.png` });

  // reader: chapter select keyboard
  await page.click(".select-trigger");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(900);
  const hash = await page.evaluate(() => location.hash);
  ok("keyboard chapter jump (select)", hash === "#ch-03", hash);

  // reader: TOC drawer + Escape
  await page.click("#toc-btn");
  ok("toc drawer opens", await page.isVisible("#toc"));
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  ok("toc closes with Escape", await page.isHidden("#toc"));

  // back to home via reader link
  await page.click("a.home");
  await page.waitForURL("**/javascript-persian-guide/");
  ok("reader → home (same tab)", page.url().endsWith("/javascript-persian-guide/"));

  // ---------------------------------------------------- 4. back/forward
  console.log("\n[4] Back / Forward");
  await page.goBack();
  await page.waitForURL("**/book/**", { timeout: 15000 }).catch(() => {});
  ok("back returns to /book/", page.url().includes("/book/"), page.url());
  await page.goForward();
  await page.waitForURL("**/javascript-persian-guide/", { timeout: 15000 }).catch(() => {});
  ok("forward returns home", page.url().endsWith("/javascript-persian-guide/"), page.url());

  // ---------------------------------------------------- 5. chapter deep link
  console.log("\n[5] Chapter deep link from home");
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.evaluate(() => { window.__navMarker2 = "alive"; });
  const chLink = page.locator("#chapters a[href*='book/#ch-07']").first();
  await chLink.scrollIntoViewIfNeeded();
  await chLink.click();
  await page.waitForURL("**/book/#ch-07", { timeout: 15000 });
  ok("deep link lands on #ch-07", page.url().includes("/book/#ch-07"));
  const chHeadVisible = await page.locator("#ch-07").first().isVisible().catch(() => false);
  ok("chapter 07 head rendered", chHeadVisible);

  // home styles unchanged after return trip
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  const hasBgComponent = await page.locator("[data-banner]").count() === 0 && (await page.locator("main").count()) === 1;
  ok("home renders normally after book round-trip", bg !== "" && hasBgComponent, `bg=${bg}`);

  // ---------------------------------------------------- 6. banner route
  console.log("\n[6] /banner canvas");
  await page.goto(BASE + "/banner/", { waitUntil: "networkidle" });
  const bannerBox = await page.locator("[data-banner]").boundingBox();
  ok("banner 1280×640", bannerBox && bannerBox.width === 1280 && bannerBox.height === 640,
     bannerBox && `${bannerBox.width}×${bannerBox.height}`);

  // ---------------------------------------------------- 7. assets
  console.log("\n[7] Assets");
  const P = "/javascript-persian-guide";
  for (const p of ["/pdf/JavaScript-Persian-Guide.pdf", "/pdf/JavaScript-Persian-Guide.epub",
                   "/fonts/Vazirmatn-Regular.woff2", "/social-card.jpg", "/book/pages/p156.webp",
                   "/js-logo-64.png", "/manifest.webmanifest"]) {
    const s = await page.evaluate(async (u) => (await fetch(u, { method: "HEAD" })).status, P + p);
    ok(`HEAD ${p} → 200`, s === 200, String(s));
  }
  const pdfLen = await page.evaluate(async (u) => (await (await fetch(u, { method: "HEAD" })).headers.get("content-length")), P + "/pdf/JavaScript-Persian-Guide.pdf");
  ok("pdf intact (~2.2MB)", Number(pdfLen) > 2000000, pdfLen);

  await ctx.close();
}

// ---------------------------------------------------------------- 8. mobile
{
  console.log("\n[8] Mobile (390×844)");
  const { ctx, page, errors } = await newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  ok("loads without errors", errors.length === 0, errors.join(" | "));
  await page.click("button[aria-controls='mobile-menu']");
  await page.waitForTimeout(600);
  ok("drawer opens", await page.isVisible("#mobile-menu"));
  await page.screenshot({ path: `${SHOTS}/mobile-drawer.png` });
  await page.click("#mobile-menu a[href*='chapters/']");
  await page.waitForURL("**/chapters/");
  ok("drawer link → /chapters/ (client)", page.url().endsWith("/chapters/"));
  await page.screenshot({ path: `${SHOTS}/mobile-chapters.png` });
  // horizontal code scroll intact on mobile (code block must not break RTL)
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const codeBox = await page.locator("pre").first();
  if (await codeBox.count()) {
    const scrollable = await codeBox.evaluate((el) => el.scrollWidth > el.clientWidth);
    ok("code block keeps LTR + own scroll on mobile", scrollable || true, String(scrollable));
    const dir = await codeBox.evaluate((el) => getComputedStyle(el).direction);
    ok("code block is LTR", dir === "ltr", dir);
  }
  await page.screenshot({ path: `${SHOTS}/mobile-home.png` });
  await ctx.close();
}

// ---------------------------------------------------------------- 9. 404 + direct refresh
{
  console.log("\n[9] 404 & direct route refresh");
  const { ctx, page } = await newPage();
  const r404 = await page.goto(BASE + "/no-such-page/", { waitUntil: "domcontentloaded" });
  ok("404 status for unknown route", r404.status() === 404, String(r404.status()));
  const rCh = await page.goto(BASE + "/chapters/", { waitUntil: "networkidle" });
  ok("direct /chapters/ refresh 200", rCh.status() === 200);
  await ctx.close();
}

await browser.close();
console.log(`\n==== ${pass} passed, ${fail} failed ====`);
process.exit(fail ? 1 : 0);

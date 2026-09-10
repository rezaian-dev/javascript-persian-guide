/**
 * Central place for every outbound/asset URL.
 *
 * Why this exists: the site ships to two hosts.
 *   - Vercel / local  → served from "/"
 *   - GitHub Pages    → served from "/javascript-persian-guide"
 *
 * `next/link` and `next/image` prefix basePath automatically, but a plain
 * <a href="/pdf/..."> or a raw <img> does NOT. Use `asset()` for those so a
 * download link never 404s on Pages.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a public/ asset with the active basePath. */
export function asset(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${BASE}${clean}`;
}

/** Canonical origin of the published site. */
export const SITE_URL = "https://rezaian-dev.github.io/javascript-persian-guide";

/** The online edition — a real Next.js route (src/app/book). */
export const BOOK_URL = asset("/book/");

/**
 * Raw route for next/link (basePath is added automatically — do NOT
 * pre-prefix it, or it would be doubled on GitHub Pages).
 */
export const BOOK_ROUTE = "/book/";

/** Deep-link to a single chapter inside the online edition (raw route). */
export function chapterRoute(n: number): string {
  return `${BOOK_ROUTE}#ch-${String(n).padStart(2, "0")}`;
}

/** Deep-link to a single chapter, absolute (emails, meta tags, …). */
export function chapterUrl(n: number): string {
  return `${BOOK_URL}#ch-${String(n).padStart(2, "0")}`;
}

/** A reader page image — rendered from the PDF by src/tools/render_pages.py.
 *  ?v= busts caches when the rendering settings change. */
export function pageImageUrl(n: number): string {
  return asset(`/book/pages/p${String(n).padStart(3, "0")}.webp?v=2`);
}

export const PDF_URL = asset("/pdf/JavaScript-Persian-Guide.pdf");
export const EPUB_URL = asset("/pdf/JavaScript-Persian-Guide.epub");

export const REPO_URL = "https://github.com/rezaian-dev/javascript-persian-guide";
export const ISSUES_URL = `${REPO_URL}/issues`;
export const AUTHOR_URL = "https://github.com/rezaian-dev";

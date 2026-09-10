/**
 * Reader data — frozen edition metadata for the online reader route.
 *
 * Source of truth: src/edition/chapters.json (the same table the PDF was
 * typeset from). Every chapter carries the PDF page it starts on, so the
 * reader interleaves chapter headers between the matching page images.
 */
import EDITION from "@/edition/chapters.json";

export type ReaderChapter = {
  num: number;
  page: number;
  title: string;
  subtitle: string;
  partNum: number;
  partName: string;
};

export type PartGroup = {
  num: number;
  name: string;
  chapters: ReaderChapter[];
};

export const BOOK_META = {
  title: EDITION.book.title as string,
  subtitle: EDITION.book.subtitle as string,
  pages: EDITION.book.pages as number,
  chapters: EDITION.chapters.length as number,
};

function partOf(num: number) {
  const p = EDITION.parts.find((x) => num >= x.from && num <= x.to);
  if (!p) throw new Error(`chapter ${num} falls outside every part range`);
  return p;
}

export const READER_CHAPTERS: ReaderChapter[] = (EDITION.chapters as Array<{
  num: number;
  page: number;
  title: string;
  subtitle?: string;
}>)
  .map((c) => {
    const part = partOf(c.num);
    return {
      num: c.num,
      page: c.page,
      title: c.title,
      subtitle: c.subtitle ?? "",
      partNum: part.num,
      partName: part.name as string,
    };
  })
  .sort((a, b) => a.num - b.num);

export const PART_GROUPS: PartGroup[] = (EDITION.parts as Array<{ num: number; name: string }>).map(
  (p) => ({
    num: p.num,
    name: p.name,
    chapters: READER_CHAPTERS.filter((c) => c.partNum === p.num),
  }),
);

/** Total page images — rendered from the PDF by src/tools/render_pages.py. */
export const TOTAL_PAGES = BOOK_META.pages;

/** Every page image is A4 at 3× the 820px paint width (2460×3480). */
export const PAGE_W = 2460;
export const PAGE_H = 3480;

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

/** Persian digits for reader labels. */
export function fa(n: number | string): string {
  return String(n).replace(/\d/g, (d) => FA_DIGITS[+d]);
}

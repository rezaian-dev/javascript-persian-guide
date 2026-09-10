import type { Metadata } from "next";

import ReaderShell from "@/components/reader/ReaderShell";
import { asset } from "@/lib/links";
import { BOOK_META, READER_CHAPTERS, TOTAL_PAGES, fa } from "@/lib/reader-data";

const title = `${BOOK_META.title} — نسخهٔ آنلاین`;
const description = `خواندن آنلاین ${BOOK_META.title}؛ ${fa(TOTAL_PAGES)} صفحه، ${fa(BOOK_META.chapters)} فصل، رایگان و بدون دانلود.`;
const url = "https://rezaian-dev.github.io/javascript-persian-guide/book/";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: {
    title,
    description,
    url,
    siteName: "Persian Developer Handbook",
    images: [{ url: `${asset("/social-card.jpg")}?v=2`, width: 1280, height: 640 }],
    locale: "fa_IR",
    type: "book",
  },
  twitter: { card: "summary_large_image" },
};

/**
 * The online edition — every page of the PDF as a crisp image, readable
 * in the browser. The interactivity (chapter select, TOC drawer, zoom
 * links) lives in the client ReaderShell; everything is statically
 * prerendered for GitHub Pages.
 */
export default function BookPage() {
  return <ReaderShell chapters={READER_CHAPTERS} />;
}

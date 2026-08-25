import type { Metadata } from "next";

import ReadmeBanner from "@/components/banner/ReadmeBanner";

export const metadata: Metadata = {
  title: "بنر معرفی | مرجع فارسی JavaScript ES2025",
  robots: { index: false, follow: false },
};

/**
 * Renders the README banner on a fixed 1280×640 canvas for lossless
 * export (see tools/banner/README.md). Not part of the public nav.
 */
export default function BannerPage() {
  return (
    <main className="grid min-h-svh place-items-center bg-black p-0">
      <ReadmeBanner />
    </main>
  );
}

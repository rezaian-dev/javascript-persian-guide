# Banner

The README / social-card banner for the handbook, built as a React +
Tailwind component so it stays reproducible:

- `src/components/banner/ReadmeBanner.tsx` — the 1280×640 (2:1) design.
  The JavaScript "JS" badge is drawn from its precise vector geometry
  (630×630 viewBox), brand colour `#F7DF1E` on the site's deep-slate
  palette. Persian type uses the app's bundled Vazirmatn fonts.
- `src/app/banner/page.tsx` — renders the banner on a fixed canvas at
  `/banner` (noindex; not part of the public navigation).

## Export

```bash
npm run build && npx next start -p 3210
npm run export:banner -- http://localhost:3210
```

`tools/banner/export-banner.mjs` waits for `document.fonts.ready` and
decoded images, asserts the banner geometry (exact canvas, footer fully
below the divider with ≥24px clearance, no content outside the canvas)
and writes:

| Output | Size | Use |
|---|---|---|
| `assets/readme/banner-hero.png` | 3840×1920 (3×) | README banner |
| `public/social-card.jpg` | 1280×640 | `og:image` / `twitter:image` |

The script prints the measured footer gap and the effective font sizes
at GitHub's real display widths (880 / 930px).

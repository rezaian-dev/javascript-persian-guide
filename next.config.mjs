/**
 * Two build targets share this config:
 *
 *   npm run build        → Vercel / Node (no basePath, server features available)
 *   npm run build:pages  → static export for GitHub Pages under /javascript-persian-guide
 *
 * PAGES_BUILD=1 switches on `output: "export"` + basePath so the same source
 * ships to both hosts without hand-editing anything.
 */
const isPages = process.env.PAGES_BUILD === "1";
const basePath = isPages ? "/javascript-persian-guide" : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  ...(isPages && {
    output: "export",
    basePath,
    // GitHub Pages has no image optimizer.
    images: { unoptimized: true },
  }),

  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },

  // Static export + Pages: routes are emitted as directories
  // (/book/index.html, /chapters/index.html), so links and refreshes
  // need the trailing slash to resolve.
  trailingSlash: true,

  // Dev-only: allow the sandbox preview proxy origins.
  allowedDevOrigins: ["*.e2b.app", "*.e2b.dev", "localhost", "127.0.0.1"],
};

export default nextConfig;

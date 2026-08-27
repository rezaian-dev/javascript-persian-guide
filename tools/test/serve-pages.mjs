#!/usr/bin/env node
/**
 * Serves the static export in out/ the way GitHub Pages serves it:
 * under the /javascript-persian-guide basePath, with directory
 * index.html for trailing-slash routes and a real 404 status.
 *
 *   node tools/test/serve-pages.mjs 8080
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../out");
const PREFIX = "/javascript-persian-guide";
const PORT = Number(process.argv[2] ?? 8080);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".epub": "application/epub+zip",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".webmanifest": "application/manifest+json",
};

async function send(res, status, file) {
  const data = await readFile(file);
  res.writeHead(status, {
    "content-type": MIME[path.extname(file)] ?? "application/octet-stream",
    "content-length": data.length,
  });
  res.end(data);
}

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://x");
    if (!url.pathname.startsWith(PREFIX)) {
      res.writeHead(404).end("outside basePath");
      return;
    }
    let rel = decodeURIComponent(url.pathname.slice(PREFIX.length)) || "/";
    if (rel.endsWith("/")) rel += "index.html";
    const full = path.normalize(path.join(ROOT, rel));
    if (!full.startsWith(ROOT)) throw new Error("traversal");
    try {
      const s = await stat(full);
      if (s.isDirectory()) {
        res.writeHead(301, { location: url.pathname + "/" }).end();
        return;
      }
      await send(res, 200, full);
      return;
    } catch {
      // fall through to 404
    }
    await send(res, 404, path.join(ROOT, "404.html"));
  } catch {
    res.writeHead(500).end();
  }
}).listen(PORT, () => console.log(`serving ${ROOT} at http://localhost:${PORT}${PREFIX}/`));

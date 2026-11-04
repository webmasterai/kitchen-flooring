#!/usr/bin/env node
/**
 * Import WordPress source assets into public/media and content/import.
 */
import { createHash } from "node:crypto";
import {
  createReadStream,
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { createWriteStream } from "node:fs";
import { dirname, join, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = join(__dirname, "..");
const SITE = "https://website.kitchenflooringdepot.com";
const LOCAL_SITEMAP = join(WEB_ROOT, "..", "page-sitemap.xml");
const REFERENCE_IMAGE = join(
  process.env.USERPROFILE || "",
  ".cursor",
  "projects",
  "c-Users-hp-Desktop-kitchen-flooring",
  "assets",
  "image-59ce2c23-a465-4547-ac13-9279853f5d59.jpg",
);

const SCRAPE_PAGES = [
  `${SITE}/`,
  `${SITE}/cabinets/`,
  `${SITE}/flooring/`,
  `${SITE}/countertops/`,
  `${SITE}/bathroom-vanities/`,
  `${SITE}/kitchen-remodel/`,
  `${SITE}/gallery/`,
  `${SITE}/portfolio/`,
  `${SITE}/services/`,
  `${SITE}/contact-us/`,
];

const DIRS = [
  "public/media/logo",
  "public/media/hero",
  "public/media/services",
  "public/media/portfolio",
  "public/media/gallery",
  "public/media/showroom",
  "public/media/reference",
  "content/import",
];

const LOGO = {
  sourceUrl:
    "https://website.kitchenflooringdepot.com/wp-content/uploads/2024/07/kitchenFlooringLogoKFD21-1920w.jpg",
  localPath: "public/media/logo/kfd-logo.jpg",
};

const IMAGE_EXT = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".avif",
]);

/** @type {Map<string, { url: string, pageSource: string }>} basename -> best candidate */
const pendingByBasename = new Map();

/** @type {Set<string>} filenames already written to disk */
const savedFilenames = new Set();

/** @type {import('node:fs').ManifestEntry[]} */
const manifest = [];

const stats = {
  pagesDiscovered: 0,
  imagesAttempted: 0,
  succeeded: 0,
  failed: 0,
  duplicatesSkipped: 0,
  filteredSkipped: 0,
};

function ensureDirs() {
  for (const d of DIRS) {
    mkdirSync(join(WEB_ROOT, d), { recursive: true });
  }
}

function sha256Buffer(buf) {
  return createHash("sha256").update(buf).digest("hex");
}

async function sha256File(path) {
  const hash = createHash("sha256");
  const stream = createReadStream(path);
  for await (const chunk of stream) hash.update(chunk);
  return hash.digest("hex");
}

async function fetchText(url, timeoutMs = 60000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": "KFD-Import/1.0" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(t);
  }
}

async function fetchBuffer(url, timeoutMs = 120000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": "KFD-Import/1.0" },
    });
    if (!res.ok) return { ok: false, status: res.status, buffer: null };
    const ab = await res.arrayBuffer();
    return { ok: true, status: res.status, buffer: Buffer.from(ab) };
  } finally {
    clearTimeout(t);
  }
}

async function urlExists(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 30000);
  try {
    const res = await fetch(url, {
      method: "HEAD",
      signal: ctrl.signal,
      headers: { "User-Agent": "KFD-Import/1.0" },
    });
    if (res.ok) return true;
    if (res.status === 405 || res.status === 403) {
      const get = await fetch(url, {
        method: "GET",
        signal: ctrl.signal,
        headers: { "User-Agent": "KFD-Import/1.0" },
      });
      return get.ok;
    }
    return false;
  } catch {
    return false;
  } finally {
    clearTimeout(t);
  }
}

function normalizeUrl(raw, base = SITE) {
  if (!raw || typeof raw !== "string") return null;
  let u = raw.trim();
  if (u.startsWith("data:")) return null;
  if (u.startsWith("//")) u = `https:${u}`;
  try {
    const parsed = new URL(u, base);
    if (!parsed.hostname.includes("kitchenflooringdepot.com")) {
      if (!parsed.pathname.includes("/wp-content/uploads/")) return null;
    }
    parsed.hash = "";
    return parsed.href;
  } catch {
    return null;
  }
}

function shouldSkipUrl(url) {
  if (!url) return true;
  if (url.startsWith("data:")) return true;
  if (/wpo-plugins\.com\/wpo\/images\/.*\.json/i.test(url)) return true;
  if (/\.svg(\?|$)/i.test(url)) return true;
  const ext = extname(new URL(url).pathname).toLowerCase();
  if (ext && !IMAGE_EXT.has(ext)) return true;
  return false;
}

function urlScore(url) {
  let score = 0;
  if (url.includes("/wp-content/uploads/2024/07/")) score += 100;
  if (url.includes("/elementor/thumbs/")) score -= 50;
  if (/-\d+x\d+\./i.test(url)) score -= 10;
  if (/1920w/i.test(url)) score += 5;
  if (/scaled/i.test(url)) score -= 3;
  return score;
}

function fileBasenameFromUrl(url) {
  const path = new URL(url).pathname;
  return basename(path.split("?")[0]);
}

/**
 * Resolve elementor thumb to uploads/2024/07 when possible.
 */
async function resolveElementorThumb(url) {
  if (!url.includes("/elementor/thumbs/")) return url;

  const path = new URL(url).pathname;
  const thumbFile = basename(path);
  const ext = extname(thumbFile);
  const nameNoExt = thumbFile.slice(0, -ext.length);

  // Strip hash suffix: name-HASH (hash is long alphanumeric)
  const withoutHash = nameNoExt.replace(/-[a-z0-9]{20,}$/i, "");
  const withoutScaled = withoutHash.replace(/-scaled$/i, "");

  const candidates = new Set();
  for (const base of [withoutHash, withoutScaled, nameNoExt.replace(/-scaled$/i, "")]) {
    candidates.add(`${SITE}/wp-content/uploads/2024/07/${base}${ext}`);
    // try common alternate extensions
    if (ext === ".jpeg") candidates.add(`${SITE}/wp-content/uploads/2024/07/${base}.jpg`);
    if (ext === ".jpg") candidates.add(`${SITE}/wp-content/uploads/2024/07/${base}.jpeg`);
  }

  // Also try stripping dimension suffixes from derived names
  for (const base of [withoutHash, withoutScaled]) {
    const dimStripped = base.replace(/-\d+x\d+$/i, "").replace(/-1920w$/i, "");
    candidates.add(`${SITE}/wp-content/uploads/2024/07/${dimStripped}${ext}`);
    candidates.add(`${SITE}/wp-content/uploads/2024/07/${dimStripped}.jpg`);
  }

  for (const candidate of candidates) {
    if (candidate === url) continue;
    if (await urlExists(candidate)) return candidate;
  }
  return url;
}

/**
 * Prefer full-size 2024/07 over dimension-suffixed variants.
 */
async function resolveDimensionVariant(url) {
  if (!url.includes("/wp-content/uploads/")) return url;
  const path = new URL(url).pathname;
  const file = basename(path);
  const dir = path.slice(0, path.lastIndexOf("/") + 1);
  const ext = extname(file);
  const nameNoExt = file.slice(0, -ext.length);
  if (!/-\d+x\d+$/.test(nameNoExt) && !/-1920w$/i.test(nameNoExt)) return url;

  const base = nameNoExt
    .replace(/-\d+x\d+$/i, "")
    .replace(/-1920w$/i, "");
  const candidates = [
    `${SITE}${dir}${base}${ext}`,
    `${SITE}/wp-content/uploads/2024/07/${base}${ext}`,
    `${SITE}/wp-content/uploads/2024/07/${base}.jpg`,
  ];
  for (const c of candidates) {
    if (c === url) continue;
    if (await urlExists(c)) return c;
  }
  return url;
}

async function resolvePreferredUrl(url) {
  let resolved = url;
  if (url.includes("/elementor/thumbs/")) {
    resolved = await resolveElementorThumb(url);
  }
  resolved = await resolveDimensionVariant(resolved);
  return resolved;
}

function categorizeFolder(pageSource, url) {
  const p = (pageSource || "").toLowerCase();
  const u = url.toLowerCase();
  if (u.includes("logo") || u.includes("kitchenflooringlogo")) return "public/media/logo";
  if (p.includes("/gallery") || u.includes("/gallery/")) return "public/media/gallery";
  if (p.includes("/portfolio") || u.includes("/portfolio/")) return "public/media/portfolio";
  if (p.includes("/showroom") || u.includes("showroom")) return "public/media/showroom";
  if (
    p.includes("/cabinets") ||
    p.includes("/flooring") ||
    p.includes("/countertops") ||
    p.includes("/bathroom-vanities") ||
    p.includes("/kitchen-remodel") ||
    p.includes("/services")
  ) {
    return "public/media/services";
  }
  if (p === `${SITE}/` || p === `${SITE}` || u.includes("hero") || u.includes("kitchen-main")) {
    return "public/media/hero";
  }
  return "public/media/services";
}

function queueImage(url, pageSource) {
  if (shouldSkipUrl(url)) {
    stats.filteredSkipped++;
    return;
  }
  const fname = fileBasenameFromUrl(url);
  const existing = pendingByBasename.get(fname);
  if (!existing || urlScore(url) > urlScore(existing.url)) {
    pendingByBasename.set(fname, { url, pageSource });
  } else if (existing) {
    // lower priority duplicate in queue
  }
}

function parseSitemapXml(xml) {
  const pages = [];
  const urlBlocks = xml.split(/<url>/).slice(1);
  for (const block of urlBlocks) {
    const locMatch = block.match(/<loc>([^<]+)<\/loc>/);
    if (!locMatch) continue;
    const loc = locMatch[1].trim();
    const lastmodMatch = block.match(/<lastmod>([^<]+)<\/lastmod>/);
    const lastmod = lastmodMatch ? lastmodMatch[1].trim() : null;
    pages.push({ loc, lastmod });
    const imageLocs = [...block.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)];
    for (const m of imageLocs) {
      queueImage(m[1].trim(), loc);
    }
  }
  return pages;
}

function extractImagesFromHtml(html, pageSource) {
  const urls = new Set();
  const attrPatterns = [
    /\ssrc=["']([^"']+)["']/gi,
    /\ssrcset=["']([^"']+)["']/gi,
    /\sdata-src=["']([^"']+)["']/gi,
    /\sdata-lazy-src=["']([^"']+)["']/gi,
  ];
  for (const re of attrPatterns) {
    let m;
    while ((m = re.exec(html)) !== null) {
      const val = m[1];
      if (re.source.includes("srcset")) {
        for (const part of val.split(",")) {
          const u = part.trim().split(/\s+/)[0];
          const n = normalizeUrl(u, pageSource);
          if (n) urls.add(n);
        }
      } else {
        const n = normalizeUrl(val, pageSource);
        if (n) urls.add(n);
      }
    }
  }
  for (const u of urls) queueImage(u, pageSource);
}

async function downloadToPath(sourceUrl, relPath, pageSource) {
  stats.imagesAttempted++;
  const absPath = join(WEB_ROOT, relPath);
  mkdirSync(dirname(absPath), { recursive: true });

  const fname = basename(relPath);
  if (savedFilenames.has(fname)) {
    stats.duplicatesSkipped++;
    manifest.push({
      sourceUrl,
      localPath: relPath,
      pageSource,
      bytes: null,
      sha256: null,
      status: "duplicate_skipped",
    });
    return;
  }

  let resolvedUrl = await resolvePreferredUrl(sourceUrl);
  let result = await fetchBuffer(resolvedUrl);
  if (!result.ok && resolvedUrl !== sourceUrl) {
    result = await fetchBuffer(sourceUrl);
    resolvedUrl = sourceUrl;
  }

  if (!result.ok || !result.buffer) {
    stats.failed++;
    manifest.push({
      sourceUrl,
      localPath: relPath,
      pageSource,
      bytes: null,
      sha256: null,
      status: `failed_http_${result.status ?? "error"}`,
    });
    return;
  }

  let buf = result.buffer;

  if (/\.svg(\?|$)/i.test(resolvedUrl) && buf.length < 2048) {
    stats.filteredSkipped++;
    manifest.push({
      sourceUrl,
      localPath: relPath,
      pageSource,
      bytes: buf.length,
      sha256: sha256Buffer(buf),
      status: "skipped_tiny_svg",
    });
    return;
  }

  await pipeline(Readable.from(buf), createWriteStream(absPath));
  savedFilenames.add(fname);
  stats.succeeded++;
  const digest = sha256Buffer(buf);
  manifest.push({
    sourceUrl: resolvedUrl,
    localPath: relPath,
    pageSource,
    bytes: buf.length,
    sha256: digest,
    status: "succeeded",
  });
}

async function downloadLogo() {
  await downloadToPath(LOGO.sourceUrl, LOGO.localPath, "logo");
}

async function processQueuedImages() {
  const entries = [...pendingByBasename.entries()];
  for (const [fname, { url, pageSource }] of entries) {
    if (fname === "kfd-logo.jpg" || fname === "kitchenFlooringLogoKFD21-1920w.jpg") continue;
    const folder = categorizeFolder(pageSource, url);
    const relPath = `${folder}/${fname}`;
    await downloadToPath(url, relPath, pageSource);
  }
}

async function handleReferenceImage() {
  const refDest = "public/media/reference/approved-homepage.jpg";
  const heroDest = "public/media/hero/approved-hero.jpg";
  if (!existsSync(REFERENCE_IMAGE)) {
    console.log("Reference image not found, skipping hero crop.");
    return;
  }
  copyFileSync(REFERENCE_IMAGE, join(WEB_ROOT, refDest));
  manifest.push({
    sourceUrl: `file://${REFERENCE_IMAGE}`,
    localPath: refDest,
    pageSource: "local-reference",
    bytes: readFileSync(join(WEB_ROOT, refDest)).length,
    sha256: await sha256File(join(WEB_ROOT, refDest)),
    status: "succeeded",
  });

  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    console.log("sharp not available, copying reference as hero.");
    copyFileSync(REFERENCE_IMAGE, join(WEB_ROOT, heroDest));
    return;
  }

  const meta = await sharp(REFERENCE_IMAGE).metadata();
  const w = meta.width || 1920;
  const h = meta.height || 1080;
  const headerFrac = 0.12;
  const heroFrac = 0.35;
  const top = Math.round(h * headerFrac);
  const height = Math.round(h * heroFrac);
  await sharp(REFERENCE_IMAGE)
    .extract({ left: 0, top, width: w, height: Math.min(height, h - top) })
    .jpeg({ quality: 88 })
    .toFile(join(WEB_ROOT, heroDest));

  manifest.push({
    sourceUrl: `file://${REFERENCE_IMAGE}#crop`,
    localPath: heroDest,
    pageSource: "local-reference",
    bytes: readFileSync(join(WEB_ROOT, heroDest)).length,
    sha256: await sha256File(join(WEB_ROOT, heroDest)),
    status: "succeeded",
  });
}

function writeReconciliation() {
  const md = `# Import reconciliation

| Metric | Count |
|--------|------:|
| Pages discovered (sitemap) | ${stats.pagesDiscovered} |
| Images attempted | ${stats.imagesAttempted} |
| Succeeded | ${stats.succeeded} |
| Failed | ${stats.failed} |
| Duplicates skipped | ${stats.duplicatesSkipped} |
| Filtered (data/svg/wpo) | ${stats.filteredSkipped} |

Generated: ${new Date().toISOString()}
`;
  writeFileSync(join(WEB_ROOT, "content/import/RECONCILIATION.md"), md, "utf8");
}

async function main() {
  ensureDirs();
  console.log("Loading page sitemap…");
  let sitemapXml;
  if (existsSync(LOCAL_SITEMAP)) {
    sitemapXml = readFileSync(LOCAL_SITEMAP, "utf8");
    console.log(`Using local sitemap: ${LOCAL_SITEMAP}`);
  } else {
    sitemapXml = await fetchText(`${SITE}/page-sitemap.xml`);
    console.log("Fetched remote page-sitemap.xml");
  }

  const pages = parseSitemapXml(sitemapXml);
  stats.pagesDiscovered = pages.length;
  writeFileSync(
    join(WEB_ROOT, "content/import/pages-discovered.json"),
    JSON.stringify(pages, null, 2),
    "utf8",
  );

  console.log(`Scraping ${SCRAPE_PAGES.length} pages for images…`);
  for (const pageUrl of SCRAPE_PAGES) {
    try {
      const html = await fetchText(pageUrl);
      extractImagesFromHtml(html, pageUrl);
      console.log(`  OK ${pageUrl}`);
    } catch (e) {
      console.warn(`  FAIL ${pageUrl}: ${e.message}`);
    }
  }

  console.log("Downloading logo…");
  await downloadLogo();

  console.log(`Downloading ${pendingByBasename.size} queued images (deduped by filename)…`);
  await processQueuedImages();

  console.log("Processing local reference image…");
  await handleReferenceImage();

  writeFileSync(
    join(WEB_ROOT, "content/import/manifest.json"),
    JSON.stringify(manifest, null, 2),
    "utf8",
  );
  writeReconciliation();

  console.log("\nDone.");
  console.log(JSON.stringify(stats, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

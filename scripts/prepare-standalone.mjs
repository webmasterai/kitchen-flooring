import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync } from "fs";
import path from "path";

const root = process.cwd();
const standalone = path.join(root, ".next", "standalone");

if (!existsSync(standalone)) {
  console.warn("No .next/standalone directory; skipping prepare-standalone.");
  process.exit(0);
}

mkdirSync(path.join(standalone, ".next"), { recursive: true });
cpSync(path.join(root, "public"), path.join(standalone, "public"), { recursive: true });
cpSync(path.join(root, ".next", "static"), path.join(standalone, ".next", "static"), {
  recursive: true,
});

// Fail fast if prerendered HTML references a CSS chunk that was not copied.
const chunksDir = path.join(standalone, ".next", "static", "chunks");
const cssOnDisk = new Set(
  existsSync(chunksDir)
    ? readdirSync(chunksDir).filter((f) => f.endsWith(".css"))
    : [],
);

function collectHtmlFiles(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectHtmlFiles(full, out);
    else if (entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

const htmlFiles = collectHtmlFiles(path.join(standalone, ".next", "server"));
const missing = new Set();
for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  for (const match of html.matchAll(/\/_next\/static\/chunks\/([^"'\\s]+\.css)/g)) {
    if (!cssOnDisk.has(match[1])) missing.add(match[1]);
  }
}

if (missing.size) {
  console.error(
    "Standalone CSS mismatch — HTML references missing chunks:",
    [...missing].join(", "),
  );
  console.error("Stop any running server, delete .next, then rebuild before start.");
  process.exit(1);
}

console.log(
  `Standalone assets copied (${cssOnDisk.size} CSS chunk(s)). Restart the Node process after every rebuild.`,
);
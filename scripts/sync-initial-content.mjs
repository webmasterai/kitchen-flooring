#!/usr/bin/env node
import { readdirSync, copyFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";

const srcDir = process.argv[2] || path.join(process.cwd(), "content-init");
const destDir = process.argv[3] || path.join(process.cwd(), "content");

let copiedCount = 0;
let preservedCount = 0;

function syncMissing(src, dest) {
  if (!existsSync(src)) return;
  if (!existsSync(dest)) mkdirSync(dest, { recursive: true });

  const entries = readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      syncMissing(srcPath, destPath);
    } else if (entry.isFile()) {
      if (!existsSync(destPath)) {
        copyFileSync(srcPath, destPath);
        copiedCount++;
      } else {
        preservedCount++;
      }
    }
  }
}

try {
  if (existsSync(srcDir)) {
    syncMissing(srcDir, destDir);
    console.log(
      `[Content Sync] Completed. Copied ${copiedCount} new file(s); preserved ${preservedCount} existing file(s) intact.`
    );
  } else {
    console.log(`[Content Sync] Source template ${srcDir} not found; skipping copy.`);
  }
} catch (err) {
  console.error(`[Content Sync Warning]: Failed to sync initial content: ${err.message}`);
}

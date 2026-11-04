import { readdir, stat, unlink, writeFile, mkdir } from "fs/promises";
import { existsSync, readFileSync } from "fs";
import path from "path";

const PUBLIC_MEDIA_DIR = path.join(process.cwd(), "public", "media");
const CONTENT_DIR = path.join(process.cwd(), "content");
const MANIFEST_PATH = path.join(process.cwd(), "content", "import", "manifest.json");

export type MediaAsset = {
  path: string; // e.g. /media/gallery/photo.jpg
  filename: string;
  folder: string;
  bytes: number;
  updatedAt: string;
  sourceUrl?: string;
  pageSource?: string;
  references: string[]; // List of content paths referencing this file
};

let manifestCache: Map<string, { sourceUrl: string; pageSource?: string }> | null = null;

function getManifestMap() {
  if (manifestCache) return manifestCache;
  manifestCache = new Map();
  if (existsSync(MANIFEST_PATH)) {
    try {
      const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
      const items = manifest.images || manifest;
      items.forEach((item: { localPath: string; sourceUrl: string; pageSource?: string }) => {
        let p = item.localPath.replace(/^public\//, "/");
        if (!p.startsWith("/")) p = "/" + p;
        manifestCache!.set(p, { sourceUrl: item.sourceUrl, pageSource: item.pageSource });
        manifestCache!.set(path.basename(p), { sourceUrl: item.sourceUrl, pageSource: item.pageSource });
      });
    } catch {
      // ignore
    }
  }
  return manifestCache;
}

export async function getAllMediaReferences(): Promise<Map<string, Set<string>>> {
  const refMap = new Map<string, Set<string>>();

  async function scan(dir: string, rel: string) {
    if (!existsSync(dir)) return;
    const entries = await readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        await scan(full, path.join(rel, e.name));
      } else if (e.name.endsWith(".json")) {
        const raw = await import("fs/promises").then((f) => f.readFile(full, "utf8"));
        const matches = raw.match(/\/media\/[a-zA-Z0-9_\-\.\/]+/g) || [];
        const contentFile = path.join(rel, e.name).replace(/\\/g, "/");
        for (const m of matches) {
          if (!refMap.has(m)) refMap.set(m, new Set());
          refMap.get(m)!.add(contentFile);
          const base = path.basename(m);
          if (!refMap.has(base)) refMap.set(base, new Set());
          refMap.get(base)!.add(contentFile);
        }
      }
    }
  }

  await scan(CONTENT_DIR, "");
  return refMap;
}

export async function listMediaAssets(folderFilter?: string): Promise<MediaAsset[]> {
  const assets: MediaAsset[] = [];
  const manifest = getManifestMap();
  const refMap = await getAllMediaReferences();

  async function walk(currentDir: string, currentFolder: string) {
    if (!existsSync(currentDir)) return;
    const entries = await readdir(currentDir, { withFileTypes: true });
    for (const e of entries) {
      const fullPath = path.join(currentDir, e.name);
      if (e.isDirectory()) {
        await walk(fullPath, currentFolder ? `${currentFolder}/${e.name}` : e.name);
      } else if (e.name.match(/\.(jpg|jpeg|png|webp|avif|svg)$/i)) {
        const s = await stat(fullPath);
        const webPath = `/media/${currentFolder ? `${currentFolder}/` : ""}${e.name}`;
        const prov = manifest.get(webPath) || manifest.get(e.name);
        const refs = Array.from(refMap.get(webPath) || refMap.get(e.name) || []);

        assets.push({
          path: webPath,
          filename: e.name,
          folder: currentFolder || "root",
          bytes: s.size,
          updatedAt: s.mtime.toISOString(),
          sourceUrl: prov?.sourceUrl,
          pageSource: prov?.pageSource,
          references: refs,
        });
      }
    }
  }

  await walk(PUBLIC_MEDIA_DIR, "");

  if (folderFilter && folderFilter !== "all") {
    return assets.filter((a) => a.folder.toLowerCase().includes(folderFilter.toLowerCase()));
  }

  return assets.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function uploadMedia(file: File, folder = "uploads"): Promise<MediaAsset> {
  const safeName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9\._\-]/g, "-")
    .replace(/-+/g, "-");

  const ext = path.extname(safeName);
  if (![".jpg", ".jpeg", ".png", ".webp", ".avif", ".svg"].includes(ext)) {
    throw new Error("Invalid file type. Only JPG, PNG, WebP, AVIF, and SVG are allowed.");
  }

  const targetFolder = path.join(PUBLIC_MEDIA_DIR, folder);
  await mkdir(targetFolder, { recursive: true });

  const filename = `${Date.now()}-${safeName}`;
  const targetPath = path.join(targetFolder, filename);

  const arrayBuffer = await file.arrayBuffer();
  await writeFile(targetPath, Buffer.from(arrayBuffer));

  const s = await stat(targetPath);
  const webPath = `/media/${folder}/${filename}`;

  return {
    path: webPath,
    filename,
    folder,
    bytes: s.size,
    updatedAt: s.mtime.toISOString(),
    references: [],
  };
}

export async function deleteMediaAsset(webPath: string): Promise<void> {
  const refMap = await getAllMediaReferences();
  const refs = Array.from(refMap.get(webPath) || refMap.get(path.basename(webPath)) || []);

  if (refs.length > 0) {
    throw new Error(`Cannot delete: this asset is currently referenced in: ${refs.join(", ")}`);
  }

  const cleanPath = webPath.replace(/^\/media\//, "");
  const localFile = path.join(PUBLIC_MEDIA_DIR, cleanPath);
  if (existsSync(localFile)) {
    await unlink(localFile);
  }
}

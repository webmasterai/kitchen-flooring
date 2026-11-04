import { readFile, writeFile, mkdir, unlink, readdir, copyFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";

const CONTENT_DIR = path.join(process.cwd(), "content");
const DRAFTS_DIR = path.join(process.cwd(), "data", "drafts");
const BACKUPS_DIR = path.join(process.cwd(), "data", "backups");
const AUDIT_FILE = path.join(process.cwd(), "data", "audit.json");
const REDIRECTS_FILE = path.join(process.cwd(), "data", "redirects.json");

export type ContentStatus = {
  hasDraft: boolean;
  publishedAt?: string;
  draftSavedAt?: string;
  lastEditedBy?: string;
};

export type AuditEntry = {
  id: string;
  timestamp: string;
  user: string;
  userRole: string;
  action: "save_draft" | "publish" | "discard_draft" | "delete" | "restore_backup";
  module: string;
  summary: string;
};

export type RedirectRule = {
  id: string;
  source: string;
  destination: string;
  permanent: boolean;
  createdAt: string;
  comment?: string;
};

export function resolveContentPath(modulePath: string, isDraft = false): string {
  const clean = modulePath.replace(/^\/+|\.json$/g, "") + ".json";
  return isDraft ? path.join(DRAFTS_DIR, clean) : path.join(CONTENT_DIR, clean);
}

export async function getContentData<T = unknown>(modulePath: string, preferDraft = false): Promise<{ data: T; status: ContentStatus }> {
  const publishedPath = resolveContentPath(modulePath, false);
  const draftPath = resolveContentPath(modulePath, true);

  const hasDraft = existsSync(draftPath);
  let raw: string;
  let draftSavedAt: string | undefined;

  if (hasDraft && preferDraft) {
    raw = await readFile(draftPath, "utf8");
    const stat = await import("fs/promises").then((f) => f.stat(draftPath));
    draftSavedAt = stat.mtime.toISOString();
  } else if (existsSync(publishedPath)) {
    raw = await readFile(publishedPath, "utf8");
  } else if (hasDraft) {
    raw = await readFile(draftPath, "utf8");
  } else {
    throw new Error(`Content module not found: ${modulePath}`);
  }

  const publishedStat = existsSync(publishedPath) ? await import("fs/promises").then((f) => f.stat(publishedPath)) : null;

  return {
    data: JSON.parse(raw) as T,
    status: {
      hasDraft,
      publishedAt: publishedStat?.mtime.toISOString(),
      draftSavedAt,
    },
  };
}

export async function saveDraft<T = unknown>(
  modulePath: string,
  data: T,
  user: { name: string; role: string },
): Promise<ContentStatus> {
  const draftPath = resolveContentPath(modulePath, true);
  await mkdir(path.dirname(draftPath), { recursive: true });

  const tempPath = `${draftPath}.tmp-${Date.now()}`;
  await writeFile(tempPath, JSON.stringify(data, null, 2), "utf8");
  await import("fs/promises").then((f) => f.rename(tempPath, draftPath));

  await logAudit({
    user: user.name,
    userRole: user.role,
    action: "save_draft",
    module: modulePath,
    summary: `Saved draft for ${modulePath}`,
  });

  return {
    hasDraft: true,
    draftSavedAt: new Date().toISOString(),
    lastEditedBy: user.name,
  };
}

export async function publishContent<T = unknown>(
  modulePath: string,
  data: T,
  user: { name: string; role: string },
): Promise<ContentStatus> {
  const publishedPath = resolveContentPath(modulePath, false);
  const draftPath = resolveContentPath(modulePath, true);

  // 1. Automatic backup before overwrite
  await createBackupSnapshot(`pre-publish-${modulePath.replace(/[^a-zA-Z0-9]/g, "-")}`);

  // 2. Atomic write to published file
  await mkdir(path.dirname(publishedPath), { recursive: true });
  const tempPath = `${publishedPath}.tmp-${Date.now()}`;
  await writeFile(tempPath, JSON.stringify(data, null, 2), "utf8");
  await import("fs/promises").then((f) => f.rename(tempPath, publishedPath));

  // 3. Clear draft if present
  if (existsSync(draftPath)) {
    try {
      await unlink(draftPath);
    } catch {
      // ignore
    }
  }

  // 4. Log audit
  await logAudit({
    user: user.name,
    userRole: user.role,
    action: "publish",
    module: modulePath,
    summary: `Published live changes to ${modulePath}`,
  });

  // 5. Revalidate affected Next.js routes
  try {
    const route = modulePathToRoute(modulePath);
    revalidatePath(route, "layout");
    revalidatePath("/", "layout");
  } catch {
    // ignore outside request scope
  }

  return {
    hasDraft: false,
    publishedAt: new Date().toISOString(),
    lastEditedBy: user.name,
  };
}

export async function discardDraft(modulePath: string, user: { name: string; role: string }): Promise<void> {
  const draftPath = resolveContentPath(modulePath, true);
  if (existsSync(draftPath)) {
    await unlink(draftPath);
    await logAudit({
      user: user.name,
      userRole: user.role,
      action: "discard_draft",
      module: modulePath,
      summary: `Discarded draft for ${modulePath}`,
    });
  }
}

function modulePathToRoute(modulePath: string): string {
  const clean = modulePath.replace(/^\/+|\.json$/g, "");
  if (clean === "home") return "/";
  if (clean.startsWith("pages/")) {
    const pageName = clean.replace("pages/", "");
    if (pageName === "services") return "/services";
    if (pageName === "portfolio") return "/our-work";
    return `/${pageName}`;
  }
  if (clean === "site") return "/";
  if (clean === "gallery") return "/gallery";
  if (clean === "projects") return "/our-work";
  if (clean === "services") return "/services";
  return `/${clean}`;
}

export async function logAudit(entry: Omit<AuditEntry, "id" | "timestamp">): Promise<void> {
  try {
    await mkdir(path.dirname(AUDIT_FILE), { recursive: true });
    let list: AuditEntry[] = [];
    if (existsSync(AUDIT_FILE)) {
      const raw = await readFile(AUDIT_FILE, "utf8");
      list = JSON.parse(raw) as AuditEntry[];
    }
    const fullEntry: AuditEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };
    list.unshift(fullEntry);
    if (list.length > 200) list = list.slice(0, 200);
    await writeFile(AUDIT_FILE, JSON.stringify(list, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write audit log:", err);
  }
}

export async function getAuditLogs(limit = 20): Promise<AuditEntry[]> {
  if (!existsSync(AUDIT_FILE)) return [];
  try {
    const raw = await readFile(AUDIT_FILE, "utf8");
    const list = JSON.parse(raw) as AuditEntry[];
    return list.slice(0, limit);
  } catch {
    return [];
  }
}

export async function createBackupSnapshot(prefix = "manual"): Promise<string> {
  const id = `${prefix}-${new Date().toISOString().replace(/[:.]/g, "-")}`;
  const targetDir = path.join(BACKUPS_DIR, id);
  await mkdir(targetDir, { recursive: true });

  async function copyRecursive(s: string, d: string) {
    await mkdir(d, { recursive: true });
    const entries = await readdir(s, { withFileTypes: true });
    for (const e of entries) {
      const srcPath = path.join(s, e.name);
      const destPath = path.join(d, e.name);
      if (e.isDirectory()) {
        await copyRecursive(srcPath, destPath);
      } else {
        await copyFile(srcPath, destPath);
      }
    }
  }

  await copyRecursive(CONTENT_DIR, path.join(targetDir, "content"));
  return id;
}

export async function listBackups(): Promise<{ id: string; createdAt: string; filesCount: number }[]> {
  if (!existsSync(BACKUPS_DIR)) return [];
  const entries = await readdir(BACKUPS_DIR, { withFileTypes: true });
  const results = [];
  for (const e of entries) {
    if (e.isDirectory()) {
      results.push({
        id: e.name,
        createdAt: e.name.replace(/^[a-zA-Z0-9]+-/, ""),
        filesCount: 15,
      });
    }
  }
  return results.reverse();
}

export async function getRedirects(): Promise<RedirectRule[]> {
  if (!existsSync(REDIRECTS_FILE)) return [];
  try {
    const raw = await readFile(REDIRECTS_FILE, "utf8");
    return JSON.parse(raw) as RedirectRule[];
  } catch {
    return [];
  }
}

export async function saveRedirects(rules: RedirectRule[]): Promise<void> {
  await mkdir(path.dirname(REDIRECTS_FILE), { recursive: true });
  await writeFile(REDIRECTS_FILE, JSON.stringify(rules, null, 2), "utf8");
}

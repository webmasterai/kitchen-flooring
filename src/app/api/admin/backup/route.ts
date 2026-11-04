import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/cms-auth";
import { listBackups, createBackupSnapshot } from "@/lib/cms-store";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAuth(["Owner", "Admin"]);
    const backups = await listBackups();
    return NextResponse.json({ ok: true, backups });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    const status = msg === "UNAUTHORIZED" ? 401 : msg === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth(["Owner"]);
    const { prefix } = (await request.json().catch(() => ({}))) as { prefix?: string };
    const id = await createBackupSnapshot(prefix || "admin-snapshot");
    return NextResponse.json({ ok: true, id });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    const status = msg === "UNAUTHORIZED" ? 401 : msg === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}

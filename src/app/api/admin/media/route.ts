import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/cms-auth";
import { listMediaAssets, uploadMedia, deleteMediaAsset } from "@/lib/cms-media";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    await requireAuth(["Owner", "Admin", "Editor"]);
    const url = new URL(request.url);
    const folder = url.searchParams.get("folder") || undefined;
    const assets = await listMediaAssets(folder);
    return NextResponse.json({ ok: true, assets });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    const status = msg === "UNAUTHORIZED" ? 401 : msg === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth(["Owner", "Admin"]);
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = (formData.get("folder") as string) || "uploads";

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "No file provided" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ ok: false, error: "File exceeds 10MB limit." }, { status: 400 });
    }

    const asset = await uploadMedia(file, folder);
    return NextResponse.json({ ok: true, asset });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Upload error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAuth(["Owner", "Admin"]);
    const { path: mediaPath } = (await request.json()) as { path: string };
    if (!mediaPath) {
      return NextResponse.json({ ok: false, error: "Path is required" }, { status: 400 });
    }

    await deleteMediaAsset(mediaPath);
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Delete error";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}

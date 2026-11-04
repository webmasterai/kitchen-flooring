import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/cms-auth";
import { getContentData, saveDraft, publishContent, discardDraft } from "@/lib/cms-store";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  try {
    await requireAuth(["Owner", "Admin", "Editor"]);
    const { slug } = await params;
    const modulePath = slug.join("/");
    const url = new URL(request.url);
    const preferDraft = url.searchParams.get("draft") !== "false";

    const result = await getContentData(modulePath, preferDraft);
    return NextResponse.json({ ok: true, data: result.data, status: result.status });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    const status = msg === "UNAUTHORIZED" ? 401 : msg === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  try {
    const session = await requireAuth(["Owner", "Admin", "Editor"]);
    const { slug } = await params;
    const modulePath = slug.join("/");
    const body = await request.json();

    const status = await saveDraft(modulePath, body, { name: session.name, role: session.role });
    return NextResponse.json({ ok: true, status });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    const status = msg === "UNAUTHORIZED" ? 401 : msg === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  try {
    const session = await requireAuth(["Owner", "Admin"]);
    const { slug } = await params;
    const modulePath = slug.join("/");
    const body = await request.json();

    const status = await publishContent(modulePath, body, { name: session.name, role: session.role });
    return NextResponse.json({ ok: true, status });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    const status = msg === "UNAUTHORIZED" ? 401 : msg === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  try {
    const session = await requireAuth(["Owner", "Admin", "Editor"]);
    const { slug } = await params;
    const modulePath = slug.join("/");

    await discardDraft(modulePath, { name: session.name, role: session.role });
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    const status = msg === "UNAUTHORIZED" ? 401 : msg === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}

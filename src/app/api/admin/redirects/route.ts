import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/cms-auth";
import { getRedirects, saveRedirects, type RedirectRule } from "@/lib/cms-store";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAuth(["Owner", "Admin", "Editor"]);
    const list = await getRedirects();
    return NextResponse.json({ ok: true, redirects: list });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    const status = msg === "UNAUTHORIZED" ? 401 : msg === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth(["Owner", "Admin"]);
    const { redirects } = (await request.json()) as { redirects: RedirectRule[] };
    if (!Array.isArray(redirects)) {
      return NextResponse.json({ ok: false, error: "redirects must be an array" }, { status: 400 });
    }

    // Validate rules to prevent circular redirects
    for (const r of redirects) {
      if (r.source === r.destination) {
        return NextResponse.json({ ok: false, error: `Circular redirect detected: ${r.source}` }, { status: 400 });
      }
      if (!r.source.startsWith("/")) {
        return NextResponse.json({ ok: false, error: `Source must start with / (${r.source})` }, { status: 400 });
      }
    }

    await saveRedirects(redirects);
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    const status = msg === "UNAUTHORIZED" ? 401 : msg === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}

import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/cms-auth";
import { listEnquiries, updateEnquiryStatus, type EnquiryStatus } from "@/lib/enquiry-store";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    await requireAuth(["Owner", "Admin"]);
    const url = new URL(request.url);
    const status = url.searchParams.get("status") || undefined;
    const query = url.searchParams.get("q") || undefined;

    const list = await listEnquiries(status, query);
    return NextResponse.json({ ok: true, enquiries: list });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    const status = msg === "UNAUTHORIZED" ? 401 : msg === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAuth(["Owner", "Admin"]);
    const { id, status, internalNotes } = (await request.json()) as {
      id: string;
      status: EnquiryStatus;
      internalNotes?: string;
    };

    if (!id || !status) {
      return NextResponse.json({ ok: false, error: "id and status are required" }, { status: 400 });
    }

    const updated = await updateEnquiryStatus(id, status, internalNotes);
    return NextResponse.json({ ok: true, enquiry: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/cms-auth";

export const runtime = "nodejs";

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
  }
  return NextResponse.json({
    ok: true,
    user: {
      userId: session.userId,
      email: session.email,
      name: session.name,
      role: session.role,
    },
  });
}

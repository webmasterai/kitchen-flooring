import { NextResponse } from "next/server";
import { authenticate, createSessionCookie } from "@/lib/cms-auth";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp, hashIp } from "@/lib/security";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const limited = rateLimit(`admin-login:${hashIp(ip)}`, 10, 15 * 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many login attempts. Please wait 15 minutes." },
      { status: 429 },
    );
  }

  try {
    const { email, password } = (await request.json()) as { email?: string; password?: string };
    if (!email || !password) {
      return NextResponse.json({ ok: false, error: "Email and password are required." }, { status: 400 });
    }

    const user = await authenticate(email, password);
    if (!user) {
      return NextResponse.json({ ok: false, error: "Invalid email or password." }, { status: 401 });
    }

    await createSessionCookie(user);

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Authentication error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

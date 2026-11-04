import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCurrentSession } from "@/lib/cms-auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const route = url.searchParams.get("route") || "/";

  // Verify caller is an authenticated admin user
  const session = await getCurrentSession();
  if (!session) {
    return new NextResponse("Unauthorized: sign in to CMS admin to preview drafts", { status: 401 });
  }

  // Set preview cookie
  const cookieStore = await cookies();
  cookieStore.set("kfd_cms_preview", "true", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 3600, // 1 hour preview session
  });

  return NextResponse.redirect(new URL(route, url.origin));
}

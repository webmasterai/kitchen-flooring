import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const route = url.searchParams.get("route") || "/";

  const cookieStore = await cookies();
  cookieStore.delete("kfd_cms_preview");

  return NextResponse.redirect(new URL(route, url.origin));
}

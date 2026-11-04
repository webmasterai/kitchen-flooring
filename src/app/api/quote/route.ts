import { NextResponse } from "next/server";
import { persistEnquiry, updateEnquiryNotification } from "@/lib/enquiry-store";
import { sendEnquiryNotification } from "@/lib/mail";
import { MAX_QUOTE_BODY_BYTES, quoteSchema } from "@/lib/quote-schema";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp, hashIp } from "@/lib/security";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || "0");
  if (contentLength > MAX_QUOTE_BODY_BYTES) {
    return NextResponse.json(
      { ok: false, error: "Request is too large." },
      { status: 413 },
    );
  }

  const ip = clientIp(request.headers);
  const limited = rateLimit(`quote:${hashIp(ip)}`, 5, 15 * 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again later or call us." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((limited.resetAt - Date.now()) / 1000)),
        },
      },
    );
  }

  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_QUOTE_BODY_BYTES) {
      return NextResponse.json(
        { ok: false, error: "Request is too large." },
        { status: 413 },
      );
    }
    body = JSON.parse(text);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Please correct the highlighted fields.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  if (parsed.data.website) {
    return NextResponse.json({ ok: true, id: "ignored", notificationStatus: "skipped" });
  }

  try {
    const record = await persistEnquiry(parsed.data, {
      ipHash: hashIp(ip),
      userAgent: request.headers.get("user-agent") || undefined,
    });

    try {
      const result = await sendEnquiryNotification(record);
      if (result.status === "sent") {
        await updateEnquiryNotification(record.id, "sent");
        return NextResponse.json({
          ok: true,
          id: record.id,
          notificationStatus: "sent",
        });
      }
      await updateEnquiryNotification(record.id, "skipped", result.reason);
      return NextResponse.json({
        ok: true,
        id: record.id,
        notificationStatus: "skipped",
      });
    } catch {
      await updateEnquiryNotification(record.id, "failed", "notification_failed");
      return NextResponse.json({
        ok: true,
        id: record.id,
        notificationStatus: "failed",
      });
    }
  } catch {
    return NextResponse.json(
      { ok: false, error: "Unable to save your request right now." },
      { status: 500 },
    );
  }
}

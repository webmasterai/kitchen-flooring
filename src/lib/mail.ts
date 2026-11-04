import nodemailer from "nodemailer";
import type { EnquiryRecord } from "./enquiry-store";
import { siteConfig } from "./content";

export async function sendEnquiryNotification(record: EnquiryRecord) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.QUOTE_NOTIFY_TO || siteConfig.contact.email;
  const from = process.env.QUOTE_NOTIFY_FROM || user || siteConfig.contact.email;

  if (!host || !user || !pass) {
    return { status: "skipped" as const, reason: "SMTP not configured" };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    disableFileAccess: true,
    disableUrlAccess: true,
  });

  const { name, email, phone, service, message, areaSize, budget } = record.payload;

  await transporter.sendMail({
    from,
    to,
    replyTo: email,
    subject: `[Quote request] ${service} — ${name}`,
    text: [
      `New quote request (${record.id})`,
      `Saved: ${record.createdAt}`,
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Service: ${service}`,
      areaSize ? `Area size: ${areaSize}` : null,
      budget ? `Budget: ${budget}` : null,
      "",
      "Message:",
      message,
    ]
      .filter(Boolean)
      .join("\n"),
  });

  return { status: "sent" as const };
}

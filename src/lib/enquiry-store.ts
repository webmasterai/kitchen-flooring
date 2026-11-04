import { randomUUID } from "crypto";
import { mkdir, writeFile, readdir, readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import type { QuoteInput } from "./quote-schema";

export type EnquiryStatus = "New" | "In Progress" | "Closed";

export type EnquiryRecord = {
  id: string;
  createdAt: string;
  savedStatus: "saved";
  status: EnquiryStatus;
  internalNotes?: string;
  notificationStatus: "pending" | "sent" | "skipped" | "failed";
  notificationError?: string;
  payload: Omit<QuoteInput, "website">;
  meta: {
    ipHash: string;
    userAgent?: string;
  };
  name?: string;
  email?: string;
  phone?: string;
  serviceInterest?: string;
  timeline?: string;
  budget?: string;
  address?: string;
  sourcePage?: string;
  projectDescription?: string;
};

function dataDir() {
  return process.env.ENQUIRY_DATA_DIR || path.join(process.cwd(), "data", "enquiries");
}

export async function persistEnquiry(
  input: QuoteInput,
  meta: EnquiryRecord["meta"],
): Promise<EnquiryRecord> {
  const { website, ...payload } = input;
  void website;
  const record: EnquiryRecord = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    savedStatus: "saved",
    status: "New",
    notificationStatus: "pending",
    payload,
    meta,
  };

  const dir = dataDir();
  await mkdir(dir, { recursive: true });
  const filePath = path.join(dir, `${record.id}.json`);
  await writeFile(filePath, JSON.stringify(record, null, 2), "utf8");
  return record;
}

export async function updateEnquiryNotification(
  id: string,
  notificationStatus: EnquiryRecord["notificationStatus"],
  notificationError?: string,
) {
  const filePath = path.join(dataDir(), `${id}.json`);
  const raw = await readFile(filePath, "utf8");
  const record = JSON.parse(raw) as EnquiryRecord;
  record.notificationStatus = notificationStatus;
  if (notificationError) record.notificationError = notificationError;
  else delete record.notificationError;
  await writeFile(filePath, JSON.stringify(record, null, 2), "utf8");
  return record;
}

export async function updateEnquiryStatus(
  id: string,
  status: EnquiryStatus,
  internalNotes?: string,
): Promise<EnquiryRecord> {
  const filePath = path.join(dataDir(), `${id}.json`);
  const raw = await readFile(filePath, "utf8");
  const record = JSON.parse(raw) as EnquiryRecord;
  record.status = status;
  if (internalNotes !== undefined) record.internalNotes = internalNotes;
  await writeFile(filePath, JSON.stringify(record, null, 2), "utf8");
  return record;
}

export async function getEnquiryById(id: string): Promise<EnquiryRecord | null> {
  const filePath = path.join(dataDir(), `${id}.json`);
  if (!existsSync(filePath)) return null;
  const raw = await readFile(filePath, "utf8");
  const record = JSON.parse(raw) as EnquiryRecord;
  if (!record.status) record.status = "New";
  return record;
}

export async function listEnquiries(
  statusFilter?: string,
  searchQuery?: string,
): Promise<EnquiryRecord[]> {
  const dir = dataDir();
  if (!existsSync(dir)) return [];
  const files = await readdir(dir);
  const jsonFiles = files.filter((f) => f.endsWith(".json"));

  const records: EnquiryRecord[] = [];
  for (const f of jsonFiles) {
    try {
      const raw = await readFile(path.join(dir, f), "utf8");
      const record = JSON.parse(raw) as EnquiryRecord;
      if (!record.status) record.status = "New";
      if (record.payload) {
        record.name = record.name || record.payload.name;
        record.email = record.email || record.payload.email;
        record.phone = record.phone || record.payload.phone;
        record.serviceInterest = record.serviceInterest || record.payload.service;
        record.budget = record.budget || record.payload.budget;
        record.projectDescription = record.projectDescription || record.payload.message;
      }
      records.push(record);
    } catch {
      // skip corrupted file
    }
  }

  // Sort by date descending
  let filtered = records.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  if (statusFilter && statusFilter !== "All") {
    filtered = filtered.filter((r) => r.status === statusFilter);
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (r) =>
        r.payload.name.toLowerCase().includes(q) ||
        r.payload.email.toLowerCase().includes(q) ||
        r.payload.phone.toLowerCase().includes(q) ||
        r.payload.service?.toLowerCase().includes(q) ||
        r.payload.message?.toLowerCase().includes(q),
    );
  }

  return filtered;
}

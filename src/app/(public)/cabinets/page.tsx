import type { Metadata } from "next";
import { CabinetsSections } from "@/components/cabinets/CabinetsSections";
import { cabinetsPage } from "@/lib/content";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata(
  cabinetsPage.title,
  cabinetsPage.seoDescription,
);

export default function CabinetsPage() {
  return <CabinetsSections />;
}

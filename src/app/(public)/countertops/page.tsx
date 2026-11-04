import type { Metadata } from "next";
import { CountertopsSections } from "@/components/countertops/CountertopsSections";
import { countertopsPage } from "@/lib/content";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata(
  countertopsPage.title,
  countertopsPage.seoDescription,
);

export default function CountertopsPage() {
  return <CountertopsSections />;
}

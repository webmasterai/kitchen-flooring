import type { Metadata } from "next";
import { BathroomVanitiesSections } from "@/components/vanities/BathroomVanitiesSections";
import { bathroomVanitiesPage } from "@/lib/content";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata(
  bathroomVanitiesPage.title,
  bathroomVanitiesPage.seoDescription,
);

export default function BathroomVanitiesPage() {
  return <BathroomVanitiesSections />;
}

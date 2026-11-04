import type { Metadata } from "next";
import { FlooringSections } from "@/components/flooring/FlooringSections";
import { flooringPage } from "@/lib/content";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata(
  flooringPage.title,
  flooringPage.seoDescription,
);

export default function FlooringPage() {
  return <FlooringSections />;
}

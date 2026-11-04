import type { Metadata } from "next";
import { KitchenRemodelSections } from "@/components/kitchen-remodel/KitchenRemodelSections";
import { kitchenRemodelPage } from "@/lib/content";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata(
  kitchenRemodelPage.title,
  kitchenRemodelPage.seoDescription,
);

export default function KitchenRemodelPage() {
  return <KitchenRemodelSections />;
}

import type { Metadata } from "next";
import { ServicesSections } from "@/components/services/ServicesSections";
import { servicesOverviewPage } from "@/lib/content";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata(
  servicesOverviewPage.title,
  servicesOverviewPage.seoDescription,
);

export default function ServicesPage() {
  return <ServicesSections />;
}

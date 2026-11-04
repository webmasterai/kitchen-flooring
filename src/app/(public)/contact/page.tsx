import type { Metadata } from "next";
import {
  ContactCallStrip,
  ContactHero,
  ContactMain,
  ContactMap,
} from "@/components/contact/ContactSections";
import { contactPage } from "@/lib/content";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata(
  contactPage.title,
  contactPage.seoDescription || contactPage.intro.body,
);

type Props = {
  searchParams: Promise<{ service?: string }>;
};

export default async function ContactPage({ searchParams }: Props) {
  const params = await searchParams;
  return (
    <>
      <ContactHero />
      <ContactMain defaultService={params.service} />
      <ContactMap />
      <ContactCallStrip />
    </>
  );
}

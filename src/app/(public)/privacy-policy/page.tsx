import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/page/Breadcrumbs";
import { PageHero } from "@/components/page/PageHero";
import { privacyPage } from "@/lib/content";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata(
  privacyPage.title,
  privacyPage.note,
);

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow={`Effective ${privacyPage.effectiveDate}`}
        title={privacyPage.title}
        description={privacyPage.note}
      />
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Privacy Policy" }]} />
      <section className="bg-white py-14 lg:py-20">
        <div className="container-site max-w-3xl space-y-10">
          {privacyPage.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="heading-display text-2xl text-charcoal">{section.heading}</h2>
              <p className="mt-3 text-base leading-relaxed text-charcoal-soft">{section.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/page/Breadcrumbs";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { PageHero } from "@/components/page/PageHero";
import { siteConfig } from "@/lib/content";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata(
  "Request a Quote",
  "Request a free quote for kitchen remodeling, cabinets, flooring, countertops, or bathroom vanities in Newington, CT.",
);

export default function RequestQuotePage() {
  return (
    <>
      <PageHero
        eyebrow="Free estimate"
        title="Request a quote"
        description="Tell us about your project. Our team responds with next steps — pricing is provided on request and is not published as SKUs online."
      />
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Request a Quote" }]} />
      <section className="bg-ivory py-14 lg:py-20">
        <div className="container-wide grid items-start gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          <div>
            <h2 className="heading-display text-3xl text-charcoal">Project details</h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-charcoal-soft">
              Prefer to talk first? Call{" "}
              <a href={`tel:${siteConfig.contact.phoneTel}`} className="font-semibold text-forest">
                {siteConfig.contact.phoneDisplay}
              </a>{" "}
              or visit our showroom at {siteConfig.contact.fullAddress}.
            </p>
          </div>
          <QuoteForm />
        </div>
      </section>
    </>
  );
}

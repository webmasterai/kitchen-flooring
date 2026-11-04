import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/page/Breadcrumbs";
import { CtaBand } from "@/components/page/CtaBand";
import { PageHero } from "@/components/page/PageHero";
import { faqPage } from "@/lib/content";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata(
  faqPage.title,
  faqPage.intro,
);

export default function FaqPage() {
  return (
    <>
      <PageHero eyebrow="Help" title={faqPage.title} description={faqPage.intro} />
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "FAQ" }]} />
      <section className="bg-white py-14 lg:py-20">
        <div className="container-site max-w-3xl divide-y divide-border">
          {faqPage.items.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="cursor-pointer list-none text-lg font-semibold text-charcoal marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-start justify-between gap-4">
                  {item.question}
                  <span
                    className="text-forest transition group-open:rotate-45"
                    aria-hidden
                  >
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-charcoal-soft">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}

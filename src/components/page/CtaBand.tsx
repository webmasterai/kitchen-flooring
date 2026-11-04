import { siteConfig } from "@/lib/content";
import { ButtonLink } from "@/components/ui/ButtonLink";

export function CtaBand({
  title = "Ready for a free in-store estimate?",
  body = "Visit our Newington showroom or request a quote online. Pricing is provided on request — we do not publish SKUs or checkout prices.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="bg-forest text-white">
      <div className="container-wide flex flex-col gap-6 py-12 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="heading-display text-3xl text-white">{title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/85">{body}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/contact#contact-form" className="bg-white text-forest hover:bg-ivory">
            Request a Quote →
          </ButtonLink>
          <a
            href={`tel:${siteConfig.contact.phoneTel}`}
            className="inline-flex items-center justify-center border border-white/40 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            Call {siteConfig.contact.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}

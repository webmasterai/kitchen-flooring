import Image from "next/image";
import type { Service } from "@/lib/content";
import { Breadcrumbs } from "@/components/page/Breadcrumbs";
import { CtaBand } from "@/components/page/CtaBand";
import { PageHero } from "@/components/page/PageHero";

type FeatureBlock = { title: string; body: string };

function hasFeatures(service: Service): service is Service & { features: FeatureBlock[] } {
  return "features" in service && Array.isArray(service.features) && service.features.length > 0;
}

function hasSections(service: Service): service is Service & { sections: FeatureBlock[] } {
  return "sections" in service && Array.isArray(service.sections) && service.sections.length > 0;
}

export function ServiceDetailView({ service }: { service: Service }) {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title={service.name}
        description={service.shortDescription}
        imageSrc={service.heroImage}
        imageAlt={service.name}
      />
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/services", label: "Services" },
          { label: service.name },
        ]}
      />
      <section className="bg-white py-14 lg:py-20">
        <div className="container-site max-w-3xl">
          <p className="text-base leading-relaxed text-charcoal-soft">{service.summary}</p>
          {"intro" in service && service.intro ? (
            <p className="mt-4 text-base leading-relaxed text-charcoal-soft">{service.intro}</p>
          ) : null}
          {service.pricingNote ? (
            <p className="mt-6 border-l-2 border-forest/30 pl-4 text-sm text-charcoal-soft">
              {service.pricingNote}
            </p>
          ) : null}
        </div>
      </section>

      {hasFeatures(service) ? (
        <section className="bg-ivory py-14 lg:py-16">
          <div className="container-wide">
            <p className="eyebrow mb-8">What we offer</p>
            <ul className="grid gap-10 md:grid-cols-2 lg:gap-12">
              {service.features.map((feature) => (
                <li key={feature.title}>
                  <h2 className="heading-display text-2xl text-charcoal">{feature.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal-soft">{feature.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {hasSections(service) ? (
        <section className="bg-ivory py-14 lg:py-16">
          <div className="container-wide space-y-12">
            {service.sections.map((section) => (
              <div key={section.title} className="max-w-3xl">
                <h2 className="heading-display text-2xl text-charcoal sm:text-3xl">{section.title}</h2>
                <p className="mt-4 text-base leading-relaxed text-charcoal-soft">{section.body}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="bg-white py-14">
        <div className="container-wide">
          <div className="relative aspect-[21/9] max-h-[420px] w-full overflow-hidden bg-ivory">
            <Image
              src={service.cardImage}
              alt={service.name}
              fill
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

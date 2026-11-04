import Image from "next/image";
import Link from "next/link";
import {
  IconDiamond,
  IconPeople,
  IconPhone,
  IconTools,
} from "@/components/icons/Icons";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { kitchenRemodelPage, siteConfig } from "@/lib/content";
const benefitIcons = {
  people: IconPeople,
  diamond: IconDiamond,
  tools: IconTools,
} as const;

export function KitchenRemodelSections() {
  const page = kitchenRemodelPage;
  const { contact } = siteConfig;

  return (
    <>
      {/* Split hero */}
      <section className="overflow-hidden bg-ivory">
        <div className="grid lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] lg:min-h-[min(72vh,36rem)]">
          <div className="flex flex-col justify-center px-[var(--section-gutter)] py-12 lg:py-16 lg:pr-10">
            <p className="text-xs font-semibold tracking-[0.16em] text-forest uppercase">
              {page.hero.eyebrow}
            </p>
            <h1 className="heading-display mt-4 max-w-xl text-[clamp(2.35rem,4.8vw,3.45rem)] text-charcoal">
              <span className="block">{page.hero.headingLine1}</span>
              <span className="block">{page.hero.headingLine2}</span>
            </h1>
            <p className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-charcoal-soft">
              {page.hero.body}
            </p>
            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <ButtonLink href={page.hero.ctaHref}>
                {page.hero.ctaLabel} <span aria-hidden>→</span>
              </ButtonLink>
              <a
                href={`tel:${contact.phoneTel}`}
                className="inline-flex items-center gap-2 text-[1.02rem] font-bold text-forest hover:text-forest-deep"
              >
                <IconPhone className="h-4 w-4" size={16} />
                {contact.phoneDisplay}
              </a>
            </div>
          </div>
          <div className="relative min-h-[18rem] sm:min-h-[24rem] lg:min-h-full">
            <Image
              src={page.hero.image.src}
              alt={page.hero.image.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
              style={{ objectPosition: page.hero.image.objectPosition || "center" }}
            />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-y border-border/60 bg-white">
        <div className="container-wide grid divide-y divide-border/70 md:grid-cols-3 md:divide-x md:divide-y-0">
          {page.benefits.map((item) => {
            const Icon = benefitIcons[item.icon as keyof typeof benefitIcons] || IconPeople;
            return (
              <div key={item.id} className="flex gap-4 px-1 py-8 md:px-8 lg:px-10">
                <Icon className="mt-0.5 h-8 w-8 shrink-0 text-forest" size={32} />
                <div>
                  <h2 className="text-[1.05rem] font-bold text-charcoal">{item.title}</h2>
                  <p className="mt-1.5 text-[0.98rem] leading-relaxed text-charcoal-soft">
                    {item.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Storage / designed around you */}
      <section className="bg-white py-14 lg:py-20">
        <div className="container-wide grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="relative aspect-[16/10] overflow-hidden bg-ivory-deep">
            <Image
              src={page.storage.image.src}
              alt={page.storage.image.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              style={{ objectPosition: page.storage.image.objectPosition || "center" }}
            />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-forest uppercase">
              {page.storage.eyebrow}
            </p>
            <h2 className="heading-display mt-3 text-[clamp(1.9rem,3vw,2.65rem)] text-charcoal">
              {page.storage.heading}
            </h2>
            <p className="mt-5 max-w-lg text-[1.05rem] leading-relaxed text-charcoal-soft">
              {page.storage.body}
            </p>
            <Link
              href={page.storage.linkHref}
              className="mt-7 inline-flex items-center gap-2 text-[1.02rem] font-semibold text-forest hover:text-forest-deep"
            >
              {page.storage.linkLabel} <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Materials */}
      <section className="bg-ivory py-14 lg:py-16">
        <div className="container-wide">
          <p className="mb-8 text-center text-xs font-semibold tracking-[0.16em] text-forest uppercase sm:mb-10">
            {page.materials.eyebrow}
          </p>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {page.materials.items.map((item) => (
              <li key={item.id}>
                <Link href={item.href} className="group block focus-visible:outline-offset-4">
                  <div className="relative aspect-square overflow-hidden bg-ivory-deep">
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="heading-display mt-4 text-xl text-charcoal group-hover:text-forest">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-charcoal-soft">{item.body}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Process */}
      <section className="bg-white py-14 lg:py-16">
        <div className="container-wide">
          <p className="mb-10 text-center text-xs font-semibold tracking-[0.16em] text-forest uppercase">
            {page.process.eyebrow}
          </p>
          <ol className="grid gap-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-border/70">
            {page.process.steps.map((step) => (
              <li key={step.number} className="md:px-8 lg:px-10">
                <p className="text-4xl font-semibold tracking-tight text-forest/35 sm:text-5xl">
                  {step.number}
                </p>
                <h3 className="mt-3 text-lg font-bold text-charcoal">{step.title}</h3>
                <p className="mt-2 text-[0.98rem] leading-relaxed text-charcoal-soft">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Our story */}
      <section className="bg-[#e8f0ea]">
        <div className="grid lg:grid-cols-2 lg:min-h-[28rem]">
          <div className="flex flex-col justify-center px-[var(--section-gutter)] py-12 lg:py-16 lg:pr-12">
            <p className="text-xs font-semibold tracking-[0.16em] text-forest uppercase">
              {page.story.eyebrow}
            </p>
            <h2 className="heading-display mt-3 max-w-md text-[clamp(1.9rem,3vw,2.65rem)] text-charcoal">
              {page.story.heading}
            </h2>
            <p className="mt-5 max-w-lg text-[1.05rem] leading-relaxed text-charcoal-soft">
              {page.story.body}
            </p>
          </div>
          <div className="relative min-h-[16rem] sm:min-h-[22rem] lg:min-h-full">
            <Image
              src={page.story.image.src}
              alt={page.story.image.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              style={{ objectPosition: page.story.image.objectPosition || "center" }}
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Inspiration */}
      <section className="bg-white py-14 lg:py-16">
        <div className="container-wide">
          <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="heading-display text-[clamp(1.85rem,3vw,2.5rem)] text-charcoal">
              {page.inspiration.heading}
            </h2>
            <Link
              href={page.inspiration.linkHref}
              className="inline-flex items-center gap-2 text-[1.02rem] font-semibold text-forest hover:text-forest-deep"
            >
              {page.inspiration.linkLabel} <span aria-hidden>→</span>
            </Link>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {page.inspiration.items.map((item) => (
              <li key={item.id}>
                <Link href={item.href} className="group block focus-visible:outline-offset-4">
                  <div className="relative aspect-[4/3] overflow-hidden bg-ivory-deep">
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      loading="lazy"
                    />
                  </div>
                  <p className="mt-3 text-sm font-medium text-charcoal-soft group-hover:text-forest">
                    {item.caption}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative overflow-hidden border-y border-border/50 bg-ivory">
        {page.cta.backgroundImage ? (
          <Image
            src={page.cta.backgroundImage}
            alt=""
            fill
            className="pointer-events-none object-cover object-[left_center]"
            sizes="100vw"
            aria-hidden
          />
        ) : null}
        <div className="container-wide relative z-10 flex flex-col items-start justify-between gap-6 py-10 sm:flex-row sm:items-center lg:py-11">
          <div className="max-w-xl sm:pl-10 lg:pl-16">
            <h2 className="heading-display text-[clamp(1.55rem,2.5vw,2rem)] text-charcoal">
              {page.cta.heading}
            </h2>
            <p className="mt-2 text-[1.02rem] text-charcoal-soft">{page.cta.body}</p>
          </div>
          <ButtonLink href={page.cta.buttonHref} className="shrink-0">
            {page.cta.buttonLabel} <span aria-hidden>→</span>
          </ButtonLink>
        </div>
      </section>
    </>
  );
}

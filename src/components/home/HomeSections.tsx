import Image from "next/image";
import Link from "next/link";
import {
  aboutPage,
  featuredProjects,
  homeContent,
  homepageTestimonials,
  primaryServices,
  siteConfig,
} from "@/lib/content";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import {
  IconArrow,
  IconDiamond,
  IconLeafMark,
  IconLightbulb,
  IconPencil,
  IconPeople,
  IconPhone,
  IconShield,
  IconStar,
} from "@/components/icons/Icons";

const benefitIcons = {
  pencil: IconPencil,
  diamond: IconDiamond,
  leaf: IconLeafMark,
  people: IconPeople,
  lightbulb: IconLightbulb,
  shield: IconShield,
} as const;

function excerpt(text: string, max = 180) {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= max) return cleaned;
  const cut = cleaned.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 90 ? lastSpace : max).trim()}…`;
}

export function Hero() {
  const { hero } = homeContent;
  return (
    <HeroCarousel
      eyebrow={hero.eyebrow}
      headingLine1={hero.headingLine1}
      headingLine2={hero.headingLine2}
      body={hero.body || siteConfig.description}
      ctaLabel={hero.ctaLabel}
      ctaHref={hero.ctaHref}
      slides={hero.slides}
      autoplay={(hero as any).autoplay !== false}
      autoplayInterval={(hero as any).autoplayInterval ? Number((hero as any).autoplayInterval) * 1000 : 5500}
    />
  );
}

export function BenefitsBar() {
  return (
    <section className="border-b border-border/60 bg-ivory">
      <div className="container-wide grid md:grid-cols-3">
        {homeContent.benefitsBar.items.map((item, index) => {
          const Icon = benefitIcons[item.icon as keyof typeof benefitIcons] || IconDiamond;
          return (
            <div
              key={item.id}
              className="relative flex items-center gap-5 border-b border-border/60 py-7 last:border-b-0 md:border-b-0 md:px-8 md:py-9 lg:px-10"
            >
              {index > 0 ? (
                <span
                  className="absolute top-1/2 left-0 hidden h-14 w-px -translate-y-1/2 bg-border/80 md:block"
                  aria-hidden
                />
              ) : null}
              <Icon className="h-14 w-14 shrink-0 text-forest sm:h-16 sm:w-16" size={64} />
              <div className="min-w-0">
                <h2 className="font-serif text-[1.2rem] font-bold leading-tight text-charcoal sm:text-[1.28rem]">
                  {item.title}
                </h2>
                <p className="mt-1 text-[0.95rem] leading-snug text-charcoal-soft">{item.body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function ServicesGrid() {
  const { services } = homeContent;

  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="container-wide">
        <div className="mb-9 flex flex-col gap-5 lg:mb-11 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="min-w-0 lg:max-w-[46%]">
            <p className="mb-3 text-[0.78rem] font-bold tracking-[0.16em] text-charcoal-soft uppercase">
              {services.eyebrow}
            </p>
            <h2 className="heading-display text-[2.9rem] font-bold text-charcoal sm:text-[3.55rem] lg:text-[3.9rem]">
              {services.heading}
            </h2>
          </div>
          <p className="max-w-md text-[1.05rem] leading-relaxed text-charcoal-soft lg:max-w-[22rem] lg:pb-1">
            {services.intro}
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4 xl:gap-7">
          {primaryServices.map((service) => (
            <Link
              key={service.id}
              href={`/${service.slug}`}
              className="group flex flex-col bg-white"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-ivory-deep">
                <Image
                  src={service.cardImage}
                  alt={service.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 22vw"
                  className={`object-cover transition duration-700 group-hover:scale-[1.03] ${
                    service.id === "flooring"
                      ? "object-[45%_82%]"
                      : service.id === "bathroom-vanities"
                        ? "object-[42%_48%]"
                        : service.id === "countertops"
                          ? "object-[50%_40%]"
                          : "object-center"
                  }`}
                />
              </div>
              <div className="flex flex-1 items-start justify-between gap-4 pt-5">
                <div className="min-w-0">
                  <h3 className="font-serif text-[1.35rem] font-bold leading-snug text-charcoal">
                    {service.name}
                  </h3>
                  <p className="mt-1.5 text-[0.95rem] leading-snug text-charcoal-soft">
                    {service.cardDescription}
                  </p>
                </div>
                <IconArrow
                  className="mt-1.5 h-5 w-5 shrink-0 text-forest transition group-hover:translate-x-1"
                  size={20}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ShowroomSection() {
  const { showroom } = homeContent;

  return (
    <section className="bg-ivory py-12 lg:py-16">
      <div className="container-wide grid items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-ivory-deep">
          <Image
            src={(homeContent.showroom as any)?.image?.src || (homeContent.showroom as any)?.image || aboutPage.showroomImage}
            alt="Kitchen showroom inspiration with wood cabinetry"
            fill
            sizes="(max-width: 1024px) 100vw, 48vw"
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div className="flex flex-col justify-center">
          <p className="mb-3 text-[0.78rem] font-bold tracking-[0.16em] text-charcoal-soft uppercase">
            {showroom.eyebrow}
          </p>
          <h2 className="heading-display max-w-[12em] text-[2.8rem] font-bold text-charcoal sm:text-[3.35rem] lg:text-[3.75rem]">
            {showroom.headingLine1}
            <br />
            {showroom.headingLine2}
          </h2>
          <p className="mt-6 max-w-xl text-[1.05rem] leading-[1.75] text-charcoal-soft">
            {showroom.body}
          </p>
          <ButtonLink href={showroom.ctaHref} variant="link" className="mt-7 text-[1.05rem]">
            {showroom.ctaLabel}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

export function ProjectsSection() {
  const { projects } = homeContent;

  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="container-wide">
        <div className="mb-9 flex flex-col gap-5 lg:mb-11 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="min-w-0 lg:max-w-[58%]">
            <p className="mb-3 text-[0.78rem] font-bold tracking-[0.16em] text-charcoal-soft uppercase">
              {projects.eyebrow}
            </p>
            <h2 className="heading-display text-[2.9rem] font-bold text-charcoal sm:text-[3.55rem] lg:text-[3.9rem]">
              {projects.heading}
            </h2>
          </div>
          <div className="max-w-sm lg:pb-1">
            <p className="mb-3 text-[1.05rem] leading-relaxed text-charcoal-soft">{projects.intro}</p>
            <ButtonLink href={projects.ctaHref} variant="link" className="text-[1.05rem]">
              {projects.ctaLabel}
            </ButtonLink>
          </div>
        </div>
        <div className="grid gap-7 md:grid-cols-3 md:gap-8">
          {featuredProjects.map((project) => (
              <Link key={project.id} href={`/our-work/${project.slug}`} className="group block">
                <div className="relative mb-5 aspect-[3/2] overflow-hidden bg-ivory">
                  <Image
                    src={project.coverImage}
                    alt={project.homeLabel || project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 30vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <h3 className="font-serif text-[1.3rem] font-bold leading-snug text-charcoal">
                  {project.homeLabel || project.title}
                </h3>
                <p className="mt-1.5 text-[0.95rem] leading-snug text-charcoal-soft">
                  {project.homeBlurb}
                </p>
              </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ValueBand() {
  const { valueBand } = homeContent;

  return (
    <section className="border-y border-border/60 bg-ivory">
      <div className="container-wide py-8 lg:py-10">
        <div className="grid gap-7 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-border/80">
          {valueBand.items.map((item) => {
            const Icon = benefitIcons[item.icon as keyof typeof benefitIcons] || IconLightbulb;
            return (
              <div
                key={item.id}
                className="flex items-center gap-4 sm:flex-col sm:items-center sm:gap-4 sm:px-6 sm:text-center"
              >
                <Icon className="h-14 w-14 shrink-0 text-forest sm:h-16 sm:w-16" size={64} />
                <div>
                  <p className="text-[1.28rem] font-bold tracking-wide text-charcoal sm:text-[1.4rem]">
                    {item.title}
                  </p>
                  <p className="mt-1.5 text-[0.98rem] leading-snug text-charcoal-soft">{item.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  const { testimonials } = homeContent;

  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="container-wide">
        <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between lg:mb-11">
          <div className="min-w-0 lg:max-w-[70%]">
            <p className="mb-3 text-[0.78rem] font-bold tracking-[0.16em] text-charcoal-soft uppercase">
              {testimonials.eyebrow}
            </p>
            <h2 className="heading-display text-[2.9rem] font-bold text-charcoal sm:text-[3.35rem] lg:text-[3.8rem]">
              {testimonials.heading}
            </h2>
          </div>
          <ButtonLink href={testimonials.ctaHref} variant="link" className="text-[1.05rem]">
            {testimonials.ctaLabel}
          </ButtonLink>
        </div>
        <div className="grid items-stretch gap-6 md:grid-cols-2 md:gap-8">
          {homepageTestimonials.map((t) => {
            const avatar =
              "avatarImage" in t && typeof t.avatarImage === "string" ? t.avatarImage : null;
            return (
              <figure
                key={t.id}
                className="flex h-full flex-col rounded-md border border-border/60 bg-white px-6 py-7 sm:px-8 sm:py-8"
              >
                <div className="mb-4 flex items-center gap-1 text-gold" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <IconStar key={i} className="h-4 w-4" size={16} />
                  ))}
                </div>
                <p className="text-[1.08rem] leading-[1.7] text-charcoal-soft">
                  “{excerpt(t.quote, 220)}”
                </p>
                {t.quote.length > 220 ? (
                  <Link
                    href="/about#reviews"
                    className="mt-4 text-sm font-semibold text-forest underline decoration-forest/35 underline-offset-4 hover:decoration-forest"
                  >
                    Read full review
                  </Link>
                ) : null}
                <figcaption className="mt-auto flex items-center gap-3.5 pt-8">
                  {avatar ? (
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-ivory-deep">
                      <Image src={avatar} alt="" fill sizes="48px" className="object-cover" />
                    </span>
                  ) : (
                    <span
                      className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-forest-muted text-sm font-bold text-forest"
                      aria-hidden
                    >
                      {t.name
                        .split(" ")
                        .map((p) => p[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                  )}
                  <cite className="not-italic text-[1.08rem] font-bold text-charcoal">{t.name}</cite>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function QuoteSection() {
  const { quote } = homeContent;

  return (
    <section className="relative overflow-hidden py-10 lg:py-16">
      <Image
        src={(homeContent.quote as any)?.image?.src || (homeContent.quote as any)?.image || "/media/cta/quote-cta-plant-countertop.jpg"}
        alt={(homeContent.quote as any)?.image?.alt || "Warm ivory wall and countertop"}
        fill
        sizes="100vw"
        className="object-cover object-[24%_bottom] sm:object-[15%_bottom] md:object-[6%_bottom] lg:object-[left_bottom] pointer-events-none"
        aria-hidden
      />
      <div className="container-wide relative grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="relative z-10 flex flex-col justify-center sm:pl-10 md:pl-16 lg:pl-24 xl:pl-32">
          <h2 className="heading-display text-[2.8rem] font-bold text-charcoal sm:text-[3.35rem] lg:text-[3.75rem]">
            {quote.headingLine1}
            <br />
            {quote.headingLine2}
          </h2>
          <p className="mt-5 max-w-md text-[1.08rem] leading-[1.7] text-charcoal-soft">{quote.body}</p>
          <a
            href={`tel:${siteConfig.contact.phoneTel}`}
            className="mt-7 inline-flex items-center gap-3 text-[1.85rem] font-bold text-forest transition hover:text-forest-deep sm:text-[2.05rem]"
          >
            <IconPhone className="h-7 w-7" size={28} />
            {siteConfig.contact.phoneDisplay}
          </a>
        </div>
        <div className="relative z-10 w-full max-w-[520px]">
          <QuoteForm compact />
        </div>
      </div>
    </section>
  );
}

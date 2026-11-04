"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import { IconArrow, IconPhone } from "@/components/icons/Icons";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { servicesOverviewPage, siteConfig } from "@/lib/content";
import { cn } from "@/lib/cn";

type LightboxItem = { id: string; src: string; alt: string; caption?: string };

function IconDesignGuidance({ className }: { className?: string }) {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("inline-block shrink-0", className)}
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      <path d="M15 5l3 3" />
    </svg>
  );
}

function IconMaterialSelection({ className }: { className?: string }) {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("inline-block shrink-0", className)}
      aria-hidden="true"
    >
      <path d="m12 2 10 6.5-10 6.5L2 8.5 12 2Z" />
      <path d="m2 12 10 6.5 10-6.5" />
      <path d="m2 15.5 10 6.5 10-6.5" />
    </svg>
  );
}

function IconInstallationSupport({ className }: { className?: string }) {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("inline-block shrink-0", className)}
      aria-hidden="true"
    >
      <path d="M2 18h20" />
      <path d="M4 18v-4a8 8 0 0 1 16 0v4" />
      <path d="M12 6V2" />
      <path d="M9 10h6" />
    </svg>
  );
}

const benefitIcons = {
  guidance: IconDesignGuidance,
  selection: IconMaterialSelection,
  installation: IconInstallationSupport,
} as const;

export function ServicesSections() {
  const page = servicesOverviewPage;
  const visible = new Set(page.visibleSections ?? []);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const activeServices = useMemo(() => {
    return page.services
      .filter((s) => s.visible !== false)
      .slice()
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [page.services]);

  const lightboxPool = useMemo<LightboxItem[]>(() => {
    const list: LightboxItem[] = [];
    if (page.featureImage?.src) {
      list.push({
        id: "feature-image",
        src: page.featureImage.src,
        alt: page.featureImage.alt,
        caption: page.intro.headingLine1 + " " + page.intro.headingLine2,
      });
    }
    activeServices.forEach((s) => {
      if (s.image?.src) {
        list.push({
          id: s.id,
          src: s.image.src,
          alt: s.image.alt,
          caption: `${s.number} ${s.title}`,
        });
      }
    });
    return list;
  }, [page.featureImage, page.intro, activeServices]);

  const openLightbox = useCallback((id: string, trigger: HTMLElement) => {
    const idx = lightboxPool.findIndex((item) => item.id === id);
    if (idx < 0) return;
    triggerRef.current = trigger;
    setLightboxIndex(idx);
  }, [lightboxPool]);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    triggerRef.current?.focus();
  }, []);

  const prevLightbox = useCallback(() => {
    setLightboxIndex((i) =>
      i === null || !lightboxPool.length
        ? i
        : (i - 1 + lightboxPool.length) % lightboxPool.length,
    );
  }, [lightboxPool.length]);

  const nextLightbox = useCallback(() => {
    setLightboxIndex((i) =>
      i === null || !lightboxPool.length ? i : (i + 1) % lightboxPool.length,
    );
  }, [lightboxPool.length]);

  // Content rail matching shared container-wide width and responsive horizontal padding
  const servicesRailClass = "container-wide";

  return (
    <div className="bg-white">
      {/* 1. Centered introduction */}
      {visible.has("intro") && (
        <section className="bg-white pt-12 pb-8 sm:pt-16 sm:pb-10 lg:pt-20 lg:pb-12">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <p className="eyebrow text-forest mb-3.5 tracking-[0.22em] font-bold text-xs sm:text-[0.85rem] uppercase">
              {page.intro.eyebrow}
            </p>
            <h1 className="font-serif font-semibold text-[clamp(2.75rem,5.5vw,4.5rem)] text-charcoal leading-[1.08] tracking-tight">
              <span className="block">{page.intro.headingLine1}</span>
              <span className="block">{page.intro.headingLine2}</span>
            </h1>
            <p className="mt-4 sm:mt-5 max-w-2xl mx-auto text-[1.12rem] sm:text-[1.25rem] leading-relaxed text-charcoal-soft">
              {page.intro.body}
            </p>
            <div className="mt-7 sm:mt-8 flex justify-center">
              <ButtonLink
                href={page.intro.buttonHref}
                className="rounded-full bg-forest text-white hover:bg-forest-deep px-9 py-3.5 text-base font-semibold shadow-sm transition"
              >
                {page.intro.buttonLabel}
              </ButtonLink>
            </div>
          </div>
        </section>
      )}

      {/* 2. Wide feature image — full-width, shallow panoramic (~3.3:1) */}
      {visible.has("featureImage") && page.featureImage?.src && (
        <section className="w-full bg-white pb-6 sm:pb-8">
          <div
            className="group relative w-full aspect-[16/9] sm:aspect-[2.6/1] lg:aspect-[3.3/1] max-h-[520px] overflow-hidden bg-ivory-deep cursor-pointer"
            onClick={(e) => openLightbox("feature-image", e.currentTarget)}
            role="button"
            tabIndex={0}
            aria-label="Enlarge panoramic kitchen feature image"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openLightbox("feature-image", e.currentTarget);
              }
            }}
          >
            <Image
              src={page.featureImage.src}
              alt={page.featureImage.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover transition duration-700 group-hover:scale-[1.01]"
              style={{
                objectPosition: page.featureImage.objectPosition || "center 46%",
              }}
            />
          </div>
        </section>
      )}

      {/* 3. Service jump navigation — evenly distributed across content width */}
      {visible.has("serviceNav") && (
        <nav
          aria-label="Services Navigation"
          className="sticky top-[69px] sm:top-[77px] z-30 border-y border-border/70 bg-white/95 backdrop-blur shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
        >
          <div className={servicesRailClass}>
            <ul className="flex flex-wrap sm:flex-nowrap items-center divide-x divide-border/70 py-1">
              {page.navItems.map((item) => (
                <li key={item.id} className="flex-1 min-w-[120px] text-center">
                  <a
                    href={item.target}
                    className="block w-full py-3 sm:py-3.5 px-2 sm:px-4 text-[0.98rem] sm:text-[1.08rem] font-semibold text-charcoal hover:text-forest transition whitespace-nowrap text-center"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}

      {/* 4. Alternating service rows — 55% image / 45% text on every row, landscape 2.5:1 image frames */}
      {visible.has("serviceRows") && (
        <section className="bg-white py-4 sm:py-6">
          <div className={servicesRailClass}>
            {activeServices.map((service, index) => {
              const isImageRight = service.imagePosition === "right";
              return (
                <article
                  key={service.id}
                  id={service.id}
                  className={cn(
                    "scroll-mt-28 sm:scroll-mt-32 border-b border-border/60 py-7 sm:py-9 lg:py-11",
                    index === 0 && "pt-4 sm:pt-6 lg:pt-8",
                    index === activeServices.length - 1 && "border-b-0 pb-8 sm:pb-10 lg:pb-12",
                  )}
                >
                  <div
                    className={cn(
                      "grid items-center gap-7 sm:gap-9 lg:gap-14 xl:gap-16",
                      // Exactly 55% image / 45% text on desktop whether image is left or right
                      isImageRight
                        ? "lg:grid-cols-[45%_55%]"
                        : "lg:grid-cols-[55%_45%]",
                    )}
                  >
                    {/* Text Panel */}
                    <div
                      className={cn(
                        "flex flex-col justify-center",
                        // Mobile: always text below image
                        "order-2",
                        // Desktop: mirrored correctly
                        isImageRight ? "lg:order-1 lg:pr-4" : "lg:order-2 lg:pl-4",
                      )}
                    >
                      <div className="flex items-center gap-2.5 text-forest font-semibold text-base sm:text-[1.05rem] tracking-wider mb-2 sm:mb-2.5">
                        <span>{service.number}</span>
                        <span className="w-8 h-[2px] bg-forest/80" aria-hidden="true" />
                      </div>

                      <h2 className="font-serif font-semibold text-[clamp(2.2rem,3.4vw,3.15rem)] text-charcoal leading-[1.1] mb-3 sm:mb-3.5">
                        {service.title}
                      </h2>

                      <p className="text-[1.05rem] sm:text-[1.16rem] leading-relaxed text-charcoal-soft mb-5 sm:mb-6 max-w-xl">
                        {service.description}
                      </p>

                      <div>
                        <Link
                          href={service.linkHref}
                          className="inline-flex items-center gap-2.5 font-bold text-forest text-[1.05rem] sm:text-[1.15rem] group/link hover:text-forest-deep transition"
                        >
                          <span>{service.linkLabel}</span>
                          <IconArrow
                            className="h-4.5 w-4.5 transition group-hover/link:translate-x-1.5"
                            size={18}
                          />
                        </Link>
                      </div>
                    </div>

                    {/* Image Panel — consistent shallow landscape ~2.5:1 aspect ratio */}
                    <div
                      className={cn(
                        // Mobile: always image on top
                        "order-1",
                        // Desktop: mirrored correctly
                        isImageRight ? "lg:order-2" : "lg:order-1",
                      )}
                    >
                      <div
                        className="group relative w-full aspect-[16/10] sm:aspect-[2.1/1] lg:aspect-[2.5/1] overflow-hidden bg-ivory-deep cursor-pointer"
                        onClick={(e) => openLightbox(service.id, e.currentTarget)}
                        role="button"
                        tabIndex={0}
                        aria-label={`Enlarge image for ${service.title}`}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            openLightbox(service.id, e.currentTarget);
                          }
                        }}
                      >
                        <Image
                          src={service.image.src}
                          alt={service.image.alt}
                          fill
                          sizes="(max-width: 1024px) 100vw, 55vw"
                          className="object-cover transition duration-700 group-hover:scale-[1.02]"
                          style={{
                            objectPosition: service.image.objectPosition || "center 45%",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* 6. Support benefits band — compact pale-sage */}
      {visible.has("benefits") && (
        <section className="bg-[#EAF0EB] border-t border-forest/15 py-10 sm:py-12 lg:py-14">
          <div className={servicesRailClass}>
            <h2 className="font-serif font-semibold text-[clamp(1.9rem,3vw,2.5rem)] text-charcoal text-center mb-8 sm:mb-11">
              {page.benefits.heading}
            </h2>

            <div className="grid gap-8 sm:gap-6 md:grid-cols-3 md:divide-x md:divide-forest/20">
              {page.benefits.items.map((item, idx) => {
                const IconComponent =
                  benefitIcons[item.icon as keyof typeof benefitIcons] ||
                  IconDesignGuidance;
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-start gap-4 sm:gap-5",
                      idx === 0 ? "md:pr-8" : idx === 1 ? "md:px-8" : "md:pl-8",
                    )}
                  >
                    <span className="shrink-0 text-forest pt-0.5">
                      <IconComponent className="h-10 w-10 sm:h-11 sm:w-11 text-forest" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-bold text-charcoal text-[1.12rem] sm:text-[1.22rem] leading-snug">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-[0.98rem] sm:text-[1.05rem] text-charcoal-soft leading-relaxed">
                        {item.body}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 7. Final CTA — warm ivory */}
      {visible.has("cta") && (
        <section className="bg-ivory border-t border-border/70 py-11 sm:py-13 lg:py-15">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="font-serif font-semibold text-[clamp(2rem,3.2vw,2.75rem)] text-charcoal mb-6 sm:mb-7">
              {page.cta.heading}
            </h2>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <ButtonLink
                href={page.cta.buttonHref}
                className="bg-forest text-white hover:bg-forest-deep px-8 py-3.5 rounded-lg text-base font-semibold shadow-sm transition"
              >
                {page.cta.buttonLabel}
              </ButtonLink>

              <span className="hidden sm:inline-block h-6 w-px bg-border/80" aria-hidden="true" />

              <a
                href={page.cta.phoneHref || `tel:${siteConfig.contact.phoneTel}`}
                className="inline-flex items-center gap-2.5 text-base sm:text-[1.15rem] font-semibold text-charcoal hover:text-forest transition"
              >
                <IconPhone className="h-4.5 w-4.5 text-forest" size={18} />
                <span>{page.cta.phoneLabel || siteConfig.contact.phoneDisplay}</span>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Interactive Lightbox Modal */}
      <GalleryLightbox
        images={lightboxPool}
        index={lightboxIndex}
        onClose={closeLightbox}
        onPrev={prevLightbox}
        onNext={nextLightbox}
      />
    </div>
  );
}

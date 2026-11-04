"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useId, useMemo, useRef, useState } from "react";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import {
  IconDiamond,
  IconHome,
  IconLayers,
  IconPeople,
  IconTools,
} from "@/components/icons/Icons";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { flooringPage } from "@/lib/content";
import { cn } from "@/lib/cn";

const benefitIcons = {
  people: IconPeople,
  layers: IconLayers,
  tools: IconTools,
} as const;

const pointIcons = {
  home: IconHome,
  diamond: IconDiamond,
  people: IconPeople,
} as const;

type LightboxItem = { id: string; src: string; alt: string; caption?: string };

export function FlooringSections() {
  const page = flooringPage;
  const visible = new Set(page.visibleSections ?? []);
  const baseId = useId();

  const [expandedOption, setExpandedOption] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxPool, setLightboxPool] = useState<LightboxItem[]>([]);
  const triggerRef = useRef<HTMLElement | null>(null);

  const finishes = useMemo(
    () =>
      page.finishes.items
        .filter((item) => item.visible !== false && Boolean(item.image?.src?.trim()))
        .slice()
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [page.finishes.items],
  );

  const openLightbox = useCallback((pool: LightboxItem[], id: string, trigger: HTMLElement) => {
    const idx = pool.findIndex((img) => img.id === id);
    if (idx < 0) return;
    triggerRef.current = trigger;
    setLightboxPool(pool);
    setLightboxIndex(idx);
  }, []);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
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

  const finishPool: LightboxItem[] = finishes.map((item) => ({
    id: item.id,
    src: item.image.src,
    alt: item.image.alt || item.label,
    caption: item.label,
  }));

  const galleryPool: LightboxItem[] = page.gallery.images.map((img) => ({
    id: img.id,
    src: img.src,
    alt: img.alt,
    caption: img.caption,
  }));

  return (
    <div className="flooring-shell">
      {visible.has("hero") ? (
        <section className="relative overflow-hidden bg-ivory">
          <div className="absolute inset-0">
            <Image
              src={page.hero.image.src}
              alt={page.hero.image.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: page.hero.image.objectPosition || "center" }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, rgba(249,248,243,0.97) 0%, rgba(249,248,243,0.9) 26%, rgba(249,248,243,0.52) 46%, rgba(249,248,243,0.14) 64%, transparent 78%)",
              }}
              aria-hidden
            />
          </div>
          <div className="container-wide relative z-10 flex min-h-[min(52vh,28rem)] flex-col justify-center py-11 lg:min-h-[min(58vh,32rem)] lg:py-14">
            <nav aria-label="Breadcrumb" className="mb-5 text-[0.95rem] text-charcoal-soft">
              <ol className="flex flex-wrap items-center gap-2">
                {page.hero.breadcrumb.map((crumb, index) => (
                  <li key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                    {index > 0 ? (
                      <span aria-hidden className="text-border">
                        /
                      </span>
                    ) : null}
                    {"href" in crumb && crumb.href ? (
                      <Link href={crumb.href} className="hover:text-forest">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="font-medium text-charcoal" aria-current="page">
                        {crumb.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
            <h1 className="heading-display max-w-xl text-[clamp(2.55rem,5.2vw,3.85rem)] font-bold leading-[1.04] text-charcoal sm:max-w-2xl">
              <span className="block whitespace-normal sm:whitespace-nowrap">
                {page.hero.headingLine1}
              </span>
              <span className="block whitespace-normal sm:whitespace-nowrap">
                {page.hero.headingLine2}
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-[clamp(1.08rem,1.15vw,1.2rem)] leading-relaxed text-charcoal-soft">
              {page.hero.body}
            </p>
            <div className="mt-7">
              <ButtonLink href={page.hero.ctaHref} className="px-6 py-3.5 text-[1rem] tracking-wide">
                {page.hero.ctaLabel} <span aria-hidden>→</span>
              </ButtonLink>
            </div>
          </div>
        </section>
      ) : null}

      {visible.has("benefits") ? (
        <section className="border-y border-border/60 bg-white">
          <div className="container-wide grid divide-y divide-border/70 md:grid-cols-3 md:divide-x md:divide-y-0">
            {page.benefits.map((item) => {
              const Icon = benefitIcons[item.icon as keyof typeof benefitIcons] || IconPeople;
              return (
                <div
                  key={item.id}
                  className="flex items-start gap-4 px-1 py-6 md:items-center md:px-7 lg:gap-5 lg:px-8 lg:py-7"
                >
                  <Icon
                    className="mt-0.5 h-11 w-11 shrink-0 text-forest md:mt-0 lg:h-12 lg:w-12"
                    size={48}
                  />
                  <div>
                    <h2 className="text-[1.16rem] font-semibold text-charcoal lg:text-[1.2rem]">
                      {item.title}
                    </h2>
                    <p className="mt-1.5 text-[1.04rem] leading-relaxed text-charcoal-soft">
                      {item.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {visible.has("options") ? (
        <section id={page.options.id} className="scroll-mt-24 bg-white py-8 lg:py-10">
          <div className="container-wide">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="heading-display text-[clamp(2.15rem,3.6vw,3rem)] font-bold text-charcoal">
                {page.options.heading}
              </h2>
              <p className="mt-3 text-[1.08rem] leading-relaxed text-charcoal-soft">
                {page.options.body}
              </p>
            </div>
            <ul className="mt-7 grid gap-5 sm:grid-cols-2 lg:mt-8 lg:grid-cols-4 lg:gap-5">
              {page.options.items.map((item) => {
                const panelId = `${baseId}-option-${item.id}`;
                const expanded = expandedOption === item.id;
                return (
                  <li key={item.id} className="flex flex-col">
                    <Link
                      href={item.href}
                      className="group relative block aspect-[16/11] overflow-hidden bg-ivory-deep focus-visible:outline-offset-4"
                      aria-label={`${item.title} — view flooring details`}
                    >
                      <Image
                        src={item.image.src}
                        alt={item.image.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                        style={{
                          objectPosition: item.image.objectPosition || "center",
                        }}
                        loading="lazy"
                      />
                    </Link>
                    <button
                      type="button"
                      className="group/title mt-3.5 flex w-full items-start justify-between gap-3 text-left"
                      aria-expanded={expanded}
                      aria-controls={panelId}
                      id={`${panelId}-trigger`}
                      onClick={() =>
                        setExpandedOption((current) => (current === item.id ? null : item.id))
                      }
                    >
                      <span>
                        <span className="heading-display block text-[clamp(1.4rem,1.5vw,1.7rem)] font-bold text-charcoal group-hover/title:text-forest">
                          {item.title}
                        </span>
                        <span className="mt-1.5 block text-[1.02rem] leading-relaxed text-charcoal-soft">
                          {item.body}
                        </span>
                      </span>
                      <span
                        aria-hidden
                        className={cn(
                          "mt-1 shrink-0 text-2xl leading-none text-charcoal transition group-hover/title:text-forest",
                          expanded && "rotate-90",
                        )}
                      >
                        →
                      </span>
                    </button>
                    {expanded && item.detail ? (
                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={`${panelId}-trigger`}
                        className="mt-3 border-t border-border/70 pt-3"
                      >
                        <h3 className="text-[1.05rem] font-semibold text-charcoal">
                          {item.detail.heading}
                        </h3>
                        <p className="mt-1.5 text-[1.02rem] leading-relaxed text-charcoal-soft">
                          {item.detail.body}
                        </p>
                        <Link
                          href={item.href}
                          className="mt-3 inline-flex text-[1rem] font-semibold text-forest hover:text-forest-deep"
                        >
                          View flooring details <span aria-hidden>→</span>
                        </Link>
                      </div>
                    ) : (
                      <div id={panelId} hidden />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ) : null}

      {visible.has("lifestyle") ? (
        <section className="bg-white py-7 lg:py-9">
          <div className="container-wide grid items-center gap-7 lg:grid-cols-2 lg:gap-10">
            <div className="relative aspect-[16/12] overflow-hidden bg-ivory-deep lg:aspect-[16/13]">
              <Image
                src={page.lifestyle.image.src}
                alt={page.lifestyle.image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                style={{ objectPosition: page.lifestyle.image.objectPosition || "center" }}
                loading="lazy"
              />
            </div>
            <div className="lg:py-2">
              <h2 className="heading-display text-[clamp(2.1rem,3.5vw,2.95rem)] font-bold leading-[1.06] text-charcoal">
                <span className="block">{page.lifestyle.headingLine1}</span>
                <span className="block">{page.lifestyle.headingLine2}</span>
              </h2>
              <p className="mt-4 max-w-lg text-[1.1rem] leading-relaxed text-charcoal-soft">
                {page.lifestyle.body}
              </p>
              <ul className="mt-7 grid gap-5 sm:grid-cols-3 sm:gap-4">
                {page.lifestyle.points.map((point) => {
                  const Icon = pointIcons[point.icon as keyof typeof pointIcons] || IconHome;
                  return (
                    <li key={point.id}>
                      <Icon className="h-9 w-9 text-forest" size={36} />
                      <h3 className="mt-3 text-[1.08rem] font-semibold text-charcoal">
                        {point.title}
                      </h3>
                      <p className="mt-1.5 text-[1rem] leading-relaxed text-charcoal-soft">
                        {point.body}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      {visible.has("finishes") ? (
        <section className="bg-ivory py-8 lg:py-10">
          <div className="container-wide">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="heading-display text-[clamp(2.1rem,3.5vw,2.95rem)] font-bold text-charcoal">
                {page.finishes.heading}
              </h2>
              <p className="mt-3 text-[1.08rem] leading-relaxed text-charcoal-soft">
                {page.finishes.body}
              </p>
            </div>
            <ul className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-3.5 lg:mt-8 lg:grid-cols-5 lg:gap-3">
              {finishes.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className="group w-full text-left focus-visible:outline-offset-4"
                    onClick={(e) => openLightbox(finishPool, item.id, e.currentTarget)}
                    aria-label={`Enlarge preview: ${item.label}`}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-ivory-deep">
                      <Image
                        src={item.image.src}
                        alt={item.image.alt || item.label}
                        fill
                        sizes="(max-width: 1024px) 40vw, 16vw"
                        className="object-cover transition duration-500 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                        style={{ objectPosition: item.image.objectPosition || "center" }}
                        loading="lazy"
                      />
                    </div>
                    <p className="mt-2 text-center text-[0.95rem] font-semibold text-charcoal">
                      {item.label}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
            {page.finishes.note ? (
              <p className="mt-5 text-center text-[0.95rem] text-charcoal-soft">{page.finishes.note}</p>
            ) : null}
          </div>
        </section>
      ) : null}

      {visible.has("process") ? (
        <section className="border-y border-border/60 bg-white py-8 lg:py-10">
          <div className="container-wide">
            <h2 className="heading-display mx-auto max-w-3xl text-center text-[clamp(2.05rem,3.4vw,2.9rem)] font-bold text-charcoal">
              {page.process.heading}
            </h2>
            <ol className="mt-7 grid gap-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-border/70">
              {page.process.steps.map((step) => (
                <li key={step.number} className="flex gap-4 sm:px-6 lg:gap-4 lg:px-8">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-forest text-lg font-bold text-white">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="text-[1.16rem] font-semibold text-charcoal">{step.title}</h3>
                    <p className="mt-1.5 text-[1.04rem] leading-relaxed text-charcoal-soft">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {visible.has("gallery") ? (
        <section className="bg-white py-8 lg:py-10">
          <div className="container-wide">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="heading-display text-[clamp(2.1rem,3.4vw,2.95rem)] font-bold text-charcoal">
                {page.gallery.heading}
              </h2>
              <p className="mt-2 text-[1.08rem] leading-relaxed text-charcoal-soft">
                {page.gallery.body}
              </p>
              {page.gallery.disclaimer ? (
                <p className="mt-2 text-[0.92rem] text-charcoal-soft/90">{page.gallery.disclaimer}</p>
              ) : null}
            </div>
            <ul className="mt-7 grid gap-3.5 sm:grid-cols-3 sm:gap-4">
              {page.gallery.images.map((img) => (
                <li key={img.id}>
                  <button
                    type="button"
                    className="group relative block aspect-[16/10] w-full overflow-hidden bg-ivory-deep focus-visible:outline-offset-4"
                    onClick={(e) => openLightbox(galleryPool, img.id, e.currentTarget)}
                    aria-label={`Open larger view: ${img.caption || img.alt}`}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      style={{
                        objectPosition:
                          ("objectPosition" in img && img.objectPosition) || "center",
                      }}
                      loading="lazy"
                    />
                  </button>
                  {img.caption ? (
                    <p className="mt-2 text-[0.98rem] text-charcoal-soft">{img.caption}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {visible.has("cta") ? (
        <section className="bg-ivory py-9 lg:py-10">
          <div className="container-wide flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <div className="max-w-xl">
              <h2 className="heading-display text-[clamp(2.05rem,3.2vw,2.75rem)] font-bold text-charcoal">
                {page.cta.heading}
              </h2>
              <p className="mt-3 text-[1.12rem] leading-relaxed text-charcoal-soft">
                {page.cta.body}
              </p>
            </div>
            <ButtonLink href={page.cta.buttonHref} className="shrink-0 px-6 py-3.5 text-[1rem]">
              {page.cta.buttonLabel} <span aria-hidden>→</span>
            </ButtonLink>
          </div>
        </section>
      ) : null}

      <GalleryLightbox
        images={lightboxPool}
        index={lightboxIndex}
        onClose={closeLightbox}
        onPrev={prevLightbox}
        onNext={nextLightbox}
        returnFocusRef={triggerRef}
      />
    </div>
  );
}

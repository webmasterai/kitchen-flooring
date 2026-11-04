"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useId, useMemo, useRef, useState } from "react";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import { IconBrush, IconCabinet, IconPeople } from "@/components/icons/Icons";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { bathroomVanitiesPage } from "@/lib/content";

const benefitIcons = {
  cabinet: IconCabinet,
  brush: IconBrush,
  people: IconPeople,
} as const;

type SwatchItem = {
  id: string;
  label: string;
  order?: number;
  visible?: boolean;
  image: { src: string; alt?: string; objectPosition?: string };
};

type LightboxItem = { id: string; src: string; alt: string; caption?: string };

function visibleSwatches(items: SwatchItem[]) {
  return items
    .filter((item) => item.visible !== false && Boolean(item.image?.src?.trim()))
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function BathroomVanitiesSections() {
  const page = bathroomVanitiesPage;
  const visible = new Set(page.visibleSections ?? []);
  const baseId = useId();

  const [expandedStyle, setExpandedStyle] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxPool, setLightboxPool] = useState<LightboxItem[]>([]);
  const triggerRef = useRef<HTMLElement | null>(null);

  const finishes = useMemo(
    () => visibleSwatches(page.options.finishes as SwatchItem[]),
    [page.options.finishes],
  );
  const handles = useMemo(
    () => visibleSwatches(page.options.handles as SwatchItem[]),
    [page.options.handles],
  );
  const basins = useMemo(
    () => visibleSwatches(page.options.basins as SwatchItem[]),
    [page.options.basins],
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

  const galleryPool: LightboxItem[] = page.gallery.images.map((img) => ({
    id: img.id,
    src: img.src,
    alt: img.alt,
    caption: img.caption,
  }));

  const optionPool: LightboxItem[] = [...finishes, ...handles, ...basins].map((item) => ({
    id: item.id,
    src: item.image.src,
    alt: item.image.alt || item.label,
    caption: item.label,
  }));

  function renderSwatch(item: SwatchItem, sizes: string) {
    return (
      <button
        type="button"
        className="group w-full text-left focus-visible:outline-offset-4"
        onClick={(e) => openLightbox(optionPool, item.id, e.currentTarget)}
        aria-label={`Enlarge preview: ${item.label}`}
      >
        <div className="relative aspect-square overflow-hidden bg-ivory-deep">
          <Image
            src={item.image.src}
            alt={item.image.alt || item.label}
            fill
            sizes={sizes}
            className="object-cover transition duration-500 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            style={{ objectPosition: item.image.objectPosition || "center" }}
            loading="lazy"
          />
        </div>
        <p className="mt-1.5 text-center text-[0.92rem] font-semibold leading-tight text-charcoal">
          {item.label}
        </p>
      </button>
    );
  }

  return (
    <div className="vanities-shell">
      {visible.has("hero") ? (
        <section className="overflow-hidden bg-ivory">
          <div className="grid lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:min-h-[min(58vh,31rem)]">
            <div className="flex flex-col justify-center px-[clamp(20px,2.35vw,38px)] py-10 lg:py-12 lg:pr-10 xl:pl-[max(clamp(20px,2.35vw,38px),calc((100vw-1620px)/2+38px))]">
              {page.hero.eyebrow ? (
                <p className="mb-3 text-[0.78rem] font-semibold tracking-[0.14em] text-charcoal-soft">
                  {page.hero.eyebrow}
                </p>
              ) : null}
              <h1 className="heading-display max-w-[12ch] text-[clamp(2.75rem,5.4vw,4.15rem)] font-bold leading-[1.02] text-charcoal sm:max-w-none">
                <span className="block whitespace-normal sm:whitespace-nowrap">
                  {page.hero.headingLine1}
                </span>
                <span className="block whitespace-normal sm:whitespace-nowrap">
                  {page.hero.headingLine2}
                </span>
              </h1>
              <p className="mt-5 max-w-md text-[clamp(1.08rem,1.15vw,1.2rem)] leading-relaxed text-charcoal-soft">
                {page.hero.body}
              </p>
              <div className="mt-7">
                <ButtonLink href={page.hero.ctaHref} className="px-6 py-3.5 text-[1rem] tracking-wide">
                  {page.hero.ctaLabel} <span aria-hidden>→</span>
                </ButtonLink>
              </div>
            </div>
            <div className="relative min-h-[16.5rem] sm:min-h-[21rem] lg:min-h-full">
              <Image
                src={page.hero.image.src}
                alt={page.hero.image.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
                style={{ objectPosition: page.hero.image.objectPosition || "center" }}
              />
            </div>
          </div>
        </section>
      ) : null}

      {visible.has("benefits") ? (
        <section className="border-y border-border/60 bg-white">
          <div className="container-wide grid divide-y divide-border/70 md:grid-cols-3 md:divide-x md:divide-y-0">
            {page.benefits.map((item) => {
              const Icon = benefitIcons[item.icon as keyof typeof benefitIcons] || IconCabinet;
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

      {visible.has("styles") ? (
        <section id={page.styles.id} className="scroll-mt-24 bg-white py-8 lg:py-10">
          <div className="container-wide">
            <div className="max-w-2xl">
              <h2 className="heading-display text-[clamp(2.15rem,3.6vw,3rem)] font-bold text-charcoal">
                {page.styles.heading}
              </h2>
              {page.styles.body ? (
                <p className="mt-3 text-[1.08rem] leading-relaxed text-charcoal-soft">
                  {page.styles.body}
                </p>
              ) : null}
            </div>
            <ul className="mt-7 grid gap-5 sm:grid-cols-2 lg:mt-8 lg:grid-cols-3 lg:gap-6">
              {page.styles.items.map((item) => {
                const panelId = `${baseId}-style-${item.id}`;
                const expanded = expandedStyle === item.id;
                return (
                  <li key={item.id} className="flex flex-col">
                    <Link
                      href={item.href}
                      className="group relative block aspect-[16/10] overflow-hidden bg-ivory-deep focus-visible:outline-offset-4"
                      aria-label={`${item.title} — view vanity inspiration in the gallery`}
                    >
                      <Image
                        src={item.image.src}
                        alt={item.image.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                        style={{
                          objectPosition: item.image.objectPosition || "center",
                        }}
                        loading="lazy"
                      />
                    </Link>
                    <button
                      type="button"
                      className="group/title mt-3.5 w-full text-center"
                      aria-expanded={expanded}
                      aria-controls={panelId}
                      id={`${panelId}-trigger`}
                      onClick={() =>
                        setExpandedStyle((current) => (current === item.id ? null : item.id))
                      }
                    >
                      <span className="heading-display block text-[clamp(1.45rem,1.55vw,1.75rem)] font-bold text-charcoal group-hover/title:text-forest">
                        {item.title}
                      </span>
                      {"body" in item && item.body ? (
                        <span className="mt-1.5 block text-[1.02rem] leading-relaxed text-charcoal-soft">
                          {item.body}
                        </span>
                      ) : null}
                    </button>
                    {expanded && item.detail ? (
                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={`${panelId}-trigger`}
                        className="mt-3 border-t border-border/70 pt-3 text-left"
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
                          View in gallery <span aria-hidden>→</span>
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

      {visible.has("storage") ? (
        <section className="bg-white py-7 lg:py-9">
          <div className="container-wide grid items-center gap-7 lg:grid-cols-2 lg:gap-10">
            <div className="relative aspect-[16/12] overflow-hidden bg-ivory-deep lg:aspect-[16/13]">
              <Image
                src={page.storage.image.src}
                alt={page.storage.image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                style={{ objectPosition: page.storage.image.objectPosition || "center" }}
                loading="lazy"
              />
            </div>
            <div className="lg:py-2">
              <h2 className="heading-display text-[clamp(2.1rem,3.5vw,2.95rem)] font-bold leading-[1.06] text-charcoal">
                <span className="block">{page.storage.headingLine1}</span>
                <span className="block">{page.storage.headingLine2}</span>
              </h2>
              <p className="mt-4 max-w-lg text-[1.1rem] leading-relaxed text-charcoal-soft">
                {page.storage.body}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {visible.has("options") ? (
        <section className="bg-ivory py-8 lg:py-10">
          <div className="container-wide">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="heading-display text-[clamp(2.1rem,3.5vw,2.95rem)] font-bold text-charcoal">
                {page.options.heading}
              </h2>
              <p className="mt-3 text-[1.08rem] leading-relaxed text-charcoal-soft">
                {page.options.body}
              </p>
            </div>
            <div className="mt-7 grid items-start gap-7 lg:mt-8 lg:grid-cols-[minmax(0,1.15fr)_auto_minmax(0,1.05fr)_auto_minmax(0,0.95fr)] lg:gap-6">
              <div>
                <h3 className="mb-3 text-center text-[0.95rem] font-semibold tracking-wide text-charcoal-soft">
                  {page.options.finishesHeading}
                </h3>
                <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:gap-2.5">
                  {finishes.map((item) => (
                    <li key={item.id}>{renderSwatch(item, "(max-width: 1024px) 28vw, 10vw")}</li>
                  ))}
                </ul>
              </div>
              <div className="hidden w-px self-stretch bg-border/80 lg:block" aria-hidden />
              <div>
                <h3 className="mb-3 text-center text-[0.95rem] font-semibold tracking-wide text-charcoal-soft">
                  {page.options.handlesHeading}
                </h3>
                <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:gap-2.5">
                  {handles.map((item) => (
                    <li key={item.id}>{renderSwatch(item, "(max-width: 1024px) 28vw, 10vw")}</li>
                  ))}
                </ul>
              </div>
              <div className="hidden w-px self-stretch bg-border/80 lg:block" aria-hidden />
              <div>
                <h3 className="mb-3 text-center text-[0.95rem] font-semibold tracking-wide text-charcoal-soft">
                  {page.options.basinsHeading}
                </h3>
                <ul className="grid grid-cols-3 gap-2.5 lg:gap-2.5">
                  {basins.map((item) => (
                    <li key={item.id}>{renderSwatch(item, "(max-width: 1024px) 30vw, 9vw")}</li>
                  ))}
                </ul>
              </div>
            </div>
            {page.options.note ? (
              <p className="mt-5 text-center text-[0.95rem] text-charcoal-soft">{page.options.note}</p>
            ) : null}
          </div>
        </section>
      ) : null}

      {visible.has("gallery") ? (
        <section className="bg-white py-8 lg:py-10">
          <div className="container-wide">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <h2 className="heading-display text-[clamp(2.1rem,3.4vw,2.95rem)] font-bold text-charcoal">
                  {page.gallery.heading}
                </h2>
                {page.gallery.body ? (
                  <p className="mt-2 text-[1.08rem] leading-relaxed text-charcoal-soft">
                    {page.gallery.body}
                  </p>
                ) : null}
              </div>
              {page.gallery.viewAllHref ? (
                <Link
                  href={page.gallery.viewAllHref}
                  className="shrink-0 text-[1rem] font-semibold text-forest hover:text-forest-deep"
                >
                  {page.gallery.viewAllLabel || "View Gallery"} <span aria-hidden>→</span>
                </Link>
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
                      style={{ objectPosition: img.objectPosition || "center" }}
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

      {visible.has("process") ? (
        <section className="border-y border-border/60 bg-white py-8 lg:py-10">
          <div className="container-wide">
            <h2 className="heading-display mx-auto max-w-3xl text-center text-[clamp(2.05rem,3.4vw,2.9rem)] font-bold text-charcoal">
              {page.process.heading}
            </h2>
            <ol className="mt-7 grid gap-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-border/70">
              {page.process.steps.map((step) => (
                <li key={step.number} className="flex gap-4 sm:px-6 lg:gap-4 lg:px-8">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ivory-deep text-lg font-bold text-charcoal">
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

      {visible.has("cta") ? (
        <section className="bg-ivory py-9 lg:py-10">
          <div className="container-wide flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-5">
              {page.cta.decorImage?.src ? (
                <div className="relative hidden h-24 w-20 shrink-0 overflow-hidden sm:block lg:h-28 lg:w-24">
                  <Image
                    src={page.cta.decorImage.src}
                    alt={page.cta.decorImage.alt || ""}
                    fill
                    sizes="96px"
                    className="object-cover"
                    loading="lazy"
                    aria-hidden={!page.cta.decorImage.alt}
                  />
                </div>
              ) : null}
              <div className="max-w-xl">
                <h2 className="heading-display text-[clamp(2.05rem,3.2vw,2.75rem)] font-bold text-charcoal">
                  {page.cta.heading}
                </h2>
                <p className="mt-3 text-[1.12rem] leading-relaxed text-charcoal-soft">
                  {page.cta.body}
                </p>
              </div>
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

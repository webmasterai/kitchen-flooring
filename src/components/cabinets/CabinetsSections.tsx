"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useId, useMemo, useRef, useState } from "react";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import {
  IconBrush,
  IconCabinet,
  IconTools,
} from "@/components/icons/Icons";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { cabinetsPage, type CabinetSwatch } from "@/lib/content";
import { cn } from "@/lib/cn";

const benefitIcons = {
  cabinet: IconCabinet,
  brush: IconBrush,
  tools: IconTools,
} as const;

type LightboxItem = { id: string; src: string; alt: string; caption?: string };

function visibleSwatches(items: CabinetSwatch[]) {
  return items
    .filter((item) => item.visible !== false)
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function CabinetsSections() {
  const page = cabinetsPage;
  const visible = new Set(page.visibleSections ?? []);
  const baseId = useId();

  const [expandedStyle, setExpandedStyle] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxPool, setLightboxPool] = useState<LightboxItem[]>([]);
  const triggerRef = useRef<HTMLElement | null>(null);

  const woods = useMemo(() => visibleSwatches(page.options.woods), [page.options.woods]);
  const finishes = useMemo(
    () => visibleSwatches(page.options.finishes),
    [page.options.finishes],
  );
  const storageImageSrc = page.storage.image?.src?.trim() || "";

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

  const swatchPool: LightboxItem[] = [...woods, ...finishes]
    .filter((item) => Boolean(item.image?.src?.trim()))
    .map((item) => ({
      id: item.id,
      src: item.image.src,
      alt: item.image.alt || item.alt || item.label,
      caption: item.label,
    }));

  function renderSwatch(
    item: CabinetSwatch,
    sizes: string,
  ) {
    const src = item.image?.src?.trim() || "";
    const alt = item.image?.alt || item.alt || item.label;
    const media = (
      <div
        className={cn(
          "relative aspect-square overflow-hidden bg-ivory-deep",
          !src && "border border-border/70",
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            className="object-cover transition duration-500 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            loading="lazy"
          />
        ) : null}
      </div>
    );

    if (!src) {
      return (
        <div className="w-full">
          {media}
          <p className="mt-1.5 text-center text-[0.92rem] font-semibold leading-tight text-charcoal">
            {item.label}
          </p>
        </div>
      );
    }

    return (
      <button
        type="button"
        className="group w-full text-left focus-visible:outline-offset-4"
        onClick={(e) => openLightbox(swatchPool, item.id, e.currentTarget)}
        aria-label={`Enlarge preview: ${item.label}`}
      >
        {media}
        <p className="mt-1.5 text-center text-[0.92rem] font-semibold leading-tight text-charcoal">
          {item.label}
        </p>
      </button>
    );
  }

  return (
    <div className="cabinets-shell">
      {visible.has("hero") ? (
        <section className="overflow-hidden bg-ivory">
          <div className="grid lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] lg:min-h-[min(58vh,31rem)]">
            <div className="flex flex-col justify-center px-[clamp(20px,2.35vw,38px)] py-10 lg:py-12 lg:pr-10 xl:pl-[max(clamp(20px,2.35vw,38px),calc((100vw-1620px)/2+38px))]">
              <nav aria-label="Breadcrumb" className="mb-4 text-[0.95rem] text-charcoal-soft">
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
              <h1 className="heading-display max-w-[14ch] text-[clamp(2.75rem,5.4vw,4.15rem)] font-bold leading-[1.02] text-charcoal sm:max-w-none">
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
                <ButtonLink
                  href={page.hero.ctaHref}
                  className="px-6 py-3.5 text-[1rem] tracking-wide"
                >
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
                sizes="(max-width: 1024px) 100vw, 60vw"
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
                    className="mt-0.5 h-12 w-12 shrink-0 text-forest md:mt-0 lg:h-[3.25rem] lg:w-[3.25rem]"
                    size={52}
                  />
                  <div>
                    <h2 className="text-[1.18rem] font-semibold text-charcoal lg:text-[1.22rem]">
                      {item.title}
                    </h2>
                    <p className="mt-1.5 text-[1.05rem] leading-relaxed text-charcoal-soft">
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
            <h2 className="heading-display text-center text-[clamp(2.25rem,3.8vw,3.15rem)] font-bold text-charcoal">
              {page.styles.heading}
            </h2>
            <ul className="mt-7 grid gap-5 sm:grid-cols-2 lg:mt-8 lg:grid-cols-3 lg:gap-6">
              {page.styles.items.map((item) => {
                const panelId = `${baseId}-style-${item.id}`;
                const expanded = expandedStyle === item.id;
                return (
                  <li key={item.id} className="flex flex-col">
                    <Link
                      href={item.href}
                      className="group relative block aspect-[16/10] overflow-hidden bg-ivory-deep focus-visible:outline-offset-4"
                      aria-label={`${item.title} — view cabinet inspiration in the gallery`}
                    >
                      <Image
                        src={item.image.src}
                        alt={item.image.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                        style={{
                          objectPosition:
                            ("objectPosition" in item.image && item.image.objectPosition) ||
                            "center",
                        }}
                        loading="lazy"
                      />
                    </Link>
                    <button
                      type="button"
                      className="group/title mt-3.5 flex w-full items-center justify-between gap-3 text-left"
                      aria-expanded={expanded}
                      aria-controls={panelId}
                      id={`${panelId}-trigger`}
                      onClick={() =>
                        setExpandedStyle((current) => (current === item.id ? null : item.id))
                      }
                    >
                      <span className="heading-display text-[clamp(1.55rem,1.6vw,1.85rem)] font-bold text-charcoal group-hover/title:text-forest">
                        {item.title}
                      </span>
                      <span
                        aria-hidden
                        className={cn(
                          "text-2xl leading-none text-charcoal transition group-hover/title:text-forest",
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
          <div className="grid items-stretch lg:grid-cols-2">
            <div className="flex flex-col justify-center bg-ivory px-[var(--section-gutter)] py-9 lg:py-11 lg:pl-[max(var(--section-gutter),calc((100vw-min(1620px,100vw))/2+clamp(20px,2.35vw,38px)))] lg:pr-12">
              <h2 className="heading-display max-w-lg text-[clamp(2.2rem,3.6vw,3.05rem)] font-bold leading-[1.05] text-charcoal">
                <span className="block">{page.storage.headingLine1}</span>
                <span className="block">{page.storage.headingLine2}</span>
              </h2>
              <p className="mt-4 max-w-md text-[clamp(1.08rem,1.15vw,1.18rem)] leading-relaxed text-charcoal-soft">
                {page.storage.body}
              </p>
            </div>
            <div className="relative min-h-[15rem] bg-ivory-deep sm:min-h-[19rem] lg:min-h-[24rem]">
              {storageImageSrc ? (
                <Image
                  src={storageImageSrc}
                  alt={page.storage.image?.alt || "Cabinet storage detail"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  style={{ objectPosition: page.storage.image?.objectPosition || "center" }}
                  loading="lazy"
                />
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {visible.has("options") ? (
        <section className="bg-white py-7 lg:py-9">
          <div className="container-wide">
            <h2 className="heading-display text-center text-[clamp(2.2rem,3.5vw,3rem)] font-bold text-charcoal">
              {page.options.heading}
            </h2>
            <div className="mt-6 grid items-start gap-7 lg:grid-cols-[minmax(0,1.35fr)_auto_minmax(0,1fr)] lg:gap-8">
              <div>
                <h3 className="mb-3 text-center text-[0.95rem] font-semibold tracking-wide text-charcoal-soft lg:text-left">
                  {page.options.woodsHeading}
                </h3>
                <ul className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3 lg:grid-cols-6 lg:gap-2.5">
                  {woods.map((item) => (
                    <li key={item.id}>{renderSwatch(item, "(max-width: 1024px) 22vw, 9vw")}</li>
                  ))}
                </ul>
              </div>
              <div className="hidden w-px self-stretch bg-border/80 lg:block" aria-hidden />
              <div>
                <h3 className="mb-3 text-center text-[0.95rem] font-semibold tracking-wide text-charcoal-soft lg:text-left">
                  {page.options.finishesHeading}
                </h3>
                <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3 lg:gap-2.5">
                  {finishes.map((item) => (
                    <li key={item.id}>{renderSwatch(item, "(max-width: 1024px) 28vw, 10vw")}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-5 text-center text-[0.98rem] text-charcoal-soft">{page.options.note}</p>
          </div>
        </section>
      ) : null}

      {visible.has("process") ? (
        <section className="border-y border-border/60 bg-white py-8 lg:py-10">
          <div className="container-wide">
            <h2 className="heading-display text-center text-[clamp(2.15rem,3.4vw,2.95rem)] font-bold text-charcoal">
              {page.process.heading}
            </h2>
            <ol className="mt-7 grid gap-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-border/70">
              {page.process.steps.map((step) => (
                <li
                  key={step.number}
                  className="flex gap-4 sm:px-6 lg:gap-4 lg:px-8"
                >
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-forest text-lg font-bold text-white">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="text-[1.18rem] font-semibold text-charcoal">{step.title}</h3>
                    <p className="mt-1.5 text-[1.05rem] leading-relaxed text-charcoal-soft">
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
            <h2 className="heading-display text-center text-[clamp(2.15rem,3.4vw,2.95rem)] font-bold text-charcoal">
              {page.gallery.heading}
            </h2>
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
              <h2 className="heading-display text-[clamp(2.1rem,3.3vw,2.85rem)] font-bold text-charcoal">
                {page.cta.heading}
              </h2>
              <p className="mt-3 text-[1.12rem] leading-relaxed text-charcoal-soft">
                {page.cta.body}
              </p>
            </div>
            <ButtonLink
              href={page.cta.buttonHref}
              className="shrink-0 px-6 py-3.5 text-[1rem]"
            >
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

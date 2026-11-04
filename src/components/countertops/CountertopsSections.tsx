"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useId, useRef, useState } from "react";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import {
  IconDroplet,
  IconGrid,
  IconHome,
  IconLayers,
  IconPeople,
  IconTools,
} from "@/components/icons/Icons";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { countertopsPage } from "@/lib/content";
import { cn } from "@/lib/cn";

const benefitIcons = {
  people: IconPeople,
  layers: IconLayers,
  tools: IconTools,
} as const;

const pointIcons = {
  droplet: IconDroplet,
  grid: IconGrid,
  home: IconHome,
} as const;

type LightboxItem = { id: string; src: string; alt: string; caption?: string };

export function CountertopsSections() {
  const page = countertopsPage;
  const visible = new Set(page.visibleSections ?? []);
  const baseId = useId();

  const [expandedMaterial, setExpandedMaterial] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxPool, setLightboxPool] = useState<LightboxItem[]>([]);
  const triggerRef = useRef<HTMLElement | null>(null);

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

  function toggleMaterial(id: string) {
    setExpandedMaterial((current) => (current === id ? null : id));
  }

  const swatchPool: LightboxItem[] = page.swatches.items.map((item) => ({
    id: item.id,
    src: item.image.src,
    alt: item.image.alt,
    caption: item.label,
  }));

  const galleryPool: LightboxItem[] = page.gallery.images.map((img) => ({
    id: img.id,
    src: img.src,
    alt: img.alt,
    caption: img.caption,
  }));

  return (
    <>
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
                  "linear-gradient(90deg, rgba(249,248,243,0.97) 0%, rgba(249,248,243,0.88) 28%, rgba(249,248,243,0.45) 48%, rgba(249,248,243,0.12) 62%, transparent 78%)",
              }}
              aria-hidden
            />
          </div>
          <div className="container-wide relative z-10 flex min-h-[min(52vh,28rem)] flex-col justify-center py-11 lg:min-h-[min(58vh,32rem)] lg:py-14">
            <nav aria-label="Breadcrumb" className="mb-5 text-sm text-charcoal-soft">
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
            <h1 className="heading-display max-w-xl text-[clamp(2.45rem,5vw,3.65rem)] leading-[1.06] text-charcoal sm:max-w-2xl">
              <span className="block whitespace-normal sm:whitespace-nowrap">
                {page.hero.headingLine1}
              </span>
              <span className="block whitespace-normal sm:whitespace-nowrap">
                {page.hero.headingLine2}
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-[1.1rem] leading-relaxed text-charcoal-soft">
              {page.hero.body}
            </p>
            <div className="mt-8">
              <ButtonLink href={page.hero.ctaHref}>
                {page.hero.ctaLabel} <span aria-hidden>→</span>
              </ButtonLink>
            </div>
          </div>
        </section>
      ) : null}

      {visible.has("benefits") ? (
        <section className="border-y border-border/60 bg-[#f7f6f3]">
          <div className="container-wide grid divide-y divide-border/70 md:grid-cols-3 md:divide-x md:divide-y-0">
            {page.benefits.map((item) => {
              const Icon = benefitIcons[item.icon as keyof typeof benefitIcons] || IconPeople;
              return (
                <div key={item.id} className="flex gap-4 px-1 py-6 md:px-7 lg:gap-5 lg:px-9 lg:py-7">
                  <Icon className="mt-0.5 h-10 w-10 shrink-0 text-charcoal lg:h-11 lg:w-11" size={44} />
                  <div>
                    <h2 className="text-[1.15rem] font-bold text-charcoal lg:text-[1.2rem]">
                      {item.title}
                    </h2>
                    <p className="mt-1.5 text-[1.02rem] leading-relaxed text-charcoal-soft lg:text-[1.05rem]">
                      {item.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {visible.has("materials") ? (
        <section id={page.materials.id} className="scroll-mt-24 bg-white py-10 lg:py-12">
          <div className="container-wide">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="heading-display text-[clamp(2rem,3.5vw,2.85rem)] text-charcoal">
                {page.materials.heading}
              </h2>
              <p className="mt-3 text-[1.08rem] leading-relaxed text-charcoal-soft">
                {page.materials.body}
              </p>
            </div>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:mt-9 lg:grid-cols-3 lg:gap-6">
              {page.materials.items.map((item) => {
                const panelId = `${baseId}-material-${item.id}`;
                const expanded = expandedMaterial === item.id;
                return (
                  <li key={item.id} className="flex flex-col border border-border/80 bg-white">
                    <div className="relative aspect-[16/7.2] overflow-hidden bg-ivory-deep">
                      <Image
                        src={item.image.src}
                        alt={item.image.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                        style={{
                          objectPosition:
                            ("objectPosition" in item.image && item.image.objectPosition) ||
                            "center",
                        }}
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-1 flex-col px-5 pt-4 pb-5">
                      <h3 className="heading-display text-[1.7rem] text-charcoal">{item.title}</h3>
                      <p className="mt-2 text-[1.02rem] leading-relaxed text-charcoal-soft">
                        {item.body}
                      </p>
                      <button
                        type="button"
                        className="mt-4 inline-flex items-center gap-2 self-start text-[1.02rem] font-semibold text-forest hover:text-forest-deep"
                        aria-expanded={expanded}
                        aria-controls={panelId}
                        id={`${panelId}-trigger`}
                        onClick={() => toggleMaterial(item.id)}
                      >
                        {item.linkLabel}
                        <span aria-hidden className={cn("transition", expanded && "rotate-90")}>
                          →
                        </span>
                      </button>
                      {expanded ? (
                        <div
                          id={panelId}
                          role="region"
                          aria-labelledby={`${panelId}-trigger`}
                          className="mt-4 border-t border-border/70 pt-4"
                        >
                          <h4 className="text-[1.05rem] font-bold text-charcoal">
                            {item.detail.heading}
                          </h4>
                          <p className="mt-2 text-[1.02rem] leading-relaxed text-charcoal-soft">
                            {item.detail.body}
                          </p>
                        </div>
                      ) : (
                        <div id={panelId} hidden />
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ) : null}

      {visible.has("feature") ? (
        <section className="bg-white py-8 lg:py-10">
          <div className="container-wide grid items-center gap-8 lg:grid-cols-2 lg:gap-11">
            <div className="relative aspect-[16/11] overflow-hidden bg-ivory-deep">
              <Image
                src={page.feature.image.src}
                alt={page.feature.image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                style={{ objectPosition: page.feature.image.objectPosition || "center" }}
                loading="lazy"
              />
            </div>
            <div>
              <h2 className="heading-display text-[clamp(2.05rem,3.4vw,2.85rem)] leading-[1.08] text-charcoal">
                <span className="block">{page.feature.headingLine1}</span>
                <span className="block">{page.feature.headingLine2}</span>
              </h2>
              <p className="mt-4 max-w-lg text-[1.12rem] leading-relaxed text-charcoal-soft">
                {page.feature.body}
              </p>
              <ul className="mt-7 grid gap-5 sm:grid-cols-3 sm:gap-5">
                {page.feature.points.map((point) => {
                  const Icon = pointIcons[point.icon as keyof typeof pointIcons] || IconDroplet;
                  return (
                    <li key={point.id}>
                      <Icon className="h-9 w-9 text-charcoal" size={36} />
                      <h3 className="mt-3 text-[1.08rem] font-bold text-charcoal">{point.title}</h3>
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

      {visible.has("swatches") ? (
        <section className="bg-white py-8 lg:py-10">
          <div className="container-wide grid items-start gap-7 lg:grid-cols-[minmax(0,0.36fr)_minmax(0,0.64fr)] lg:gap-10">
            <div>
              <h2 className="heading-display text-[clamp(1.95rem,3.1vw,2.6rem)] text-charcoal">
                {page.swatches.heading}
              </h2>
              <span className="mt-3 block h-px w-16 bg-border" aria-hidden />
              <p className="mt-3 max-w-sm text-[1.05rem] leading-relaxed text-charcoal-soft">
                {page.swatches.body}
              </p>
            </div>
            <ul className="grid grid-cols-2 gap-3.5 sm:grid-cols-4 sm:gap-4">
              {page.swatches.items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className="group w-full text-left focus-visible:outline-offset-4"
                    onClick={(e) => openLightbox(swatchPool, item.id, e.currentTarget)}
                    aria-label={`Enlarge preview: ${item.label}`}
                  >
                    <div className="relative aspect-square overflow-hidden bg-ivory-deep">
                      <Image
                        src={item.image.src}
                        alt={item.image.alt}
                        fill
                        sizes="(max-width: 640px) 45vw, 15vw"
                        className="object-cover transition duration-500 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                        style={{
                          objectPosition:
                            ("objectPosition" in item.image && item.image.objectPosition) ||
                            "center",
                        }}
                        loading="lazy"
                      />
                    </div>
                    <p className="mt-2.5 text-[0.98rem] font-semibold text-charcoal">{item.label}</p>
                    <p className="mt-0.5 text-sm text-charcoal-soft">{item.description}</p>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {visible.has("gallery") ? (
        <section className="bg-white py-8 lg:py-10">
          <div className="container-wide">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-xl">
                <h2 className="heading-display text-[clamp(1.95rem,3.1vw,2.6rem)] text-charcoal">
                  {page.gallery.heading}
                </h2>
                <p className="mt-2 text-[1.05rem] leading-relaxed text-charcoal-soft">
                  {page.gallery.body}
                </p>
              </div>
              <Link
                href={page.gallery.linkHref}
                className="inline-flex shrink-0 items-center gap-2 text-[1.05rem] font-semibold text-forest hover:text-forest-deep"
              >
                {page.gallery.linkLabel} <span aria-hidden>→</span>
              </Link>
            </div>
            <ul className="mt-6 grid gap-3.5 sm:grid-cols-3 sm:gap-4">
              {page.gallery.images.map((img) => (
                <li key={img.id}>
                  <button
                    type="button"
                    className="group relative block aspect-[16/8] w-full overflow-hidden bg-ivory-deep focus-visible:outline-offset-4"
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
                    <p className="mt-2 text-[0.95rem] text-charcoal-soft">{img.caption}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {visible.has("process") ? (
        <section className="bg-[#f3eee4] py-9 lg:py-11">
          <div className="container-wide flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
            <p className="heading-display shrink-0 text-[clamp(1.85rem,2.8vw,2.35rem)] text-charcoal lg:max-w-[11rem] lg:pt-1">
              {page.process.intro}
            </p>
            <ol className="grid flex-1 gap-7 sm:grid-cols-3 sm:gap-6">
              {page.process.steps.map((step, index) => (
                <li key={step.number} className="relative flex gap-3.5 sm:block">
                  {index < page.process.steps.length - 1 ? (
                    <span
                      className="pointer-events-none absolute top-5 left-[calc(100%+0.15rem)] hidden text-border sm:block"
                      aria-hidden
                    >
                      →
                    </span>
                  ) : null}
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/30 text-base font-bold text-charcoal">
                    {step.number}
                  </span>
                  <div className="sm:mt-3.5">
                    <h3 className="text-[1.12rem] font-bold text-charcoal">{step.title}</h3>
                    <p className="mt-1.5 text-[1.02rem] leading-relaxed text-charcoal-soft">
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
        <section className="bg-ivory py-11 lg:py-12">
          <div className="container-wide flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="max-w-xl">
              <h2 className="heading-display text-[clamp(2rem,3.2vw,2.7rem)] text-charcoal">
                {page.cta.heading}
              </h2>
              <p className="mt-3 text-[1.1rem] leading-relaxed text-charcoal-soft">{page.cta.body}</p>
            </div>
            <ButtonLink href={page.cta.buttonHref} className="shrink-0 px-6 py-3.5 text-[0.98rem]">
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
    </>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
import { GalleryCarousel } from "@/components/gallery/GalleryCarousel";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import { galleryContent } from "@/lib/content";
import { cn } from "@/lib/cn";

type GalleryImage = (typeof galleryContent.images)[number];

const FILTER_IDS = new Set(galleryContent.filters.map((f) => f.id));

export function GalleryPageView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const raw = searchParams.get("category") || "all";
  const activeFilter = FILTER_IDS.has(raw) ? raw : "all";

  const visibleImages = useMemo(
    () => galleryContent.images.filter((img) => img.visible !== false),
    [],
  );

  const sections = useMemo(() => {
    return galleryContent.categories
      .map((cat) => ({
        ...cat,
        images: visibleImages.filter((img) => img.category === cat.id),
      }))
      .filter((section) => section.images.length > 0);
  }, [visibleImages]);

  const shownSections =
    activeFilter === "all"
      ? sections
      : sections.filter((s) => s.id === activeFilter);

  const lightboxPool = useMemo(() => {
    const list =
      activeFilter === "all"
        ? visibleImages
        : visibleImages.filter((img) => img.category === activeFilter);
    return list.map((img) => ({
      id: img.id,
      src: img.src,
      alt: img.alt,
      caption: img.caption,
    }));
  }, [activeFilter, visibleImages]);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  function setFilter(id: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (id === "all") params.delete("category");
    else params.set("category", id);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const openLightbox = useCallback(
    (id: string, trigger: HTMLElement) => {
      const idx = lightboxPool.findIndex((img) => img.id === id);
      if (idx < 0) return;
      triggerRef.current = trigger;
      setLightboxIndex(idx);
    },
    [lightboxPool],
  );

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevLightbox = useCallback(() => {
    setLightboxIndex((i) =>
      i === null ? i : (i - 1 + lightboxPool.length) % lightboxPool.length,
    );
  }, [lightboxPool.length]);
  const nextLightbox = useCallback(() => {
    setLightboxIndex((i) => (i === null ? i : (i + 1) % lightboxPool.length));
  }, [lightboxPool.length]);

  const { hero, cta, note } = galleryContent;

  return (
    <>
      <section className="relative overflow-hidden bg-ivory">
        <div className="grid lg:min-h-[min(62vh,32rem)] lg:grid-cols-[minmax(0,0.44fr)_minmax(0,0.56fr)]">
          <div className="relative z-10 flex flex-col justify-center px-[var(--section-gutter)] py-10 sm:py-12 lg:py-14 lg:pr-8 xl:pr-12">
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-charcoal-soft lg:mb-7">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="hover:text-forest">
                    Home
                  </Link>
                </li>
                <li aria-hidden className="text-border">
                  /
                </li>
                <li className="font-medium text-charcoal" aria-current="page">
                  Gallery
                </li>
              </ol>
            </nav>
            <p className="inline-flex items-center gap-3 text-xs font-semibold tracking-[0.16em] text-forest uppercase">
              <span className="inline-block h-px w-8 bg-forest" aria-hidden />
              {hero.eyebrow}
            </p>
            <h1 className="heading-display mt-4 max-w-[16ch] text-[clamp(2.7rem,5.8vw,3.9rem)] leading-[1.02] text-charcoal">
              <span className="block">{hero.headingLine1}</span>
              <span className="block">{hero.headingLine2}</span>
            </h1>
            <p className="mt-5 max-w-md text-[1.1rem] leading-relaxed text-charcoal-soft">
              {hero.body}
            </p>
          </div>

          <div className="relative min-h-[15rem] sm:min-h-[20rem] lg:min-h-full">
            <div
              className="absolute inset-0 lg:[clip-path:polygon(10%_0,100%_0,100%_100%,0_100%)]"
              aria-hidden={false}
            >
              <Image
                src={hero.image.src}
                alt={hero.image.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 56vw"
                className="object-cover object-[center_40%]"
              />
            </div>
            <div
              className="pointer-events-none absolute inset-y-0 left-0 hidden w-[12%] bg-ivory lg:block"
              style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
              aria-hidden
            />
          </div>
        </div>
      </section>

      <div className="border-b border-border/60 bg-white">
        <div className="container-wide py-5 lg:py-6">
          <div
            role="tablist"
            aria-label="Gallery categories"
            className="flex justify-start gap-2.5 overflow-x-auto pb-1 sm:justify-center sm:gap-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {galleryContent.filters.map((filter) => {
              const selected = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  className={cn(
                    "shrink-0 rounded-full border px-4 py-2.5 text-[0.95rem] font-semibold whitespace-nowrap transition sm:px-5 sm:py-3",
                    selected
                      ? "border-forest bg-forest text-white"
                      : "border-charcoal/25 bg-white text-charcoal hover:border-forest hover:text-forest",
                  )}
                  onClick={() => setFilter(filter.id)}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
          {note ? (
            <p className="mt-4 text-center text-sm text-charcoal-soft">{note}</p>
          ) : null}
        </div>
      </div>

      {shownSections.map((section, index) => {
        const ivory = index % 2 === 1;
        return (
          <section
            key={section.id}
            id={`gallery-${section.id}`}
            className={cn("py-9 lg:py-12", ivory ? "bg-ivory" : "bg-white")}
          >
            <div className="container-wide">
              <GalleryCarousel
                sectionId={`gallery-${section.id}`}
                heading={
                  <h2 className="heading-display text-[clamp(2.1rem,3.4vw,2.85rem)] text-charcoal">
                    {section.heading}
                  </h2>
                }
                description={section.description}
                items={section.images.map((img: GalleryImage) => ({
                  id: img.id,
                  src: img.src,
                  alt: img.alt,
                  caption: img.caption,
                }))}
                onOpen={openLightbox}
              />
            </div>
          </section>
        );
      })}

      <section className="relative overflow-hidden border-y border-border/50 bg-ivory">
        {cta.backgroundImage ? (
          <Image
            src={cta.backgroundImage}
            alt=""
            fill
            className="pointer-events-none object-cover object-[left_bottom] opacity-80 sm:object-[left_center]"
            sizes="100vw"
            aria-hidden
          />
        ) : null}
        <div className="container-wide relative z-10 flex flex-col items-start justify-between gap-7 py-12 sm:flex-row sm:items-center lg:py-14">
          <div className="max-w-xl pl-0 sm:pl-14 lg:pl-20">
            <h2 className="heading-display text-[clamp(2rem,3.4vw,2.7rem)] leading-[1.08] text-charcoal">
              {cta.heading}
            </h2>
            <p className="mt-3 text-[1.12rem] leading-relaxed text-charcoal-soft">
              {cta.body}
            </p>
          </div>
          <Link
            href={cta.buttonHref}
            className="inline-flex shrink-0 items-center gap-2 bg-forest px-6 py-3.5 text-[0.95rem] font-semibold text-white transition hover:bg-forest-deep"
          >
            {cta.buttonLabel} <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

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

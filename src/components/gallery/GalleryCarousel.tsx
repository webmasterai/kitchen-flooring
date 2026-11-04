"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { IconChevron, IconSearch } from "@/components/icons/Icons";
import { cn } from "@/lib/cn";

export type GalleryCard = {
  id: string;
  src: string;
  alt: string;
  caption: string;
};

type Props = {
  items: GalleryCard[];
  onOpen: (id: string, trigger: HTMLElement) => void;
  sectionId: string;
  heading: ReactNode;
  description?: string;
};

function useVisibleCount() {
  const [count, setCount] = useState(3);
  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      if (w < 640) setCount(1);
      else if (w < 1024) setCount(2);
      else setCount(3);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return count;
}

export function GalleryCarousel({
  items,
  onOpen,
  sectionId,
  heading,
  description,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const visibleCount = useVisibleCount();
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  const showControls = items.length > visibleCount;

  // Sync scrollability state
  const sync = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const run = () => sync();
    run();
    const raf = window.requestAnimationFrame(run);
    el.addEventListener("scroll", run, { passive: true });
    window.addEventListener("resize", run);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(run) : null;
    ro?.observe(el);
    return () => {
      window.cancelAnimationFrame(raf);
      el.removeEventListener("scroll", run);
      window.removeEventListener("resize", run);
      ro?.disconnect();
    };
  }, [sync, items.length, visibleCount]);

  // Motion preference detection
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReduceMotion(mq.matches);
    updateMotion();
    mq.addEventListener("change", updateMotion);
    return () => mq.removeEventListener("change", updateMotion);
  }, []);

  // Page visibility detection
  useEffect(() => {
    function onVisibilityChange() {
      setIsPageVisible(document.visibilityState === "visible");
    }
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  // IntersectionObserver detection
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scrollByDir = useCallback((dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-gallery-card]");
    const amount = card ? card.offsetWidth + 14 : el.clientWidth * 0.8;
    el.scrollBy({
      left: dir * amount,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }, []);

  const stepForward = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const isAtEnd = el.scrollLeft >= max - 12;
    if (isAtEnd) {
      el.scrollTo({
        left: 0,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    } else {
      scrollByDir(1);
    }
  }, [reduceMotion, scrollByDir]);

  // Autoplay rotation timer (~4.5s)
  useEffect(() => {
    if (
      !showControls ||
      reduceMotion ||
      isPaused ||
      isHovered ||
      isFocused ||
      !isInView ||
      !isPageVisible
    ) {
      return;
    }

    const timer = setInterval(() => {
      stepForward();
    }, 4500);

    return () => clearInterval(timer);
  }, [
    showControls,
    reduceMotion,
    isPaused,
    isHovered,
    isFocused,
    isInView,
    isPageVisible,
    stepForward,
  ]);

  return (
    <div
      ref={rootRef}
      className="min-w-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node)) {
          setIsFocused(false);
        }
      }}
    >
      <div className="mb-5 flex items-start justify-between gap-4 lg:mb-6">
        <div className="min-w-0 max-w-2xl">
          {heading}
          {description ? (
            <p className="mt-3 text-[1.08rem] leading-relaxed text-charcoal-soft">
              {description}
            </p>
          ) : null}
        </div>
        {showControls ? (
          <div className="flex shrink-0 items-center gap-2 pt-1">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-charcoal transition hover:border-forest hover:text-forest focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
              onClick={() => setIsPaused((prev) => !prev)}
              aria-label={
                isPaused
                  ? "Start automatic carousel rotation"
                  : "Pause automatic carousel rotation"
              }
              title={
                isPaused
                  ? "Start automatic rotation"
                  : "Pause automatic rotation"
              }
            >
              {isPaused ? (
                <svg
                  className="h-3.5 w-3.5 fill-current ml-0.5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <polygon points="6 4 20 12 6 20 6 4" />
                </svg>
              ) : (
                <svg
                  className="h-3.5 w-3.5 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              )}
            </button>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-charcoal transition hover:border-forest hover:text-forest disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
              onClick={() => scrollByDir(-1)}
              disabled={!canPrev}
              aria-controls={`${sectionId}-track`}
              aria-label="Previous images"
            >
              <IconChevron className="h-4 w-4 rotate-90" size={16} />
            </button>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-charcoal transition hover:border-forest hover:text-forest disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
              onClick={() => scrollByDir(1)}
              disabled={!canNext}
              aria-controls={`${sectionId}-track`}
              aria-label="Next images"
            >
              <IconChevron className="h-4 w-4 -rotate-90" size={16} />
            </button>
          </div>
        ) : null}
      </div>

      <ul
        id={`${sectionId}-track`}
        ref={scrollerRef}
        className={cn(
          "flex w-full min-w-0 gap-3 overflow-x-auto pb-1 scroll-smooth snap-x snap-mandatory sm:gap-3.5",
          "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        )}
        tabIndex={0}
        aria-label="Image carousel"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            scrollByDir(1);
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            scrollByDir(-1);
          }
        }}
      >
        {items.map((item) => (
          <li
            key={item.id}
            data-gallery-card
            className="w-[min(100%,20rem)] shrink-0 basis-[min(100%,20rem)] snap-start sm:w-[calc((100%-0.875rem)/2)] sm:basis-[calc((100%-0.875rem)/2)] lg:w-[calc((100%-1.75rem)/3)] lg:basis-[calc((100%-1.75rem)/3)]"
          >
            <figure>
              <button
                type="button"
                className="group relative block aspect-[16/11] w-full overflow-hidden bg-ivory-deep focus-visible:outline-offset-4"
                onClick={(e) => onOpen(item.id, e.currentTarget)}
                aria-label={`Open larger view: ${item.caption}`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center transition duration-500 group-hover:scale-[1.035] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  loading="lazy"
                />
                <span className="absolute right-3 bottom-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-forest shadow-sm transition group-hover:bg-forest group-hover:text-white">
                  <IconSearch className="h-4 w-4" size={16} />
                </span>
              </button>
              <figcaption className="mt-3 text-[0.98rem] font-medium leading-snug text-charcoal-soft">
                {item.caption}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}

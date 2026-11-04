"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { HeroSlide } from "@/lib/content";
import { IconArrow } from "@/components/icons/Icons";

type HeroCarouselProps = {
  eyebrow: string;
  headingLine1: string;
  headingLine2: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  slides: HeroSlide[];
  autoplay?: boolean;
  autoplayInterval?: number; // milliseconds
};

export function HeroCarousel({
  eyebrow,
  headingLine1,
  headingLine2,
  body,
  ctaLabel,
  ctaHref,
  slides,
  autoplay = true,
  autoplayInterval = 5500,
}: HeroCarouselProps) {
  const labelId = useId();
  const regionRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const [isPageVisible, setIsPageVisible] = useState(true);

  const pointerStart = useRef<{ x: number; y: number } | null>(null);

  const count = slides.length;
  const active = slides[index] ?? slides[0];

  const go = useCallback(
    (next: number) => {
      if (count < 1) return;
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  // Motion preference detection
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Page visibility detection
  useEffect(() => {
    function onVisibilityChange() {
      setIsPageVisible(document.visibilityState === "visible");
    }
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  // Viewport intersection detection
  useEffect(() => {
    const el = regionRef.current;
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

  // Autoplay rotation timer
  useEffect(() => {
    if (
      !autoplay ||
      count <= 1 ||
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
      go(index + 1);
    }, autoplayInterval);

    return () => clearInterval(timer);
  }, [
    autoplay,
    autoplayInterval,
    count,
    reduceMotion,
    isPaused,
    isHovered,
    isFocused,
    isInView,
    isPageVisible,
    go,
    index,
  ]);

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      go(0);
    } else if (event.key === "End") {
      event.preventDefault();
      go(count - 1);
    }
  }

  function onPointerDown(event: ReactPointerEvent<HTMLElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const target = event.target as HTMLElement | null;
    if (target?.closest("a, button, input, textarea, select, label")) return;
    pointerStart.current = { x: event.clientX, y: event.clientY };
  }

  function onPointerUp(event: ReactPointerEvent<HTMLElement>) {
    if (!pointerStart.current) return;
    const dx = event.clientX - pointerStart.current.x;
    const dy = event.clientY - pointerStart.current.y;
    pointerStart.current = null;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
    go(dx < 0 ? index + 1 : index - 1);
  }

  if (!active) return null;

  const slideLabel = `${String(index + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}`;
  const progress = ((index + 1) / count) * 100;

  return (
    <section
      ref={regionRef}
      data-no-reveal="true"
      className="relative isolate overflow-hidden bg-ivory-deep text-white"
      aria-roledescription="carousel"
      aria-labelledby={labelId}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        pointerStart.current = null;
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={(e) => {
        if (!regionRef.current?.contains(e.relatedTarget as Node)) {
          setIsFocused(false);
        }
      }}
    >
      <h2 id={labelId} className="sr-only">
        Featured kitchen photography
      </h2>

      <div className="relative h-[min(78vh,46rem)] min-h-[24rem] w-full sm:min-h-[30rem]">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 ${reduceMotion ? "" : "transition-opacity duration-700 ease-out"} ${
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: slide.objectPosition || "50% 45%" }}
            />
          </div>
        ))}

        <div
          className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent"
          aria-hidden
        />

        <div className="container-wide relative flex h-full flex-col justify-between py-12 sm:py-14 lg:py-16">
          <div className="flex flex-1 items-center">
            <div className="max-w-[38rem] fade-up">
              <p className="mb-4 text-[0.7rem] font-semibold tracking-[0.22em] text-white/92 uppercase sm:text-[0.78rem]">
                {eyebrow}
              </p>
              <h1 className="heading-display text-[3.35rem] !font-bold leading-[1.01] tracking-[-0.03em] text-white sm:text-[4.25rem] lg:text-[5.15rem]">
                {headingLine1}
                <br />
                {headingLine2}
              </h1>
              <p className="mt-5 max-w-[30rem] text-[1.05rem] leading-relaxed text-white/93 sm:text-[1.12rem]">
                {body}
              </p>
              <div className="mt-8 fade-up-delay">
                <Link
                  href={ctaHref}
                  className="inline-flex items-center justify-center gap-2 bg-forest px-8 py-4 text-base font-semibold tracking-wide text-white transition hover:bg-forest-soft"
                >
                  {ctaLabel}
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 flex items-end justify-between gap-4">
            <div className="flex items-center gap-4" aria-live="polite">
              <div className="min-w-[7.5rem]">
                <p className="text-xs font-semibold tracking-[0.16em] text-white/90 tabular-nums">
                  {slideLabel}
                </p>
                <div
                  className="mt-2 h-px w-28 overflow-hidden bg-white/35"
                  role="presentation"
                >
                  <div
                    className={`h-full bg-white ${reduceMotion ? "" : "transition-[width] duration-500 ease-out"}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 pb-0.5" role="tablist" aria-label="Slides">
                {slides.map((slide, i) => (
                  <button
                    key={slide.id}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-2 w-2 rounded-full transition ${
                      i === index ? "bg-white" : "bg-white/45 hover:bg-white/75"
                    }`}
                    onClick={() => go(i)}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-charcoal shadow-sm transition hover:bg-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                aria-label={isPaused ? "Play slide rotation" : "Pause slide rotation"}
                title={isPaused ? "Play slide rotation" : "Pause slide rotation"}
                onClick={() => setIsPaused((prev) => !prev)}
              >
                {isPaused ? (
                  <svg
                    className="h-4 w-4 fill-current ml-0.5"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <polygon points="6 4 20 12 6 20 6 4" />
                  </svg>
                ) : (
                  <svg
                    className="h-4 w-4 fill-current"
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
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-charcoal shadow-sm transition hover:bg-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                aria-label="Previous slide"
                onClick={() => go(index - 1)}
              >
                <IconArrow className="h-4 w-4 rotate-180" size={16} />
              </button>
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-charcoal shadow-sm transition hover:bg-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                aria-label="Next slide"
                onClick={() => go(index + 1)}
              >
                <IconArrow className="h-4 w-4" size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

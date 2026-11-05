"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { allServices, mainNav, Service, siteConfig } from "@/lib/content";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { IconChevron, IconPhone } from "@/components/icons/Icons";
import { cn } from "@/lib/cn";

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/services") {
    return (
      pathname === "/services" ||
      pathname.startsWith("/services/") ||
      pathname === "/cabinets" ||
      pathname === "/flooring" ||
      pathname.startsWith("/flooring/") ||
      pathname === "/countertops" ||
      pathname === "/bathroom-vanities"
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function useNavReady() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

const PRIMARY_SERVICES_CONFIG = [
  {
    id: "cabinets",
    title: "Cabinets",
    href: "/cabinets",
    defaultImage: "/media/services/Photo12-1920w-2.jpg",
    defaultDesc: "Stylish, durable cabinetry to fit your space and style.",
  },
  {
    id: "flooring",
    title: "Flooring",
    href: "/flooring",
    defaultImage: "/media/services/laminate-vs-vinyl-feature-pic-1_2048x.webp",
    defaultDesc: "Beautiful, long-lasting flooring for every room in your home.",
  },
  {
    id: "countertops",
    title: "Countertops",
    href: "/countertops",
    defaultImage: "/media/services/c96f081c-3d94-4c25-b210-fdd92b9f619e_KitchenFusionStone-1024x896.jpg",
    defaultDesc: "Premium countertops that combine beauty and performance.",
  },
  {
    id: "bathroom-vanities",
    title: "Bathroom Vanities",
    href: "/bathroom-vanities",
    defaultImage: "/media/services/vanity-9-qrppq7f7x6tt7em56oc3akh68lpah3kxcv3wgs36vk.jpg",
    defaultDesc: "Functional, elegant vanities that elevate your bathroom.",
  },
];

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopServicesOpen, setDesktopServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [pointerLeft, setPointerLeft] = useState<number | null>(null);

  const servicesBtnRef = useRef<HTMLButtonElement | null>(null);
  const megaMenuRef = useRef<HTMLDivElement | null>(null);

  const mobilePanelId = useId();
  const pathname = usePathname();
  const navReady = useNavReady();

  // Same URL everywhere avoids SSR/client href mismatch; hash still scrolls on /contact.
  const quoteHref = "/contact#contact-form";

  // Prevent background scroll when mobile navigation is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close menus on route navigation
  useEffect(() => {
    setDesktopServicesOpen(false);
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
  }, [pathname]);

  // Calculate pointer caret position relative to Services button center
  const updatePointer = useCallback(() => {
    if (!servicesBtnRef.current || !megaMenuRef.current) return;
    const btnRect = servicesBtnRef.current.getBoundingClientRect();
    const panelRect = megaMenuRef.current.getBoundingClientRect();
    const center = btnRect.left + btnRect.width / 2 - panelRect.left;
    setPointerLeft(center);
  }, []);

  // Listeners for outside click, Escape key, and window resize
  useEffect(() => {
    if (!desktopServicesOpen) return;

    updatePointer();
    const handleResize = () => updatePointer();
    window.addEventListener("resize", handleResize);

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        megaMenuRef.current &&
        !megaMenuRef.current.contains(target) &&
        servicesBtnRef.current &&
        !servicesBtnRef.current.contains(target)
      ) {
        setDesktopServicesOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDesktopServicesOpen(false);
        servicesBtnRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [desktopServicesOpen, updatePointer]);

  const active = (href: string) => navReady && isActivePath(pathname, href);

  // Merge CMS descriptions/images with config to support dynamic live editing
  const megaMenuItems = PRIMARY_SERVICES_CONFIG.map((item) => {
    const cms = (allServices as Service[]).find((s) => s.id === item.id);
    return {
      ...item,
      title: cms?.name || item.title,
      image: cms?.cardImage || cms?.heroImage || item.defaultImage,
      description: cms?.cardDescription || cms?.shortDescription || item.defaultDesc,
    };
  });

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-white/95 backdrop-blur">
      <div className="container-site flex items-center justify-between gap-4 py-2 sm:py-2.5 lg:py-2.5">
        <Link href="/" className="shrink-0 flex items-center" onClick={() => setMobileMenuOpen(false)}>
          <Image
            src={siteConfig.logo.src}
            alt={siteConfig.logo.alt}
            width={240}
            height={122}
            className="h-[4.35rem] w-auto object-contain sm:h-[4.85rem] lg:h-[5.25rem]"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Primary" className="hidden items-center gap-5 xl:gap-7 lg:flex">
          {mainNav.map((item) => {
            if (item.href === "/services") {
              return (
                <div key={item.href} className="relative">
                  <button
                    ref={servicesBtnRef}
                    type="button"
                    aria-expanded={desktopServicesOpen}
                    aria-controls="services-mega-menu"
                    aria-haspopup="dialog"
                    onClick={() => setDesktopServicesOpen((prev) => !prev)}
                    className={cn(
                      "inline-flex items-center gap-1.5 text-[0.95rem] font-semibold transition-colors duration-150 rounded-md cursor-pointer",
                      desktopServicesOpen
                        ? "bg-[#015335] text-white px-3.5 py-1.5 shadow-sm"
                        : cn(
                            "px-2.5 py-1.5 hover:text-forest",
                            active("/services")
                              ? "text-forest underline decoration-forest decoration-2 underline-offset-[10px]"
                              : "text-charcoal",
                          ),
                    )}
                  >
                    <span>{item.label}</span>
                    <IconChevron
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-200",
                        desktopServicesOpen ? "rotate-180 text-white" : "text-current",
                      )}
                    />
                  </button>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-[0.95rem] font-semibold hover:text-forest",
                  active(item.href)
                    ? "text-forest underline decoration-forest decoration-2 underline-offset-[10px]"
                    : "text-charcoal",
                )}
                aria-current={active(item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Phone & Quote CTA */}
        <div className="hidden shrink-0 items-center gap-4 lg:flex xl:gap-5">
          <a
            href={`tel:${siteConfig.contact.phoneTel}`}
            className="hidden items-center gap-2 text-[0.95rem] font-bold text-charcoal hover:text-forest xl:inline-flex"
          >
            <IconPhone className="h-4 w-4 text-forest" size={16} />
            {siteConfig.contact.phoneDisplay}
          </a>
          <ButtonLink href={quoteHref} className="whitespace-nowrap px-5 py-3.5 text-[0.95rem] xl:px-6">
            Get a Free Quote <span aria-hidden>→</span>
          </ButtonLink>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center border border-border text-charcoal lg:hidden"
          aria-expanded={mobileMenuOpen}
          aria-controls={mobilePanelId}
          onClick={() => setMobileMenuOpen((v) => !v)}
        >
          <span className="sr-only">{mobileMenuOpen ? "Close menu" : "Open menu"}</span>
          <span className="flex flex-col gap-1.5" aria-hidden>
            <span
              className={`block h-0.5 w-5 bg-current transition ${mobileMenuOpen ? "translate-y-2 rotate-45" : ""}`}
            />
            <span className={`block h-0.5 w-5 bg-current transition ${mobileMenuOpen ? "opacity-0" : ""}`} />
            <span
              className={`block h-0.5 w-5 bg-current transition ${mobileMenuOpen ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>

      {/* Desktop Mega Menu Panel (Floats directly below header, overlaying page without layout shift) */}
      {desktopServicesOpen && (
        <div className="hidden lg:block absolute left-0 right-0 top-full pt-1.5 z-50">
          <div className="container-site">
            <div
              ref={megaMenuRef}
              id="services-mega-menu"
              role="region"
              aria-label="Services menu"
              className="relative w-full rounded-2xl border border-neutral-200/90 bg-white p-6 lg:p-8 shadow-2xl transition-all"
            >
              {/* Upward Pointer Caret aligned directly to Services button */}
              <div
                style={{ left: pointerLeft !== null ? `${pointerLeft}px` : "38%" }}
                className="pointer-events-none absolute -top-[7px] h-3.5 w-3.5 -translate-x-1/2 rotate-45 border-l border-t border-neutral-200/90 bg-white"
                aria-hidden="true"
              />

              {/* Mega Menu Heading */}
              <h2 className="heading-display mb-6 text-2xl lg:text-[1.85rem] font-medium text-charcoal">
                Explore our services
              </h2>

              {/* 4 Equal-width Service Cards */}
              <div className="grid grid-cols-4 gap-6">
                {megaMenuItems.map((service) => (
                  <Link
                    key={service.href}
                    href={service.href}
                    onClick={() => setDesktopServicesOpen(false)}
                    className="group block rounded-lg focus-visible:outline-2 focus-visible:outline-forest focus-visible:outline-offset-4"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md bg-neutral-100">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        sizes="(max-width: 1280px) 25vw, 320px"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-3.5 flex items-center justify-between gap-2">
                      <h3 className="heading-display text-lg lg:text-[1.2rem] font-semibold text-charcoal transition-colors group-hover:text-forest">
                        {service.title}
                      </h3>
                      <span
                        aria-hidden="true"
                        className="text-base font-bold text-forest transition-transform duration-200 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </div>
                    <p className="mt-1 text-xs lg:text-[0.85rem] leading-relaxed text-charcoal-soft">
                      {service.description}
                    </p>
                  </Link>
                ))}
              </div>

              {/* Bottom Divider and View All Link */}
              <div className="mt-6 border-t border-neutral-200/90 pt-4">
                <Link
                  href="/services"
                  onClick={() => setDesktopServicesOpen(false)}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-forest hover:underline focus-visible:outline-2 focus-visible:outline-forest"
                >
                  View all services <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Navigation */}
      <div
        id={mobilePanelId}
        className={`border-t border-border bg-white lg:hidden ${mobileMenuOpen ? "block" : "hidden"}`}
      >
        <nav aria-label="Mobile" className="container-wide flex flex-col gap-1 py-4">
          {mainNav.map((item) => {
            if (item.href === "/services") {
              return (
                <div key={item.href} className="border-b border-border/60 py-2">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between py-2 text-left text-base font-medium text-charcoal"
                    aria-expanded={mobileServicesOpen}
                    onClick={() => setMobileServicesOpen((v) => !v)}
                  >
                    <span>{item.label}</span>
                    <IconChevron
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        mobileServicesOpen ? "rotate-180 text-forest" : "text-charcoal",
                      )}
                    />
                  </button>

                  {mobileServicesOpen && (
                    <div className="mt-2 flex flex-col gap-2.5 pb-2">
                      {megaMenuItems.map((service) => (
                        <Link
                          key={service.href}
                          href={service.href}
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setMobileServicesOpen(false);
                          }}
                          className="flex items-center gap-3 rounded-lg border border-neutral-100 bg-neutral-50/60 p-2.5 transition-colors hover:bg-neutral-100"
                        >
                          <div className="relative h-14 w-18 shrink-0 overflow-hidden rounded-md bg-neutral-200">
                            <Image
                              src={service.image}
                              alt={service.title}
                              fill
                              sizes="72px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <h4 className="heading-display text-base font-semibold text-charcoal">
                                {service.title}
                              </h4>
                              <span className="text-forest text-sm font-bold">→</span>
                            </div>
                            <p className="line-clamp-2 text-xs leading-snug text-charcoal-soft">
                              {service.description}
                            </p>
                          </div>
                        </Link>
                      ))}

                      <div className="pt-1">
                        <Link
                          href="/services"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setMobileServicesOpen(false);
                          }}
                          className="inline-flex items-center gap-1.5 text-sm font-bold text-forest hover:underline py-1.5"
                        >
                          View all services <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "border-b border-border/60 py-3 text-base font-medium",
                  active(item.href) && "text-forest",
                )}
                aria-current={active(item.href) ? "page" : undefined}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}

          <a
            href={`tel:${siteConfig.contact.phoneTel}`}
            className="mt-3 inline-flex items-center gap-2 py-2 font-semibold"
          >
            <IconPhone className="h-4 w-4 text-forest" size={16} />
            {siteConfig.contact.phoneDisplay}
          </a>
          <ButtonLink href={quoteHref} className="mt-2 w-full" onClick={() => setMobileMenuOpen(false)}>
            Get a Free Quote →
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}

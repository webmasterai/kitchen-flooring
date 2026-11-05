"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState, useSyncExternalStore } from "react";
import { mainNav, siteConfig } from "@/lib/content";
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

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const panelId = useId();
  const pathname = usePathname();
  const navReady = useNavReady();
  // Same URL everywhere avoids SSR/client href mismatch; hash still scrolls on /contact.
  const quoteHref = "/contact#contact-form";

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const active = (href: string) => navReady && isActivePath(pathname, href);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-white/95 backdrop-blur">
      <div className="container-site flex items-center justify-between gap-4 py-2 sm:py-2.5 lg:py-2.5">
        <Link href="/" className="shrink-0 flex items-center" onClick={() => setOpen(false)}>
          <Image
            src={siteConfig.logo.src}
            alt={siteConfig.logo.alt}
            width={240}
            height={122}
            className="h-[4.35rem] w-auto object-contain sm:h-[4.85rem] lg:h-[5.25rem]"
            priority
          />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-5 xl:gap-7 lg:flex">
          {mainNav.map((item) =>
            "children" in item && item.children ? (
              <div key={item.href} className="relative group">
                <Link
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-1 text-[0.95rem] font-semibold hover:text-forest",
                    active(item.href) ? "text-forest underline decoration-forest decoration-2 underline-offset-[10px]" : "text-charcoal",
                  )}
                >
                  {item.label}
                  <IconChevron className="h-3.5 w-3.5" />
                </Link>
                <div className="invisible absolute left-0 top-full z-20 min-w-52 translate-y-2 border border-border bg-white py-2 opacity-0 shadow-sm transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-4 py-2 text-sm text-charcoal hover:bg-ivory hover:text-forest"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
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
            ),
          )}
        </nav>

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

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center border border-border text-charcoal lg:hidden"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span className="flex flex-col gap-1.5" aria-hidden>
            <span className={`block h-0.5 w-5 bg-current transition ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-current transition ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-current transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      <div
        id={panelId}
        className={`border-t border-border bg-white lg:hidden ${open ? "block" : "hidden"}`}
      >
        <nav aria-label="Mobile" className="container-wide flex flex-col gap-1 py-4">
          {mainNav.map((item) =>
            "children" in item && item.children ? (
              <div key={item.href} className="border-b border-border/60 py-2">
                <button
                  type="button"
                  className="flex w-full items-center justify-between py-2 text-left text-base font-medium"
                  aria-expanded={servicesOpen}
                  onClick={() => setServicesOpen((v) => !v)}
                >
                  {item.label}
                  <IconChevron className={`transition ${servicesOpen ? "rotate-180" : ""}`} />
                </button>
                {servicesOpen ? (
                  <div className="mb-2 ml-3 flex flex-col gap-1">
                    <Link href={item.href} className="py-2 text-sm text-charcoal-soft" onClick={() => setOpen(false)}>
                      All services
                    </Link>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="py-2 text-sm text-charcoal-soft"
                        onClick={() => setOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "border-b border-border/60 py-3 text-base font-medium",
                  active(item.href) && "text-forest",
                )}
                aria-current={active(item.href) ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ),
          )}
          <a
            href={`tel:${siteConfig.contact.phoneTel}`}
            className="mt-3 inline-flex items-center gap-2 py-2 font-semibold"
          >
            <IconPhone className="h-4 w-4 text-forest" size={16} />
            {siteConfig.contact.phoneDisplay}
          </a>
          <ButtonLink href={quoteHref} className="mt-2 w-full" onClick={() => setOpen(false)}>
            Get a Free Quote →
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}

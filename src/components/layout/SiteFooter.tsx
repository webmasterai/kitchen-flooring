"use client";

import Image from "next/image";
import Link from "next/link";
import {
  footerExplore,
  primaryServices,
  siteConfig,
} from "@/lib/content";
import {
  IconClock,
  IconFacebook,
  IconInstagram,
  IconMail,
  IconPhone,
  IconPin,
} from "@/components/icons/Icons";
import { cn } from "@/lib/cn";

function useFooterVariant(): "brand" | "light" {
  return "light";
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  const { contact, social, logo, footerBlurb } = siteConfig;
  const variant = useFooterVariant();
  const light = variant === "light";

  return (
    <footer
      className={cn("border-t border-border/70 bg-white text-charcoal")}
    >
      <div className="container-wide grid items-start gap-10 py-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-12 lg:py-14">
        <div>
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            className="mb-5 h-auto w-[min(100%,15rem)] max-h-[5.5rem] object-contain object-left sm:max-h-[5.75rem]"
          />
          <p
            className={cn(
              "max-w-xs text-[1.02rem] leading-relaxed",
              light ? "text-charcoal-soft" : "text-white/80",
            )}
          >
            {footerBlurb}
          </p>
          <div className="mt-5 flex gap-2">
            <a
              href={social.facebook}
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-full border transition",
                light
                  ? "border-border text-forest hover:border-forest hover:bg-forest hover:text-white"
                  : "border-white/35 text-white hover:bg-white hover:text-forest",
              )}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <IconFacebook className="h-4 w-4" size={16} />
            </a>
            <a
              href={social.instagram}
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-full border transition",
                light
                  ? "border-border text-forest hover:border-forest hover:bg-forest hover:text-white"
                  : "border-white/35 text-white hover:bg-white hover:text-forest",
              )}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <IconInstagram className="h-4 w-4" size={16} />
            </a>
          </div>
        </div>

        <div>
          <h2
            className={cn(
              "mb-4 text-sm font-bold tracking-[0.14em] uppercase",
              light ? "text-charcoal" : "text-white",
            )}
          >
            Services
          </h2>
          <ul
            className={cn(
              "space-y-3 text-[1.02rem]",
              light ? "text-charcoal-soft" : "text-white/80",
            )}
          >
            {primaryServices.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/${s.slug}`}
                  className={light ? "hover:text-forest" : "hover:text-white"}
                >
                  {s.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/kitchen-remodel"
                className={light ? "hover:text-forest" : "hover:text-white"}
              >
                Kitchen Remodel
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2
            className={cn(
              "mb-4 text-sm font-bold tracking-[0.14em] uppercase",
              light ? "text-charcoal" : "text-white",
            )}
          >
            Explore
          </h2>
          <ul
            className={cn(
              "space-y-3 text-[1.02rem]",
              light ? "text-charcoal-soft" : "text-white/80",
            )}
          >
            {footerExplore.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={light ? "hover:text-forest" : "hover:text-white"}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/privacy-policy"
                className={light ? "hover:text-forest" : "hover:text-white"}
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2
            className={cn(
              "mb-4 text-sm font-bold tracking-[0.14em] uppercase",
              light ? "text-charcoal" : "text-white",
            )}
          >
            Visit Us
          </h2>
          <ul
            className={cn(
              "space-y-3.5 text-[1.02rem]",
              light ? "text-charcoal-soft" : "text-white/80",
            )}
          >
            <li className="flex items-start gap-2.5">
              <IconPin
                className={cn("mt-0.5 h-5 w-5 shrink-0", light ? "text-forest" : "text-white")}
                size={20}
              />
              <a
                href={siteConfig.maps.googleMapsSearch}
                target="_blank"
                rel="noopener noreferrer"
                className={light ? "hover:text-forest" : "hover:text-white"}
              >
                {contact.fullAddress}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <IconPhone
                className={cn("mt-0.5 h-5 w-5 shrink-0", light ? "text-forest" : "text-white")}
                size={20}
              />
              <a
                href={`tel:${contact.phoneTel}`}
                className={light ? "hover:text-forest" : "hover:text-white"}
              >
                {contact.phoneDisplay}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <IconMail
                className={cn("mt-0.5 h-5 w-5 shrink-0", light ? "text-forest" : "text-white")}
                size={20}
              />
              <a
                href={`mailto:${contact.email}`}
                className={light ? "hover:text-forest" : "hover:text-white"}
              >
                {contact.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <IconClock
                className={cn("mt-0.5 h-5 w-5 shrink-0", light ? "text-forest" : "text-white")}
                size={20}
              />
              <span>{contact.hoursNote}</span>
            </li>
          </ul>
        </div>
      </div>

      <div
        className={cn(
          "border-t",
          "border-border/70 bg-white",
        )}
      >
        <div
          className={cn(
            "container-wide flex flex-col gap-2 py-3.5 text-xs sm:flex-row sm:items-center sm:justify-between",
            light ? "text-charcoal-soft" : "text-white/70",
          )}
        >
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/privacy-policy"
              className={light ? "hover:text-forest" : "hover:text-white"}
            >
              Privacy Policy
            </Link>
            <span>{siteConfig.credit.text}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

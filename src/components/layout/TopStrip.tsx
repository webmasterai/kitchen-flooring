import { siteConfig } from "@/lib/content";
import {
  IconClock,
  IconFacebook,
  IconInstagram,
  IconPin,
} from "@/components/icons/Icons";

export function TopStrip() {
  const { contact, social, maps } = siteConfig;

  return (
    <div className="bg-[#015335] text-white">
      <div className="container-site flex flex-col items-center gap-1.5 py-1 text-[11px] tracking-[0.08em] sm:flex-row sm:justify-between sm:gap-4 sm:py-1.5 sm:text-xs">
        <a
          href={maps.googleMapsSearch}
          className="inline-flex max-w-full items-center justify-center gap-2 py-0.5 text-white/95 hover:text-white sm:justify-start"
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconPin className="h-3.5 w-3.5 shrink-0 text-white" />
          <span className="truncate">{contact.fullAddress}</span>
        </a>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <p className="inline-flex items-center gap-2 py-0.5 text-white/95">
            <IconClock className="h-3.5 w-3.5 shrink-0 text-white" />
            <span>{contact.hoursNote}</span>
          </p>
          <div className="flex items-center gap-2">
            <a
              href={social.facebook}
              className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/40 text-white hover:bg-white/10 sm:h-7 sm:w-7"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Kitchen & Flooring Depot on Facebook"
            >
              <IconFacebook className="h-3.5 w-3.5" />
            </a>
            <a
              href={social.instagram}
              className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/40 text-white hover:bg-white/10 sm:h-7 sm:w-7"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Kitchen & Flooring Depot on Instagram"
            >
              <IconInstagram className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

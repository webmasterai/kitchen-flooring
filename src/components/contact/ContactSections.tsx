import Image from "next/image";
import Link from "next/link";
import { QuoteForm } from "@/components/forms/QuoteForm";
import {
  IconClock,
  IconFacebook,
  IconInstagram,
  IconMail,
  IconPhone,
  IconPin,
} from "@/components/icons/Icons";
import { contactPage, siteConfig } from "@/lib/content";

export function ContactHero() {
  const { hero } = contactPage;
  const bgImage = hero.backgroundImage || "/media/cta/quote-cta-plant-countertop.jpg";

  return (
    <section className="relative overflow-hidden bg-ivory">
      {bgImage ? (
        <>
          <Image
            src={bgImage}
            alt={hero.backgroundAlt || "Warm ivory wall with olive foliage and stone countertop"}
            fill
            priority
            className="pointer-events-none object-cover object-[24%_bottom] sm:object-[15%_bottom] md:object-[8%_bottom] lg:object-[left_bottom]"
            sizes="100vw"
            aria-hidden
          />
          {/* Subtle light overlay ensuring crisp readability across desktop and mobile */}
          <div
            className="pointer-events-none absolute inset-0 bg-white/80 sm:bg-white/60 md:bg-white/45 backdrop-blur-[0.5px]"
            aria-hidden
          />
        </>
      ) : null}
      {hero.foliageImage ? (
        // Decorative SVG — native img avoids Next/Image SVG restrictions
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={hero.foliageImage}
          alt=""
          width={280}
          height={220}
          className="pointer-events-none absolute -top-2 right-0 z-0 w-[min(42vw,16rem)] opacity-70 sm:w-[min(36vw,18rem)] lg:right-[max(0px,calc((100%-var(--container-max))/2))] lg:w-[17rem]"
          aria-hidden
        />
      ) : null}

      <div className="container-wide relative z-10 py-10 sm:py-12 lg:py-16">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-charcoal-soft">
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
              Contact
            </li>
          </ol>
        </nav>

        <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1.05fr)_auto_minmax(0,0.95fr)] lg:gap-0">
          <div className="max-w-xl pl-1 sm:pl-0">
            <p className="eyebrow text-forest">{hero.eyebrow}</p>
            <h1 className="heading-display mt-4 text-[clamp(2.4rem,5vw,3.65rem)] text-charcoal">
              <span className="block">{hero.headingLine1}</span>
              <span className="block">{hero.headingLine2}</span>
            </h1>
            <span
              className="mt-5 block h-[3px] w-14 rounded-full bg-forest"
              aria-hidden
            />
          </div>

          <div
            className="mx-10 hidden h-full min-h-[7rem] w-px self-stretch bg-border/80 lg:block"
            aria-hidden
          />

          <p className="max-w-md self-center text-[1.08rem] leading-relaxed text-charcoal-soft lg:pl-2">
            {hero.body}
          </p>
        </div>
      </div>
    </section>
  );
}

export function ContactMain({ defaultService }: { defaultService?: string } = {}) {
  const { intro, form } = contactPage;
  const { contact, social } = siteConfig;

  const rows = [
    {
      icon: IconPhone,
      label: "Call Us",
      content: (
        <a href={`tel:${contact.phoneTel}`} className="font-semibold text-charcoal hover:text-forest">
          {contact.phoneDisplay}
        </a>
      ),
    },
    {
      icon: IconMail,
      label: "Email Us",
      content: (
        <a href={`mailto:${contact.email}`} className="font-semibold text-charcoal hover:text-forest">
          {contact.email}
        </a>
      ),
    },
    {
      icon: IconPin,
      label: "Visit Our Showroom",
      content: (
        <address className="not-italic leading-snug text-charcoal">
          <span className="block font-semibold">{contact.addressLine1}</span>
          <span className="block text-charcoal-soft">
            {contact.city}, {contact.state === "CT" ? "Connecticut" : contact.state} {contact.postalCode}
          </span>
        </address>
      ),
    },
    {
      icon: IconClock,
      label: "Hours",
      content: <p className="font-semibold text-charcoal">{contact.hoursNote}</p>,
    },
  ] as const;

  return (
    <section className="bg-white py-14 lg:py-20">
      <div className="container-wide grid items-start gap-12 lg:grid-cols-[minmax(0,0.43fr)_minmax(0,0.57fr)] lg:gap-14 xl:gap-16">
        <div>
          <h2 className="heading-display max-w-md text-[clamp(1.85rem,3vw,2.55rem)] text-charcoal">
            {intro.heading}
          </h2>
          <p className="mt-5 max-w-md text-[1.02rem] leading-relaxed text-charcoal-soft">
            {intro.body}
          </p>

          <ul className="mt-9 divide-y divide-border/70 border-y border-border/70">
            {rows.map((row) => {
              const Icon = row.icon;
              return (
                <li key={row.label} className="flex gap-4 py-4">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest-muted text-forest">
                    <Icon className="h-5 w-5" size={20} />
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-xs font-semibold tracking-[0.12em] text-charcoal-soft uppercase">
                      {row.label}
                    </p>
                    <div className="mt-1 text-[1.02rem]">{row.content}</div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 flex gap-2.5">
            <a
              href={social.facebook}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-forest text-white transition hover:bg-forest-deep"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <IconFacebook className="h-4 w-4" size={16} />
            </a>
            <a
              href={social.instagram}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-forest text-white transition hover:bg-forest-deep"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <IconInstagram className="h-4 w-4" size={16} />
            </a>
          </div>
        </div>

        <div className="rounded-2xl bg-ivory-deep/80 p-3 sm:p-5 lg:p-6">
          <QuoteForm
            variant="contact"
            formIdAttr="contact-form"
            defaultService={defaultService}
            copy={{
              heading: form.heading,
              body: form.body,
              submitLabel: form.submitLabel,
              privacyNote: form.privacyNote,
              successMessage: form.successMessage,
              emailSkippedMessage: form.emailSkippedMessage,
              emailFailedMessage: form.emailFailedMessage,
              labels: form.labels,
              placeholders: form.placeholders,
              budgetOptions: form.budgetOptions,
            }}
          />
        </div>
      </div>
    </section>
  );
}

export function ContactMap() {
  const { map } = contactPage;
  const { contact, maps } = siteConfig;
  const embedUrl = maps.googleMapsEmbed;
  const directionsUrl = maps.googleMapsDirections || maps.googleMapsSearch;

  return (
    <section id="showroom" className="scroll-mt-24 bg-ivory py-14 lg:py-16">
      <div className="container-wide">
        <div className="mb-8 grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-0">
          <h2 className="heading-display max-w-md text-[clamp(1.85rem,3vw,2.55rem)] text-charcoal">
            {map.heading}
          </h2>
          <div
            className="mx-10 hidden h-16 w-px bg-border lg:block"
            aria-hidden
          />
          <p className="max-w-md text-[1.05rem] leading-relaxed text-charcoal-soft lg:pl-2">
            {map.body}
          </p>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-border/60 bg-white">
          <div className="relative aspect-[16/9] min-h-[18rem] w-full lg:aspect-[21/9] lg:min-h-[22rem]">
            {embedUrl ? (
              <iframe
                title={map.embedTitle}
                src={embedUrl}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-ivory-deep px-6 text-center text-charcoal-soft">
                <p>
                  Map embed is not configured.{" "}
                  <a
                    href={directionsUrl}
                    className="font-semibold text-forest hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open directions
                  </a>
                </p>
              </div>
            )}
          </div>

          <div className="pointer-events-none absolute inset-0 flex items-end justify-end p-4 sm:p-6 lg:items-center lg:p-8">
            <div className="pointer-events-auto w-full max-w-sm rounded-xl border border-border/70 bg-white p-5 shadow-[0_12px_40px_rgba(28,33,30,0.12)] sm:w-[min(100%,20rem)]">
              <p className="text-xs font-semibold tracking-[0.12em] text-forest uppercase">
                {map.cardLabel}
              </p>
              <p className="mt-2 text-[1.02rem] font-semibold leading-snug text-charcoal">
                {contact.addressLine1}
              </p>
              <p className="mt-1 text-sm text-charcoal-soft">
                {contact.city}, {contact.state} {contact.postalCode}
              </p>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 bg-forest px-4 py-3 text-sm font-semibold text-white transition hover:bg-forest-deep"
              >
                {map.directionsLabel} <span aria-hidden>↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ContactCallStrip() {
  const { callStrip } = contactPage;
  const { contact } = siteConfig;

  return (
    <section className="relative overflow-hidden border-y border-border/50 bg-[#eef4ef]">
      {callStrip.backgroundImage ? (
        <Image
          src={callStrip.backgroundImage}
          alt=""
          fill
          className="pointer-events-none object-cover object-[left_center]"
          sizes="100vw"
          aria-hidden
        />
      ) : null}
      {callStrip.foliageImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={callStrip.foliageImage}
          alt=""
          width={160}
          height={120}
          className="pointer-events-none absolute -left-2 top-1/2 z-[1] hidden w-24 -translate-y-1/2 opacity-40 sm:block"
          aria-hidden
        />
      ) : null}
      <div className="container-wide relative z-10 flex flex-col items-start justify-between gap-6 py-10 sm:flex-row sm:items-center lg:py-11">
        <div className="max-w-xl sm:pl-10 lg:pl-16">
          <h2 className="heading-display text-[clamp(1.55rem,2.5vw,2rem)] text-charcoal">
            {callStrip.heading}
          </h2>
          <p className="mt-2 text-[1.02rem] leading-relaxed text-charcoal-soft">
            {callStrip.body}
          </p>
        </div>
        <a
          href={`tel:${contact.phoneTel}`}
          className="inline-flex shrink-0 items-center gap-3 border border-forest bg-white/70 px-5 py-3.5 text-sm font-semibold text-forest backdrop-blur-sm transition hover:bg-forest hover:text-white"
        >
          <IconPhone className="h-4 w-4" size={16} />
          <span className="flex flex-col items-start leading-tight sm:flex-row sm:items-center sm:gap-2">
            <span>{callStrip.buttonLabel}</span>
            <span className="font-bold">{contact.phoneDisplay}</span>
          </span>
        </a>
      </div>
    </section>
  );
}

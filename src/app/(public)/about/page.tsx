import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/page/Breadcrumbs";
import { CtaBand } from "@/components/page/CtaBand";
import { PageHero } from "@/components/page/PageHero";
import { aboutPage, allTestimonials } from "@/lib/content";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata(
  aboutPage.title,
  aboutPage.body[0] ?? "About Kitchen & Flooring Depot — Newington, CT showroom for kitchens, flooring, and baths.",
);

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow={aboutPage.eyebrow}
        title={aboutPage.headline}
        description={aboutPage.body[0]}
        imageSrc={aboutPage.showroomImage}
        imageAlt="Kitchen & Flooring Depot showroom"
      />
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "About" }]} />
      <section className="bg-white py-14 lg:py-20">
        <div className="container-wide grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-4 text-base leading-relaxed text-charcoal-soft">
            {aboutPage.body.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={aboutPage.showroomImage}
                alt="Showroom kitchen display"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -right-2 -bottom-6 w-[48%] overflow-hidden border-[6px] border-white shadow-sm sm:-right-4 sm:border-8">
              <div className="relative aspect-square">
                <Image
                  src={aboutPage.showroomInset}
                  alt="Cabinet detail"
                  fill
                  sizes="30vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="reviews" className="bg-ivory py-14 lg:py-20 scroll-mt-24">
        <div className="container-wide">
          <p className="eyebrow mb-3">Reviews</p>
          <h2 className="heading-display text-3xl text-charcoal sm:text-4xl">
            What customers share publicly.
          </h2>
          <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {allTestimonials.map((t) => (
              <li key={t.id} className="border border-border bg-white p-6">
                <blockquote className="text-sm italic leading-relaxed text-charcoal-soft">
                  “{t.quote}”
                </blockquote>
                <p className="mt-4 text-sm font-semibold text-charcoal not-italic">{t.name}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-charcoal-soft">
            Quotes are reproduced from the public source website. Star ratings are not shown when
            the source does not publish per-review ratings.
          </p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

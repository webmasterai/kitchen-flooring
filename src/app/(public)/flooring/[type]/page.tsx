import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/page/Breadcrumbs";
import { CtaBand } from "@/components/page/CtaBand";
import { PageHero } from "@/components/page/PageHero";
import { getFlooringType, getService } from "@/lib/content";
import { pageMetadata } from "@/lib/page-metadata";

type Props = { params: Promise<{ type: string }> };

export async function generateStaticParams() {
  const flooring = getService("flooring");
  if (!flooring || !("types" in flooring) || !flooring.types) return [];
  return flooring.types.map((t) => ({ type: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type: slug } = await params;
  const flooringType = getFlooringType(slug);
  if (!flooringType) {
    return pageMetadata("Flooring type not found", "The requested flooring type could not be found.");
  }
  return pageMetadata(
    flooringType.name,
    flooringType.description,
  );
}

export default async function FlooringTypePage({ params }: Props) {
  const { type: slug } = await params;
  const flooringType = getFlooringType(slug);
  const flooring = getService("flooring");
  if (!flooringType || !flooring) notFound();

  return (
    <>
      <PageHero
        eyebrow="Flooring"
        title={flooringType.name}
        description={flooringType.description}
        imageSrc={flooringType.image}
        imageAlt={flooringType.name}
      />
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/services", label: "Services" },
          { href: "/flooring", label: "Flooring" },
          { label: flooringType.name },
        ]}
      />
      <section className="bg-white py-14 lg:py-20">
        <div className="container-wide grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="text-base leading-relaxed text-charcoal-soft">{flooringType.description}</p>
            {flooring.pricingNote ? (
              <p className="mt-6 border-l-2 border-forest/30 pl-4 text-sm text-charcoal-soft">
                {flooring.pricingNote}
              </p>
            ) : null}
          </div>
          <div className="relative aspect-[4/3] overflow-hidden bg-ivory">
            <Image
              src={flooringType.image}
              alt={flooringType.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

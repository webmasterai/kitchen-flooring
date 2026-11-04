import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LightboxGallery } from "@/components/gallery/LightboxGallery";
import { Breadcrumbs } from "@/components/page/Breadcrumbs";
import { CtaBand } from "@/components/page/CtaBand";
import { PageHero } from "@/components/page/PageHero";
import { allProjects, getProject } from "@/lib/content";
import { pageMetadata } from "@/lib/page-metadata";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return allProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) {
    return pageMetadata("Project not found", "This portfolio project could not be found.");
  }
  return pageMetadata(project.title, project.description);
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const galleryImages = project.images.map((src, index) => ({
    id: `${project.id}-${index}`,
    src,
    alt: `${project.title} — photo ${index + 1}`,
  }));

  return (
    <>
      <PageHero
        eyebrow={project.category}
        title={project.title}
        description={project.description}
        imageSrc={project.coverImage}
        imageAlt={project.title}
      />
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/our-work", label: "Portfolio" },
          { label: project.displayTitle || project.title },
        ]}
      />
      <section className="bg-white py-14 lg:py-20">
        <div className="container-wide">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.14em] text-forest uppercase">
              {project.categoryLabel || project.category}
            </p>
            <h2 className="heading-display mt-3 text-3xl text-charcoal sm:text-4xl">
              {project.displayTitle || project.title}
            </h2>
            <p className="mt-4 text-[1.05rem] leading-relaxed text-charcoal-soft">
              {project.displayDescription || project.description}
            </p>
          </div>
          <p className="eyebrow mb-6">Project gallery</p>
          <LightboxGallery images={galleryImages} />
        </div>
      </section>
      <CtaBand
        title="Like what you see?"
        body="Tell us about your kitchen or flooring project — visit our Newington showroom or request a free quote."
      />
    </>
  );
}

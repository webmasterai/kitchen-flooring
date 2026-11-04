"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { ProjectCollage } from "@/components/portfolio/ProjectCollage";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { portfolioPage, publishedProjects, type Project } from "@/lib/content";
import { cn } from "@/lib/cn";

const FILTER_IDS = new Set(portfolioPage.filters.map((f) => f.id));

function projectNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

function ProjectCopy({
  project,
  index,
  align = "start",
}: {
  project: Project;
  index: number;
  align?: "start" | "center";
}) {
  const title = project.displayTitle || project.title;
  const description = project.displayDescription || project.description;
  const categoryLabel = project.categoryLabel || project.category;

  return (
    <div
      className={cn(
        "flex h-full flex-col",
        align === "center" ? "justify-center" : "justify-start pt-1 lg:pt-2",
      )}
    >
      <p className="text-[0.8rem] font-semibold tracking-[0.14em] text-charcoal-soft uppercase">
        {projectNumber(index)} / {categoryLabel}
      </p>
      <span className="mt-3.5 block h-px w-11 bg-gold" aria-hidden />
      <h2 className="heading-display mt-4 max-w-[16ch] text-[clamp(2rem,3.4vw,2.85rem)] leading-[1.08] text-charcoal">
        {title}
      </h2>
      <p className="mt-4 max-w-md text-[1.08rem] leading-relaxed text-charcoal-soft">
        {description}
      </p>
      <Link
        href={`/our-work/${project.slug}`}
        className="mt-5 inline-flex items-center gap-2 text-[1.08rem] font-semibold text-forest hover:text-forest-deep"
      >
        View Project <span aria-hidden>→</span>
      </Link>
    </div>
  );
}

export function PortfolioPageView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const raw = searchParams.get("category") || "all";
  const activeFilter = FILTER_IDS.has(raw) ? raw : "all";
  const pageParam = Number(searchParams.get("page") || "1");
  const page = Number.isFinite(pageParam) && pageParam > 0 ? Math.floor(pageParam) : 1;
  const visibleCount = page * portfolioPage.pageSize;

  const filtered = useMemo(() => {
    if (activeFilter === "all") return publishedProjects;
    return publishedProjects.filter((p) => p.filterId === activeFilter);
  }, [activeFilter]);

  const shown = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visibleCount;

  function replaceParams(next: { category?: string; page?: number }) {
    const params = new URLSearchParams(searchParams.toString());
    const category = next.category ?? activeFilter;
    if (category === "all") params.delete("category");
    else params.set("category", category);
    const pageValue = next.page ?? page;
    if (pageValue <= 1) params.delete("page");
    else params.set("page", String(pageValue));
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function setFilter(id: string) {
    replaceParams({ category: id, page: 1 });
  }

  return (
    <>
      <section className="bg-ivory py-10 lg:py-12">
        <div className="container-wide text-center">
          <p className="inline-flex items-center gap-4 text-xs font-semibold tracking-[0.16em] text-charcoal uppercase">
            <span className="hidden h-px w-10 bg-border sm:block" aria-hidden />
            {portfolioPage.intro.eyebrow}
            <span className="hidden h-px w-10 bg-border sm:block" aria-hidden />
          </p>
          <h1 className="heading-display mt-4 text-[clamp(2.55rem,5vw,3.6rem)] text-charcoal">
            {portfolioPage.intro.heading}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[1.1rem] leading-relaxed text-charcoal-soft">
            {portfolioPage.intro.body}
          </p>

          <div
            role="tablist"
            aria-label="Portfolio categories"
            className="mt-7 flex justify-start gap-5 overflow-x-auto pb-1 sm:justify-center sm:gap-7 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {portfolioPage.filters.map((filter) => {
              const selected = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  className={cn(
                    "shrink-0 pb-2 text-[0.95rem] font-semibold whitespace-nowrap transition",
                    selected
                      ? "text-forest underline decoration-forest decoration-2 underline-offset-[10px]"
                      : "text-charcoal-soft hover:text-forest",
                  )}
                  onClick={() => setFilter(filter.id)}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white pt-6 pb-8 lg:pt-8 lg:pb-10">
        <div className="container-wide">
          {shown.length === 0 ? (
            <p className="py-12 text-center text-charcoal-soft">{portfolioPage.emptyMessage}</p>
          ) : (
            <ul className="divide-y divide-border/70">
              {shown.map((project, index) => {
                const imagesLeft =
                  project.collage === "hero-two-detail" ||
                  project.collage === "single-left";
                const textAlign =
                  project.collage === "hero-two-detail" || project.collage === "single-left"
                    ? "start"
                    : "start";

                return (
                  <li key={project.id} className="py-8 lg:py-10">
                    <div
                      className={cn(
                        "grid items-start gap-7 lg:gap-10",
                        imagesLeft
                          ? "lg:grid-cols-[minmax(0,0.64fr)_minmax(0,0.36fr)]"
                          : "lg:grid-cols-[minmax(0,0.36fr)_minmax(0,0.64fr)]",
                      )}
                    >
                      {imagesLeft ? (
                        <>
                          <ProjectCollage
                            collage={project.collage}
                            images={project.images}
                            title={project.displayTitle || project.title}
                          />
                          <ProjectCopy
                            project={project}
                            index={index}
                            align={textAlign}
                          />
                        </>
                      ) : (
                        <>
                          <ProjectCopy
                            project={project}
                            index={index}
                            align={textAlign}
                          />
                          <ProjectCollage
                            collage={project.collage}
                            images={project.images}
                            title={project.displayTitle || project.title}
                          />
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {hasMore ? (
            <div className="mt-2 flex justify-center pt-2 pb-4 lg:pb-5">
              <button
                type="button"
                className="inline-flex items-center gap-2 border border-forest px-6 py-3 text-sm font-semibold text-forest transition hover:bg-forest hover:text-white"
                onClick={() => replaceParams({ page: page + 1 })}
              >
                {portfolioPage.browseMoreLabel} <span aria-hidden>→</span>
              </button>
            </div>
          ) : null}
        </div>
      </section>

      <section className="bg-ivory py-12 lg:py-14">
        <div className="container-wide text-center">
          <h2 className="heading-display mx-auto max-w-3xl text-[clamp(2rem,3.5vw,2.75rem)] text-charcoal">
            {portfolioPage.cta.heading}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[1.08rem] leading-relaxed text-charcoal-soft">
            {portfolioPage.cta.body}
          </p>
          <ButtonLink href={portfolioPage.cta.buttonHref} className="mt-7 inline-flex">
            {portfolioPage.cta.buttonLabel} <span aria-hidden>→</span>
          </ButtonLink>
        </div>
      </section>
    </>
  );
}

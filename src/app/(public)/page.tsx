import type { Metadata } from "next";
import {
  BenefitsBar,
  Hero,
  ProjectsSection,
  QuoteSection,
  ServicesGrid,
  ShowroomSection,
  TestimonialsSection,
  ValueBand,
} from "@/components/home/HomeSections";
import { homeContent, siteConfig } from "@/lib/content";
import { pageMetadata } from "@/lib/page-metadata";

export function generateMetadata(): Metadata {
  const seo = (homeContent as any).seo;
  return pageMetadata(
    seo?.title || siteConfig.name,
    seo?.description || siteConfig.description,
  );
}

export default function HomePage() {
  const visible = (homeContent as any).visibleSections;
  return (
    <>
      {(!visible || visible.hero !== false) && <Hero />}
      {(!visible || visible.benefits !== false) && <BenefitsBar />}
      {(!visible || visible.services !== false) && <ServicesGrid />}
      {(!visible || visible.showroom !== false) && <ShowroomSection />}
      {(!visible || visible.projects !== false) && <ProjectsSection />}
      {(!visible || visible.value !== false) && <ValueBand />}
      {(!visible || visible.testimonials !== false) && <TestimonialsSection />}
      {(!visible || visible.quote !== false) && <QuoteSection />}
    </>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { PortfolioPageView } from "@/components/portfolio/PortfolioPageView";
import { portfolioPage } from "@/lib/content";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata(
  portfolioPage.title,
  portfolioPage.seoDescription,
);

function PortfolioFallback() {
  return (
    <div className="bg-ivory py-24">
      <div className="container-wide text-center text-charcoal-soft">
        Loading portfolio…
      </div>
    </div>
  );
}

export default function OurWorkPage() {
  return (
    <Suspense fallback={<PortfolioFallback />}>
      <PortfolioPageView />
    </Suspense>
  );
}

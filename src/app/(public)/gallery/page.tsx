import type { Metadata } from "next";
import { Suspense } from "react";
import { GalleryPageView } from "@/components/gallery/GalleryPageView";
import { galleryContent } from "@/lib/content";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata(
  "Gallery",
  galleryContent.hero?.body ||
    "Showcase kitchen and flooring photography from Kitchen & Flooring Depot in Newington, CT — gallery images, not inventoried SKUs.",
);

function GalleryFallback() {
  return (
    <div className="bg-ivory py-24">
      <div className="container-wide">
        <p className="text-charcoal-soft">Loading gallery…</p>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  return (
    <Suspense fallback={<GalleryFallback />}>
      <GalleryPageView />
    </Suspense>
  );
}

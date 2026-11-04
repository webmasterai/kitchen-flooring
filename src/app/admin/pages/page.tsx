"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type PageItem = {
  id: string;
  name: string;
  route: string;
  slug: string;
  category: "Core" | "Service Page" | "Utility";
  description: string;
  hasDraft?: boolean;
};

const pagesList: PageItem[] = [
  { id: "home", name: "Homepage", route: "/", slug: "home", category: "Core", description: "Main landing page, hero carousel, value props, showroom, and CTA." },
  { id: "services", name: "Services Overview", route: "/services", slug: "services", category: "Core", description: "Services overview landing page with primary service cards and intro." },
  { id: "cabinets", name: "Cabinets", route: "/cabinets", slug: "cabinets", category: "Service Page", description: "Cabinet styles, wood/finish swatches, storage features, and gallery." },
  { id: "flooring", name: "Flooring", route: "/flooring", slug: "flooring", category: "Service Page", description: "Hardwood, vinyl, laminate options, finish looks, and lifestyle sections." },
  { id: "countertops", name: "Countertops", route: "/countertops", slug: "countertops", category: "Service Page", description: "Quartz, granite, marble materials, edge profiles, and swatches." },
  { id: "bathroom-vanities", name: "Bathroom Vanities", route: "/bathroom-vanities", slug: "bathroom-vanities", category: "Service Page", description: "Vanity styles, storage solutions, finish/hardware swatches, and sizes." },
  { id: "kitchen-remodel", name: "Kitchen Remodel", route: "/kitchen-remodel", slug: "kitchen-remodel", category: "Service Page", description: "Full kitchen remodeling, process timeline, materials, and consultation." },
  { id: "portfolio", name: "Portfolio Listing", route: "/our-work", slug: "portfolio", category: "Core", description: "Project showcase listing hero, category tabs, and consultation banner." },
  { id: "gallery", name: "Inspiration Gallery", route: "/gallery", slug: "gallery", category: "Core", description: "Category filters, photo masonry, lightboxes, and disclaimer note." },
  { id: "about", name: "About Us", route: "/about", slug: "about", category: "Utility", description: "Company background, showroom story, mission, and team philosophy." },
  { id: "contact", name: "Contact & Directions", route: "/contact", slug: "contact", category: "Utility", description: "Showroom location, consultation form, map coordinates, and opening hours." },
  { id: "faq", name: "Frequently Asked Questions", route: "/faq", slug: "faq", category: "Utility", description: "Customer FAQs, remodeling guides, timelines, and warranty details." },
  { id: "privacy", name: "Privacy Policy", route: "/privacy-policy", slug: "privacy", category: "Utility", description: "Website terms, privacy statements, and customer data policy." },
];

export default function AdminPagesList() {
  const [pages, setPages] = useState<PageItem[]>(pagesList);
  const [filter, setFilter] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check drafts for each page
    async function checkDrafts() {
      const updated = await Promise.all(
        pagesList.map(async (p) => {
          try {
            const apiPath = p.slug === "home" ? "home" : p.slug === "gallery" ? "gallery" : `pages/${p.slug}`;
            const res = await fetch(`/api/admin/content/${apiPath}`);
            const data = await res.json();
            return { ...p, hasDraft: data?.status?.hasDraft || false };
          } catch {
            return p;
          }
        })
      );
      setPages(updated);
      setLoading(false);
    }
    checkDrafts();
  }, []);

  const filtered = filter === "All" ? pages : pages.filter((p) => p.category === filter);

  return (
    <div className="space-y-6">
      {/* Top Heading */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Website Pages</h1>
          <p className="mt-1 text-sm text-gray-500">
            Select any public page to edit its headings, copy, images, features, and layout settings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {["All", "Core", "Service Page", "Utility"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                filter === cat
                  ? "bg-[#028051] text-white shadow-xs"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#028051] border-r-transparent" />
          <p className="mt-3 text-sm text-gray-500 font-medium">Checking page statuses...</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((page) => {
            const editUrl = page.slug === "home" ? "/admin/homepage" : page.slug === "gallery" ? "/admin/gallery" : `/admin/pages/${page.slug}`;
            return (
              <div
                key={page.id}
                className="flex flex-col justify-between rounded-2xl border border-gray-200/90 bg-white p-5 shadow-xs transition hover:border-[#028051]/40 hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[0.68rem] font-bold text-gray-600 uppercase tracking-wider">
                      {page.category}
                    </span>
                    {page.hasDraft ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[0.68rem] font-bold text-amber-700 border border-amber-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        Unpublished Draft
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[0.68rem] font-bold text-emerald-700 border border-emerald-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Live
                      </span>
                    )}
                  </div>

                  <h3 className="mt-3 text-lg font-bold text-gray-900 tracking-tight">{page.name}</h3>
                  <p className="mt-1 text-xs text-gray-500 line-clamp-2 leading-relaxed">{page.description}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-400 truncate max-w-[150px]">{page.route}</span>
                  <div className="flex items-center gap-2">
                    <a
                      href={page.route}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                      title="View live page"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    <Link
                      href={editUrl}
                      className="rounded-xl bg-[#028051] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#016641] transition"
                    >
                      Edit Page
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

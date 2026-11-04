"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { EditorActionBar } from "@/components/admin/EditorActionBar";
import { MediaSelectorModal } from "@/components/admin/MediaSelectorModal";
import type { ContentStatus } from "@/lib/cms-store";

interface PageConfig {
  title: string;
  route: string;
  category: string;
  sections: { id: string; label: string; key?: string }[];
}

const pageConfigs: Record<string, PageConfig> = {
  cabinets: {
    title: "Cabinets Page Editor",
    route: "/cabinets",
    category: "Service Page",
    sections: [
      { id: "hero", label: "Hero Banner", key: "hero" },
      { id: "benefits", label: "Benefits Strip", key: "benefits" },
      { id: "styles", label: "Cabinet Styles", key: "styles" },
      { id: "storage", label: "Storage Feature", key: "storage" },
      { id: "options", label: "Wood & Finish Options", key: "options" },
      { id: "process", label: "Cabinet Process", key: "process" },
      { id: "gallery", label: "Inspiration Gallery", key: "gallery" },
      { id: "cta", label: "Quote CTA", key: "cta" },
      { id: "seo", label: "Page SEO & Settings" },
    ],
  },
  flooring: {
    title: "Flooring Page Editor",
    route: "/flooring",
    category: "Service Page",
    sections: [
      { id: "hero", label: "Hero Banner", key: "hero" },
      { id: "benefits", label: "Benefits Strip", key: "benefits" },
      { id: "options", label: "Flooring Types", key: "options" },
      { id: "lifestyle", label: "Lifestyle & Durability", key: "lifestyle" },
      { id: "finishes", label: "Finishes & Tones", key: "finishes" },
      { id: "process", label: "Flooring Process", key: "process" },
      { id: "gallery", label: "Inspiration Gallery", key: "gallery" },
      { id: "cta", label: "Quote CTA", key: "cta" },
      { id: "seo", label: "Page SEO & Settings" },
    ],
  },
  countertops: {
    title: "Countertops Page Editor",
    route: "/countertops",
    category: "Service Page",
    sections: [
      { id: "hero", label: "Hero Banner", key: "hero" },
      { id: "benefits", label: "Benefits Strip", key: "benefits" },
      { id: "materials", label: "Stone Materials", key: "materials" },
      { id: "feature", label: "Features & Edges", key: "feature" },
      { id: "swatches", label: "Popular Swatches", key: "swatches" },
      { id: "process", label: "Fabrication Process", key: "process" },
      { id: "gallery", label: "Inspiration Gallery", key: "gallery" },
      { id: "cta", label: "Quote CTA", key: "cta" },
      { id: "seo", label: "Page SEO & Settings" },
    ],
  },
  "bathroom-vanities": {
    title: "Bathroom Vanities Page Editor",
    route: "/bathroom-vanities",
    category: "Service Page",
    sections: [
      { id: "hero", label: "Hero Banner", key: "hero" },
      { id: "benefits", label: "Benefits Strip", key: "benefits" },
      { id: "styles", label: "Vanity Styles", key: "styles" },
      { id: "storage", label: "Storage Solutions", key: "storage" },
      { id: "options", label: "Finishes & Hardware", key: "options" },
      { id: "process", label: "Vanity Process", key: "process" },
      { id: "gallery", label: "Inspiration Gallery", key: "gallery" },
      { id: "cta", label: "Quote CTA", key: "cta" },
      { id: "seo", label: "Page SEO & Settings" },
    ],
  },
  "kitchen-remodel": {
    title: "Kitchen Remodel Page Editor",
    route: "/kitchen-remodel",
    category: "Service Page",
    sections: [
      { id: "hero", label: "Hero Banner", key: "hero" },
      { id: "benefits", label: "Benefits Strip", key: "benefits" },
      { id: "storage", label: "Storage & Layout", key: "storage" },
      { id: "materials", label: "Materials Selection", key: "materials" },
      { id: "process", label: "Remodel Timeline", key: "process" },
      { id: "story", label: "Remodel Story", key: "story" },
      { id: "inspiration", label: "Inspiration Gallery", key: "inspiration" },
      { id: "cta", label: "Quote CTA", key: "cta" },
      { id: "seo", label: "Page SEO & Settings" },
    ],
  },
  services: {
    title: "Services Overview Editor",
    route: "/services",
    category: "Core",
    sections: [
      { id: "intro", label: "Intro & Hero", key: "intro" },
      { id: "featureImage", label: "Feature Banner Image", key: "featureImage" },
      { id: "services", label: "Primary Capabilities", key: "services" },
      { id: "benefits", label: "Why Choose Us", key: "benefits" },
      { id: "cta", label: "Consultation CTA", key: "cta" },
      { id: "seo", label: "Page SEO & Settings" },
    ],
  },
  portfolio: {
    title: "Portfolio Overview Editor",
    route: "/our-work",
    category: "Core",
    sections: [
      { id: "intro", label: "Header & Intro", key: "intro" },
      { id: "filters", label: "Filter Categories", key: "filters" },
      { id: "settings", label: "Display Settings" },
      { id: "cta", label: "Consultation CTA", key: "cta" },
      { id: "seo", label: "Page SEO & Settings" },
    ],
  },
  about: {
    title: "About Us Page Editor",
    route: "/about",
    category: "Utility",
    sections: [
      { id: "story", label: "Story & Narrative" },
      { id: "media", label: "Showroom Visuals" },
      { id: "sourceBasis", label: "Philosophy Points" },
      { id: "seo", label: "Page SEO & Settings" },
    ],
  },
  contact: {
    title: "Contact Page Editor",
    route: "/contact",
    category: "Utility",
    sections: [
      { id: "hero", label: "Hero Banner", key: "hero" },
      { id: "intro", label: "Showroom Info", key: "intro" },
      { id: "callStrip", label: "Phone Call Strip", key: "callStrip" },
      { id: "map", label: "Map & Directions", key: "map" },
      { id: "form", label: "Consultation Form", key: "form" },
      { id: "seo", label: "Page SEO & Settings" },
    ],
  },
  faq: {
    title: "FAQ Page Editor",
    route: "/faq",
    category: "Utility",
    sections: [
      { id: "intro", label: "Hero Header", key: "intro" },
      { id: "items", label: "FAQ Questions & Answers", key: "items" },
      { id: "seo", label: "Page SEO & Settings" },
    ],
  },
  privacy: {
    title: "Privacy Policy Editor",
    route: "/privacy-policy",
    category: "Utility",
    sections: [
      { id: "header", label: "Policy Header" },
      { id: "sections", label: "Policy Clauses", key: "sections" },
      { id: "seo", label: "Page SEO & Settings" },
    ],
  },
};

function moveItem<T>(list: T[], index: number, direction: "up" | "down"): T[] {
  const target = direction === "up" ? index - 1 : index + 1;
  if (target < 0 || target >= list.length) return list;
  const clone = [...list];
  const [removed] = clone.splice(index, 1);
  clone.splice(target, 0, removed);
  return clone;
}

export default function AdminPageSlugEditor({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const meta = pageConfigs[slug] || {
    title: `${slug} Editor`,
    route: `/${slug}`,
    category: "Page",
    sections: [{ id: "hero", label: "Hero" }, { id: "seo", label: "SEO" }],
  };

  const [data, setData] = useState<Record<string, any> | null>(null);
  const [status, setStatus] = useState<ContentStatus>({ hasDraft: false });
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string>(meta.sections[0]?.id || "hero");

  // Media selector modal
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/content/pages/${slug}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.ok) {
          setData(resData.data);
          setStatus(resData.status);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  async function handleSaveDraft() {
    if (!data) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/content/pages/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const resJson = await res.json();
      if (resJson.ok) {
        setStatus(resJson.status);
        setIsDirty(false);
        alert("Draft saved successfully!");
      } else {
        alert(resJson.error || "Failed to save draft");
      }
    } catch {
      alert("Error saving draft");
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    if (!data) return;
    if (!confirm(`Are you sure you want to publish live updates to ${meta.title}?`)) return;
    setPublishing(true);
    try {
      const res = await fetch(`/api/admin/content/pages/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const resJson = await res.json();
      if (resJson.ok) {
        setStatus(resJson.status);
        setIsDirty(false);
        alert("Published live successfully!");
      } else {
        alert(resJson.error || "Failed to publish");
      }
    } catch {
      alert("Error publishing");
    } finally {
      setPublishing(false);
    }
  }

  async function handleDiscardDraft() {
    const res = await fetch(`/api/admin/content/pages/${slug}`, { method: "DELETE" });
    if (res.ok) {
      const r = await fetch(`/api/admin/content/pages/${slug}?draft=false`);
      const d = await r.json();
      if (d.ok) {
        setData(d.data);
        setStatus(d.status);
        setIsDirty(false);
      }
    }
  }

  function updateField(pathStr: string, value: any) {
    setData((prev) => {
      if (!prev) return prev;
      const clone = JSON.parse(JSON.stringify(prev));
      const parts = pathStr.split(".");
      let cur = clone;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!cur[parts[i]]) cur[parts[i]] = {};
        cur = cur[parts[i]];
      }
      cur[parts[parts.length - 1]] = value;
      return clone;
    });
    setIsDirty(true);
  }

  function isSectionVisible(sectionId: string): boolean {
    if (!data) return true;
    if (sectionId === "seo" || sectionId === "settings") return true;
    if (Array.isArray(data.visibleSections)) {
      return data.visibleSections.includes(sectionId);
    }
    if (data.visibleSections && typeof data.visibleSections === "object") {
      return data.visibleSections[sectionId] !== false;
    }
    return true;
  }

  function toggleSectionVisibility(sectionId: string) {
    if (!data) return;
    if (Array.isArray(data.visibleSections)) {
      const exists = data.visibleSections.includes(sectionId);
      const updated = exists
        ? data.visibleSections.filter((s: string) => s !== sectionId)
        : [...data.visibleSections, sectionId];
      updateField("visibleSections", updated);
    } else if (data.visibleSections && typeof data.visibleSections === "object") {
      const current = data.visibleSections[sectionId] !== false;
      updateField(`visibleSections.${sectionId}`, !current);
    } else {
      // Initialize visibleSections array
      const allIds = meta.sections.map((s) => s.id).filter((id) => id !== "seo" && id !== "settings");
      const updated = allIds.filter((id) => id !== sectionId);
      updateField("visibleSections", updated);
    }
  }

  if (loading || !data) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#015335] border-r-transparent" />
        <p className="mt-3 text-sm font-medium text-gray-500">Loading {meta.title}...</p>
      </div>
    );
  }

  const activeIdx = meta.sections.findIndex((s) => s.id === activeSectionId);
  const activeSection = meta.sections[activeIdx] || meta.sections[0];
  const prevSection = activeIdx > 0 ? meta.sections[activeIdx - 1] : null;
  const nextSection = activeIdx < meta.sections.length - 1 ? meta.sections[activeIdx + 1] : null;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Link href="/admin/pages" className="hover:text-gray-900 transition font-medium">
            Pages
          </Link>
          <span>/</span>
          <span className="font-semibold text-gray-800">{meta.title}</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/header-announcement"
            className="text-xs text-[#015335] hover:underline font-medium"
          >
            Edit Header & Strip →
          </Link>
          <span className="text-gray-300">|</span>
          <Link
            href="/admin/footer"
            className="text-xs text-[#015335] hover:underline font-medium"
          >
            Edit Footer →
          </Link>
        </div>
      </div>

      <EditorActionBar
        title={meta.title}
        previewRoute={meta.route}
        status={status}
        isDirty={isDirty}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        onDiscardDraft={status.hasDraft ? handleDiscardDraft : undefined}
        saving={saving}
        publishing={publishing}
      />

      {/* Main 2-Column Section Layout: Left = Section Navigator, Right = Section Form */}
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* ================= SECTION NAVIGATOR ================= */}
        <aside className="space-y-3">
          <div className="rounded-md border border-gray-200 bg-white p-4 shadow-xs space-y-3">
            <div className="border-b border-gray-100 pb-2.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700">Section Navigator</h2>
              <p className="text-[0.72rem] text-gray-500">Frontend sections in exact scroll order.</p>
            </div>

            <nav className="space-y-1" aria-label="Sections in frontend order">
              {meta.sections.map((sec, idx) => {
                const isSelected = activeSectionId === sec.id;
                const isVis = isSectionVisible(sec.id);
                const isConfigurable = sec.id !== "seo" && sec.id !== "settings";

                return (
                  <button
                    key={sec.id}
                    id={`sec-nav-${sec.id}`}
                    type="button"
                    className={`group w-full flex items-center justify-between rounded-md px-3 py-2 text-xs font-medium transition cursor-pointer text-left ${
                      isSelected
                        ? "bg-[#015335] text-white shadow-xs"
                        : "text-gray-700 hover:bg-gray-100 bg-white"
                    }`}
                    onClick={() => setActiveSectionId(sec.id)}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`inline-block w-4 text-[0.7rem] font-bold ${isSelected ? "text-white/70" : "text-gray-400"}`}>
                        {idx + 1}.
                      </span>
                      <span className="truncate">{sec.label}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isConfigurable && (
                        <span
                          className={`rounded px-1.5 py-0.5 text-[0.62rem] font-bold uppercase ${
                            isSelected
                              ? isVis
                                ? "bg-white/20 text-white"
                                : "bg-amber-400 text-gray-900"
                              : isVis
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {isVis ? "Visible" : "Hidden"}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </nav>

            <div className="pt-2 border-t border-gray-100 space-y-1 text-[0.72rem] text-gray-500">
              <p>
                <strong>Tip:</strong> Hidden sections stay in CMS with all content preserved and can be enabled any time.
              </p>
            </div>
          </div>
        </aside>

        {/* ================= ACTIVE SECTION FORM ================= */}
        <main className="space-y-6">
          <div className="rounded-md border border-gray-200 bg-white p-6 shadow-xs">
            {/* Section Header with Visibility Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase text-[#015335]">Section {activeIdx + 1} of {meta.sections.length}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs text-gray-500">{meta.title}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mt-0.5">{activeSection.label}</h3>
              </div>

              {activeSection.id !== "seo" && activeSection.id !== "settings" && (
                <label className="flex items-center gap-2.5 rounded-md border border-gray-200 bg-gray-50/80 px-3 py-1.5 cursor-pointer hover:bg-gray-100 transition">
                  <span className="text-xs font-bold text-gray-700">Display on Public Page:</span>
                  <input
                    type="checkbox"
                    checked={isSectionVisible(activeSection.id)}
                    onChange={() => toggleSectionVisibility(activeSection.id)}
                    className="h-4 w-4 rounded-md border-gray-300 text-[#015335] focus:ring-[#015335] cursor-pointer"
                  />
                  <span className={`text-xs font-bold ${isSectionVisible(activeSection.id) ? "text-[#015335]" : "text-amber-700"}`}>
                    {isSectionVisible(activeSection.id) ? "Visible" : "Hidden"}
                  </span>
                </label>
              )}
            </div>

            {/* Hidden Notice if section is hidden */}
            {!isSectionVisible(activeSection.id) && activeSection.id !== "seo" && activeSection.id !== "settings" && (
              <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
                <span className="text-amber-600 font-bold text-sm">ⓘ</span>
                <div>
                  <strong>Section Currently Hidden on Live Website:</strong> All content, images, and swatches below are preserved and editable. Check &ldquo;Display on Public Page&rdquo; above to publish this section to the frontend.
                </div>
              </div>
            )}

            {/* ===================== HERO BANNER ===================== */}
            {activeSection.id === "hero" && data.hero && (
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Eyebrow</label>
                    <input
                      type="text"
                      value={data.hero.eyebrow || ""}
                      onChange={(e) => updateField("hero.eyebrow", e.target.value)}
                      className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Heading Line 1</label>
                    <input
                      type="text"
                      value={data.hero.headingLine1 || ""}
                      onChange={(e) => updateField("hero.headingLine1", e.target.value)}
                      className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Heading Line 2</label>
                    <input
                      type="text"
                      value={data.hero.headingLine2 || ""}
                      onChange={(e) => updateField("hero.headingLine2", e.target.value)}
                      className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">CTA Button Label</label>
                    <input
                      type="text"
                      value={data.hero.ctaLabel || data.hero.cta?.label || ""}
                      onChange={(e) => updateField(data.hero.ctaLabel !== undefined ? "hero.ctaLabel" : "hero.cta.label", e.target.value)}
                      className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">CTA Destination (Href)</label>
                    <input
                      type="text"
                      value={data.hero.ctaHref || data.hero.cta?.href || ""}
                      onChange={(e) => updateField(data.hero.ctaHref !== undefined ? "hero.ctaHref" : "hero.cta.href", e.target.value)}
                      className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Hero Lead Paragraph / Body</label>
                  <textarea
                    rows={3}
                    value={data.hero.body || ""}
                    onChange={(e) => updateField("hero.body", e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                  />
                </div>

                {data.hero.image && (
                  <div className="pt-4 border-t border-gray-100">
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Hero Banner Image</label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="relative h-32 w-48 rounded-md overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                        <Image
                          src={data.hero.image.src || "/media/logo/kfd-logo.jpg"}
                          alt={data.hero.image.alt || ""}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-2 flex-1 w-full">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setMediaTarget("hero.image.src");
                              setMediaModalOpen(true);
                            }}
                            className="rounded-md bg-white border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"
                          >
                            Replace Image
                          </button>
                          <span className="text-xs text-gray-400 font-mono truncate">{data.hero.image.src}</span>
                        </div>
                        <input
                          type="text"
                          placeholder="Image Alt Text (accurate visual description)"
                          value={data.hero.image.alt || ""}
                          onChange={(e) => updateField("hero.image.alt", e.target.value)}
                          className="w-full rounded-md border border-gray-300 p-2 text-xs text-gray-900"
                        />
                        <input
                          type="text"
                          placeholder="Focal Point (e.g. center 50%)"
                          value={data.hero.image.objectPosition || ""}
                          onChange={(e) => updateField("hero.image.objectPosition", e.target.value)}
                          className="w-full rounded-md border border-gray-300 p-2 text-xs text-gray-900"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ===================== BENEFITS STRIP ===================== */}
            {activeSection.id === "benefits" && data.benefits && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Benefits Strip Items</h4>
                    <p className="text-xs text-gray-500">Horizontal 3-column value propositions displayed beneath hero.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const items = Array.isArray(data.benefits) ? data.benefits : data.benefits.items || [];
                      const newItems = [...items, { id: `benefit-${Date.now()}`, icon: "tools", title: "New Benefit", body: "Benefit description." }];
                      if (Array.isArray(data.benefits)) updateField("benefits", newItems);
                      else updateField("benefits.items", newItems);
                    }}
                    className="rounded-md bg-[#015335] px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#028051]"
                  >
                    + Add Benefit
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {(Array.isArray(data.benefits) ? data.benefits : data.benefits.items || []).map((item: any, idx: number) => {
                    const prefix = Array.isArray(data.benefits) ? `benefits.${idx}` : `benefits.items.${idx}`;
                    const list = Array.isArray(data.benefits) ? data.benefits : data.benefits.items || [];
                    return (
                      <div key={item.id || idx} className="rounded-md border border-gray-200 p-4 bg-gray-50/50 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[0.68rem] font-bold text-gray-500 uppercase">Item #{idx + 1}</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                const updated = moveItem(list, idx, "up");
                                if (Array.isArray(data.benefits)) updateField("benefits", updated);
                                else updateField("benefits.items", updated);
                              }}
                              disabled={idx === 0}
                              className="text-xs text-gray-500 hover:text-gray-900 disabled:opacity-30"
                              title="Move Up"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = moveItem(list, idx, "down");
                                if (Array.isArray(data.benefits)) updateField("benefits", updated);
                                else updateField("benefits.items", updated);
                              }}
                              disabled={idx === list.length - 1}
                              className="text-xs text-gray-500 hover:text-gray-900 disabled:opacity-30"
                              title="Move Down"
                            >
                              ↓
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = list.filter((_: any, i: number) => i !== idx);
                                if (Array.isArray(data.benefits)) updateField("benefits", updated);
                                else updateField("benefits.items", updated);
                              }}
                              className="text-xs text-red-600 hover:underline ml-2"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[0.68rem] font-bold text-gray-700 uppercase mb-1">Title</label>
                          <input
                            type="text"
                            value={item.title || ""}
                            onChange={(e) => updateField(`${prefix}.title`, e.target.value)}
                            className="w-full rounded-md border border-gray-300 bg-white p-2 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[0.68rem] font-bold text-gray-700 uppercase mb-1">Icon Key</label>
                          <select
                            value={item.icon || "cabinet"}
                            onChange={(e) => updateField(`${prefix}.icon`, e.target.value)}
                            className="w-full rounded-md border border-gray-300 bg-white p-2 text-xs"
                          >
                            <option value="cabinet">Cabinet (Storage)</option>
                            <option value="brush">Brush (Finishes)</option>
                            <option value="tools">Tools (Installation)</option>
                            <option value="diamond">Diamond (Quality)</option>
                            <option value="leaf">Leaf (Eco/Wood)</option>
                            <option value="people">People (Team)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[0.68rem] font-bold text-gray-700 uppercase mb-1">Description</label>
                          <textarea
                            rows={2}
                            value={item.body || ""}
                            onChange={(e) => updateField(`${prefix}.body`, e.target.value)}
                            className="w-full rounded-md border border-gray-300 bg-white p-2 text-xs"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ===================== STYLES / TYPES / MATERIALS ===================== */}
            {(activeSection.id === "styles" || activeSection.id === "materials" || (activeSection.id === "options" && slug === "flooring")) && (
              <div className="space-y-6">
                {(() => {
                  const secKey = data.styles ? "styles" : data.materials ? "materials" : "options";
                  const sec = data[secKey] || {};
                  const items = sec.items || [];

                  return (
                    <>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Section Heading</label>
                          <input
                            type="text"
                            value={sec.heading || ""}
                            onChange={(e) => updateField(`${secKey}.heading`, e.target.value)}
                            className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                          />
                        </div>
                        <div className="flex items-end justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              const newItems = [
                                ...items,
                                {
                                  id: `style-${Date.now()}`,
                                  title: "New Style",
                                  href: "/gallery?category=cabinets",
                                  image: { src: "/media/gallery/Jeff2-scaled-qrha9z4ool25y1sz8phe1hhazocoglfiyb0pufpnxs.jpg", alt: "Style image", objectPosition: "center" },
                                  detail: { heading: "Style Details", body: "Detailed description of style lines and character." },
                                },
                              ];
                              updateField(`${secKey}.items`, newItems);
                            }}
                            className="rounded-md bg-[#015335] px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#028051]"
                          >
                            + Add Style Card
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4 pt-2">
                        <h4 className="text-xs font-bold text-gray-500 uppercase">Style Cards ({items.length})</h4>
                        <div className="grid gap-5 lg:grid-cols-3">
                          {items.map((card: any, idx: number) => (
                            <div key={card.id || idx} className="rounded-md border border-gray-200 p-4 bg-gray-50/50 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-[#015335]">Card #{idx + 1}</span>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => updateField(`${secKey}.items`, moveItem(items, idx, "up"))}
                                    disabled={idx === 0}
                                    className="text-xs text-gray-500 hover:text-gray-900 disabled:opacity-30"
                                    title="Move Left/Up"
                                  >
                                    ←
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updateField(`${secKey}.items`, moveItem(items, idx, "down"))}
                                    disabled={idx === items.length - 1}
                                    className="text-xs text-gray-500 hover:text-gray-900 disabled:opacity-30"
                                    title="Move Right/Down"
                                  >
                                    →
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = items.filter((_: any, i: number) => i !== idx);
                                      updateField(`${secKey}.items`, updated);
                                    }}
                                    className="text-xs text-red-600 hover:underline ml-2"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>

                              {card.image && (
                                <div className="space-y-1.5">
                                  <div className="relative aspect-[16/10] rounded-md overflow-hidden bg-gray-200">
                                    <Image src={card.image.src || "/media/logo/kfd-logo.jpg"} alt={card.image.alt || ""} fill sizes="300px" className="object-cover" />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setMediaTarget(`${secKey}.items.${idx}.image.src`);
                                      setMediaModalOpen(true);
                                    }}
                                    className="w-full rounded-md bg-white border border-gray-300 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                                  >
                                    Replace Image
                                  </button>
                                  <input
                                    type="text"
                                    placeholder="Image Alt Text"
                                    value={card.image.alt || ""}
                                    onChange={(e) => updateField(`${secKey}.items.${idx}.image.alt`, e.target.value)}
                                    className="w-full rounded-md border border-gray-300 bg-white p-1 text-xs"
                                  />
                                </div>
                              )}

                              <div>
                                <label className="block text-[0.68rem] font-bold text-gray-700 uppercase mb-0.5">Card Title</label>
                                <input
                                  type="text"
                                  value={card.title || ""}
                                  onChange={(e) => updateField(`${secKey}.items.${idx}.title`, e.target.value)}
                                  className="w-full rounded-md border border-gray-300 bg-white p-2 text-xs font-semibold"
                                />
                              </div>

                              <div>
                                <label className="block text-[0.68rem] font-bold text-gray-700 uppercase mb-0.5">Gallery Link (Href)</label>
                                <input
                                  type="text"
                                  value={card.href || ""}
                                  onChange={(e) => updateField(`${secKey}.items.${idx}.href`, e.target.value)}
                                  className="w-full rounded-md border border-gray-300 bg-white p-2 text-xs"
                                />
                              </div>

                              {card.detail && (
                                <div className="pt-2 border-t border-gray-200/80 space-y-2">
                                  <div>
                                    <label className="block text-[0.68rem] font-bold text-gray-700 uppercase mb-0.5">Expandable Detail Heading</label>
                                    <input
                                      type="text"
                                      value={card.detail.heading || ""}
                                      onChange={(e) => updateField(`${secKey}.items.${idx}.detail.heading`, e.target.value)}
                                      className="w-full rounded-md border border-gray-300 bg-white p-1.5 text-xs font-medium"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[0.68rem] font-bold text-gray-700 uppercase mb-0.5">Expandable Detail Body</label>
                                    <textarea
                                      rows={3}
                                      value={card.detail.body || ""}
                                      onChange={(e) => updateField(`${secKey}.items.${idx}.detail.body`, e.target.value)}
                                      className="w-full rounded-md border border-gray-300 bg-white p-1.5 text-xs"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {/* ===================== STORAGE FEATURE ===================== */}
            {(activeSection.id === "storage" || activeSection.id === "feature" || activeSection.id === "lifestyle") && (
              <div className="space-y-6">
                {(() => {
                  const secKey = data.storage ? "storage" : data.feature ? "feature" : "lifestyle";
                  const sec = data[secKey] || {};

                  return (
                    <>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Heading Line 1</label>
                          <input
                            type="text"
                            value={sec.headingLine1 || sec.heading || ""}
                            onChange={(e) => updateField(sec.headingLine1 !== undefined ? `${secKey}.headingLine1` : `${secKey}.heading`, e.target.value)}
                            className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Heading Line 2</label>
                          <input
                            type="text"
                            value={sec.headingLine2 || ""}
                            onChange={(e) => updateField(`${secKey}.headingLine2`, e.target.value)}
                            className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Paragraph Description</label>
                        <textarea
                          rows={3}
                          value={sec.body || ""}
                          onChange={(e) => updateField(`${secKey}.body`, e.target.value)}
                          className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                        />
                      </div>

                      {sec.image && (
                        <div className="pt-4 border-t border-gray-100">
                          <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Feature Showcase Image</label>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="relative h-32 w-48 rounded-md overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                              <Image
                                src={sec.image.src || "/media/logo/kfd-logo.jpg"}
                                alt={sec.image.alt || ""}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="space-y-2 flex-1 w-full">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setMediaTarget(`${secKey}.image.src`);
                                    setMediaModalOpen(true);
                                  }}
                                  className="rounded-md bg-white border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"
                                >
                                  Replace Image
                                </button>
                                <span className="text-xs text-gray-400 font-mono truncate">{sec.image.src}</span>
                              </div>
                              <input
                                type="text"
                                placeholder="Image Alt Text"
                                value={sec.image.alt || ""}
                                onChange={(e) => updateField(`${secKey}.image.alt`, e.target.value)}
                                className="w-full rounded-md border border-gray-300 p-2 text-xs text-gray-900"
                              />
                              <input
                                type="text"
                                placeholder="Focal Point (e.g. center 45%)"
                                value={sec.image.objectPosition || ""}
                                onChange={(e) => updateField(`${secKey}.image.objectPosition`, e.target.value)}
                                className="w-full rounded-md border border-gray-300 p-2 text-xs text-gray-900"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}

            {/* ===================== WOOD & FINISH OPTIONS ===================== */}
            {activeSection.id === "options" && slug !== "flooring" && data.options && (
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Section Heading</label>
                    <input
                      type="text"
                      value={data.options.heading || ""}
                      onChange={(e) => updateField("options.heading", e.target.value)}
                      className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Helper Note</label>
                    <input
                      type="text"
                      value={data.options.note || ""}
                      onChange={(e) => updateField("options.note", e.target.value)}
                      className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                    />
                  </div>
                </div>

                {/* Woods */}
                {data.options.woods && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-gray-700 uppercase">{data.options.woodsHeading || "Wood Options"} ({data.options.woods.length})</h4>
                        <p className="text-[0.72rem] text-gray-500">Individual wood species swatches with lightbox preview.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newWoods = [
                            ...data.options.woods,
                            { id: `wood-${Date.now()}`, label: "New Wood", order: data.options.woods.length + 1, visible: true, image: { src: "", alt: "Wood swatch" } },
                          ];
                          updateField("options.woods", newWoods);
                        }}
                        className="rounded-md bg-[#015335] px-3 py-1 text-xs font-semibold text-white shadow-xs"
                      >
                        + Add Wood
                      </button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
                      {data.options.woods.map((sw: any, idx: number) => (
                        <div key={sw.id || idx} className="rounded-md border border-gray-200 p-2.5 bg-gray-50/50 space-y-2">
                          <div className="relative aspect-square rounded-md overflow-hidden bg-gray-200 border border-gray-300">
                            {sw.image?.src ? (
                              <Image src={sw.image.src} alt={sw.label} fill sizes="120px" className="object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center p-2 text-center text-[0.62rem] text-gray-400">
                                No image
                              </div>
                            )}
                          </div>
                          <input
                            type="text"
                            value={sw.label || ""}
                            onChange={(e) => updateField(`options.woods.${idx}.label`, e.target.value)}
                            className="w-full rounded-md border border-gray-300 bg-white p-1 text-xs font-bold text-center"
                          />
                          <div className="flex items-center justify-between text-[0.68rem] pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                setMediaTarget(`options.woods.${idx}.image.src`);
                                setMediaModalOpen(true);
                              }}
                              className="text-[#015335] font-semibold hover:underline"
                            >
                              Image
                            </button>
                            <label className="flex items-center gap-1 cursor-pointer">
                              <span>Vis:</span>
                              <input
                                type="checkbox"
                                checked={sw.visible !== false}
                                onChange={(e) => updateField(`options.woods.${idx}.visible`, e.target.checked)}
                                className="h-3 w-3 rounded text-[#015335]"
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = data.options.woods.filter((_: any, i: number) => i !== idx);
                                updateField("options.woods", updated);
                              }}
                              className="text-red-600 hover:underline"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Finishes */}
                {data.options.finishes && (
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-gray-700 uppercase">{data.options.finishesHeading || "Finish Options"} ({data.options.finishes.length})</h4>
                        <p className="text-[0.72rem] text-gray-500">Finish tone swatches with lightbox preview.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newFinishes = [
                            ...data.options.finishes,
                            { id: `finish-${Date.now()}`, label: "New Finish", order: data.options.finishes.length + 1, visible: true, image: { src: "", alt: "Finish sample" } },
                          ];
                          updateField("options.finishes", newFinishes);
                        }}
                        className="rounded-md bg-[#015335] px-3 py-1 text-xs font-semibold text-white shadow-xs"
                      >
                        + Add Finish
                      </button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-4">
                      {data.options.finishes.map((sw: any, idx: number) => (
                        <div key={sw.id || idx} className="rounded-md border border-gray-200 p-2.5 bg-gray-50/50 space-y-2">
                          <div className="relative aspect-square rounded-md overflow-hidden bg-gray-200 border border-gray-300">
                            {sw.image?.src ? (
                              <Image src={sw.image.src} alt={sw.label} fill sizes="150px" className="object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center p-2 text-center text-[0.62rem] text-gray-400">
                                No image
                              </div>
                            )}
                          </div>
                          <input
                            type="text"
                            value={sw.label || ""}
                            onChange={(e) => updateField(`options.finishes.${idx}.label`, e.target.value)}
                            className="w-full rounded-md border border-gray-300 bg-white p-1 text-xs font-bold text-center"
                          />
                          <div className="flex items-center justify-between text-[0.68rem] pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                setMediaTarget(`options.finishes.${idx}.image.src`);
                                setMediaModalOpen(true);
                              }}
                              className="text-[#015335] font-semibold hover:underline"
                            >
                              Image
                            </button>
                            <label className="flex items-center gap-1 cursor-pointer">
                              <span>Vis:</span>
                              <input
                                type="checkbox"
                                checked={sw.visible !== false}
                                onChange={(e) => updateField(`options.finishes.${idx}.visible`, e.target.checked)}
                                className="h-3 w-3 rounded text-[#015335]"
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = data.options.finishes.filter((_: any, i: number) => i !== idx);
                                updateField("options.finishes", updated);
                              }}
                              className="text-red-600 hover:underline"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ===================== PROCESS STEPS ===================== */}
            {activeSection.id === "process" && data.process && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Cabinet Process Timeline</h4>
                    <p className="text-xs text-gray-500">Step-by-step guidance showing each numbered stage.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const steps = data.process.steps || [];
                      const newSteps = [
                        ...steps,
                        { number: `${steps.length + 1}`, title: "New Step", body: "Step description." },
                      ];
                      updateField("process.steps", newSteps);
                    }}
                    className="rounded-md bg-[#015335] px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#028051]"
                  >
                    + Add Step
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Section Heading</label>
                  <input
                    type="text"
                    value={data.process.heading || data.process.intro?.heading || ""}
                    onChange={(e) => updateField(data.process.heading !== undefined ? "process.heading" : "process.intro.heading", e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                  />
                </div>

                <div className="space-y-3">
                  {(data.process.steps || []).map((step: any, idx: number) => {
                    const steps = data.process.steps || [];
                    return (
                      <div key={idx} className="rounded-md border border-gray-200 p-4 bg-gray-50/50 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#015335]">Step {step.number || step.step || idx + 1}</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => updateField("process.steps", moveItem(steps, idx, "up"))}
                              disabled={idx === 0}
                              className="text-xs text-gray-500 hover:text-gray-900 disabled:opacity-30"
                              title="Move Up"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              onClick={() => updateField("process.steps", moveItem(steps, idx, "down"))}
                              disabled={idx === steps.length - 1}
                              className="text-xs text-gray-500 hover:text-gray-900 disabled:opacity-30"
                              title="Move Down"
                            >
                              ↓
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = steps.filter((_: any, i: number) => i !== idx);
                                updateField("process.steps", updated);
                              }}
                              className="text-xs text-red-600 hover:underline ml-2"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-4">
                          <div>
                            <label className="block text-[0.68rem] font-bold text-gray-600 uppercase mb-0.5">Number</label>
                            <input
                              type="text"
                              value={step.number || step.step || ""}
                              onChange={(e) => updateField(`process.steps.${idx}.number`, e.target.value)}
                              className="w-full rounded-md border border-gray-300 bg-white p-2 text-xs font-bold"
                            />
                          </div>
                          <div className="sm:col-span-3">
                            <label className="block text-[0.68rem] font-bold text-gray-600 uppercase mb-0.5">Step Title</label>
                            <input
                              type="text"
                              value={step.title || ""}
                              onChange={(e) => updateField(`process.steps.${idx}.title`, e.target.value)}
                              className="w-full rounded-md border border-gray-300 bg-white p-2 text-xs font-semibold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[0.68rem] font-bold text-gray-600 uppercase mb-0.5">Step Description</label>
                          <textarea
                            rows={2}
                            value={step.body || ""}
                            onChange={(e) => updateField(`process.steps.${idx}.body`, e.target.value)}
                            className="w-full rounded-md border border-gray-300 bg-white p-2 text-xs"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ===================== INSPIRATION GALLERY ===================== */}
            {(activeSection.id === "gallery" || activeSection.id === "inspiration") && (data.gallery || data.inspiration) && (
              <div className="space-y-6">
                {(() => {
                  const secKey = data.gallery ? "gallery" : "inspiration";
                  const sec = data[secKey] || {};
                  const images = sec.images || sec.items || [];
                  const listKey = sec.images ? `${secKey}.images` : `${secKey}.items`;

                  return (
                    <>
                      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">Inspiration Gallery</h4>
                          <p className="text-xs text-gray-500">Curated showcase photographs with lightbox triggers.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newImgs = [
                              ...images,
                              {
                                id: `insp-${Date.now()}`,
                                src: "/media/gallery/Jeff2-scaled-qrha9z4ool25y1sz8phe1hhazocoglfiyb0pufpnxs.jpg",
                                alt: "Cabinetry inspiration",
                                caption: "New cabinetry design",
                                objectPosition: "center",
                              },
                            ];
                            updateField(listKey, newImgs);
                          }}
                          className="rounded-md bg-[#015335] px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#028051]"
                        >
                          + Add Photo
                        </button>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Section Heading</label>
                        <input
                          type="text"
                          value={sec.heading || ""}
                          onChange={(e) => updateField(`${secKey}.heading`, e.target.value)}
                          className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3">
                        {images.map((img: any, idx: number) => (
                          <div key={img.id || idx} className="rounded-md border border-gray-200 p-3 bg-gray-50/50 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[0.68rem] font-bold text-gray-500 uppercase">Photo #{idx + 1}</span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => updateField(listKey, moveItem(images, idx, "up"))}
                                  disabled={idx === 0}
                                  className="text-xs text-gray-500 hover:text-gray-900 disabled:opacity-30"
                                  title="Move Left"
                                >
                                  ←
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateField(listKey, moveItem(images, idx, "down"))}
                                  disabled={idx === images.length - 1}
                                  className="text-xs text-gray-500 hover:text-gray-900 disabled:opacity-30"
                                  title="Move Right"
                                >
                                  →
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = images.filter((_: any, i: number) => i !== idx);
                                    updateField(listKey, updated);
                                  }}
                                  className="text-xs text-red-600 hover:underline ml-2"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>

                            <div className="relative aspect-[16/10] rounded-md overflow-hidden bg-gray-200">
                              <Image src={img.src} alt={img.alt || ""} fill sizes="300px" className="object-cover" />
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setMediaTarget(`${listKey}.${idx}.src`);
                                setMediaModalOpen(true);
                              }}
                              className="w-full rounded-md bg-white border border-gray-300 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                            >
                              Replace Image
                            </button>

                            <div>
                              <label className="block text-[0.62rem] font-bold text-gray-500 uppercase">Caption</label>
                              <input
                                type="text"
                                placeholder="Caption text"
                                value={img.caption || ""}
                                onChange={(e) => updateField(`${listKey}.${idx}.caption`, e.target.value)}
                                className="w-full rounded-md border border-gray-300 bg-white p-1.5 text-xs font-medium"
                              />
                            </div>

                            <div>
                              <label className="block text-[0.62rem] font-bold text-gray-500 uppercase">Alt Text</label>
                              <input
                                type="text"
                                placeholder="Alt text"
                                value={img.alt || ""}
                                onChange={(e) => updateField(`${listKey}.${idx}.alt`, e.target.value)}
                                className="w-full rounded-md border border-gray-300 bg-white p-1.5 text-xs"
                              />
                            </div>

                            <div>
                              <label className="block text-[0.62rem] font-bold text-gray-500 uppercase">Focal Point</label>
                              <input
                                type="text"
                                placeholder="e.g. center 40%"
                                value={img.objectPosition || ""}
                                onChange={(e) => updateField(`${listKey}.${idx}.objectPosition`, e.target.value)}
                                className="w-full rounded-md border border-gray-300 bg-white p-1.5 text-xs"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {/* ===================== QUOTE CTA ===================== */}
            {activeSection.id === "cta" && data.cta && (
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Heading</label>
                    <input
                      type="text"
                      value={data.cta.heading || ""}
                      onChange={(e) => updateField("cta.heading", e.target.value)}
                      className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Button Label</label>
                    <input
                      type="text"
                      value={data.cta.buttonLabel || data.cta.button?.label || ""}
                      onChange={(e) => updateField(data.cta.buttonLabel !== undefined ? "cta.buttonLabel" : "cta.button.label", e.target.value)}
                      className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Button Destination (Href)</label>
                    <input
                      type="text"
                      value={data.cta.buttonHref || data.cta.button?.href || ""}
                      onChange={(e) => updateField(data.cta.buttonHref !== undefined ? "cta.buttonHref" : "cta.button.href", e.target.value)}
                      className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Body Description</label>
                  <textarea
                    rows={3}
                    value={data.cta.body || ""}
                    onChange={(e) => updateField("cta.body", e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                  />
                </div>
              </div>
            )}

            {/* ===================== PAGE SEO & SETTINGS ===================== */}
            {activeSection.id === "seo" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Page Title Tag</label>
                  <input
                    type="text"
                    value={data.title || ""}
                    onChange={(e) => updateField("title", e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Meta Description</label>
                  <textarea
                    rows={3}
                    value={data.seoDescription || data.intro?.body || data.note || ""}
                    onChange={(e) => updateField("seoDescription", e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                  />
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <h4 className="text-xs font-bold uppercase text-gray-700">Connected Global Shell Settings</h4>
                  <p className="text-xs text-gray-500">Shared headers and footers are managed globally to maintain visual consistency across all pages.</p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/admin/header-announcement"
                      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Announcement Bar & Header Settings →
                    </Link>
                    <Link
                      href="/admin/navigation"
                      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Site Navigation & Dropdown Menus →
                    </Link>
                    <Link
                      href="/admin/footer"
                      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Site Footer & Quick Links →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Section Paging */}
            <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between">
              {prevSection ? (
                <button
                  type="button"
                  onClick={() => setActiveSectionId(prevSection.id)}
                  className="rounded-md border border-gray-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  ← Previous: {prevSection.label}
                </button>
              ) : <div />}

              {nextSection ? (
                <button
                  type="button"
                  onClick={() => setActiveSectionId(nextSection.id)}
                  className="rounded-md bg-[#015335] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#028051] cursor-pointer"
                >
                  Next: {nextSection.label} →
                </button>
              ) : <div />}
            </div>
          </div>
        </main>
      </div>

      <MediaSelectorModal
        isOpen={mediaModalOpen}
        onClose={() => {
          setMediaModalOpen(false);
          setMediaTarget(null);
        }}
        onSelect={(path) => {
          if (mediaTarget) {
            updateField(mediaTarget, path);
          }
          setMediaModalOpen(false);
          setMediaTarget(null);
        }}
      />
    </div>
  );
}

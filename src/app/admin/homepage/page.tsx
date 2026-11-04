"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { EditorActionBar } from "@/components/admin/EditorActionBar";
import { MediaSelectorModal } from "@/components/admin/MediaSelectorModal";
import type { ContentStatus } from "@/lib/cms-store";
import type { Service, Project, Testimonial } from "@/lib/content";

export default function AdminHomepageEditor() {
  const [content, setContent] = useState<any | null>(null);
  const [status, setStatus] = useState<ContentStatus>({ hasDraft: false });
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("hero");

  // Connected collections
  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [testimonialsList, setTestimonialsList] = useState<Testimonial[]>([]);

  // Media selector modal
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<string | null>(null);

  useEffect(() => {
    async function loadAll() {
      try {
        const [homeRes, sRes, pRes, tRes] = await Promise.all([
          fetch("/api/admin/content/home").then((r) => r.json()),
          fetch("/api/admin/content/services").then((r) => r.json()).catch(() => ({ data: [] })),
          fetch("/api/admin/content/projects").then((r) => r.json()).catch(() => ({ data: [] })),
          fetch("/api/admin/content/testimonials").then((r) => r.json()).catch(() => ({ data: [] })),
        ]);

        if (homeRes.ok) {
          setContent(homeRes.data);
          setStatus(homeRes.status);
        }
        if (sRes.ok || sRes.data) setServicesList(sRes.data || []);
        if (pRes.ok || pRes.data) setProjectsList(pRes.data || []);
        if (tRes.ok || tRes.data) setTestimonialsList(tRes.data || []);
      } catch (err) {
        console.error("Failed to load homepage data", err);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  async function handleSaveDraft() {
    if (!content) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content/home", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = await res.json();
      if (data.ok) {
        setStatus(data.status);
        setIsDirty(false);
        alert("Draft saved successfully!");
      } else {
        alert(data.error || "Failed to save draft");
      }
    } catch {
      alert("Error saving draft");
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    if (!content) return;
    if (!confirm("Are you sure you want to publish these changes directly to the live website?")) return;
    setPublishing(true);
    try {
      const res = await fetch("/api/admin/content/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = await res.json();
      if (data.ok) {
        setStatus(data.status);
        setIsDirty(false);
        alert("Homepage published live successfully!");
      } else {
        alert(data.error || "Failed to publish");
      }
    } catch {
      alert("Error publishing homepage");
    } finally {
      setPublishing(false);
    }
  }

  async function handleDiscardDraft() {
    const res = await fetch("/api/admin/content/home", { method: "DELETE" });
    if (res.ok) {
      const r = await fetch("/api/admin/content/home?draft=false");
      const d = await r.json();
      if (d.ok) {
        setContent(d.data);
        setStatus(d.status);
        setIsDirty(false);
      }
    }
  }

  function updateNested(pathStr: string, value: any) {
    setContent((prev: any) => {
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

  if (loading || !content) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#015335] border-r-transparent" />
        <p className="mt-3 text-sm font-medium text-gray-500">Loading Homepage editor...</p>
      </div>
    );
  }

  const tabs = [
    { id: "hero", label: "1. Hero Carousel" },
    { id: "benefits", label: "2. Benefits Bar" },
    { id: "services", label: "3. Services Grid" },
    { id: "showroom", label: "4. Showroom Section" },
    { id: "projects", label: "5. Projects Teaser" },
    { id: "value", label: "6. Value Band" },
    { id: "testimonials", label: "7. Testimonials & Reviews" },
    { id: "quote", label: "8. Quote CTA" },
    { id: "visibility", label: "Section Visibility" },
    { id: "seo", label: "Page SEO" },
  ];

  const iconOptions = [
    { value: "diamond", label: "Diamond (Quality/Design)" },
    { value: "leaf", label: "Leaf (Materials/Eco)" },
    { value: "people", label: "People (Experts/Team)" },
    { value: "lightbulb", label: "Lightbulb (Creative Solutions)" },
    { value: "shield", label: "Shield (Trust/Warranty)" },
    { value: "pencil", label: "Pencil (Custom Plans)" },
  ];

  return (
    <div className="space-y-6">
      <EditorActionBar
        title="Homepage Section-by-Section Editor"
        previewRoute="/"
        status={status}
        isDirty={isDirty}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        onDiscardDraft={status.hasDraft ? handleDiscardDraft : undefined}
        saving={saving}
        publishing={publishing}
      />

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-gray-200 pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-md px-3.5 py-2 text-xs font-semibold transition cursor-pointer ${
              activeTab === tab.id
                ? "bg-[#015335] text-white shadow-xs"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-md border border-gray-200 bg-white p-6 shadow-xs">
        {/* Tab 1: Hero */}
        {activeTab === "hero" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">Hero Carousel Section</h3>
                <p className="text-xs text-gray-500">Main headline, lead paragraph, CTA button, and background slides.</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Eyebrow</label>
                <input
                  type="text"
                  value={content.hero.eyebrow || ""}
                  onChange={(e) => updateNested("hero.eyebrow", e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Heading Line 1</label>
                <input
                  type="text"
                  value={content.hero.headingLine1 || ""}
                  onChange={(e) => updateNested("hero.headingLine1", e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Heading Line 2</label>
                <input
                  type="text"
                  value={content.hero.headingLine2 || ""}
                  onChange={(e) => updateNested("hero.headingLine2", e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">CTA Label</label>
                <input
                  type="text"
                  value={content.hero.ctaLabel || ""}
                  onChange={(e) => updateNested("hero.ctaLabel", e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">CTA Destination (Href)</label>
                <input
                  type="text"
                  value={content.hero.ctaHref || ""}
                  onChange={(e) => updateNested("hero.ctaHref", e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Hero Body Copy</label>
              <textarea
                rows={3}
                value={content.hero.body || ""}
                onChange={(e) => updateNested("hero.body", e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
              />
            </div>

            {/* Carousel Autoplay Settings */}
            <div className="rounded-md border border-gray-200 bg-gray-50/80 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-gray-900 uppercase">Carousel Autoplay Controls</h4>
                  <p className="text-xs text-gray-500">Enable automatic slide rotation and set rotation duration.</p>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={content.hero.autoplay !== false}
                      onChange={(e) => updateNested("hero.autoplay", e.target.checked)}
                      className="h-4 w-4 rounded-md border-gray-300 text-[#015335] focus:ring-[#015335]"
                    />
                    <span className="text-xs font-semibold text-gray-800">Autoplay Enabled</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    <label className="text-xs text-gray-600">Interval:</label>
                    <input
                      type="number"
                      min={3}
                      max={15}
                      step={0.5}
                      value={content.hero.autoplayInterval ?? 5.5}
                      onChange={(e) => updateNested("hero.autoplayInterval", parseFloat(e.target.value) || 5.5)}
                      className="w-16 rounded-md border border-gray-300 bg-white p-1 text-xs text-gray-900 text-center"
                    />
                    <span className="text-xs text-gray-500">sec</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Slides Manager */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Carousel Slides ({content.hero.slides?.length || 0})</h4>
                  <p className="text-xs text-gray-500">Rearrange, replace, or add slides using approved website imagery.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newSlides = [
                      ...(content.hero.slides || []),
                      {
                        id: `hero-slide-${Date.now()}`,
                        src: "/media/services/Photo12-1920w-2.jpg",
                        alt: "Kitchen design presentation",
                        objectPosition: "50% 50%",
                      },
                    ];
                    updateNested("hero.slides", newSlides);
                  }}
                  className="rounded-md bg-[#015335] px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#028051]"
                >
                  + Add Slide
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {(content.hero.slides || []).map((slide: any, idx: number) => (
                  <div key={slide.id || idx} className="rounded-md border border-gray-200 p-3 bg-gray-50/50 space-y-2">
                    <div className="relative aspect-16/10 rounded-md overflow-hidden bg-gray-200">
                      <Image src={slide.src} alt={slide.alt || ""} fill sizes="300px" className="object-cover" />
                    </div>
                    <p className="text-[0.72rem] font-mono text-gray-500 truncate">{slide.src}</p>
                    <input
                      type="text"
                      placeholder="Alt text"
                      value={slide.alt || ""}
                      onChange={(e) => {
                        const newSlides = [...content.hero.slides];
                        newSlides[idx].alt = e.target.value;
                        updateNested("hero.slides", newSlides);
                      }}
                      className="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-xs"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setMediaTarget(`hero.slides.${idx}.src`);
                          setMediaModalOpen(true);
                        }}
                        className="flex-1 rounded-md bg-white border border-gray-300 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                      >
                        Replace Image
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const newSlides = content.hero.slides.filter((_: any, i: number) => i !== idx);
                          updateNested("hero.slides", newSlides);
                        }}
                        className="rounded-md bg-red-50 border border-red-200 px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Benefits Bar */}
        {activeTab === "benefits" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">Benefits Bar (3 Value Columns)</h3>
                <p className="text-xs text-gray-500">Highlighted value propositions directly below the hero carousel.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newItems = [
                    ...(content.benefitsBar.items || []),
                    { id: `benefit-${Date.now()}`, title: "New Benefit", body: "Description here.", icon: "diamond" },
                  ];
                  updateNested("benefitsBar.items", newItems);
                }}
                className="rounded-md bg-[#015335] px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#028051]"
              >
                + Add Benefit
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {(content.benefitsBar.items || []).map((item: any, idx: number) => (
                <div key={item.id || idx} className="rounded-md border border-gray-200 p-4 bg-gray-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[0.68rem] font-bold text-gray-500 uppercase">Item #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newItems = content.benefitsBar.items.filter((_: any, i: number) => i !== idx);
                        updateNested("benefitsBar.items", newItems);
                      }}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Title</label>
                    <input
                      type="text"
                      value={item.title || ""}
                      onChange={(e) => {
                        const newItems = [...content.benefitsBar.items];
                        newItems[idx].title = e.target.value;
                        updateNested("benefitsBar.items", newItems);
                      }}
                      className="w-full rounded-md border border-gray-300 bg-white p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Icon</label>
                    <select
                      value={item.icon || "diamond"}
                      onChange={(e) => {
                        const newItems = [...content.benefitsBar.items];
                        newItems[idx].icon = e.target.value;
                        updateNested("benefitsBar.items", newItems);
                      }}
                      className="w-full rounded-md border border-gray-300 bg-white p-2 text-xs"
                    >
                      {iconOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Body Description</label>
                    <textarea
                      rows={2}
                      value={item.body || ""}
                      onChange={(e) => {
                        const newItems = [...content.benefitsBar.items];
                        newItems[idx].body = e.target.value;
                        updateNested("benefitsBar.items", newItems);
                      }}
                      className="w-full rounded-md border border-gray-300 bg-white p-2 text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Services Grid */}
        {activeTab === "services" && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Services Grid Section</h3>
              <p className="text-xs text-gray-500">Section intro text and preview of connected primary service cards.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Eyebrow</label>
                <input
                  type="text"
                  value={content.services.eyebrow || ""}
                  onChange={(e) => updateNested("services.eyebrow", e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Heading</label>
                <input
                  type="text"
                  value={content.services.heading || ""}
                  onChange={(e) => updateNested("services.heading", e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Body Introduction</label>
              <textarea
                rows={3}
                value={content.services.intro || ""}
                onChange={(e) => updateNested("services.intro", e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
              />
            </div>

            {/* Connected Collection Preview */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Connected Primary Services ({servicesList.filter((s: any) => (s as any).isPrimary !== false).length})</h4>
                  <p className="text-xs text-gray-500">Sourced from the Services collection. Card imagery and copy can be edited directly in Services module.</p>
                </div>
                <Link
                  href="/admin/services"
                  className="rounded-md bg-[#015335] px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#028051]"
                >
                  Manage Services →
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {servicesList.filter((s: any) => (s as any).isPrimary !== false).map((service) => (
                  <div key={service.id} className="rounded-md border border-gray-200 bg-gray-50/50 p-3 space-y-2">
                    <div className="relative aspect-[4/5] rounded-md overflow-hidden bg-gray-200">
                      <Image src={service.cardImage} alt={service.name} fill sizes="250px" className="object-cover" />
                    </div>
                    <h5 className="text-xs font-bold text-gray-900">{service.name}</h5>
                    <p className="text-[0.72rem] text-gray-500 line-clamp-2">{service.cardDescription}</p>
                    <Link
                      href={`/admin/pages/${service.slug}`}
                      className="block text-center rounded-md border border-gray-300 bg-white py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                    >
                      Edit Page Details
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Showroom */}
        {activeTab === "showroom" && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Showroom Section</h3>
              <p className="text-xs text-gray-500">Story block highlighting the Newington showroom location and personal expertise.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Eyebrow</label>
                <input
                  type="text"
                  value={content.showroom.eyebrow || ""}
                  onChange={(e) => updateNested("showroom.eyebrow", e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Heading Line 1</label>
                <input
                  type="text"
                  value={content.showroom.headingLine1 || ""}
                  onChange={(e) => updateNested("showroom.headingLine1", e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Heading Line 2</label>
                <input
                  type="text"
                  value={content.showroom.headingLine2 || ""}
                  onChange={(e) => updateNested("showroom.headingLine2", e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">CTA Label</label>
                <input
                  type="text"
                  value={content.showroom.ctaLabel || ""}
                  onChange={(e) => updateNested("showroom.ctaLabel", e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">CTA Destination (Href)</label>
                <input
                  type="text"
                  value={content.showroom.ctaHref || ""}
                  onChange={(e) => updateNested("showroom.ctaHref", e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Showroom Body Description</label>
              <textarea
                rows={4}
                value={content.showroom.body || ""}
                onChange={(e) => updateNested("showroom.body", e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
              />
            </div>

            {/* Showroom Image */}
            <div className="pt-4 border-t border-gray-100">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Showroom Feature Image</label>
              <div className="flex items-center gap-4">
                <div className="relative h-28 w-40 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                  <Image
                    src={content.showroom.image?.src || "/media/services/Photo12-1920w-2.jpg"}
                    alt={content.showroom.image?.alt || "Showroom"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMediaTarget("showroom.image.src");
                        setMediaModalOpen(true);
                      }}
                      className="rounded-md bg-white border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      Choose from Media Library
                    </button>
                    <span className="text-xs text-gray-400 font-mono truncate">{content.showroom.image?.src || "/media/services/Photo12-1920w-2.jpg"}</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Image Alt Text"
                    value={content.showroom.image?.alt || ""}
                    onChange={(e) => updateNested("showroom.image.alt", e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2 text-xs text-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Projects Teaser */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Projects Teaser Section</h3>
              <p className="text-xs text-gray-500">Introductory heading and featured project cards linking to project case studies.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Eyebrow</label>
                <input
                  type="text"
                  value={content.projects.eyebrow || ""}
                  onChange={(e) => updateNested("projects.eyebrow", e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Heading</label>
                <input
                  type="text"
                  value={content.projects.heading || ""}
                  onChange={(e) => updateNested("projects.heading", e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">CTA Label</label>
                <input
                  type="text"
                  value={content.projects.ctaLabel || ""}
                  onChange={(e) => updateNested("projects.ctaLabel", e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">CTA Destination (Href)</label>
                <input
                  type="text"
                  value={content.projects.ctaHref || ""}
                  onChange={(e) => updateNested("projects.ctaHref", e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Intro Body Copy</label>
              <textarea
                rows={2}
                value={content.projects.intro || ""}
                onChange={(e) => updateNested("projects.intro", e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
              />
            </div>

            {/* Connected Collection Preview */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Featured Homepage Projects ({projectsList.filter((p) => p.featuredOnHome).length})</h4>
                  <p className="text-xs text-gray-500">Projects marked as &ldquo;Featured on Homepage&rdquo; in the Portfolio module.</p>
                </div>
                <Link
                  href="/admin/projects"
                  className="rounded-md bg-[#015335] px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#028051]"
                >
                  Manage Portfolio →
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {projectsList.filter((p) => p.featuredOnHome).map((project) => (
                  <div key={project.id} className="rounded-md border border-gray-200 bg-gray-50/50 p-3 space-y-2">
                    <div className="relative aspect-[3/2] rounded-md overflow-hidden bg-gray-200">
                      <Image src={project.coverImage} alt={project.title} fill sizes="300px" className="object-cover" />
                    </div>
                    <h5 className="text-xs font-bold text-gray-900">{project.homeLabel || project.title}</h5>
                    <p className="text-[0.72rem] text-gray-500 line-clamp-2">{project.homeBlurb || project.description}</p>
                    <Link
                      href="/admin/projects"
                      className="block text-center rounded-md border border-gray-300 bg-white py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                    >
                      Edit Project Record
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Value Band */}
        {activeTab === "value" && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Value Band Section</h3>
              <p className="text-xs text-gray-500">Horizontal bar showcasing core craftsmanship and customer-centric values.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Section Heading</label>
              <input
                type="text"
                value={content.valueBand.heading || ""}
                onChange={(e) => updateNested("valueBand.heading", e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3 pt-2">
              {(content.valueBand.items || []).map((item: any, idx: number) => (
                <div key={item.id || idx} className="rounded-md border border-gray-200 p-4 bg-gray-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[0.68rem] font-bold text-gray-500 uppercase">Item #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newItems = content.valueBand.items.filter((_: any, i: number) => i !== idx);
                        updateNested("valueBand.items", newItems);
                      }}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Title</label>
                    <input
                      type="text"
                      value={item.title || ""}
                      onChange={(e) => {
                        const newItems = [...content.valueBand.items];
                        newItems[idx].title = e.target.value;
                        updateNested("valueBand.items", newItems);
                      }}
                      className="w-full rounded-md border border-gray-300 bg-white p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Icon</label>
                    <select
                      value={item.icon || "lightbulb"}
                      onChange={(e) => {
                        const newItems = [...content.valueBand.items];
                        newItems[idx].icon = e.target.value;
                        updateNested("valueBand.items", newItems);
                      }}
                      className="w-full rounded-md border border-gray-300 bg-white p-2 text-xs"
                    >
                      {iconOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Body Text</label>
                    <textarea
                      rows={2}
                      value={item.body || ""}
                      onChange={(e) => {
                        const newItems = [...content.valueBand.items];
                        newItems[idx].body = e.target.value;
                        updateNested("valueBand.items", newItems);
                      }}
                      className="w-full rounded-md border border-gray-300 bg-white p-2 text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 7: Testimonials & Reviews */}
        {activeTab === "testimonials" && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Testimonials & Reviews Section</h3>
              <p className="text-xs text-gray-500">Customer feedback quotes selected from the Reviews collection.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Eyebrow</label>
                <input
                  type="text"
                  value={content.testimonials?.eyebrow || ""}
                  onChange={(e) => updateNested("testimonials.eyebrow", e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Heading</label>
                <input
                  type="text"
                  value={content.testimonials?.heading || ""}
                  onChange={(e) => updateNested("testimonials.heading", e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">CTA Label</label>
                <input
                  type="text"
                  value={content.testimonials?.ctaLabel || ""}
                  onChange={(e) => updateNested("testimonials.ctaLabel", e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">CTA Destination (Href)</label>
                <input
                  type="text"
                  value={content.testimonials?.ctaHref || ""}
                  onChange={(e) => updateNested("testimonials.ctaHref", e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                />
              </div>
            </div>

            {/* Testimonial Selection */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Select Testimonials To Display on Homepage</h4>
                  <p className="text-xs text-gray-500">Check each review to feature it in the two-column homepage grid.</p>
                </div>
                <Link
                  href="/admin/reviews"
                  className="rounded-md bg-[#015335] px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#028051]"
                >
                  Manage All Reviews →
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {testimonialsList.map((t) => {
                  const currentIds: string[] = content.testimonials?.ids || [];
                  const isChecked = currentIds.includes(t.id);
                  return (
                    <label
                      key={t.id}
                      className={`flex items-start gap-3 rounded-md border p-4 cursor-pointer transition ${
                        isChecked
                          ? "border-[#015335] bg-[#015335]/5"
                          : "border-gray-200 bg-white hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...currentIds, t.id]
                            : currentIds.filter((id) => id !== t.id);
                          updateNested("testimonials.ids", updated);
                        }}
                        className="mt-1 h-4 w-4 rounded-md border-gray-300 text-[#015335] focus:ring-[#015335]"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-900">{t.name}</span>
                          <span className="text-[0.68rem] text-amber-600 font-semibold">5 ★</span>
                        </div>
                        <p className="text-xs text-gray-600 italic line-clamp-3">&ldquo;{t.quote}&rdquo;</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 8: Quote CTA */}
        {activeTab === "quote" && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Quote CTA Section</h3>
              <p className="text-xs text-gray-500">Closing consultation form and direct showroom telephone callout.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Heading Line 1</label>
                <input
                  type="text"
                  value={content.quote.headingLine1 || ""}
                  onChange={(e) => updateNested("quote.headingLine1", e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Heading Line 2</label>
                <input
                  type="text"
                  value={content.quote.headingLine2 || ""}
                  onChange={(e) => updateNested("quote.headingLine2", e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Body Copy</label>
              <textarea
                rows={3}
                value={content.quote.body || ""}
                onChange={(e) => updateNested("quote.body", e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
              />
            </div>

            {/* Background Image */}
            <div className="pt-4 border-t border-gray-100">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Background Image</label>
              <div className="flex items-center gap-4">
                <div className="relative h-28 w-40 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                  <Image
                    src={content.quote.image?.src || "/media/hero/rune-enstad-1090369-unsplash.jpg"}
                    alt={content.quote.image?.alt || "Consultation background"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMediaTarget("quote.image.src");
                        setMediaModalOpen(true);
                      }}
                      className="rounded-md bg-white border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      Choose from Media Library
                    </button>
                    <span className="text-xs text-gray-400 font-mono truncate">{content.quote.image?.src || "/media/hero/rune-enstad-1090369-unsplash.jpg"}</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Image Alt Text"
                    value={content.quote.image?.alt || ""}
                    onChange={(e) => updateNested("quote.image.alt", e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2 text-xs text-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 9: Section Visibility */}
        {activeTab === "visibility" && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Homepage Section Visibility</h3>
              <p className="text-xs text-gray-500">Toggle sections on or off. Hidden sections disappear cleanly from the live public homepage without gaps.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { id: "hero", label: "1. Hero Carousel" },
                { id: "benefits", label: "2. Benefits Bar" },
                { id: "services", label: "3. Services Grid" },
                { id: "showroom", label: "4. Showroom Section" },
                { id: "projects", label: "5. Projects Teaser" },
                { id: "value", label: "6. Value Band" },
                { id: "testimonials", label: "7. Testimonials & Reviews" },
                { id: "quote", label: "8. Quote CTA" },
              ].map((sec) => {
                const isVisible = content.visibleSections ? content.visibleSections[sec.id] !== false : true;
                return (
                  <label
                    key={sec.id}
                    className="flex items-center justify-between rounded-md border border-gray-200 p-4 bg-gray-50/50 cursor-pointer hover:bg-gray-100/60"
                  >
                    <div>
                      <span className="text-xs font-bold text-gray-900">{sec.label}</span>
                      <p className="text-[0.68rem] text-gray-500">
                        Status: <strong className={isVisible ? "text-[#015335]" : "text-amber-700"}>{isVisible ? "Visible" : "Hidden"}</strong>
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={isVisible}
                      onChange={(e) => updateNested(`visibleSections.${sec.id}`, e.target.checked)}
                      className="h-4 w-4 rounded-md border-gray-300 text-[#015335] focus:ring-[#015335] cursor-pointer"
                    />
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 10: Page SEO */}
        {activeTab === "seo" && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Homepage SEO & Social Sharing</h3>
              <p className="text-xs text-gray-500">Search engine title tag, meta description, and OpenGraph social share card image.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Meta Title</label>
                <input
                  type="text"
                  value={content.seo?.title || ""}
                  onChange={(e) => updateNested("seo.title", e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Meta Description</label>
                <textarea
                  rows={3}
                  value={content.seo?.description || ""}
                  onChange={(e) => updateNested("seo.description", e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm text-gray-900 outline-none focus:border-[#015335]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Social Share Card Image (og:image)</label>
                <div className="flex items-center gap-4">
                  <div className="relative h-24 w-36 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                    <Image
                      src={content.seo?.ogImage || "/media/services/Photo12-1920w-2.jpg"}
                      alt="Social share preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-2 flex-1">
                    <button
                      type="button"
                      onClick={() => {
                        setMediaTarget("seo.ogImage");
                        setMediaModalOpen(true);
                      }}
                      className="rounded-md bg-white border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      Choose from Media Library
                    </button>
                    <span className="block text-xs text-gray-400 font-mono truncate">{content.seo?.ogImage || "/media/services/Photo12-1920w-2.jpg"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <MediaSelectorModal
        isOpen={mediaModalOpen}
        onClose={() => {
          setMediaModalOpen(false);
          setMediaTarget(null);
        }}
        onSelect={(src) => {
          if (mediaTarget) {
            updateNested(mediaTarget, src);
          }
          setMediaModalOpen(false);
          setMediaTarget(null);
        }}
      />
    </div>
  );
}

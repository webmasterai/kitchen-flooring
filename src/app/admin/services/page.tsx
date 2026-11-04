"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { EditorActionBar } from "@/components/admin/EditorActionBar";
import { MediaSelectorModal } from "@/components/admin/MediaSelectorModal";
import type { ContentStatus } from "@/lib/cms-store";
import type { Service } from "@/lib/content";

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [status, setStatus] = useState<ContentStatus>({ hasDraft: false });
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);

  // Media selector modal
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaTargetField, setMediaTargetField] = useState<"heroImage" | "cardImage" | null>(null);

  useEffect(() => {
    fetch("/api/admin/content/services")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.ok) {
          setServices(resData.data);
          setStatus(resData.status);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleSaveDraft() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(services),
      });
      const resJson = await res.json();
      if (resJson.ok) {
        setStatus(resJson.status);
        setIsDirty(false);
        alert("Draft saved successfully!");
      }
    } catch {
      alert("Error saving draft");
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    if (!confirm("Are you sure you want to publish services changes to the live website?")) return;
    setPublishing(true);
    try {
      const res = await fetch("/api/admin/content/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(services),
      });
      const resJson = await res.json();
      if (resJson.ok) {
        setStatus(resJson.status);
        setIsDirty(false);
        alert("Services published live successfully!");
      }
    } catch {
      alert("Error publishing services");
    } finally {
      setPublishing(false);
    }
  }

  async function handleDiscardDraft() {
    const res = await fetch("/api/admin/content/services", { method: "DELETE" });
    if (res.ok) {
      const r = await fetch("/api/admin/content/services?draft=false");
      const d = await r.json();
      if (d.ok) {
        setServices(d.data);
        setStatus(d.status);
        setIsDirty(false);
      }
    }
  }

  function updateServiceField(field: string, val: unknown) {
    setServices((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy[selectedIdx][field] = val;
      return copy;
    });
    setIsDirty(true);
  }

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#028051] border-r-transparent" />
        <p className="mt-3 text-sm text-gray-500 font-medium">Loading Services...</p>
      </div>
    );
  }

  const activeService = services[selectedIdx];

  return (
    <div className="space-y-6">
      <EditorActionBar
        title="Services Management"
        previewRoute="/services"
        status={status}
        isDirty={isDirty}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        onDiscardDraft={handleDiscardDraft}
        saving={saving}
        publishing={publishing}
      />

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Services List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="rounded-2xl border border-gray-200/90 bg-white p-4 shadow-xs space-y-2">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2 py-1">
              Active Services ({services.length})
            </h3>
            {services.map((svc, i) => (
              <button
                key={svc.id}
                type="button"
                onClick={() => setSelectedIdx(i)}
                className={`w-full flex items-center justify-between rounded-xl px-3.5 py-3 text-left transition cursor-pointer ${
                  selectedIdx === i
                    ? "bg-[#028051] text-white shadow-xs font-bold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div>
                  <p className="text-sm">{svc.name}</p>
                  <p className={`text-[0.7rem] ${selectedIdx === i ? "text-white/80" : "text-gray-400"} font-mono`}>
                    /{svc.slug}
                  </p>
                </div>
                <span className="text-xs">→</span>
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-gray-200/90 bg-white p-4 shadow-xs">
            <p className="text-xs font-semibold text-gray-700">Need to edit section content?</p>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Use the <Link href="/admin/pages" className="text-[#028051] font-bold hover:underline">Pages module</Link> to edit specific sections, finish looks, and options for this service.
            </p>
          </div>
        </div>

        {/* Right Service Form */}
        {activeService && (
          <div className="lg:col-span-8 space-y-5">
            <div className="rounded-2xl border border-gray-200/90 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{activeService.name} Service Details</h3>
                  <p className="text-xs text-gray-500">Service record key: {activeService.id}</p>
                </div>
                <a
                  href={`/${activeService.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#028051] hover:underline flex items-center gap-1"
                >
                  <span>View Public Page</span>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Service Name</label>
                  <input
                    type="text"
                    value={activeService.name}
                    onChange={(e) => updateServiceField("name", e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm text-gray-900 focus:border-[#028051] focus:ring-1 focus:ring-[#028051] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={activeService.slug}
                    onChange={(e) => updateServiceField("slug", e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm text-gray-900 focus:border-[#028051] focus:ring-1 focus:ring-[#028051] outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Short Card Description</label>
                <input
                  type="text"
                  value={activeService.shortDescription || activeService.cardDescription || ""}
                  onChange={(e) => {
                    updateServiceField("shortDescription", e.target.value);
                    updateServiceField("cardDescription", e.target.value);
                  }}
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm text-gray-900 focus:border-[#028051] focus:ring-1 focus:ring-[#028051] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Service Summary</label>
                <textarea
                  rows={3}
                  value={activeService.summary || ""}
                  onChange={(e) => updateServiceField("summary", e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm text-gray-900 focus:border-[#028051] focus:ring-1 focus:ring-[#028051] outline-none"
                />
              </div>

              {/* Images */}
              <div className="grid gap-4 sm:grid-cols-2 pt-3 border-t border-gray-100">
                {/* Hero Image */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Hero Image</label>
                  <div className="relative h-28 w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-50 mb-2">
                    <Image
                      src={activeService.heroImage || "/media/logo/kfd-logo.jpg"}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMediaTargetField("heroImage");
                      setMediaModalOpen(true);
                    }}
                    className="w-full rounded-xl bg-gray-100 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-200 transition cursor-pointer"
                  >
                    Select Hero Image
                  </button>
                </div>

                {/* Card Image */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Card Image</label>
                  <div className="relative h-28 w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-50 mb-2">
                    <Image
                      src={activeService.cardImage || "/media/logo/kfd-logo.jpg"}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMediaTargetField("cardImage");
                      setMediaModalOpen(true);
                    }}
                    className="w-full rounded-xl bg-gray-100 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-200 transition cursor-pointer"
                  >
                    Select Card Image
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Pricing Disclaimer Note</label>
                <input
                  type="text"
                  value={activeService.pricingNote || ""}
                  onChange={(e) => updateServiceField("pricingNote", e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm text-gray-900 focus:border-[#028051] focus:ring-1 focus:ring-[#028051] outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <MediaSelectorModal
        open={mediaModalOpen}
        onClose={() => {
          setMediaModalOpen(false);
          setMediaTargetField(null);
        }}
        onSelect={(path) => {
          if (mediaTargetField) {
            updateServiceField(mediaTargetField, path);
          }
          setMediaModalOpen(false);
          setMediaTargetField(null);
        }}
      />
    </div>
  );
}

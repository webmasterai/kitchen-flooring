"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { EditorActionBar } from "@/components/admin/EditorActionBar";
import { MediaSelectorModal } from "@/components/admin/MediaSelectorModal";
import type { ContentStatus } from "@/lib/cms-store";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SiteConfigData = any;

export default function AdminHeaderAnnouncementPage() {
  const [siteData, setSiteData] = useState<SiteConfigData | null>(null);
  const [status, setStatus] = useState<ContentStatus>({ hasDraft: false });
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/admin/content/site")
      .then((res) => res.json())
      .then((d) => {
        if (d.ok) {
          setSiteData(d.data);
          setStatus(d.status);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleSaveDraft() {
    if (!siteData) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content/site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(siteData),
      });
      const d = await res.json();
      if (d.ok) {
        setStatus(d.status);
        setIsDirty(false);
        alert("Draft saved successfully!");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    if (!siteData) return;
    if (!confirm("Are you sure you want to publish header settings live?")) return;
    setPublishing(true);
    try {
      const res = await fetch("/api/admin/content/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(siteData),
      });
      const d = await res.json();
      if (d.ok) {
        setStatus(d.status);
        setIsDirty(false);
        alert("Header settings published live successfully!");
      }
    } finally {
      setPublishing(false);
    }
  }

  if (loading || !siteData) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#028051] border-r-transparent" />
        <p className="mt-3 text-sm text-gray-500 font-medium">Loading header settings...</p>
      </div>
    );
  }

  const ann = siteData.announcementBar || {};
  const cta = siteData.headerCta || {};
  const logo = siteData.logo || {};

  return (
    <div className="space-y-6">
      <EditorActionBar
        title="Header & Announcement Bar Settings"
        previewRoute="/"
        status={status}
        isDirty={isDirty}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        saving={saving}
        publishing={publishing}
      />

      {/* 1. Announcement Bar Settings */}
      <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="text-base font-bold text-gray-900">Announcement Bar</h3>
            <p className="text-xs text-gray-500">The dark green top utility strip displayed on desktop and mobile.</p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-gray-700">
            <input
              type="checkbox"
              checked={ann.visible !== false}
              onChange={(e) => {
                setSiteData({ ...siteData, announcementBar: { ...ann, visible: e.target.checked } });
                setIsDirty(true);
              }}
              className="h-4 w-4 rounded text-[#028051] focus:ring-[#028051]"
            />
            <span>Enabled / Visible</span>
          </label>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Location Text</label>
            <input
              type="text"
              value={ann.locationText || ""}
              onChange={(e) => {
                setSiteData({ ...siteData, announcementBar: { ...ann, locationText: e.target.value } });
                setIsDirty(true);
              }}
              className="w-full rounded-xl border border-gray-200 p-2.5 text-sm"
              placeholder="2434 Berlin Turnpike #7, Newington, CT 06111"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Opening Hours Note</label>
            <input
              type="text"
              value={ann.hoursText || ""}
              onChange={(e) => {
                setSiteData({ ...siteData, announcementBar: { ...ann, hoursText: e.target.value } });
                setIsDirty(true);
              }}
              className="w-full rounded-xl border border-gray-200 p-2.5 text-sm"
              placeholder="We Are Open 7 Days A Week"
            />
          </div>
        </div>
      </div>

      {/* 2. Logo Configuration */}
      <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-5">
        <h3 className="text-base font-bold text-gray-900 border-b pb-3">Website Brand Logo</h3>
        <div className="flex flex-wrap items-center gap-6">
          <div className="relative h-20 w-44 rounded-xl border border-gray-200 bg-gray-50 p-2 flex items-center justify-center">
            {logo.src && (
              <Image src={logo.src} alt={logo.alt || ""} fill sizes="180px" className="object-contain p-2" />
            )}
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-600 font-mono">{logo.src}</p>
            <button
              type="button"
              onClick={() => setMediaModalOpen(true)}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 shadow-xs"
            >
              Select / Replace Logo
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Logo Alt Text</label>
          <input
            type="text"
            value={logo.alt || ""}
            onChange={(e) => {
              setSiteData({ ...siteData, logo: { ...logo, alt: e.target.value } });
              setIsDirty(true);
            }}
            className="w-full rounded-xl border border-gray-200 p-2.5 text-sm"
          />
        </div>
      </div>

      {/* 3. Header CTA Button */}
      <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-5">
        <h3 className="text-base font-bold text-gray-900 border-b pb-3">Header Quote Button</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Button Label</label>
            <input
              type="text"
              value={cta.label || ""}
              onChange={(e) => {
                setSiteData({ ...siteData, headerCta: { ...cta, label: e.target.value } });
                setIsDirty(true);
              }}
              className="w-full rounded-xl border border-gray-200 p-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Button Destination (Href)</label>
            <input
              type="text"
              value={cta.href || ""}
              onChange={(e) => {
                setSiteData({ ...siteData, headerCta: { ...cta, href: e.target.value } });
                setIsDirty(true);
              }}
              className="w-full rounded-xl border border-gray-200 p-2.5 text-sm font-mono"
            />
          </div>
        </div>
      </div>

      <MediaSelectorModal
        isOpen={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        onSelect={(path) => {
          setSiteData({ ...siteData, logo: { ...logo, src: path } });
          setIsDirty(true);
        }}
      />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { EditorActionBar } from "@/components/admin/EditorActionBar";
import type { ContentStatus } from "@/lib/cms-store";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SiteConfigData = any;

export default function AdminFooterPage() {
  const [siteData, setSiteData] = useState<SiteConfigData | null>(null);
  const [status, setStatus] = useState<ContentStatus>({ hasDraft: false });
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

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
    if (!confirm("Are you sure you want to publish footer settings live?")) return;
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
        alert("Footer settings published live successfully!");
      }
    } finally {
      setPublishing(false);
    }
  }

  if (loading || !siteData) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#028051] border-r-transparent" />
        <p className="mt-3 text-sm text-gray-500 font-medium">Loading footer settings...</p>
      </div>
    );
  }

  const footer = siteData.footerSettings || {};

  return (
    <div className="space-y-6">
      <EditorActionBar
        title="Footer Configuration"
        previewRoute="/"
        status={status}
        isDirty={isDirty}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        saving={saving}
        publishing={publishing}
      />

      {/* Theme banner */}
      <div className="rounded-2xl bg-white border border-gray-200 p-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded-full border-2 border-gray-300 bg-white" />
          <div>
            <p className="text-xs font-bold text-gray-900">Approved White Footer Theme</p>
            <p className="text-[0.7rem] text-gray-500">The entire footer uses a crisp white background with high-contrast dark text.</p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-50 text-emerald-800 text-[0.68rem] font-bold px-2.5 py-0.5 border border-emerald-200">
          White Background Active ✓
        </span>
      </div>

      {/* Footer Blurb */}
      <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-5">
        <h3 className="text-base font-bold text-gray-900 border-b pb-3">Company Summary Blurb</h3>
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Brand Bio Paragraph</label>
          <textarea
            rows={3}
            value={siteData.footerBlurb || ""}
            onChange={(e) => {
              setSiteData({ ...siteData, footerBlurb: e.target.value });
              setIsDirty(true);
            }}
            className="w-full rounded-xl border border-gray-200 p-2.5 text-sm"
          />
        </div>
      </div>

      {/* Copyright & Sub-bar */}
      <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-5">
        <h3 className="text-base font-bold text-gray-900 border-b pb-3">Copyright & Credits Strip</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Copyright Text</label>
            <input
              type="text"
              value={footer.copyrightText || "© 2026 Kitchen & Flooring Depot. All rights reserved."}
              onChange={(e) => {
                setSiteData({
                  ...siteData,
                  footerSettings: { ...footer, copyrightText: e.target.value },
                });
                setIsDirty(true);
              }}
              className="w-full rounded-xl border border-gray-200 p-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Credit Line</label>
            <input
              type="text"
              value={siteData.credit?.text || "Designed by Digital Softs"}
              onChange={(e) => {
                setSiteData({
                  ...siteData,
                  credit: { ...siteData.credit, text: e.target.value },
                });
                setIsDirty(true);
              }}
              className="w-full rounded-xl border border-gray-200 p-2.5 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { EditorActionBar } from "@/components/admin/EditorActionBar";
import type { ContentStatus } from "@/lib/cms-store";

type NavLink = {
  href: string;
  label: string;
  children?: NavLink[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SiteConfigData = any;

export default function AdminNavigationPage() {
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
    if (!confirm("Are you sure you want to publish navigation changes live?")) return;
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
        alert("Navigation published live successfully!");
      }
    } finally {
      setPublishing(false);
    }
  }

  if (loading || !siteData) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#028051] border-r-transparent" />
        <p className="mt-3 text-sm text-gray-500 font-medium">Loading navigation...</p>
      </div>
    );
  }

  const mainNav: NavLink[] = siteData.navigation?.mainNav || [];
  const footerExplore: NavLink[] = siteData.navigation?.footerExplore || [];

  return (
    <div className="space-y-6">
      <EditorActionBar
        title="Website Navigation Management"
        previewRoute="/"
        status={status}
        isDirty={isDirty}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        saving={saving}
        publishing={publishing}
      />

      {/* Main Header Navigation */}
      <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="text-base font-bold text-gray-900">Header Main Navigation</h3>
            <p className="text-xs text-gray-500">Order and links rendered in the primary desktop and mobile header.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              const newNav = [...mainNav, { href: "/new-link", label: "New Link" }];
              setSiteData({ ...siteData, navigation: { ...siteData.navigation, mainNav: newNav } });
              setIsDirty(true);
            }}
            className="rounded-lg bg-[#028051] px-3.5 py-1 text-xs font-bold text-white hover:bg-[#016641]"
          >
            + Add Header Link
          </button>
        </div>

        <div className="space-y-3">
          {mainNav.map((item, idx) => (
            <div key={idx} className="rounded-2xl border border-gray-200 p-4 bg-gray-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase">Item {idx + 1}</span>
                <button
                  type="button"
                  onClick={() => {
                    const newNav = mainNav.filter((_, i) => i !== idx);
                    setSiteData({ ...siteData, navigation: { ...siteData.navigation, mainNav: newNav } });
                    setIsDirty(true);
                  }}
                  className="text-xs text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[0.7rem] font-bold text-gray-500 uppercase mb-1">Label</label>
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => {
                      const newNav = [...mainNav];
                      newNav[idx].label = e.target.value;
                      setSiteData({ ...siteData, navigation: { ...siteData.navigation, mainNav: newNav } });
                      setIsDirty(true);
                    }}
                    className="w-full rounded-xl border border-gray-200 bg-white p-2 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[0.7rem] font-bold text-gray-500 uppercase mb-1">Destination URL</label>
                  <input
                    type="text"
                    value={item.href}
                    onChange={(e) => {
                      const newNav = [...mainNav];
                      newNav[idx].href = e.target.value;
                      setSiteData({ ...siteData, navigation: { ...siteData.navigation, mainNav: newNav } });
                      setIsDirty(true);
                    }}
                    className="w-full rounded-xl border border-gray-200 bg-white p-2 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Sub-children / Dropdown items if any */}
              {Array.isArray(item.children) && (
                <div className="pt-2 pl-4 border-l-2 border-[#028051]/30 space-y-2">
                  <p className="text-[0.7rem] font-bold text-gray-600 uppercase">Dropdown Children ({item.children.length})</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {item.children.map((child, cIdx) => (
                      <div key={cIdx} className="flex gap-2">
                        <input
                          type="text"
                          value={child.label}
                          onChange={(e) => {
                            const newNav = [...mainNav];
                            newNav[idx].children![cIdx].label = e.target.value;
                            setSiteData({ ...siteData, navigation: { ...siteData.navigation, mainNav: newNav } });
                            setIsDirty(true);
                          }}
                          className="w-1/2 rounded-lg border border-gray-200 bg-white p-1.5 text-xs"
                        />
                        <input
                          type="text"
                          value={child.href}
                          onChange={(e) => {
                            const newNav = [...mainNav];
                            newNav[idx].children![cIdx].href = e.target.value;
                            setSiteData({ ...siteData, navigation: { ...siteData.navigation, mainNav: newNav } });
                            setIsDirty(true);
                          }}
                          className="w-1/2 rounded-lg border border-gray-200 bg-white p-1.5 text-xs font-mono"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Explore Navigation */}
      <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="text-base font-bold text-gray-900">Footer Explore Links</h3>
            <p className="text-xs text-gray-500">Links rendered in the white footer explore column.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              const newExplore = [...footerExplore, { href: "/new-link", label: "New Page" }];
              setSiteData({ ...siteData, navigation: { ...siteData.navigation, footerExplore: newExplore } });
              setIsDirty(true);
            }}
            className="rounded-lg bg-[#028051] px-3.5 py-1 text-xs font-bold text-white hover:bg-[#016641]"
          >
            + Add Footer Link
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {footerExplore.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 rounded-xl border border-gray-200 p-2.5 bg-gray-50/50">
              <input
                type="text"
                value={item.label}
                onChange={(e) => {
                  const newExplore = [...footerExplore];
                  newExplore[idx].label = e.target.value;
                  setSiteData({ ...siteData, navigation: { ...siteData.navigation, footerExplore: newExplore } });
                  setIsDirty(true);
                }}
                className="w-1/2 rounded-lg border border-gray-200 bg-white p-1.5 text-xs font-semibold"
              />
              <input
                type="text"
                value={item.href}
                onChange={(e) => {
                  const newExplore = [...footerExplore];
                  newExplore[idx].href = e.target.value;
                  setSiteData({ ...siteData, navigation: { ...siteData.navigation, footerExplore: newExplore } });
                  setIsDirty(true);
                }}
                className="w-1/2 rounded-lg border border-gray-200 bg-white p-1.5 text-xs font-mono"
              />
              <button
                type="button"
                onClick={() => {
                  const newExplore = footerExplore.filter((_, i) => i !== idx);
                  setSiteData({ ...siteData, navigation: { ...siteData.navigation, footerExplore: newExplore } });
                  setIsDirty(true);
                }}
                className="text-red-500 text-sm font-bold px-1"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

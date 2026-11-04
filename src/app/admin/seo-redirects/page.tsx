"use client";

import { useEffect, useState } from "react";
import { EditorActionBar } from "@/components/admin/EditorActionBar";
import type { ContentStatus } from "@/lib/cms-store";
import { Globe, ArrowRight, Trash2, Plus, Search, ExternalLink } from "@/components/admin/AdminIcons";

interface RedirectRule {
  id: string;
  source: string;
  destination: string;
  permanent: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SiteConfigData = any;

const CANONICAL_PAGES = [
  { slug: "home", label: "Home", path: "/" },
  { slug: "services", label: "Services Overview", path: "/services" },
  { slug: "cabinets", label: "Cabinets", path: "/cabinets" },
  { slug: "flooring", label: "Flooring", path: "/flooring" },
  { slug: "countertops", label: "Countertops", path: "/countertops" },
  { slug: "bathroom-vanities", label: "Bathroom Vanities", path: "/bathroom-vanities" },
  { slug: "kitchen-remodel", label: "Kitchen Remodel", path: "/kitchen-remodel" },
  { slug: "gallery", label: "Gallery", path: "/gallery" },
  { slug: "our-work", label: "Portfolio / Our Work", path: "/our-work" },
  { slug: "about", label: "About Us", path: "/about" },
  { slug: "faq", label: "FAQ", path: "/faq" },
  { slug: "contact", label: "Contact Us", path: "/contact" },
  { slug: "privacy-policy", label: "Privacy Policy", path: "/privacy-policy" },
];

export default function AdminSeoRedirectsPage() {
  const [siteData, setSiteData] = useState<SiteConfigData | null>(null);
  const [status, setStatus] = useState<ContentStatus>({ hasDraft: false });
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  // Redirects state
  const [redirects, setRedirects] = useState<RedirectRule[]>([]);
  const [newSource, setNewSource] = useState("");
  const [newDestination, setNewDestination] = useState("");
  const [newPermanent, setNewPermanent] = useState(true);
  const [redirectSaving, setRedirectSaving] = useState(false);
  const [redirectError, setRedirectError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/content/site").then((r) => r.json()),
      fetch("/api/admin/redirects").then((r) => r.json()),
    ])
      .then(([siteRes, redRes]) => {
        if (siteRes.ok) {
          setSiteData(siteRes.data);
          setStatus(siteRes.status);
        }
        if (redRes.ok && Array.isArray(redRes.redirects)) {
          if (redRes.redirects.length === 0) {
            // Seed defaults if empty
            const defaults: RedirectRule[] = [
              { id: "red_1", source: "/contact-us", destination: "/contact", permanent: true },
              { id: "red_2", source: "/portfolio", destination: "/our-work", permanent: true },
              { id: "red_3", source: "/services.", destination: "/services", permanent: false },
            ];
            setRedirects(defaults);
          } else {
            setRedirects(redRes.redirects);
          }
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
        alert("SEO draft settings saved successfully!");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    if (!siteData) return;
    if (!confirm("Are you sure you want to publish SEO settings live?")) return;
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
        alert("SEO settings published live successfully!");
      }
    } finally {
      setPublishing(false);
    }
  }

  async function handleAddRedirect(e: React.FormEvent) {
    e.preventDefault();
    setRedirectError(null);

    const source = newSource.trim();
    const destination = newDestination.trim();

    if (!source || !destination) {
      setRedirectError("Please provide both source and destination URLs.");
      return;
    }

    if (!source.startsWith("/")) {
      setRedirectError("Source path must begin with a forward slash (e.g. /old-path)");
      return;
    }

    if (source === destination) {
      setRedirectError("Source and Destination cannot be identical (circular redirect).");
      return;
    }

    if (redirects.some((r) => r.source.toLowerCase() === source.toLowerCase())) {
      setRedirectError(`A redirect rule for "${source}" already exists.`);
      return;
    }

    const updated: RedirectRule[] = [
      ...redirects,
      {
        id: "red_" + Date.now(),
        source,
        destination,
        permanent: newPermanent,
      },
    ];

    setRedirectSaving(true);
    try {
      const res = await fetch("/api/admin/redirects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ redirects: updated }),
      });
      const d = await res.json();
      if (d.ok) {
        setRedirects(updated);
        setNewSource("");
        setNewDestination("");
      } else {
        setRedirectError(d.error || "Failed to save redirect");
      }
    } catch {
      setRedirectError("Network error saving redirect");
    } finally {
      setRedirectSaving(false);
    }
  }

  async function handleDeleteRedirect(id: string) {
    if (!confirm("Are you sure you want to delete this redirect rule?")) return;
    const updated = redirects.filter((r) => r.id !== id);
    setRedirectSaving(true);
    try {
      const res = await fetch("/api/admin/redirects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ redirects: updated }),
      });
      const d = await res.json();
      if (d.ok) {
        setRedirects(updated);
      } else {
        alert(d.error || "Failed to delete redirect");
      }
    } finally {
      setRedirectSaving(false);
    }
  }

  if (loading || !siteData) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#028051] border-r-transparent" />
        <p className="mt-3 text-sm text-gray-500 font-medium">Loading SEO & redirect settings...</p>
      </div>
    );
  }

  const seo = siteData.seo || {};

  return (
    <div className="space-y-8">
      <EditorActionBar
        title="SEO & URL Redirects"
        status={status}
        isDirty={isDirty}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        previewUrl="/"
        saving={saving}
        publishing={publishing}
      />

      {/* Site-wide Global SEO Defaults */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#028051] flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">Site-Wide SEO Defaults</h2>
            <p className="text-xs text-gray-500">Global meta tags inherited by pages unless individually overridden</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Default Site Title
            </label>
            <input
              type="text"
              value={seo.defaultTitle || ""}
              onChange={(e) => {
                setSiteData({
                  ...siteData,
                  seo: { ...seo, defaultTitle: e.target.value },
                });
                setIsDirty(true);
              }}
              placeholder="Kitchen & Flooring Depot | Newington, CT"
              className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#028051]"
            />
            <p className="text-xs text-gray-400 mt-1">Recommended length: 50-60 characters</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Title Template
            </label>
            <input
              type="text"
              value={seo.titleTemplate || ""}
              onChange={(e) => {
                setSiteData({
                  ...siteData,
                  seo: { ...seo, titleTemplate: e.target.value },
                });
                setIsDirty(true);
              }}
              placeholder="%s | Kitchen & Flooring Depot"
              className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#028051]"
            />
            <p className="text-xs text-gray-400 mt-1">Use %s where individual page titles should be inserted</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Default Meta Description
            </label>
            <textarea
              rows={3}
              value={seo.defaultDescription || ""}
              onChange={(e) => {
                setSiteData({
                  ...siteData,
                  seo: { ...seo, defaultDescription: e.target.value },
                });
                setIsDirty(true);
              }}
              placeholder="Kitchen cabinets, flooring, countertops, bathroom vanities and kitchen remodeling in Newington, CT..."
              className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#028051]"
            />
            <div className="flex justify-between items-center text-xs text-gray-400 mt-1">
              <span>Recommended length: 150-160 characters</span>
              <span className={(seo.defaultDescription?.length || 0) > 160 ? "text-amber-600 font-medium" : ""}>
                {seo.defaultDescription?.length || 0} characters
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Redirects Manager */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#028051] flex items-center justify-center">
              <ArrowRight className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">URL Redirect Rules</h2>
              <p className="text-xs text-gray-500">Manage 301 Permanent and 302 Temporary redirects to preserve SEO rankings</p>
            </div>
          </div>
          <span className="text-xs bg-gray-100 text-gray-600 font-medium px-2.5 py-1 rounded-full">
            {redirects.length} Active {redirects.length === 1 ? "Rule" : "Rules"}
          </span>
        </div>

        {/* Add Redirect Form */}
        <form onSubmit={handleAddRedirect} className="bg-gray-50/70 p-4 rounded-xl border border-gray-200 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5 text-[#028051]" /> Add New Redirect Rule
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            <div className="md:col-span-5">
              <label className="block text-xs font-medium text-gray-600 mb-1">Source Path (From)</label>
              <input
                type="text"
                value={newSource}
                onChange={(e) => setNewSource(e.target.value)}
                placeholder="/old-cabinets-link"
                className="w-full text-sm px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#028051]"
              />
            </div>

            <div className="md:col-span-4">
              <label className="block text-xs font-medium text-gray-600 mb-1">Destination (To)</label>
              <input
                type="text"
                value={newDestination}
                onChange={(e) => setNewDestination(e.target.value)}
                placeholder="/cabinets"
                className="w-full text-sm px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#028051]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">HTTP Status</label>
              <select
                value={newPermanent ? "301" : "302"}
                onChange={(e) => setNewPermanent(e.target.value === "301")}
                className="w-full text-sm px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#028051]"
              >
                <option value="301">301 (Permanent)</option>
                <option value="302">302 (Temporary)</option>
              </select>
            </div>

            <div className="md:col-span-1">
              <button
                type="submit"
                disabled={redirectSaving}
                className="w-full py-2 bg-[#028051] hover:bg-[#026b43] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>

          {redirectError && (
            <p className="text-xs text-rose-600 font-medium">{redirectError}</p>
          )}
        </form>

        {/* Redirects Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-4">Source URL</th>
                <th className="py-2.5 px-4">Destination</th>
                <th className="py-2.5 px-4">Type</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {redirects.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-400">
                    No custom redirects configured yet.
                  </td>
                </tr>
              ) : (
                redirects.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-mono text-gray-800">{r.source}</td>
                    <td className="py-3 px-4 font-mono text-[#028051]">{r.destination}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                        r.permanent ? "bg-emerald-50 text-[#028051]" : "bg-blue-50 text-blue-700"
                      }`}>
                        {r.permanent ? "301 Permanent" : "302 Temporary"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteRedirect(r.id)}
                        disabled={redirectSaving}
                        className="text-gray-400 hover:text-rose-600 transition-colors p-1"
                        title="Delete redirect"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Per-Page Meta Overview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#028051] flex items-center justify-center">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">Canonical Website Pages ({CANONICAL_PAGES.length})</h2>
            <p className="text-xs text-gray-500">Each page contains dedicated metadata that inherits from or refines global defaults</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {CANONICAL_PAGES.map((p) => (
            <div key={p.slug} className="p-3.5 rounded-lg border border-gray-200 hover:border-[#028051]/40 transition-colors flex items-center justify-between">
              <div>
                <div className="font-semibold text-xs text-gray-900">{p.label}</div>
                <div className="font-mono text-[11px] text-gray-500">{p.path}</div>
              </div>
              <a
                href={p.slug === "home" ? "/admin/homepage" : `/admin/pages/${p.slug}`}
                className="text-xs text-[#028051] hover:underline flex items-center gap-1 font-medium"
              >
                Edit Page <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

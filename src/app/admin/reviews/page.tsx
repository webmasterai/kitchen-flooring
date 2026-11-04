"use client";

import { useEffect, useState } from "react";
import { EditorActionBar } from "@/components/admin/EditorActionBar";
import type { ContentStatus } from "@/lib/cms-store";
import type { Testimonial } from "@/lib/content";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [status, setStatus] = useState<ContentStatus>({ hasDraft: false });
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    fetch("/api/admin/content/testimonials")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.ok) {
          setReviews(resData.data);
          setStatus(resData.status);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleSaveDraft() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviews),
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
    if (!confirm("Are you sure you want to publish review updates to the live website?")) return;
    setPublishing(true);
    try {
      const res = await fetch("/api/admin/content/testimonials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviews),
      });
      const resJson = await res.json();
      if (resJson.ok) {
        setStatus(resJson.status);
        setIsDirty(false);
        alert("Reviews published live successfully!");
      }
    } catch {
      alert("Error publishing reviews");
    } finally {
      setPublishing(false);
    }
  }

  async function handleDiscardDraft() {
    const res = await fetch("/api/admin/content/testimonials", { method: "DELETE" });
    if (res.ok) {
      const r = await fetch("/api/admin/content/testimonials?draft=false");
      const d = await r.json();
      if (d.ok) {
        setReviews(d.data);
        setStatus(d.status);
        setIsDirty(false);
      }
    }
  }

  function handleAddReview() {
    const newRev: Testimonial = {
      id: `rev-${Date.now()}`,
      name: "New Client",
      quote: "Write customer review quote here...",
      sourceUrl: "https://website.kitchenflooringdepot.com/",
      ratingPublished: false,
    };
    setReviews((prev) => [newRev, ...prev]);
    setIsDirty(true);
  }

  function updateField(idx: number, field: string, val: unknown) {
    setReviews((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy[idx][field] = val;
      return copy;
    });
    setIsDirty(true);
  }

  function handleDelete(idx: number) {
    if (!confirm("Are you sure you want to delete this customer review?")) return;
    setReviews((prev) => prev.filter((_, i) => i !== idx));
    setIsDirty(true);
  }

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#028051] border-r-transparent" />
        <p className="mt-3 text-sm text-gray-500 font-medium">Loading Reviews...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EditorActionBar
        title="Reviews & Testimonials Management"
        previewRoute="/"
        status={status}
        isDirty={isDirty}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        onDiscardDraft={handleDiscardDraft}
        saving={saving}
        publishing={publishing}
      />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Customer Reviews ({reviews.length})</h2>
          <p className="text-xs text-gray-500">Genuine customer quotes displayed on the homepage and landing sections.</p>
        </div>
        <button
          type="button"
          onClick={handleAddReview}
          className="rounded-xl bg-[#028051] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#016641] transition cursor-pointer"
        >
          + Add Testimonial
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {reviews.map((rev, idx) => (
          <div
            key={rev.id || idx}
            className="rounded-2xl border border-gray-200/90 bg-white p-5 shadow-xs space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-900">{rev.name}</span>
                <button
                  type="button"
                  onClick={() => handleDelete(idx)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>

              <div>
                <label className="block text-[0.68rem] font-bold text-gray-400 uppercase mb-1">Author Name</label>
                <input
                  type="text"
                  value={rev.name}
                  onChange={(e) => updateField(idx, "name", e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-1.5 text-xs text-gray-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-[0.68rem] font-bold text-gray-400 uppercase mb-1">Quote Text</label>
                <textarea
                  rows={4}
                  value={rev.quote}
                  onChange={(e) => updateField(idx, "quote", e.target.value)}
                  className="w-full rounded-xl border border-gray-300 p-2.5 text-xs text-gray-900 outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-[0.68rem] font-bold text-gray-400 uppercase mb-1">Source Link</label>
                <input
                  type="text"
                  value={rev.sourceUrl || ""}
                  onChange={(e) => updateField(idx, "sourceUrl", e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-1.5 text-xs text-gray-900 outline-none"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(rev.ratingPublished)}
                  onChange={(e) => updateField(idx, "ratingPublished", e.target.checked)}
                  className="h-3.5 w-3.5 rounded text-[#028051]"
                />
                <span className="text-xs text-gray-600 font-medium">Show Star Rating</span>
              </label>

              <span className="text-[0.68rem] font-mono text-gray-400">ID: {rev.id}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

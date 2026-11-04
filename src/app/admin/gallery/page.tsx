"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { EditorActionBar } from "@/components/admin/EditorActionBar";
import { MediaSelectorModal } from "@/components/admin/MediaSelectorModal";
import type { ContentStatus } from "@/lib/cms-store";

type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  category: string;
  visible?: boolean;
};

type GalleryCategory = {
  id: string;
  label: string;
  heading: string;
  description: string;
};

interface GalleryData {
  categories: GalleryCategory[];
  images: GalleryImage[];
  eyebrow?: string;
  heading?: string;
  intro?: string;
}

export default function AdminGalleryPage() {
  const [data, setData] = useState<GalleryData | null>(null);
  const [status, setStatus] = useState<ContentStatus>({ hasDraft: false });
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  // Media selector modal
  const [mediaModalOpen, setMediaModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/admin/content/gallery")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.ok) {
          setData(resData.data);
          setStatus(resData.status);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleSaveDraft() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
    if (!confirm("Are you sure you want to publish gallery changes live?")) return;
    setPublishing(true);
    try {
      const res = await fetch("/api/admin/content/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const resJson = await res.json();
      if (resJson.ok) {
        setStatus(resJson.status);
        setIsDirty(false);
        alert("Gallery published live successfully!");
      }
    } catch {
      alert("Error publishing gallery");
    } finally {
      setPublishing(false);
    }
  }

  async function handleDiscardDraft() {
    const res = await fetch("/api/admin/content/gallery", { method: "DELETE" });
    if (res.ok) {
      const r = await fetch("/api/admin/content/gallery?draft=false");
      const d = await r.json();
      if (d.ok) {
        setData(d.data);
        setStatus(d.status);
        setIsDirty(false);
      }
    }
  }

  function handleAddImage(src: string) {
    const newImg: GalleryImage = {
      id: `img-${Date.now()}`,
      src,
      alt: "Inspiration photo",
      caption: "",
      category: activeFilter === "all" ? (data?.categories?.[0]?.id || "cabinets") : activeFilter,
      visible: true,
    };
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        images: [newImg, ...(prev.images || [])],
      };
    });
    setIsDirty(true);
  }

  function updateImageField(id: string, field: string, val: string | boolean) {
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        images: prev.images.map((img: GalleryImage) => (img.id === id ? { ...img, [field]: val } : img)),
      };
    });
    setIsDirty(true);
  }

  function handleDeleteImage(id: string) {
    if (!confirm("Are you sure you want to remove this image from the gallery?")) return;
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        images: prev.images.filter((img: GalleryImage) => img.id !== id),
      };
    });
    setIsDirty(true);
  }

  if (loading || !data) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#028051] border-r-transparent" />
        <p className="mt-3 text-sm text-gray-500 font-medium">Loading Gallery & Categories...</p>
      </div>
    );
  }

  const allImages: GalleryImage[] = data.images || [];
  const categories: GalleryCategory[] = data.categories || [];
  const displayedImages = activeFilter === "all" ? allImages : allImages.filter((img) => img.category === activeFilter);

  return (
    <div className="space-y-6">
      <EditorActionBar
        title="Gallery & Categories Management"
        previewRoute="/gallery"
        status={status}
        isDirty={isDirty}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        onDiscardDraft={handleDiscardDraft}
        saving={saving}
        publishing={publishing}
      />

      {/* Top Gallery Header & Add Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200/80 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Inspiration Gallery Photos ({allImages.length})
          </h2>
          <p className="text-xs text-gray-500">Manage categories, captions, alt text, and visibility for /gallery.</p>
        </div>

        <button
          type="button"
          onClick={() => setMediaModalOpen(true)}
          className="rounded-xl bg-[#028051] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#016641] transition cursor-pointer"
        >
          + Add Image to Gallery
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveFilter("all")}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
            activeFilter === "all"
              ? "bg-[#028051] text-white shadow-xs"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          All Spaces ({allImages.length})
        </button>
        {categories.map((cat) => {
          const count = allImages.filter((img) => img.category === cat.id).length;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveFilter(cat.id)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                activeFilter === cat.id
                  ? "bg-[#028051] text-white shadow-xs"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Images Grid */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {displayedImages.map((img) => (
          <div
            key={img.id}
            className="rounded-2xl border border-gray-200/90 bg-white p-3 shadow-xs space-y-2.5 flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 w-full rounded-xl overflow-hidden bg-gray-100 mb-2">
                <Image src={img.src || "/media/logo/kfd-logo.jpg"} alt={img.alt || ""} fill className="object-cover" />
                <span className="absolute top-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-[0.62rem] font-bold text-white uppercase backdrop-blur-xs">
                  {img.category}
                </span>
              </div>

              <div className="space-y-1.5">
                <div>
                  <label className="block text-[0.65rem] font-bold text-gray-400 uppercase">Category</label>
                  <select
                    value={img.category}
                    onChange={(e) => updateImageField(img.id, "category", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs text-gray-900"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[0.65rem] font-bold text-gray-400 uppercase">Alt Text</label>
                  <input
                    type="text"
                    value={img.alt || ""}
                    onChange={(e) => updateImageField(img.id, "alt", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-2 py-1 text-xs text-gray-900"
                    placeholder="Describe image..."
                  />
                </div>

                <div>
                  <label className="block text-[0.65rem] font-bold text-gray-400 uppercase">Caption</label>
                  <input
                    type="text"
                    value={img.caption || ""}
                    onChange={(e) => updateImageField(img.id, "caption", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-2 py-1 text-xs text-gray-900"
                    placeholder="Optional caption..."
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={img.visible !== false}
                  onChange={(e) => updateImageField(img.id, "visible", e.target.checked)}
                  className="h-3.5 w-3.5 rounded text-[#028051]"
                />
                <span className="text-[0.7rem] font-semibold text-gray-600">Visible</span>
              </label>

              <button
                type="button"
                onClick={() => handleDeleteImage(img.id)}
                className="text-[0.7rem] font-bold text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <MediaSelectorModal
        open={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        onSelect={(path) => {
          handleAddImage(path);
          setMediaModalOpen(false);
        }}
      />
    </div>
  );
}

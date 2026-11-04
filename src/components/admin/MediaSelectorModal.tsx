"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { MediaAsset } from "@/lib/cms-media";

export function MediaSelectorModal({
  isOpen,
  open,
  onClose,
  onSelect,
  currentValue,
}: {
  isOpen?: boolean;
  open?: boolean;
  onClose: () => void;
  onSelect: (path: string) => void;
  currentValue?: string;
}) {
  const isModalOpen = Boolean(isOpen ?? open);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [folder, setFolder] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (!isModalOpen) return;
    fetch("/api/admin/media")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setAssets(data.assets);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  const folders = ["all", "hero", "services", "gallery", "portfolio", "uploads"];

  const filtered = assets.filter((a) => {
    const matchFolder = folder === "all" || a.folder.toLowerCase() === folder.toLowerCase();
    const matchSearch =
      !search ||
      a.filename.toLowerCase().includes(search.toLowerCase()) ||
      a.path.toLowerCase().includes(search.toLowerCase());
    return matchFolder && matchSearch;
  });

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "uploads");

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setUploadError(data.error || "Upload failed");
        setUploading(false);
        return;
      }
      setAssets((prev) => [data.asset, ...prev]);
      onSelect(data.asset.path);
      onClose();
    } catch {
      setUploadError("Network error during upload");
      setUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-3xl bg-white shadow-2xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">Select Media Asset</h3>
            <p className="text-xs text-gray-500">Choose an image from library or upload a client asset.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none p-1"
          >
            &times;
          </button>
        </div>

        {/* Controls: Folders, search, upload */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-6 py-3 bg-gray-50/70">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {folders.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFolder(f)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                  folder === f ? "bg-[#028051] text-white" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search filename..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-800 focus:border-[#028051] focus:outline-none"
            />
            <label className="cursor-pointer rounded-lg bg-[#028051] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#016641]">
              <span>{uploading ? "Uploading..." : "+ Upload New"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
            </label>
          </div>
        </div>

        {uploadError && (
          <div className="bg-red-50 text-red-700 px-6 py-2 text-xs border-b border-red-100">{uploadError}</div>
        )}

        {/* Grid of images */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#028051] border-r-transparent" />
              <p className="mt-2 text-xs text-gray-500">Loading media library...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-sm text-gray-400">No media assets found matching query.</div>
          ) : (
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4 md:grid-cols-5">
              {filtered.map((asset) => {
                const isSelected = currentValue === asset.path;
                return (
                  <button
                    key={asset.path}
                    type="button"
                    onClick={() => {
                      onSelect(asset.path);
                      onClose();
                    }}
                    className={`group relative flex flex-col overflow-hidden rounded-xl border text-left transition hover:shadow-md ${
                      isSelected ? "border-[#028051] ring-2 ring-[#028051]" : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="relative aspect-4/3 w-full overflow-hidden bg-gray-100">
                      <Image
                        src={asset.path}
                        alt={asset.filename}
                        fill
                        sizes="180px"
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-2 bg-white">
                      <p className="truncate text-[0.72rem] font-semibold text-gray-800" title={asset.filename}>
                        {asset.filename}
                      </p>
                      <p className="text-[0.65rem] text-gray-400 uppercase">{asset.folder}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-3.5 bg-gray-50 text-xs">
          <span className="text-gray-500">{filtered.length} media items shown</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-4 py-1.5 font-semibold text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

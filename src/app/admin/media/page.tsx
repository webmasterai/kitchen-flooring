"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import type { MediaAsset } from "@/lib/cms-media";

export default function AdminMediaPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [folder, setFolder] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchMedia = useCallback(() => {
    fetch(`/api/admin/media?folder=${folder}`)
      .then((res) => res.json())
      .then((d) => {
        if (d.ok) setAssets(d.assets);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [folder]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder === "all" ? "uploads" : folder);

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });
      const d = await res.json();
      if (!res.ok || !d.ok) {
        setUploadError(d.error || "Upload failed");
        setUploading(false);
        return;
      }
      setAssets((prev) => [d.asset, ...prev]);
      setSelectedAsset(d.asset);
    } catch {
      setUploadError("Error uploading file");
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteAsset(mediaPath: string) {
    setDeleteError(null);
    if (!confirm(`Are you sure you want to delete ${mediaPath}?`)) return;

    try {
      const res = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: mediaPath }),
      });
      const d = await res.json();
      if (!res.ok || !d.ok) {
        setDeleteError(d.error || "Failed to delete asset");
        return;
      }
      setAssets((prev) => prev.filter((a) => a.path !== mediaPath));
      setSelectedAsset(null);
    } catch {
      setDeleteError("Network error while deleting");
    }
  }

  const folders = ["all", "hero", "services", "gallery", "portfolio", "logo", "uploads"];

  const filtered = assets.filter((a) => {
    return (
      !search ||
      a.filename.toLowerCase().includes(search.toLowerCase()) ||
      a.path.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Media Library</h2>
          <p className="text-xs text-gray-500 mt-0.5">Browse, upload, inspect references and manage website media assets.</p>
        </div>

        <label className="cursor-pointer rounded-xl bg-[#028051] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#016641] transition">
          <span>{uploading ? "Uploading File..." : "+ Upload New Image"}</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
        </label>
      </div>

      {uploadError && (
        <div className="rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">{uploadError}</div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {folders.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFolder(f)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold capitalize transition ${
                folder === f
                  ? "bg-[#028051] text-white shadow-xs"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Search filenames..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs text-gray-800 focus:border-[#028051] focus:outline-none"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs">
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#028051] border-r-transparent" />
            <p className="mt-3 text-sm text-gray-500 font-medium">Scanning media storage...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">No media assets found in this folder.</div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {filtered.map((asset) => {
              const isSelected = selectedAsset?.path === asset.path;
              const hasRefs = asset.references.length > 0;
              return (
                <div
                  key={asset.path}
                  onClick={() => {
                    setSelectedAsset(asset);
                    setDeleteError(null);
                  }}
                  className={`group relative flex flex-col overflow-hidden rounded-2xl border p-2 cursor-pointer transition hover:shadow-md ${
                    isSelected
                      ? "border-[#028051] ring-2 ring-[#028051] bg-[#028051]/5"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-gray-100">
                    <Image src={asset.path} alt={asset.filename} fill sizes="180px" className="object-cover" />
                    {hasRefs && (
                      <span className="absolute bottom-1 right-1 rounded-full bg-black/70 px-1.5 py-0.5 text-[0.6rem] font-bold text-white backdrop-blur-xs">
                        {asset.references.length} ref{asset.references.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 truncate text-[0.72rem] font-bold text-gray-800" title={asset.filename}>
                    {asset.filename}
                  </p>
                  <div className="flex items-center justify-between text-[0.65rem] text-gray-400 mt-0.5">
                    <span className="uppercase">{asset.folder}</span>
                    <span>{(asset.bytes / 1024).toFixed(0)} KB</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Asset Inspector Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-gray-900 truncate max-w-md">{selectedAsset.filename}</h3>
              <button
                type="button"
                onClick={() => setSelectedAsset(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-gray-100 border">
              <Image src={selectedAsset.path} alt="" fill sizes="500px" className="object-contain" />
            </div>

            {deleteError && (
              <div className="rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">{deleteError}</div>
            )}

            <div className="grid gap-2 text-xs">
              <div>
                <span className="font-bold text-gray-400 uppercase">Public Path:</span>
                <p className="font-mono text-gray-800 text-[0.75rem]">{selectedAsset.path}</p>
              </div>
              <div className="flex gap-6">
                <div>
                  <span className="font-bold text-gray-400 uppercase">File Size:</span>
                  <p className="text-gray-800">{(selectedAsset.bytes / 1024).toFixed(1)} KB</p>
                </div>
                <div>
                  <span className="font-bold text-gray-400 uppercase">Folder:</span>
                  <p className="text-gray-800 capitalize">{selectedAsset.folder}</p>
                </div>
              </div>
              {selectedAsset.sourceUrl && (
                <div>
                  <span className="font-bold text-gray-400 uppercase">Original WordPress Provenance:</span>
                  <p className="font-mono text-[0.7rem] text-emerald-700 break-all">{selectedAsset.sourceUrl}</p>
                </div>
              )}
            </div>

            {/* Referenced Pages */}
            <div className="pt-2 border-t">
              <span className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                Active Page Usage ({selectedAsset.references.length} references)
              </span>
              {selectedAsset.references.length === 0 ? (
                <p className="text-xs text-gray-400 italic">This image is currently unreferenced by any page.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {selectedAsset.references.map((r) => (
                    <span
                      key={r}
                      className="rounded-lg bg-gray-100 px-2 py-0.5 text-[0.7rem] font-mono font-medium text-gray-700"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t">
              <button
                type="button"
                onClick={() => handleDeleteAsset(selectedAsset.path)}
                disabled={selectedAsset.references.length > 0}
                className="rounded-xl px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 transition disabled:opacity-40 disabled:hover:bg-transparent"
                title={selectedAsset.references.length > 0 ? "Cannot delete: asset is currently used in content" : ""}
              >
                {selectedAsset.references.length > 0 ? "Protected (In Use)" : "Delete Asset"}
              </button>

              <button
                type="button"
                onClick={() => setSelectedAsset(null)}
                className="rounded-xl bg-gray-900 px-5 py-2 text-xs font-bold text-white hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

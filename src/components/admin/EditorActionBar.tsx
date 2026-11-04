"use client";

import { useState } from "react";
import type { ContentStatus } from "@/lib/cms-store";

export function EditorActionBar({
  title,
  previewRoute,
  previewUrl,
  status,
  isDirty,
  onSaveDraft,
  onPublish,
  onDiscardDraft,
  saving,
  publishing,
}: {
  title: string;
  previewRoute?: string;
  previewUrl?: string;
  status: ContentStatus;
  isDirty: boolean;
  onSaveDraft: () => Promise<void>;
  onPublish: () => Promise<void>;
  onDiscardDraft?: () => Promise<void>;
  saving: boolean;
  publishing: boolean;
}) {
  const [discarding, setDiscarding] = useState(false);
  const targetRoute = previewRoute || previewUrl;

  async function handleDiscard() {
    if (!confirm("Are you sure you want to discard this draft? All unpublished changes will be lost.")) return;
    if (onDiscardDraft) {
      setDiscarding(true);
      await onDiscardDraft();
      setDiscarding(false);
    }
  }

  return (
    <div className="sticky top-20 z-20 mb-6 flex flex-wrap items-center justify-between gap-4 rounded-md border border-gray-200/90 bg-white/95 p-4 shadow-xs backdrop-blur">
      <div className="flex items-center gap-3.5">
        <div>
          <h2 className="text-base font-bold text-gray-900 tracking-tight">{title}</h2>
          <div className="flex items-center gap-2 mt-0.5">
            {status.hasDraft ? (
              <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-[0.68rem] font-bold text-amber-700 border border-amber-200 uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                Draft Saved (Unpublished)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[0.68rem] font-bold text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Live Published
              </span>
            )}

            {isDirty && (
              <span className="text-[0.72rem] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                • Unsaved changes
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {status.hasDraft && onDiscardDraft && (
          <button
            type="button"
            onClick={handleDiscard}
            disabled={discarding || saving || publishing}
            className="rounded-md border border-red-200 px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition cursor-pointer"
          >
            {discarding ? "Discarding..." : "Discard Draft"}
          </button>
        )}

        {targetRoute && (
          <a
            href={`/admin/preview?url=${encodeURIComponent(targetRoute)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 shadow-xs hover:bg-gray-50 transition"
          >
            <span>Preview Draft</span>
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}

        <button
          type="button"
          onClick={onSaveDraft}
          disabled={saving || publishing}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-gray-800 shadow-xs hover:bg-gray-50 transition cursor-pointer disabled:opacity-50"
        >
          {saving ? "Saving Draft..." : "Save Draft"}
        </button>

        <button
          type="button"
          onClick={onPublish}
          disabled={saving || publishing}
          className="rounded-md bg-[#028051] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#016641] transition cursor-pointer disabled:opacity-50"
        >
          {publishing ? "Publishing..." : "Publish Live"}
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Monitor, Tablet, Smartphone, ExternalLink, ArrowLeft, RefreshCw } from "@/components/admin/AdminIcons";

function PreviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pagePath = searchParams.get("url") || searchParams.get("path") || "/";

  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [iframeKey, setIframeKey] = useState(0);

  function handleRefresh() {
    setIframeKey((k) => k + 1);
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      {/* Top Preview Bar */}
      <header className="h-14 bg-gray-900 text-white flex items-center justify-between px-4 z-30 shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-300 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Editor
          </button>
          <div className="h-4 w-px bg-gray-700" />
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-bold text-gray-200">Draft Preview</span>
            <span className="text-xs text-gray-400 font-mono hidden sm:inline">{pagePath}</span>
          </div>
        </div>

        {/* Viewport Selectors */}
        <div className="flex items-center bg-gray-800 rounded-lg p-0.5 border border-gray-700">
          <button
            type="button"
            onClick={() => setDevice("desktop")}
            className={`p-1.5 rounded ${device === "desktop" ? "bg-gray-700 text-white" : "text-gray-400 hover:text-gray-200"}`}
            title="Desktop View (100%)"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setDevice("tablet")}
            className={`p-1.5 rounded ${device === "tablet" ? "bg-gray-700 text-white" : "text-gray-400 hover:text-gray-200"}`}
            title="Tablet View (768px)"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setDevice("mobile")}
            className={`p-1.5 rounded ${device === "mobile" ? "bg-gray-700 text-white" : "text-gray-400 hover:text-gray-200"}`}
            title="Mobile View (375px)"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
            title="Refresh preview"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <a
            href={pagePath}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-gray-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <span>Open in Tab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* Frame Container */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-auto bg-neutral-800/40">
        <div
          className={`h-full transition-all duration-300 bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-300 ${
            device === "desktop"
              ? "w-full"
              : device === "tablet"
              ? "w-[768px] max-w-full"
              : "w-[390px] max-w-full"
          }`}
        >
          <iframe
            key={iframeKey}
            src={pagePath}
            title="Page Preview"
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  );
}

export default function AdminPreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
          <div className="text-center space-y-2">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#028051] border-r-transparent" />
            <p className="text-xs text-gray-400 font-mono">Loading preview frame...</p>
          </div>
        </div>
      }
    >
      <PreviewContent />
    </Suspense>
  );
}

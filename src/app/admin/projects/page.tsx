"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { EditorActionBar } from "@/components/admin/EditorActionBar";
import { MediaSelectorModal } from "@/components/admin/MediaSelectorModal";
import type { ContentStatus } from "@/lib/cms-store";
import type { Project } from "@/lib/content";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [status, setStatus] = useState<ContentStatus>({ hasDraft: false });
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  // Active project editor
  const [activeProjectIdx, setActiveProjectIdx] = useState<number | null>(null);

  // Media selector modal
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaTargetMode, setMediaTargetMode] = useState<"cover" | "addGallery" | null>(null);

  useEffect(() => {
    fetch("/api/admin/content/projects")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.ok) {
          setProjects(resData.data);
          setStatus(resData.status);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleSaveDraft() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projects),
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
    if (!confirm("Are you sure you want to publish portfolio projects changes to live?")) return;
    setPublishing(true);
    try {
      const res = await fetch("/api/admin/content/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projects),
      });
      const resJson = await res.json();
      if (resJson.ok) {
        setStatus(resJson.status);
        setIsDirty(false);
        alert("Portfolio projects published live successfully!");
      }
    } catch {
      alert("Error publishing projects");
    } finally {
      setPublishing(false);
    }
  }

  async function handleDiscardDraft() {
    const res = await fetch("/api/admin/content/projects", { method: "DELETE" });
    if (res.ok) {
      const r = await fetch("/api/admin/content/projects?draft=false");
      const d = await r.json();
      if (d.ok) {
        setProjects(d.data);
        setStatus(d.status);
        setIsDirty(false);
      }
    }
  }

  function updateActiveField(field: string, val: unknown) {
    if (activeProjectIdx === null) return;
    setProjects((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy[activeProjectIdx][field] = val;
      return copy;
    });
    setIsDirty(true);
  }

  function handleAddProject() {
    const newProj: Project = {
      id: `project-${Date.now()}`,
      slug: `new-project-${projects.length + 1}`,
      title: "New Remodel Project",
      category: "Kitchen",
      description: "Project description and design highlights.",
      displayTitle: "New Remodel Project",
      displayDescription: "Project description for portfolio listing.",
      filterId: "kitchens",
      categoryLabel: "KITCHEN REMODEL",
      collage: "hero-two-detail",
      order: projects.length + 1,
      coverImage: "/media/portfolio/Jeff1-1-scaled-qro8r7gqx5qsmwla0slewhoh4bbsrpgabrl7qfq3xs.jpg",
      images: ["/media/portfolio/Jeff1-1-scaled-qro8r7gqx5qsmwla0slewhoh4bbsrpgabrl7qfq3xs.jpg"],
      sourceUrl: "https://website.kitchenflooringdepot.com/portfolio/",
      published: true,
      featuredOnHome: false,
    };
    setProjects((prev) => [newProj, ...prev]);
    setActiveProjectIdx(0);
    setIsDirty(true);
  }

  function handleDeleteProject(idx: number) {
    if (!confirm("Are you sure you want to delete this project?")) return;
    setProjects((prev) => prev.filter((_, i) => i !== idx));
    setActiveProjectIdx(null);
    setIsDirty(true);
  }

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#028051] border-r-transparent" />
        <p className="mt-3 text-sm text-gray-500 font-medium">Loading Portfolio Projects...</p>
      </div>
    );
  }

  const activeProject = activeProjectIdx !== null ? projects[activeProjectIdx] : null;

  return (
    <div className="space-y-6">
      <EditorActionBar
        title="Portfolio & Projects Management"
        previewRoute="/our-work"
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
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Projects Showcase ({projects.length})</h2>
          <p className="text-xs text-gray-500">Manage completed remodel sets displayed in /our-work and on homepage.</p>
        </div>
        <button
          type="button"
          onClick={handleAddProject}
          className="rounded-xl bg-[#028051] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#016641] transition cursor-pointer"
        >
          + Add New Project
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Project Cards List */}
        <div className={`${activeProject ? "lg:col-span-5" : "lg:col-span-12"} space-y-3`}>
          {projects.map((proj, idx) => (
            <div
              key={proj.id || proj.slug}
              className={`rounded-2xl border p-4 bg-white transition shadow-xs flex items-center justify-between gap-4 cursor-pointer hover:border-[#028051]/40 ${
                activeProjectIdx === idx ? "border-[#028051] ring-1 ring-[#028051]" : "border-gray-200/90"
              }`}
              onClick={() => setActiveProjectIdx(idx)}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="relative h-14 w-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <Image src={proj.coverImage || "/media/logo/kfd-logo.jpg"} alt="" fill className="object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-900 truncate">{proj.title}</span>
                    {proj.published === false && (
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[0.62rem] font-bold text-gray-500">
                        Draft
                      </span>
                    )}
                    {proj.featuredOnHome && (
                      <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[0.62rem] font-bold text-emerald-700">
                        Home
                      </span>
                    )}
                  </div>
                  <p className="text-[0.7rem] text-gray-400 font-mono truncate">/our-work/{proj.slug}</p>
                  <p className="text-[0.7rem] text-gray-500">{proj.categoryLabel || proj.category} • {proj.images?.length || 0} photos</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveProjectIdx(idx);
                  }}
                  className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-200"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Project Form */}
        {activeProject && (
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-2xl border border-gray-200/90 bg-white p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Editing: {activeProject.title}</h3>
                  <p className="text-xs text-gray-500">Slug: /our-work/{activeProject.slug}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDeleteProject(activeProjectIdx!)}
                    className="text-xs font-bold text-red-600 hover:underline"
                  >
                    Delete Project
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveProjectIdx(null)}
                    className="text-xs font-bold text-gray-400 hover:text-gray-600"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Project Title</label>
                  <input
                    type="text"
                    value={activeProject.title}
                    onChange={(e) => updateActiveField("title", e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm text-gray-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Slug</label>
                  <input
                    type="text"
                    value={activeProject.slug}
                    onChange={(e) => updateActiveField("slug", e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm text-gray-900 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category Filter ID</label>
                  <select
                    value={activeProject.filterId || "kitchens"}
                    onChange={(e) => updateActiveField("filterId", e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm text-gray-900 outline-none bg-white"
                  >
                    <option value="kitchens">Kitchens (kitchens)</option>
                    <option value="bathrooms">Bathrooms (bathrooms)</option>
                    <option value="flooring">Flooring (flooring)</option>
                    <option value="cabinets">Cabinets (cabinets)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category Label</label>
                  <input
                    type="text"
                    value={activeProject.categoryLabel || ""}
                    onChange={(e) => updateActiveField("categoryLabel", e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm text-gray-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Summary Description</label>
                <textarea
                  rows={2}
                  value={activeProject.description || ""}
                  onChange={(e) => updateActiveField("description", e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm text-gray-900 outline-none"
                />
              </div>

              {/* Cover Image */}
              <div className="pt-2 border-t border-gray-100">
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Cover Image</label>
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-32 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                    <Image src={activeProject.coverImage || "/media/logo/kfd-logo.jpg"} alt="" fill className="object-cover" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <button
                      type="button"
                      onClick={() => {
                        setMediaTargetMode("cover");
                        setMediaModalOpen(true);
                      }}
                      className="rounded-xl bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-200 transition cursor-pointer"
                    >
                      Select Cover Image
                    </button>
                    <p className="text-[0.7rem] text-gray-400 font-mono truncate">{activeProject.coverImage}</p>
                  </div>
                </div>
              </div>

              {/* Gallery Images */}
              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase">
                    Project Gallery Photos ({activeProject.images?.length || 0})
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMediaTargetMode("addGallery");
                      setMediaModalOpen(true);
                    }}
                    className="text-xs font-bold text-[#028051] hover:underline"
                  >
                    + Add Image
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {activeProject.images?.map((imgSrc, imgI) => (
                    <div key={imgI} className="group relative h-18 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                      <Image src={imgSrc} alt="" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          const list = activeProject.images.filter((_, idx) => idx !== imgI);
                          updateActiveField("images", list);
                        }}
                        className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-600 text-white text-[10px] opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="grid gap-3 sm:grid-cols-2 pt-3 border-t border-gray-100">
                <label className="flex items-center justify-between rounded-xl border border-gray-200 p-3 bg-gray-50/50 cursor-pointer">
                  <span className="text-xs font-bold text-gray-800">Published Live</span>
                  <input
                    type="checkbox"
                    checked={activeProject.published !== false}
                    onChange={(e) => updateActiveField("published", e.target.checked)}
                    className="h-4 w-4 rounded text-[#028051]"
                  />
                </label>
                <label className="flex items-center justify-between rounded-xl border border-gray-200 p-3 bg-gray-50/50 cursor-pointer">
                  <span className="text-xs font-bold text-gray-800">Featured On Homepage</span>
                  <input
                    type="checkbox"
                    checked={Boolean(activeProject.featuredOnHome)}
                    onChange={(e) => updateActiveField("featuredOnHome", e.target.checked)}
                    className="h-4 w-4 rounded text-[#028051]"
                  />
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      <MediaSelectorModal
        open={mediaModalOpen}
        onClose={() => {
          setMediaModalOpen(false);
          setMediaTargetMode(null);
        }}
        onSelect={(path) => {
          if (mediaTargetMode === "cover") {
            updateActiveField("coverImage", path);
          } else if (mediaTargetMode === "addGallery" && activeProject) {
            const list = [...(activeProject.images || []), path];
            updateActiveField("images", list);
          }
          setMediaModalOpen(false);
          setMediaTargetMode(null);
        }}
      />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { EnquiryRecord } from "@/lib/enquiry-store";
import type { AuditEntry } from "@/lib/cms-store";

type DashboardStats = {
  totalPages: number;
  totalServices: number;
  totalProjects: number;
  totalGalleryImages: number;
  totalMediaFiles: number;
  newEnquiries: number;
  totalEnquiries: number;
  totalReviews: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentEnquiries, setRecentEnquiries] = useState<EnquiryRecord[]>([]);
  const [recentActivity, setRecentActivity] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setStats(data.stats);
          setRecentEnquiries(data.recentEnquiries || []);
          setRecentActivity(data.recentActivity || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#028051] border-r-transparent align-[-0.125em]" />
        <p className="mt-3 text-sm text-gray-500 font-medium">Loading Dashboard statistics...</p>
      </div>
    );
  }

  const statCards = [
    { label: "PAGES", value: stats?.totalPages ?? 0, href: "/admin/pages" },
    { label: "SERVICES", value: stats?.totalServices ?? 0, href: "/admin/services" },
    { label: "PORTFOLIO PROJECTS", value: stats?.totalProjects ?? 0, href: "/admin/projects" },
    { label: "GALLERY IMAGES", value: stats?.totalGalleryImages ?? 0, href: "/admin/gallery" },
    { label: "MEDIA FILES", value: stats?.totalMediaFiles ?? 0, href: "/admin/media" },
    { label: "NEW INQUIRIES", value: stats?.newEnquiries ?? 0, href: "/admin/enquiries?status=New", highlight: (stats?.newEnquiries ?? 0) > 0 },
    { label: "TOTAL INQUIRIES", value: stats?.totalEnquiries ?? 0, href: "/admin/enquiries" },
    { label: "CUSTOMER REVIEWS", value: stats?.totalReviews ?? 0, href: "/admin/reviews" },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Metric Stat Cards Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={`group rounded-md border bg-white p-5 transition duration-150 shadow-xs hover:border-[#028051]/50 ${
              card.highlight ? "border-[#028051] bg-[#028051]/5" : "border-gray-200"
            }`}
          >
            <p className="text-[0.72rem] font-bold tracking-wider text-gray-500 uppercase">
              {card.label}
            </p>
            <p
              className={`mt-2 text-3xl font-extrabold tracking-tight ${
                card.highlight ? "text-[#028051]" : "text-gray-900 group-hover:text-[#028051]"
              }`}
            >
              {card.value}
            </p>
          </Link>
        ))}
      </div>

      {/* 2. Two-column Dashboard Tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Recent enquiries */}
        <div className="rounded-md border border-gray-200 bg-white p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900">Recent enquiries</h2>
            <Link
              href="/admin/enquiries"
              className="text-xs font-semibold text-[#028051] hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="flex-1 overflow-x-auto pt-3">
            {recentEnquiries.length === 0 ? (
              <p className="py-12 text-center text-sm text-gray-400">No enquiries received yet.</p>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider text-[0.68rem]">
                    <th className="py-2 font-bold">NAME</th>
                    <th className="py-2 font-bold">SERVICE</th>
                    <th className="py-2 font-bold">DATE</th>
                    <th className="py-2 font-bold text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentEnquiries.map((enq) => (
                    <tr key={enq.id} className="hover:bg-gray-50/80 transition">
                      <td className="py-3 font-semibold text-gray-900">
                        {enq.payload.name}
                        <span className="block text-[0.68rem] font-normal text-gray-500">{enq.payload.email}</span>
                      </td>
                      <td className="py-3 text-gray-600 capitalize">
                        {enq.payload.service?.replace("-", " ") || "General"}
                      </td>
                      <td className="py-3 text-gray-400">
                        {new Date(enq.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </td>
                      <td className="py-3 text-right">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-[0.68rem] font-bold uppercase tracking-wider ${
                            enq.status === "New"
                              ? "bg-emerald-100 text-emerald-800"
                              : enq.status === "In Progress"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {enq.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right: Recently edited content / audit */}
        <div className="rounded-md border border-gray-200 bg-white p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900">Recent content updates</h2>
            <Link
              href="/admin/pages"
              className="text-xs font-semibold text-[#028051] hover:underline"
            >
              View pages
            </Link>
          </div>

          <div className="flex-1 overflow-x-auto pt-3">
            {recentActivity.length === 0 ? (
              <p className="py-12 text-center text-sm text-gray-400">No content activity recorded yet.</p>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider text-[0.68rem]">
                    <th className="py-2 font-bold">MODULE</th>
                    <th className="py-2 font-bold">ACTION</th>
                    <th className="py-2 font-bold">USER</th>
                    <th className="py-2 font-bold text-right">TIME</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentActivity.map((act) => (
                    <tr key={act.id} className="hover:bg-gray-50/80 transition">
                      <td className="py-3 font-semibold text-gray-900 capitalize">
                        {act.module.replace(/^pages\//, "").replace("-", " ")}
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[0.68rem] font-bold uppercase tracking-wider ${
                            act.action === "publish"
                              ? "bg-[#028051]/10 text-[#028051]"
                              : act.action === "save_draft"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {act.action.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3 text-gray-600">{act.user}</td>
                      <td className="py-3 text-right text-gray-400">
                        {new Date(act.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* 3. Quick Actions Bar */}
      <div className="rounded-md border border-gray-200 bg-white p-6 shadow-xs">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
          Quick actions
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2 rounded-md bg-[#028051] px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#016641]"
          >
            <span>+ Add Project</span>
          </Link>
          <Link
            href="/admin/pages"
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-xs transition hover:bg-gray-50 hover:text-gray-900"
          >
            <span>Edit Pages</span>
          </Link>
          <Link
            href="/admin/homepage"
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-xs transition hover:bg-gray-50 hover:text-gray-900"
          >
            <span>Edit Homepage</span>
          </Link>
          <Link
            href="/admin/media"
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-xs transition hover:bg-gray-50 hover:text-gray-900"
          >
            <span>Manage Media</span>
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-xs transition hover:bg-gray-50 hover:text-gray-900"
          >
            <span>View Website</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import type { EnquiryRecord, EnquiryStatus } from "@/lib/enquiry-store";

interface EnqRow extends EnquiryRecord {
  name?: string;
  email?: string;
  phone?: string;
  serviceInterest?: string;
  timeline?: string;
  budget?: string;
  address?: string;
  projectDescription?: string;
  sourcePage?: string;
}

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<EnqRow[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Active detail modal
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnqRow | null>(null);
  const [modalStatus, setModalStatus] = useState<EnquiryStatus>("New");
  const [modalNotes, setModalNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    let ignore = false;
    const q = statusFilter !== "All" ? `?status=${statusFilter}` : "";
    fetch(`/api/admin/enquiries${q}`)
      .then((res) => res.json())
      .then((data) => {
        if (!ignore && data.ok) {
          const normalized: EnqRow[] = (data.enquiries || []).map((e: EnquiryRecord) => ({
            ...e,
            ...(e.payload || {}),
          }));
          setEnquiries(normalized);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [statusFilter]);

  function openDetail(enquiry: EnqRow) {
    setSelectedEnquiry(enquiry);
    setModalStatus(enquiry.status);
    setModalNotes(enquiry.internalNotes || "");
  }

  async function handleUpdateStatus() {
    if (!selectedEnquiry) return;
    setUpdating(true);
    try {
      const res = await fetch("/api/admin/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedEnquiry.id,
          status: modalStatus,
          internalNotes: modalNotes,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setEnquiries((prev) => prev.map((e) => (e.id === selectedEnquiry.id ? data.enquiry : e)));
        setSelectedEnquiry(data.enquiry);
        alert("Enquiry updated successfully!");
      }
    } catch {
      alert("Error updating enquiry");
    } finally {
      setUpdating(false);
    }
  }

  const filtered = enquiries.filter((e) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      e.name?.toLowerCase().includes(s) ||
      e.email?.toLowerCase().includes(s) ||
      e.phone?.toLowerCase().includes(s) ||
      e.serviceInterest?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200/80 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Enquiries & Quote Requests</h1>
          <p className="mt-1 text-sm text-gray-500">
            Durable customer inquiries submitted via website contact & consultation forms.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search inquiries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3.5 py-1.5 text-xs text-gray-900 outline-none focus:border-[#028051]"
          />

          <div className="flex items-center gap-1.5">
            {["All", "New", "In Progress", "Closed"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                  statusFilter === st
                    ? "bg-[#028051] text-white shadow-xs"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#028051] border-r-transparent" />
          <p className="mt-3 text-sm text-gray-500 font-medium">Loading enquiries...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-200/90 bg-white p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p className="mt-3 text-base font-bold text-gray-800">No enquiries found</p>
          <p className="text-xs text-gray-400 mt-1">There are no inquiries matching the selected filter.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200/90 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70 text-[0.7rem] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Timeline / Budget</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {filtered.map((enq) => (
                  <tr key={enq.id} className="hover:bg-gray-50/80 transition">
                    <td className="py-3.5 px-4 font-mono text-gray-400 text-[0.7rem]">
                      {new Date(enq.createdAt).toLocaleDateString()} {new Date(enq.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">{enq.name}</td>
                    <td className="py-3.5 px-4">
                      <div>{enq.email}</div>
                      <div className="text-gray-400 font-mono text-[0.7rem]">{enq.phone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="rounded bg-gray-100 px-2 py-0.5 text-[0.68rem] font-bold text-gray-700">
                        {enq.serviceInterest || "General"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500">
                      <div>{enq.timeline || "—"}</div>
                      <div className="text-[0.7rem] text-gray-400">{enq.budget || "—"}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[0.68rem] font-bold ${
                          enq.status === "New"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : enq.status === "In Progress"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => openDetail(enq)}
                        className="rounded-lg bg-[#028051]/10 px-3 py-1 text-xs font-bold text-[#028051] hover:bg-[#028051] hover:text-white transition cursor-pointer"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selectedEnquiry.name}</h3>
                <p className="text-xs text-gray-400 font-mono">ID: {selectedEnquiry.id} • {new Date(selectedEnquiry.createdAt).toLocaleString()}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="rounded-lg p-1 text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 text-xs">
              <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3.5 space-y-1">
                <span className="text-[0.65rem] font-bold text-gray-400 uppercase">Contact Information</span>
                <p className="font-bold text-gray-900">{selectedEnquiry.name}</p>
                <p className="text-gray-600">Email: <a href={`mailto:${selectedEnquiry.email}`} className="text-[#028051] underline">{selectedEnquiry.email}</a></p>
                <p className="text-gray-600">Phone: <a href={`tel:${selectedEnquiry.phone}`} className="text-[#028051] underline">{selectedEnquiry.phone}</a></p>
                <p className="text-gray-600">Address: {selectedEnquiry.address || "Not provided"}</p>
              </div>

              <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3.5 space-y-1">
                <span className="text-[0.65rem] font-bold text-gray-400 uppercase">Project Scope</span>
                <p className="font-bold text-gray-900">{selectedEnquiry.serviceInterest}</p>
                <p className="text-gray-600">Timeline: {selectedEnquiry.timeline || "Flexible"}</p>
                <p className="text-gray-600">Budget: {selectedEnquiry.budget || "Not specified"}</p>
                <p className="text-gray-600">Source: {selectedEnquiry.sourcePage || "/"}</p>
              </div>
            </div>

            {selectedEnquiry.projectDescription && (
              <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3.5">
                <span className="block text-[0.65rem] font-bold text-gray-400 uppercase mb-1">Project Details</span>
                <p className="text-xs text-gray-800 leading-relaxed whitespace-pre-wrap">{selectedEnquiry.projectDescription}</p>
              </div>
            )}

            <div className="space-y-3 pt-3 border-t border-gray-100">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Status</label>
                  <select
                    value={modalStatus}
                    onChange={(e) => setModalStatus(e.target.value as EnquiryStatus)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 font-bold"
                  >
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Internal Notes</label>
                <textarea
                  rows={3}
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  placeholder="Private staff notes regarding follow-up, showroom visit, consultation..."
                  className="w-full rounded-xl border border-gray-300 p-3 text-xs text-gray-900 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedEnquiry(null)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateStatus}
                  disabled={updating}
                  className="rounded-xl bg-[#028051] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#016641] disabled:opacity-50"
                >
                  {updating ? "Saving..." : "Save Status & Notes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { EditorActionBar } from "@/components/admin/EditorActionBar";
import type { ContentStatus } from "@/lib/cms-store";
import { MapPin, Phone, Mail, Clock, Globe, Share2 } from "@/components/admin/AdminIcons";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SiteConfigData = any;

export default function AdminContactSettingsPage() {
  const [siteData, setSiteData] = useState<SiteConfigData | null>(null);
  const [status, setStatus] = useState<ContentStatus>({ hasDraft: false });
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    fetch("/api/admin/content/site")
      .then((res) => res.json())
      .then((d) => {
        if (d.ok) {
          setSiteData(d.data);
          setStatus(d.status);
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
        alert("Contact & Social settings draft saved successfully!");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    if (!siteData) return;
    if (!confirm("Are you sure you want to publish Contact & Social settings live?")) return;
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
        alert("Contact & Social settings published live successfully!");
      }
    } finally {
      setPublishing(false);
    }
  }

  if (loading || !siteData) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#028051] border-r-transparent" />
        <p className="mt-3 text-sm text-gray-500 font-medium">Loading contact & social settings...</p>
      </div>
    );
  }

  const contact = siteData.contact || {};
  const social = siteData.social || {};
  const maps = siteData.maps || {};

  return (
    <div className="space-y-6">
      <EditorActionBar
        title="Contact & Social Links"
        status={status}
        isDirty={isDirty}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        previewUrl="/contact"
        saving={saving}
        publishing={publishing}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Info Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#028051] flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Showroom & Communication</h2>
              <p className="text-xs text-gray-500">Phone numbers, email addresses, and showroom operating hours</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Display Phone
              </label>
              <input
                type="text"
                value={contact.phoneDisplay || ""}
                onChange={(e) => {
                  setSiteData({
                    ...siteData,
                    contact: { ...contact, phoneDisplay: e.target.value },
                  });
                  setIsDirty(true);
                }}
                placeholder="(860) 757-3330"
                className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#028051]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Phone (tel: link format)
              </label>
              <input
                type="text"
                value={contact.phoneTel || ""}
                onChange={(e) => {
                  setSiteData({
                    ...siteData,
                    contact: { ...contact, phoneTel: e.target.value },
                  });
                  setIsDirty(true);
                }}
                placeholder="+18607573330"
                className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#028051]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Contact Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={contact.email || ""}
                onChange={(e) => {
                  setSiteData({
                    ...siteData,
                    contact: { ...contact, email: e.target.value },
                  });
                  setIsDirty(true);
                }}
                placeholder="hr@kitchenflooringdepot.com"
                className="w-full text-sm pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#028051]"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Operating Hours Note
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Hours Note (Shown in Header & Footer)</label>
                <input
                  type="text"
                  value={contact.hoursNote || ""}
                  onChange={(e) => {
                    setSiteData({
                      ...siteData,
                      contact: { ...contact, hoursNote: e.target.value },
                    });
                    setIsDirty(true);
                  }}
                  placeholder="We Are Open 7 Days A Week"
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#028051]"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Hours Disclaimer / Policy Note</label>
                <input
                  type="text"
                  value={contact.hoursDisclaimer || ""}
                  onChange={(e) => {
                    setSiteData({
                      ...siteData,
                      contact: { ...contact, hoursDisclaimer: e.target.value },
                    });
                    setIsDirty(true);
                  }}
                  placeholder="Exact daily hours are not published on the source site; confirm when booking."
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#028051]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Location & Address Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#028051] flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Showroom Address</h2>
              <p className="text-xs text-gray-500">Physical location details formatted for local SEO and navigation</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Full Address String (Rendered across site)
            </label>
            <input
              type="text"
              value={contact.fullAddress || ""}
              onChange={(e) => {
                setSiteData({
                  ...siteData,
                  contact: { ...contact, fullAddress: e.target.value },
                });
                setIsDirty(true);
              }}
              placeholder="2434 Berlin Turnpike #7, Newington, CT 06111"
              className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#028051]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Street Address
              </label>
              <input
                type="text"
                value={contact.addressLine1 || ""}
                onChange={(e) => {
                  setSiteData({
                    ...siteData,
                    contact: { ...contact, addressLine1: e.target.value },
                  });
                  setIsDirty(true);
                }}
                placeholder="2434 Berlin Turnpike #7"
                className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#028051]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                City
              </label>
              <input
                type="text"
                value={contact.city || ""}
                onChange={(e) => {
                  setSiteData({
                    ...siteData,
                    contact: { ...contact, city: e.target.value },
                  });
                  setIsDirty(true);
                }}
                placeholder="Newington"
                className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#028051]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                State
              </label>
              <input
                type="text"
                value={contact.state || ""}
                onChange={(e) => {
                  setSiteData({
                    ...siteData,
                    contact: { ...contact, state: e.target.value },
                  });
                  setIsDirty(true);
                }}
                placeholder="CT"
                className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#028051]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Postal Code
              </label>
              <input
                type="text"
                value={contact.postalCode || ""}
                onChange={(e) => {
                  setSiteData({
                    ...siteData,
                    contact: { ...contact, postalCode: e.target.value },
                  });
                  setIsDirty(true);
                }}
                placeholder="06111"
                className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#028051]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Profiles */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#028051] flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">Social Media Channels</h2>
            <p className="text-xs text-gray-500">Official social links rendered in the header and footer</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Facebook URL
            </label>
            <input
              type="url"
              value={social.facebook || ""}
              onChange={(e) => {
                setSiteData({
                  ...siteData,
                  social: { ...social, facebook: e.target.value },
                });
                setIsDirty(true);
              }}
              placeholder="https://www.facebook.com/KitchenFlooringDepot/"
              className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#028051]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Instagram URL
            </label>
            <input
              type="url"
              value={social.instagram || ""}
              onChange={(e) => {
                setSiteData({
                  ...siteData,
                  social: { ...social, instagram: e.target.value },
                });
                setIsDirty(true);
              }}
              placeholder="https://www.instagram.com/kitchenandflooringdepot/"
              className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#028051]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              WhatsApp Link
            </label>
            <input
              type="url"
              value={social.whatsapp || ""}
              onChange={(e) => {
                setSiteData({
                  ...siteData,
                  social: { ...social, whatsapp: e.target.value },
                });
                setIsDirty(true);
              }}
              placeholder="https://api.whatsapp.com/send/?phone=..."
              className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#028051]"
            />
          </div>
        </div>
      </div>

      {/* Google Maps Configuration */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#028051] flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">Google Maps Integration</h2>
            <p className="text-xs text-gray-500">Maps search, directions, and showroom embed URLs</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Google Maps Search URL
            </label>
            <input
              type="url"
              value={maps.googleMapsSearch || ""}
              onChange={(e) => {
                setSiteData({
                  ...siteData,
                  maps: { ...maps, googleMapsSearch: e.target.value },
                });
                setIsDirty(true);
              }}
              className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#028051]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Google Maps Directions URL
            </label>
            <input
              type="url"
              value={maps.googleMapsDirections || ""}
              onChange={(e) => {
                setSiteData({
                  ...siteData,
                  maps: { ...maps, googleMapsDirections: e.target.value },
                });
                setIsDirty(true);
              }}
              className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#028051]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Google Maps Embed URL (Used on Contact page)
            </label>
            <input
              type="url"
              value={maps.googleMapsEmbed || ""}
              onChange={(e) => {
                setSiteData({
                  ...siteData,
                  maps: { ...maps, googleMapsEmbed: e.target.value },
                });
                setIsDirty(true);
              }}
              className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#028051]"
            />
          </div>

          {maps.googleMapsEmbed && (
            <div className="mt-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Live Embed Preview
              </label>
              <div className="aspect-[16/9] w-full max-w-2xl rounded-lg overflow-hidden border border-gray-200 shadow-inner">
                <iframe
                  title="Showroom Location Preview"
                  src={maps.googleMapsEmbed}
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

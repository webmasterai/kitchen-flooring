"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@kitchenflooringdepot.com");
  const [password, setPassword] = useState("AdminPassword2026!");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Login failed. Check your credentials.");
        setLoading(false);
        return;
      }

      router.push("/admin");
    } catch {
      setError("An unexpected network error occurred.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8F9FA] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand Card */}
        <div className="rounded-md border border-gray-200 bg-white p-8 sm:p-10 shadow-xs">
          <div className="text-center mb-8">
            <div className="relative mx-auto h-12 w-36 mb-4">
              <Image
                src="/media/logo/kfd-logo.jpg"
                alt="Kitchen & Flooring Depot"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">CMS Administration</h1>
            <p className="mt-1 text-xs text-gray-500">Sign in to manage website content and enquiries.</p>
          </div>

          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
              <svg className="w-4 h-4 shrink-0 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm text-gray-900 transition focus:border-[#028051] focus:outline-none focus:ring-1 focus:ring-[#028051]"
                placeholder="admin@kitchenflooringdepot.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm text-gray-900 transition focus:border-[#028051] focus:outline-none focus:ring-1 focus:ring-[#028051]"
                placeholder="••••••••••••"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-[#028051] py-3 text-sm font-bold text-white shadow-xs transition hover:bg-[#016641] disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Authenticating..." : "Sign In to CMS"}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-[0.75rem] text-gray-400">
              Kitchen & Flooring Depot • Internal Administrative Access Only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

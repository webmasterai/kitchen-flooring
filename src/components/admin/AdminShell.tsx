"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export type AdminUserSession = {
  userId: string;
  email: string;
  name: string;
  role: "Owner" | "Admin" | "Editor";
};

const navigationModules = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/homepage", label: "Homepage", icon: "home" },
  { href: "/admin/pages", label: "Pages", icon: "pages" },
  { href: "/admin/services", label: "Services", icon: "services" },
  { href: "/admin/projects", label: "Portfolio / Projects", icon: "projects" },
  { href: "/admin/gallery", label: "Gallery & Categories", icon: "gallery" },
  { href: "/admin/enquiries", label: "Enquiries", icon: "enquiries" },
  { href: "/admin/reviews", label: "Reviews", icon: "reviews" },
  { href: "/admin/media", label: "Media Library", icon: "media" },
  { href: "/admin/navigation", label: "Navigation", icon: "nav" },
  { href: "/admin/header-announcement", label: "Header & Announcement Bar", icon: "header" },
  { href: "/admin/footer", label: "Footer", icon: "footer" },
  { href: "/admin/contact-settings", label: "Contact & Social Links", icon: "contact" },
  { href: "/admin/seo-redirects", label: "SEO & Redirects", icon: "seo" },
  { href: "/admin/users", label: "Admin Users / Roles", icon: "users" },
];

function ModuleIcon({ name, className = "w-5 h-5" }: { name: string; className?: string }) {
  switch (name) {
    case "dashboard":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      );
    case "home":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      );
    case "pages":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    case "services":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      );
    case "projects":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    case "gallery":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      );
    case "enquiries":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    case "reviews":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      );
    case "media":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    case "nav":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      );
    case "header":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h14a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
        </svg>
      );
    case "footer":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 17a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2zM4 5a1 1 0 011-1h14a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
        </svg>
      );
    case "contact":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case "seo":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      );
    case "users":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    case "profile":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "logout":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      );
    default:
      return null;
  }
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<AdminUserSession | null>(null);
  // If on login page, render children directly without shell
  const isLoginPage = pathname === "/admin/login";
  const [loading, setLoading] = useState(!isLoginPage);

  useEffect(() => {
    if (isLoginPage) return;
    fetch("/api/admin/auth/me")
      .then((res) => {
        if (!res.ok) {
          router.push("/admin/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.ok) {
          setUser(data.user);
        }
        setLoading(false);
      })
      .catch(() => {
        router.push("/admin/login");
        setLoading(false);
      });
  }, [isLoginPage, router]);

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9F9FB]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#028051] border-r-transparent align-[-0.125em]" />
          <p className="mt-3 text-sm font-medium text-gray-600">Loading CMS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1F2937]">
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden backdrop-blur-xs"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-[#01472d] bg-[#015335] text-white transition-transform duration-200 lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between border-b border-[#01442b] px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center rounded-md bg-white px-3 py-1.5 shadow-xs">
              <div className="relative h-10 w-32">
                <Image
                  src="/media/logo/kfd-logo.jpg"
                  alt="Kitchen & Flooring Depot Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <span className="rounded bg-white/15 px-2 py-0.5 text-[0.65rem] font-bold tracking-wider text-emerald-100 uppercase">
              CMS
            </span>
          </div>
          <button
            type="button"
            className="text-white/70 hover:text-white lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="text-2xl leading-none">&times;</span>
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1">
          {navigationModules.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`group flex items-center gap-3 px-3 py-2 rounded-md text-[0.9rem] font-medium transition duration-150 focus:outline-hidden focus:ring-2 focus:ring-white/40 ${
                  isActive
                    ? "bg-white text-[#015335] shadow-xs font-bold"
                    : "text-white/85 hover:bg-white/10 hover:text-white"
                }`}
              >
                <ModuleIcon
                  name={item.icon}
                  className={`w-4.5 h-4.5 shrink-0 ${isActive ? "text-[#015335]" : "text-white/70 group-hover:text-white"}`}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-[#01442b] p-3 space-y-1 bg-[#01442b]/60">
          <Link
            href="/admin/profile"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-[0.88rem] font-medium transition focus:outline-hidden focus:ring-2 focus:ring-white/40 ${
              pathname === "/admin/profile"
                ? "bg-white text-[#015335] font-bold"
                : "text-white/85 hover:bg-white/10 hover:text-white"
            }`}
          >
            <ModuleIcon
              name="profile"
              className={`w-4.5 h-4.5 shrink-0 ${pathname === "/admin/profile" ? "text-[#015335]" : "text-white/70"}`}
            />
            <span className="truncate">My Profile & Security</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-[0.88rem] font-medium text-red-300 hover:bg-red-500/20 hover:text-red-100 transition text-left cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-red-400"
          >
            <ModuleIcon name="logout" className="w-4.5 h-4.5 text-red-300 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-18 items-center justify-between border-b border-gray-200/80 bg-white/95 px-6 lg:px-8 backdrop-blur">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900 tracking-tight">Content Management</h1>
              <p className="text-xs text-gray-500">Manage website content without code.</p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-[#028051] transition"
            >
              <span>View Website</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>

            {user && (
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#028051] text-sm font-bold text-white shadow-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-gray-900 leading-none">{user.name}</p>
                  <p className="text-[0.7rem] text-gray-500 font-medium capitalize mt-0.5">{user.role}</p>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}

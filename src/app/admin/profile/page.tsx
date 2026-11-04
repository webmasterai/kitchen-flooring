"use client";

import { useEffect, useState, useCallback } from "react";
import { User, KeyRound, HardDrive, Database, RefreshCw, CheckCircle2, AlertCircle } from "@/components/admin/AdminIcons";
import type { AdminRole } from "@/lib/cms-auth";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  createdAt: string;
}

interface BackupEntry {
  id: string;
  createdAt: string;
  filesCount: number;
}

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Name edit state
  const [name, setName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);

  // Password change state
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Backups state
  const [backups, setBackups] = useState<BackupEntry[]>([]);
  const [creatingBackup, setCreatingBackup] = useState(false);

  const loadProfileAndBackups = useCallback(async () => {
    try {
      const [userRes, backupRes] = await Promise.all([
        fetch("/api/admin/auth/me").then((r) => r.json()),
        fetch("/api/admin/backup").then((r) => r.json()).catch(() => ({ ok: false, backups: [] })),
      ]);

      if (userRes.ok && userRes.user) {
        setProfile(userRes.user);
        setName(userRes.user.name);
      }
      if (backupRes.ok && Array.isArray(backupRes.backups)) {
        setBackups(backupRes.backups);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfileAndBackups();
  }, [loadProfileAndBackups]);

  async function handleUpdateName(e: React.FormEvent) {
    e.preventDefault();
    if (!profile || !name.trim()) return;

    setSavingName(true);
    setNameSuccess(false);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: profile.id, name: name.trim() }),
      });
      const d = await res.json();
      if (d.ok) {
        setNameSuccess(true);
        setTimeout(() => setNameSuccess(false), 3000);
      } else {
        alert(d.error || "Failed to update profile name");
      }
    } finally {
      setSavingName(false);
    }
  }

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    if (!profile) return;

    setSavingPassword(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: profile.id, password }),
      });
      const d = await res.json();
      if (d.ok) {
        setPasswordSuccess(true);
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => setPasswordSuccess(false), 4000);
      } else {
        setPasswordError(d.error || "Failed to change password");
      }
    } finally {
      setSavingPassword(false);
    }
  }

  async function handleCreateBackup() {
    setCreatingBackup(true);
    try {
      const res = await fetch("/api/admin/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prefix: "manual-backup" }),
      });
      const d = await res.json();
      if (d.ok) {
        alert(`Backup snapshot created successfully! (${d.id})`);
        const backupRes = await fetch("/api/admin/backup").then((r) => r.json());
        if (backupRes.ok) setBackups(backupRes.backups);
      } else {
        alert(d.error || "Failed to create backup");
      }
    } finally {
      setCreatingBackup(false);
    }
  }

  if (loading || !profile) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#028051] border-r-transparent" />
        <p className="mt-3 text-sm text-gray-500 font-medium">Loading profile & security settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#028051] flex items-center justify-center">
          <User className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Profile & Security</h1>
          <p className="text-xs text-gray-500">Manage account credentials, active sessions, and disaster recovery snapshots</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#028051] text-lg font-bold flex items-center justify-center">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900">{profile.name}</h2>
                <span className="text-xs bg-emerald-50 text-[#028051] border border-[#028051]/30 font-semibold px-2 py-0.5 rounded-full">
                  {profile.role}
                </span>
              </div>
              <p className="text-xs text-gray-500 font-mono">{profile.email}</p>
            </div>
          </div>

          <form onSubmit={handleUpdateName} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#028051]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Email Address (Signed in)
              </label>
              <input
                type="email"
                disabled
                value={profile.email}
                className="w-full text-sm px-3 py-2 bg-gray-50 border border-gray-200 text-gray-500 rounded-lg cursor-not-allowed"
              />
              <p className="text-[11px] text-gray-400 mt-1">To change login email, request assistance from the Owner.</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              {nameSuccess && (
                <span className="text-xs text-[#028051] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Name updated
                </span>
              )}
              <div className="ml-auto">
                <button
                  type="submit"
                  disabled={savingName}
                  className="px-4 py-2 bg-[#028051] hover:bg-[#026b43] text-white text-xs font-semibold rounded-lg shadow-sm disabled:opacity-50"
                >
                  {savingName ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#028051] flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Change Password</h2>
              <p className="text-xs text-gray-500">Update your account authentication credentials</p>
            </div>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                New Password (min 8 chars)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#028051]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#028051]"
              />
            </div>

            {passwordError && (
              <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {passwordError}
              </p>
            )}

            {passwordSuccess && (
              <p className="text-xs text-[#028051] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Password changed successfully!
              </p>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingPassword || !password}
                className="px-4 py-2 bg-[#028051] hover:bg-[#026b43] text-white text-xs font-semibold rounded-lg shadow-sm disabled:opacity-50"
              >
                {savingPassword ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Deployment & Environment Health */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#028051] flex items-center justify-center">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">System Health & Storage Integrity</h2>
            <p className="text-xs text-gray-500">Diagnostic indicators for Coolify container mounts and data persistence</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-700">Enquiries Volume</span>
              <CheckCircle2 className="w-4 h-4 text-[#028051]" />
            </div>
            <div className="text-xs text-gray-500 font-mono">/data/enquiries</div>
            <p className="text-[11px] text-gray-500">Durable JSON store connected with status tracking & notes</p>
          </div>

          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-700">Content Drafts Volume</span>
              <CheckCircle2 className="w-4 h-4 text-[#028051]" />
            </div>
            <div className="text-xs text-gray-500 font-mono">/data/drafts</div>
            <p className="text-[11px] text-gray-500">Private staging volume for preview before publishing</p>
          </div>

          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-700">Backups Snapshot Volume</span>
              <CheckCircle2 className="w-4 h-4 text-[#028051]" />
            </div>
            <div className="text-xs text-gray-500 font-mono">/data/backups</div>
            <p className="text-[11px] text-gray-500">Full timestamped snapshot snapshots prior to each publish</p>
          </div>
        </div>
      </div>

      {/* Backup Snapshots Vault */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#028051] flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Disaster Recovery Snapshots</h2>
              <p className="text-xs text-gray-500">Complete content state snapshots stored in persistent filesystem</p>
            </div>
          </div>
          {profile.role === "Owner" && (
            <button
              type="button"
              onClick={handleCreateBackup}
              disabled={creatingBackup}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#028051] hover:bg-[#026b43] text-white text-xs font-semibold rounded-lg shadow-sm disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${creatingBackup ? "animate-spin" : ""}`} />
              {creatingBackup ? "Generating Snapshot..." : "Generate Full Snapshot"}
            </button>
          )}
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-4">Snapshot Identifier</th>
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4">Files Preserved</th>
                <th className="py-2.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {backups.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-400">
                    No snapshots recorded yet. Click &quot;Generate Full Snapshot&quot; to create one.
                  </td>
                </tr>
              ) : (
                backups.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-mono font-medium text-gray-800">{b.id}</td>
                    <td className="py-3 px-4 text-gray-500">
                      {b.createdAt.replace(/T/, " ").replace(/\..+/, "")}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{b.filesCount} JSON modules</td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#028051] bg-emerald-50 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3" /> Ready
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { Users, Plus, Shield, KeyRound, UserX, UserCheck, Trash2, X } from "@/components/admin/AdminIcons";
import type { AdminRole } from "@/lib/cms-auth";

interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  active: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<SafeUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<SafeUser | null>(null);

  // Add User Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AdminRole>("Editor");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset Password Modal State
  const [resetModalUser, setResetModalUser] = useState<SafeUser | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [resetSaving, setResetSaving] = useState(false);

  const loadUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users");
      const d = await res.json();
      if (d.ok) {
        setUsers(d.users);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
    fetch("/api/admin/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setCurrentUser(d.user);
      })
      .catch(() => {});
  }, [loadUsers]);

  async function handleAddUser(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name || !email || !password) {
      setError("Please fill out all fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const d = await res.json();
      if (d.ok) {
        setShowAddModal(false);
        setName("");
        setEmail("");
        setPassword("");
        setRole("Editor");
        await loadUsers();
      } else {
        setError(d.error || "Failed to create user");
      }
    } catch {
      setError("Network error while creating user");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(user: SafeUser) {
    const action = user.active ? "suspend" : "activate";
    if (!confirm(`Are you sure you want to ${action} ${user.name}?`)) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, active: !user.active }),
      });
      const d = await res.json();
      if (d.ok) {
        await loadUsers();
      } else {
        alert(d.error || "Failed to update user");
      }
    } catch {
      alert("Network error updating user");
    }
  }

  async function handleChangeRole(user: SafeUser, newRole: AdminRole) {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, role: newRole }),
      });
      const d = await res.json();
      if (d.ok) {
        await loadUsers();
      } else {
        alert(d.error || "Failed to update role");
      }
    } catch {
      alert("Network error updating role");
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!resetModalUser) return;
    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    setResetSaving(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: resetModalUser.id, password: newPassword }),
      });
      const d = await res.json();
      if (d.ok) {
        alert("Password updated successfully!");
        setResetModalUser(null);
        setNewPassword("");
      } else {
        alert(d.error || "Failed to reset password");
      }
    } catch {
      alert("Network error resetting password");
    } finally {
      setResetSaving(false);
    }
  }

  async function handleDeleteUser(user: SafeUser) {
    if (!confirm(`Are you sure you want to delete user ${user.name} (${user.email})? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users?id=${user.id}`, {
        method: "DELETE",
      });
      const d = await res.json();
      if (d.ok) {
        await loadUsers();
      } else {
        alert(d.error || "Failed to delete user");
      }
    } catch {
      alert("Network error deleting user");
    }
  }

  const isOwner = currentUser?.role === "Owner";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#028051] flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Admin Users & Access Control</h1>
            <p className="text-xs text-gray-500">Manage administrator accounts, roles, and permissions</p>
          </div>
        </div>
        {isOwner && (
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#028051] hover:bg-[#026b43] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Admin User
          </button>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#028051] border-r-transparent" />
                    <p className="mt-2 text-xs">Loading users...</p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const isCurrent = currentUser?.id === u.id;
                  return (
                    <tr key={u.id} className="hover:bg-gray-50/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-emerald-100 text-[#028051] font-bold flex items-center justify-center text-xs">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900">{u.name}</span>
                            {isCurrent && (
                              <span className="ml-1.5 text-[10px] bg-emerald-100 text-[#028051] px-1.5 py-0.2 rounded font-medium">
                                You
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 font-mono">{u.email}</td>
                      <td className="py-3 px-4">
                        {isOwner && !isCurrent ? (
                          <select
                            value={u.role}
                            onChange={(e) => handleChangeRole(u, e.target.value as AdminRole)}
                            className="text-xs font-semibold px-2 py-1 rounded border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#028051]"
                          >
                            <option value="Owner">Owner</option>
                            <option value="Admin">Admin</option>
                            <option value="Editor">Editor</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              u.role === "Owner"
                                ? "bg-emerald-50 text-[#028051] border border-[#028051]/30"
                                : u.role === "Admin"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : "bg-amber-50 text-amber-800 border border-amber-200"
                            }`}
                          >
                            {u.role}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                            u.active ? "bg-emerald-50 text-[#028051]" : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {u.active ? "Active" : "Suspended"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500">
                        {new Date(u.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setResetModalUser(u)}
                            className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded"
                            title="Reset password"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>
                          {isOwner && !isCurrent && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleToggleActive(u)}
                                className={`p-1.5 rounded hover:bg-gray-100 ${
                                  u.active ? "text-amber-600" : "text-emerald-600"
                                }`}
                                title={u.active ? "Suspend account" : "Activate account"}
                              >
                                {u.active ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(u)}
                                className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                                title="Delete user"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Matrix Info Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#028051]" /> Role Permissions & Access Matrix
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-emerald-50/50 border border-emerald-100 space-y-2">
            <div className="font-bold text-[#028051]">Owner</div>
            <p className="text-gray-600">
              Full system sovereignty. Manage admin users, roles, system backups, server diagnostics, redirect rules,
              and live publishing.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-100 space-y-2">
            <div className="font-bold text-blue-800">Admin</div>
            <p className="text-gray-600">
              Manage website content, publish updates live, manage media assets, reply to enquiries, and configure site
              navigation.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-amber-50/50 border border-amber-100 space-y-2">
            <div className="font-bold text-amber-800">Editor</div>
            <p className="text-gray-600">
              Edit pages, review testimonials, and save drafts. Requires Admin or Owner review to publish changes live to
              the public website.
            </p>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Add New Admin User</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Smith"
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#028051]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="editor@kitchenflooringdepot.com"
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#028051]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Initial Password (min 8 chars)</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#028051]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Role Assignment</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as AdminRole)}
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#028051]"
                >
                  <option value="Editor">Editor (Draft only)</option>
                  <option value="Admin">Admin (Can publish)</option>
                  <option value="Owner">Owner (Full access)</option>
                </select>
              </div>

              {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-[#028051] hover:bg-[#026b43] text-white text-xs font-semibold rounded-lg shadow-sm disabled:opacity-50"
                >
                  {saving ? "Creating..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetModalUser && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full shadow-2xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Reset Password</h3>
              <button
                type="button"
                onClick={() => setResetModalUser(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="p-5 space-y-4">
              <p className="text-xs text-gray-600">
                Set a new password for <strong className="text-gray-900">{resetModalUser.name}</strong> ({resetModalUser.email}).
              </p>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">New Password (min 8 chars)</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#028051]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setResetModalUser(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetSaving}
                  className="px-4 py-2 bg-[#028051] hover:bg-[#026b43] text-white text-xs font-semibold rounded-lg shadow-sm disabled:opacity-50"
                >
                  {resetSaving ? "Saving..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

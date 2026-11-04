import { NextResponse } from "next/server";
import { requireAuth, getUsers, saveUsers, hashPassword, type AdminUser, type AdminRole } from "@/lib/cms-auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAuth(["Owner", "Admin"]);
    const users = await getUsers();
    const safeUsers = users.map((u) => {
      const copy = { ...u };
      delete (copy as Partial<AdminUser>).passwordHash;
      return copy;
    });
    return NextResponse.json({ ok: true, users: safeUsers });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    const status = msg === "UNAUTHORIZED" ? 401 : msg === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth(["Owner"]);
    const { name, email, password, role } = (await request.json()) as {
      name: string;
      email: string;
      password: string;
      role: AdminRole;
    };

    if (!name || !email || !password || !role) {
      return NextResponse.json({ ok: false, error: "All fields are required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ ok: false, error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const users = await getUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase().trim())) {
      return NextResponse.json({ ok: false, error: "User with this email already exists" }, { status: 400 });
    }

    const newUser: AdminUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: hashPassword(password),
      role,
      active: true,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    await saveUsers(users);

    const safeUser = { ...newUser };
    delete (safeUser as Partial<AdminUser>).passwordHash;
    return NextResponse.json({ ok: true, user: safeUser });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    const status = msg === "UNAUTHORIZED" ? 401 : msg === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireAuth(["Owner", "Admin"]);
    const { id, role, active, password, name } = (await request.json()) as {
      id: string;
      role?: AdminRole;
      active?: boolean;
      password?: string;
      name?: string;
    };

    if (!id) {
      return NextResponse.json({ ok: false, error: "id is required" }, { status: 400 });
    }

    const users = await getUsers();
    const target = users.find((u) => u.id === id);
    if (!target) {
      return NextResponse.json({ ok: false, error: "User not found" }, { status: 404 });
    }

    // Role modification or other user changes require Owner
    if (session.userId !== target.id && session.role !== "Owner") {
      return NextResponse.json({ ok: false, error: "Only Owner can modify other users" }, { status: 403 });
    }

    if (name) target.name = name.trim();
    if (role && session.role === "Owner") target.role = role;
    if (typeof active === "boolean" && session.role === "Owner") target.active = active;
    if (password) {
      if (password.length < 8) {
        return NextResponse.json({ ok: false, error: "Password must be at least 8 characters" }, { status: 400 });
      }
      target.passwordHash = hashPassword(password);
    }

    await saveUsers(users);
    const safeUser = { ...target };
    delete (safeUser as Partial<AdminUser>).passwordHash;
    return NextResponse.json({ ok: true, user: safeUser });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

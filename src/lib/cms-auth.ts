import { createHmac, pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto";
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { cookies } from "next/headers";

export type AdminRole = "Owner" | "Admin" | "Editor";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: AdminRole;
  active: boolean;
  createdAt: string;
  lastLoginAt?: string;
};

export type SessionPayload = {
  userId: string;
  email: string;
  name: string;
  role: AdminRole;
  expiresAt: number;
};

const USERS_FILE = path.join(process.cwd(), "data", "users.json");
const SESSION_COOKIE_NAME = "kfd_cms_session";
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || process.env.IP_HASH_SALT || "kfd-cms-session-secret-salt-2026";

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 100_000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  const hash = pbkdf2Sync(password, salt, 100_000, 64, "sha512").toString("hex");
  try {
    return timingSafeEqual(Buffer.from(key, "hex"), Buffer.from(hash, "hex"));
  } catch {
    return false;
  }
}

function signSession(data: SessionPayload): string {
  const json = JSON.stringify(data);
  const b64 = Buffer.from(json).toString("base64url");
  const signature = createHmac("sha256", SESSION_SECRET).update(b64).digest("base64url");
  return `${b64}.${signature}`;
}

function verifySession(token: string): SessionPayload | null {
  const [b64, signature] = token.split(".");
  if (!b64 || !signature) return null;
  const expected = createHmac("sha256", SESSION_SECRET).update(b64).digest("base64url");
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    const json = Buffer.from(b64, "base64url").toString("utf8");
    const payload = JSON.parse(json) as SessionPayload;
    if (Date.now() > payload.expiresAt) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getUsers(): Promise<AdminUser[]> {
  await mkdir(path.dirname(USERS_FILE), { recursive: true });
  if (!existsSync(USERS_FILE)) {
    // Initialize default Owner account (honors production bootstrap environment variables if provided)
    const initialEmail = process.env.ADMIN_INITIAL_EMAIL || "admin@kitchenflooringdepot.com";
    const initialPassword = process.env.ADMIN_INITIAL_PASSWORD || "AdminPassword2026!";
    const initialName = process.env.ADMIN_INITIAL_NAME || "CMS Administrator";

    const initialOwner: AdminUser = {
      id: "owner-initial-01",
      name: initialName,
      email: initialEmail.toLowerCase().trim(),
      passwordHash: hashPassword(initialPassword),
      role: "Owner",
      active: true,
      createdAt: new Date().toISOString(),
    };
    await writeFile(USERS_FILE, JSON.stringify([initialOwner], null, 2), "utf8");
    return [initialOwner];
  }
  try {
    const raw = await readFile(USERS_FILE, "utf8");
    return JSON.parse(raw) as AdminUser[];
  } catch {
    return [];
  }
}

export async function saveUsers(users: AdminUser[]): Promise<void> {
  await mkdir(path.dirname(USERS_FILE), { recursive: true });
  await writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

export async function authenticate(email: string, password: string): Promise<AdminUser | null> {
  const users = await getUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.active);
  if (!user) return null;
  if (!verifyPassword(password, user.passwordHash)) return null;

  user.lastLoginAt = new Date().toISOString();
  await saveUsers(users);
  return user;
}

export async function createSessionCookie(user: AdminUser): Promise<void> {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  const token = signSession({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    expiresAt,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(expiresAt),
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

export async function requireAuth(allowedRoles: AdminRole[] = ["Owner", "Admin", "Editor"]): Promise<SessionPayload> {
  const session = await getCurrentSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  if (!allowedRoles.includes(session.role)) {
    throw new Error("FORBIDDEN");
  }
  return session;
}

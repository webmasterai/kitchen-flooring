import { createHash } from "crypto";

export function hashIp(ip: string) {
  const salt = process.env.IP_HASH_SALT || "local-dev-salt";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

export function clientIp(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return headers.get("x-real-ip") || "unknown";
}

/**
 * next.config is often evaluated with NODE_ENV=production even under `next dev`.
 * Detect the running command so React/Next debugging + HMR get a permissive CSP.
 */
function isDevelopmentServer() {
  if (process.env.NODE_ENV === "development") return true;
  if (process.argv.includes("dev")) return true;
  if (process.env.npm_lifecycle_event === "dev") return true;
  return false;
}

/** Production stays strict; development allows React/Next debugging + HMR. */
export function getSecurityHeaders(): Record<string, string> {
  const isDev = isDevelopmentServer();

  return {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Content-Security-Policy": [
      "default-src 'self'",
      "img-src 'self' data: blob:",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      isDev
        ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
        : "script-src 'self' 'unsafe-inline'",
      isDev
        ? "connect-src 'self' ws: wss: http://127.0.0.1:* http://localhost:*"
        : "connect-src 'self'",
      "frame-src 'self' https://www.google.com https://maps.google.com",
      "child-src 'self' https://www.google.com https://maps.google.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  };
}

/** @deprecated Prefer getSecurityHeaders() so dev detection runs at call time. */
export const securityHeaders = getSecurityHeaders();

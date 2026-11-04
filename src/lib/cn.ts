/** Minimal class merge: later tokens override earlier ones for the same prefix group. */
export function cn(...parts: Array<string | false | null | undefined>) {
  const tokens = parts.filter(Boolean).join(" ").trim().split(/\s+/).filter(Boolean);
  const map = new Map<string, string>();
  for (const token of tokens) {
    const key = token.startsWith("h-")
      ? "h"
      : token.startsWith("w-")
        ? "w"
        : token.startsWith("size-")
          ? "size"
          : token.startsWith("text-")
            ? `text:${token}`
            : token;
    map.set(key, token);
  }
  return [...map.values()].join(" ");
}

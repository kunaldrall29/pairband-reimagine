export function newId(prefix: string): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replace(/-/g, "").slice(0, 12)
      : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  return `${prefix}_${rand}`;
}

export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function truncateAddr(addr: string, n = 4): string {
  if (!addr || addr.length < n * 2 + 1) return addr;
  return `${addr.slice(0, n)}…${addr.slice(-n)}`;
}

export function parseTweetUrl(raw: string): {
  url: string;
  handle?: string;
  statusId?: string;
} | null {
  const trimmed = raw.trim();
  const m = trimmed.match(
    /(?:https?:\/\/)?(?:www\.)?(?:twitter|x)\.com\/([^/]+)\/status\/(\d+)/i,
  );
  if (!m) return null;
  return {
    url: `https://x.com/${m[1]}/status/${m[2]}`,
    handle: m[1],
    statusId: m[2],
  };
}

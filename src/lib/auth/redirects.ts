export function safeNextPath(value: unknown, fallback = "/account") {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) return fallback;
  if (value.includes("\\") || /[\u0000-\u001F\u007F]/.test(value)) return fallback;
  try {
    const parsed = new URL(value, "https://talvanta.invalid");
    if (parsed.origin !== "https://talvanta.invalid") return fallback;
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}

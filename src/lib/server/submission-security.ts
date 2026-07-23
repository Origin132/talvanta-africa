const WINDOW_MS = 10 * 60 * 1000;
const SUBMISSION_MAX_ATTEMPTS = 5;
const attempts = new Map<string, number[]>();

async function hashIdentifier(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function hasSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try { return new URL(origin).host === new URL(request.url).host; }
  catch { return false; }
}

export async function isRateLimited(
  request: Request,
  endpoint: string,
  maximumAttempts = SUBMISSION_MAX_ATTEMPTS,
) {
  const forwarded = request.headers.get("x-vercel-forwarded-for") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const identifier = forwarded || request.headers.get("user-agent") || "unidentified-client";
  const key = await hashIdentifier(`${endpoint}:${identifier}`);
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= maximumAttempts) { attempts.set(key, recent); return true; }
  attempts.set(key, [...recent, now]);
  if (attempts.size > 500) for (const [storedKey, times] of attempts) if (!times.some((time) => now - time < WINDOW_MS)) attempts.delete(storedKey);
  return false;
}

// This process-local safeguard resets on restart and is not shared between serverless instances.
// It reduces accidental bursts but must be replaced by platform-level or distributed protection before production use.

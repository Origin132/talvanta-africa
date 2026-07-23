import "server-only";
import type { RecruitmentWebhookPayload, WebhookResult } from "@/types/integrations";

type WebhookKind = "employer" | "candidate";
const DEFAULT_TIMEOUT_MS = 10_000;

function webhookUrl(kind: WebhookKind) {
  return kind === "employer" ? process.env.MAKE_EMPLOYER_WEBHOOK_URL?.trim() : process.env.MAKE_CANDIDATE_WEBHOOK_URL?.trim();
}

function timeoutMs() {
  const configured = Number(process.env.MAKE_WEBHOOK_TIMEOUT_MS ?? DEFAULT_TIMEOUT_MS);
  return Number.isInteger(configured) && configured >= 100 && configured <= 30_000 ? configured : DEFAULT_TIMEOUT_MS;
}

function validWebhookUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || (url.protocol === "http:" && ["localhost", "127.0.0.1", "::1"].includes(url.hostname));
  } catch { return false; }
}

function operationalLog(kind: WebhookKind, category: string, status?: number) {
  const correlation = crypto.randomUUID();
  console.error(`[make-webhook] endpoint=${kind} category=${category}${status ? ` status=${status}` : ""} correlation=${correlation}`);
}

export async function sendToMakeWebhook(kind: WebhookKind, payload: RecruitmentWebhookPayload): Promise<WebhookResult> {
  const url = webhookUrl(kind);
  if (!url || !validWebhookUrl(url)) { operationalLog(kind, "configuration"); return { success: false, category: "configuration" }; }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs());
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    const secret = process.env.MAKE_WEBHOOK_SHARED_SECRET?.trim();
    if (secret) headers["X-Talvanta-Webhook-Secret"] = secret;
    const response = await fetch(url, { method: "POST", headers, body: JSON.stringify(payload), cache: "no-store", signal: controller.signal });
    if (!response.ok) { operationalLog(kind, "upstream", response.status); return { success: false, category: "upstream", upstreamStatus: response.status }; }
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") { operationalLog(kind, "timeout"); return { success: false, category: "timeout" }; }
    operationalLog(kind, "unavailable");
    return { success: false, category: "unavailable" };
  } finally { clearTimeout(timer); }
}

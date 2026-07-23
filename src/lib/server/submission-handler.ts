import { hasSameOrigin, isRateLimited } from "@/lib/server/submission-security";
import type { SubmissionApiResponse } from "@/types/api";
import type { ValidationResult } from "@/lib/validation/submission-validation";
import { sendToMakeWebhook } from "@/lib/server/make-webhook";
import type { RecruitmentWebhookPayload } from "@/types/integrations";

const MAX_BODY_BYTES = 64 * 1024;
type JsonRecord = Record<string, unknown>;
type Config = {
  endpoint: string;
  successMessage: string;
  allowedFields: ReadonlySet<string>;
  validate: (data: JsonRecord) => ValidationResult;
  webhookKind: "employer" | "candidate" | "contact";
  buildWebhookPayload: (data: JsonRecord, submissionId: string) => RecruitmentWebhookPayload;
};

function json(body: SubmissionApiResponse, status: number, headers?: HeadersInit) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

function failure(message: string, status: number, headers?: HeadersInit) {
  return json({ success: false, message }, status, headers);
}

export async function handleSubmission(request: Request, config: Config) {
  try {
    if (!hasSameOrigin(request)) return failure("The submission could not be read. Review the form and try again.", 400);
    if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return failure("This endpoint accepts application/json requests only.", 415);
    const declaredLength = Number(request.headers.get("content-length") ?? "0");
    if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) return failure("The submission is too large to process.", 413);
    const rawBody = await request.text();
    if (!rawBody || new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) return failure(rawBody ? "The submission is too large to process." : "The submission could not be read. Review the form and try again.", rawBody ? 413 : 400);
    let parsed: unknown;
    try { parsed = JSON.parse(rawBody); } catch { return failure("The submission could not be read. Review the form and try again.", 400); }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return failure("The submission could not be read. Review the form and try again.", 400);
    const data = parsed as JsonRecord;
    if (Object.keys(data).some((key) => !config.allowedFields.has(key))) return failure("The submission contains unsupported information.", 400);
    if (data.websiteConfirmation !== undefined && typeof data.websiteConfirmation !== "string") return failure("The submission could not be read. Review the form and try again.", 400);
    if (typeof data.websiteConfirmation === "string" && data.websiteConfirmation.trim()) return json({ success: true, message: config.successMessage, submissionId: crypto.randomUUID() }, 200);
    if (await isRateLimited(request, config.endpoint)) return failure("Too many submission attempts were received. Please wait before trying again.", 429, { "Retry-After": "600" });
    const result = config.validate(data);
    if (!result.valid) return json({ success: false, message: "Some submitted information is invalid.", fieldErrors: result.fieldErrors }, 422);
    const submissionId = crypto.randomUUID();
    const webhookResult = await sendToMakeWebhook(config.webhookKind, config.buildWebhookPayload(data, submissionId));
    if (!webhookResult.success) {
      if (webhookResult.category === "configuration") return failure("Recruitment processing is temporarily unavailable. Please try again later.", 503);
      if (webhookResult.category === "timeout") return failure("Your information could not be forwarded for processing. Please try again.", 504);
      if (webhookResult.category === "upstream") return failure("Your information could not be forwarded for processing. Please try again.", 502);
      if (webhookResult.category === "unavailable") return failure("Recruitment processing is temporarily unavailable. Please try again later.", 503);
      return failure("The submission could not be processed. Please try again.", 500);
    }
    return json({ success: true, message: config.successMessage, submissionId }, 200);
  } catch {
    const correlationId = crypto.randomUUID();
    console.error(`[submission-error] endpoint=${config.endpoint} category=unexpected correlation=${correlationId}`);
    return failure("The submission could not be processed. Please try again.", 500);
  }
}

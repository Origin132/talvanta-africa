import { handleSubmission } from "@/lib/server/submission-handler";
import { buildContactWebhookPayload } from "@/lib/server/make-payloads";
import {
  allowedContactFields,
  validateContactSubmission,
} from "@/lib/validation/submission-validation";

export async function POST(request: Request) {
  return handleSubmission(request, {
    endpoint: "contact",
    successMessage:
      "Your contact enquiry was forwarded for review. Keep the submission reference for future communication.",
    allowedFields: allowedContactFields,
    validate: validateContactSubmission,
    webhookKind: "contact",
    buildWebhookPayload: buildContactWebhookPayload,
  });
}

import { handleSubmission } from "@/lib/server/submission-handler";
import { allowedCandidateFields, validateCandidateSubmission } from "@/lib/validation/submission-validation";
import { buildCandidateWebhookPayload } from "@/lib/server/make-payloads";

export async function POST(request: Request) {
  return handleSubmission(request, {
    endpoint: "candidate-registration",
    successMessage: "Your candidate registration was submitted successfully.",
    allowedFields: allowedCandidateFields,
    validate: validateCandidateSubmission,
    webhookKind: "candidate",
    buildWebhookPayload: buildCandidateWebhookPayload,
  });
}

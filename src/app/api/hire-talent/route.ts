import { handleSubmission } from "@/lib/server/submission-handler";
import { allowedEmployerFields, validateEmployerSubmission } from "@/lib/validation/submission-validation";
import { buildEmployerWebhookPayload } from "@/lib/server/make-payloads";

export async function POST(request: Request) {
  return handleSubmission(request, {
    endpoint: "hire-talent",
    successMessage: "Your hiring enquiry was submitted successfully.",
    allowedFields: allowedEmployerFields,
    validate: validateEmployerSubmission,
    webhookKind: "employer",
    buildWebhookPayload: buildEmployerWebhookPayload,
  });
}

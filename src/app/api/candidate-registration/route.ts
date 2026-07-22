import { handleSubmission } from "@/lib/server/submission-handler";
import { allowedCandidateFields, validateCandidateSubmission } from "@/lib/validation/submission-validation";

export async function POST(request: Request) {
  return handleSubmission(request, {
    endpoint: "candidate-registration",
    successMessage: "Your candidate registration was received successfully.",
    allowedFields: allowedCandidateFields,
    validate: validateCandidateSubmission,
  });
}

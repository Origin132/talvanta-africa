import { handleSubmission } from "@/lib/server/submission-handler";
import { allowedEmployerFields, validateEmployerSubmission } from "@/lib/validation/submission-validation";

export async function POST(request: Request) {
  return handleSubmission(request, {
    endpoint: "hire-talent",
    successMessage: "Your hiring enquiry was received successfully.",
    allowedFields: allowedEmployerFields,
    validate: validateEmployerSubmission,
  });
}

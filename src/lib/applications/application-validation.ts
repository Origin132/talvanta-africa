import { z } from "zod";
import { applicationStatuses } from "@/lib/applications/application-status";

export const applicationIdSchema = z.uuid();
export const applicationFormSchema = z.object({
  coverNote: z.string().trim().max(5000, "Cover note must be 5,000 characters or fewer."),
  candidateDocumentId: z.union([z.literal(""), z.uuid()]),
  accuracyAcknowledged: z.literal("on", {
    error: "Confirm that your profile and application information is accurate.",
  }),
}).strict();
export const statusUpdateSchema = z.object({ status: z.enum(applicationStatuses), publicNote: z.string().trim().max(2000, "Public note must be 2,000 characters or fewer.") }).strict();

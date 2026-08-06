import type { JobApplicationStatus } from "@/lib/supabase/database.types";

export const applicationStatuses = ["submitted", "under-review", "shortlisted", "interview", "offer", "unsuccessful", "withdrawn", "hired"] as const satisfies readonly JobApplicationStatus[];
export const applicationStatusLabels: Record<JobApplicationStatus, string> = { submitted: "Submitted", "under-review": "Under Review", shortlisted: "Shortlisted", interview: "Interview Stage", offer: "Offer Stage", unsuccessful: "Unsuccessful", withdrawn: "Withdrawn", hired: "Hired" };
export const candidateWithdrawableStatuses = ["submitted", "under-review", "shortlisted", "interview"] as const satisfies readonly JobApplicationStatus[];
export const adminApplicationTransitions: Record<JobApplicationStatus, readonly JobApplicationStatus[]> = {
  submitted: ["under-review", "unsuccessful"],
  "under-review": ["shortlisted", "unsuccessful"],
  shortlisted: ["interview", "unsuccessful"],
  interview: ["offer", "unsuccessful"],
  offer: ["hired", "unsuccessful"],
  unsuccessful: [], withdrawn: [], hired: [],
};
export function isApplicationStatus(value: unknown): value is JobApplicationStatus { return typeof value === "string" && applicationStatuses.includes(value as JobApplicationStatus); }
export function canCandidateWithdraw(status: JobApplicationStatus) { return candidateWithdrawableStatuses.includes(status as typeof candidateWithdrawableStatuses[number]); }
export function canAdminTransition(from: JobApplicationStatus, to: JobApplicationStatus) { return adminApplicationTransitions[from].includes(to); }

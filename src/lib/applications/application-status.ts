import type { JobApplicationStatus } from "@/lib/supabase/database.types";

export const applicationStatuses = ["submitted", "under-review", "shortlisted", "interview", "offer", "unsuccessful", "withdrawn", "hired"] as const satisfies readonly JobApplicationStatus[];
export const applicationStatusLabels: Record<JobApplicationStatus, string> = { submitted: "Submitted", "under-review": "Under Review", shortlisted: "Shortlisted", interview: "Interview Stage", offer: "Offer Stage", unsuccessful: "Unsuccessful", withdrawn: "Withdrawn", hired: "Hired" };
export const candidateWithdrawableStatuses = ["submitted", "under-review", "shortlisted", "interview"] as const satisfies readonly JobApplicationStatus[];
export const employerApplicationActionIds = ["begin-review", "shortlist", "move-to-interview", "move-to-offer", "mark-hired", "mark-unsuccessful"] as const;
export type EmployerApplicationActionId = (typeof employerApplicationActionIds)[number];
export const employerApplicationTransitions: Record<JobApplicationStatus, readonly EmployerApplicationActionId[]> = {
  submitted: ["begin-review", "mark-unsuccessful"],
  "under-review": ["shortlist", "mark-unsuccessful"],
  shortlisted: ["move-to-interview", "mark-unsuccessful"],
  interview: ["move-to-offer", "mark-unsuccessful"],
  offer: ["mark-hired", "mark-unsuccessful"],
  unsuccessful: [], withdrawn: [], hired: [],
};
export const employerApplicationActionLabels: Record<EmployerApplicationActionId, string> = { "begin-review": "Begin Review", shortlist: "Shortlist Candidate", "move-to-interview": "Move to Interview Stage", "move-to-offer": "Move to Offer Stage", "mark-hired": "Mark as Hired", "mark-unsuccessful": "Mark Unsuccessful" };
export const employerApplicationActionTargets: Record<EmployerApplicationActionId, JobApplicationStatus> = { "begin-review": "under-review", shortlist: "shortlisted", "move-to-interview": "interview", "move-to-offer": "offer", "mark-hired": "hired", "mark-unsuccessful": "unsuccessful" };
export const employerApplicationSuccessMessages: Record<EmployerApplicationActionId, string> = { "begin-review": "Application moved to Under Review.", shortlist: "Candidate application shortlisted.", "move-to-interview": "Application moved to Interview Stage.", "move-to-offer": "Application moved to Offer Stage.", "mark-hired": "Application marked as Hired.", "mark-unsuccessful": "Application marked as Unsuccessful." };
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
export function getEmployerApplicationTarget(status: JobApplicationStatus, actionId: EmployerApplicationActionId) { return employerApplicationTransitions[status].includes(actionId) ? employerApplicationActionTargets[actionId] : null; }
export function canAdminTransition(from: JobApplicationStatus, to: JobApplicationStatus) { return adminApplicationTransitions[from].includes(to); }

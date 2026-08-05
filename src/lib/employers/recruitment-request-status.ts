import type { RecruitmentRequestStatus } from "@/lib/supabase/database.types";
export const requestStatuses: readonly RecruitmentRequestStatus[] = ["draft", "submitted", "under-review", "clarification-required", "accepted", "declined", "withdrawn", "closed"];
export const statusLabels: Record<RecruitmentRequestStatus, string> = { draft: "Draft", submitted: "Submitted", "under-review": "Under Review", "clarification-required": "Clarification Required", accepted: "Accepted for Further Discussion", declined: "Declined", withdrawn: "Withdrawn", closed: "Closed" };
export const activeStatuses: readonly RecruitmentRequestStatus[] = ["submitted", "under-review", "clarification-required", "accepted"];
export const editableStatuses: readonly RecruitmentRequestStatus[] = ["draft", "clarification-required"];
export const withdrawableStatuses: readonly RecruitmentRequestStatus[] = ["submitted", "under-review", "clarification-required"];
export function isRequestStatus(value: unknown): value is RecruitmentRequestStatus { return typeof value === "string" && requestStatuses.includes(value as RecruitmentRequestStatus); }

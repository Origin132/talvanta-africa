import type { RecruitmentRequestStatus } from "@/lib/supabase/database.types";

export const adminTransitions = {
  draft: [],
  submitted: ["under-review", "clarification-required", "declined"],
  "under-review": ["clarification-required", "accepted", "declined"],
  "clarification-required": ["submitted", "declined"],
  accepted: ["closed"],
  declined: [],
  withdrawn: [],
  closed: [],
} as const satisfies Record<
  RecruitmentRequestStatus,
  readonly RecruitmentRequestStatus[]
>;

export type AdminTargetStatus =
  (typeof adminTransitions)[keyof typeof adminTransitions][number];

export const adminTransitionLabels: Record<AdminTargetStatus, string> = {
  "under-review": "Begin Review",
  "clarification-required": "Request Clarification",
  submitted: "Mark Resubmitted",
  accepted: "Accept for Further Discussion",
  declined: "Decline",
  closed: "Close Request",
};

export function canAdminTransition(
  current: RecruitmentRequestStatus,
  target: RecruitmentRequestStatus,
): target is AdminTargetStatus {
  return (adminTransitions[current] as readonly RecruitmentRequestStatus[]).includes(
    target,
  );
}

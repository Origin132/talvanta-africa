import { statusLabels } from "@/lib/employers/recruitment-request-status"; import type { RecruitmentRequestStatus } from "@/lib/supabase/database.types";
export function RequestStatus({status}:{status:RecruitmentRequestStatus}){return <span className="inline-flex rounded-full border border-border-grey bg-soft-grey px-3 py-1 text-sm font-bold text-navy">Status: {statusLabels[status]}</span>}

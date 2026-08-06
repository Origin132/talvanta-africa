import type { JobApplicationStatus } from "@/lib/supabase/database.types";
import { applicationStatusLabels } from "@/lib/applications/application-status";
export function ApplicationStatus({ status }: { status: JobApplicationStatus }) { return <span className="inline-flex rounded-full border border-border-grey bg-soft-grey px-3 py-1 text-sm font-bold text-navy">Status: {applicationStatusLabels[status]}</span>; }

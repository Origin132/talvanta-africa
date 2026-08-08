import { applicationStatusLabels } from "@/lib/applications/application-status";
import type { JobApplicationStatus, JobApplicationStatusHistory } from "@/lib/supabase/database.types";

const date = (value: string) => new Intl.DateTimeFormat("en-NG", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Lagos" }).format(new Date(value));
const timelineLabel = (status: JobApplicationStatus) => status === "submitted" ? "Application Submitted" : applicationStatusLabels[status];

export function StatusTimeline({ history, currentStatus }: { history: JobApplicationStatusHistory[]; currentStatus?: JobApplicationStatus }) {
  if (!history.length) return currentStatus ? <div><p className="font-bold text-navy">Current status: {applicationStatusLabels[currentStatus]}</p><p className="mt-2 text-slate">No status-history entries are currently available.</p></div> : <p className="text-slate">No status updates are available.</p>;
  return <ol className="relative space-y-5 border-l-2 border-border-grey pl-6">{history.map((item) => <li key={item.id} className="relative"><span aria-hidden className="absolute -left-[31px] mt-2 size-3 rounded-full bg-green" /><p className="font-bold text-navy">{timelineLabel(item.new_status)}</p><time className="text-sm text-slate" dateTime={item.created_at}>{date(item.created_at)}</time>{item.public_note ? <p className="mt-2 whitespace-pre-wrap break-words text-slate">{item.public_note}</p> : null}</li>)}</ol>;
}

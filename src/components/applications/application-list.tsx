import { ApplicationStatus } from "@/components/applications/application-status";
import { ButtonLink } from "@/components/ui/button";
import type { CandidateApplicationView } from "@/lib/applications/candidate-applications";

const date = (value: string) => new Intl.DateTimeFormat("en-NG", { dateStyle: "medium", timeZone: "Africa/Lagos" }).format(new Date(value));

export function ApplicationList({ items, basePath, filtered = false }: { items: Array<Pick<CandidateApplicationView, "application" | "vacancy">>; basePath: string; filtered?: boolean }) {
  if (!items.length) return filtered ? <p className="text-slate">No applications match this status filter.</p> : (
    <div>
      <h2 className="font-heading text-xl font-extrabold text-navy">No Applications Yet</h2>
      <p className="mt-2 leading-7 text-slate">When you apply for a Talvanta Africa opportunity, it will appear here for you to track.</p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row"><ButtonLink href="/jobs">Browse Jobs</ButtonLink><ButtonLink href="/account/candidate/profile" variant="outline">Review Your Profile</ButtonLink></div>
    </div>
  );
  return <div className="grid gap-4">{items.map(({ application, vacancy }) => <article key={application.id} className="min-w-0 rounded-[var(--radius)] border border-border-grey p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><h2 className="break-words font-heading text-xl font-extrabold text-navy">{vacancy?.job_title ?? "Vacancy no longer available"}</h2><p className="break-words text-slate">{vacancy?.organisation_name ?? "Talvanta Africa opportunity"}</p></div><ApplicationStatus status={application.status} /></div><dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4"><Detail term="Location" value={vacancy?.job_location ?? "Unavailable"} /><Detail term="Employment type" value={vacancy?.employment_type ?? "Unavailable"} /><Detail term="Submitted" value={date(application.submitted_at)} /><Detail term="CV attachment" value={application.candidate_document_id ? "CV attached" : "No CV attached"} /></dl><ButtonLink className="mt-5 w-full sm:w-auto" href={`${basePath}/${application.id}`}>View Application</ButtonLink></article>)}</div>;
}

function Detail({ term, value }: { term: string; value: string }) { return <div className="min-w-0"><dt className="font-bold text-navy">{term}</dt><dd className="break-words text-slate">{value}</dd></div>; }

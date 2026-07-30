import { ButtonLink } from "@/components/ui/button";
import type { Job, JobStatus } from "@/lib/jobs";

const statusLabels: Record<JobStatus, string> = {
  open: "Open",
  "closing-soon": "Closing soon",
  closed: "Closed",
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-NG", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(value));
}

export function JobCard({ job }: { job: Job }) {
  return (
    <article className="flex h-full flex-col rounded-[var(--radius)] border border-border-grey bg-white p-6 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-green">{job.organisationDisplayName}</p>
          <h3 className="mt-2 text-2xl font-extrabold leading-tight text-navy">{job.title}</h3>
        </div>
        <span className="rounded-full border border-border-grey bg-soft-grey px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-navy">
          Status: {statusLabels[job.status]}
        </span>
      </div>
      <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <Detail label="Location" value={job.location} />
        <Detail label="Workplace" value={job.workplaceType} />
        <Detail label="Employment" value={job.employmentType} />
        <Detail label="Industry" value={job.industry} />
        {job.salary ? <Detail label="Salary" value={job.salary} /> : null}
        <Detail label="Published" value={formatDate(job.publishedAt)} />
        {job.closingDate ? <Detail label="Closing date" value={formatDate(job.closingDate)} /> : null}
      </dl>
      <p className="mt-6 flex-1 leading-7 text-slate">{job.summary}</p>
      <div className="mt-7"><ButtonLink href={`/jobs/${job.slug}`} variant="outline">View Details</ButtonLink></div>
    </article>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div><dt className="font-bold text-navy">{label}</dt><dd className="mt-1 text-slate">{value}</dd></div>;
}

import { RequestStatus } from "@/components/account/employer/request-status";
import { ButtonLink } from "@/components/ui/button";
import type { AdminRequestSummary } from "@/lib/admin/recruitment-requests";

const date = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat("en-NG", {
        dateStyle: "medium",
        timeZone: "Africa/Lagos",
      }).format(new Date(value))
    : "Not available";

const show = (value: string | number | null) =>
  value === null || value === "" ? "Not provided" : String(value);

export function AdminRequestList({
  requests,
  detailed = false,
}: {
  requests: AdminRequestSummary[];
  detailed?: boolean;
}) {
  if (!requests.length) {
    return <p className="leading-7 text-slate">No recruitment requests match this view.</p>;
  }

  return (
    <div className="grid gap-4">
      {requests.map((request) => (
        <article
          key={request.id}
          className="rounded-[var(--radius)] border border-border-grey bg-white p-5 shadow-sm"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="break-words font-heading text-xl font-extrabold text-navy">
                {request.job_title}
              </h2>
              <p className="mt-1 break-words text-slate">
                {request.organisation_name}
              </p>
            </div>
            <RequestStatus status={request.status} />
          </div>
          <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            {detailed ? (
              <>
                <div>
                  <dt className="font-bold text-navy">Positions</dt>
                  <dd className="text-slate">{show(request.number_of_positions)}</dd>
                </div>
                <div>
                  <dt className="font-bold text-navy">Location</dt>
                  <dd className="break-words text-slate">{show(request.job_location)}</dd>
                </div>
                <div>
                  <dt className="font-bold text-navy">Employment type</dt>
                  <dd className="text-slate">{show(request.employment_type)}</dd>
                </div>
                <div>
                  <dt className="font-bold text-navy">Workplace type</dt>
                  <dd className="text-slate">{show(request.workplace_type)}</dd>
                </div>
              </>
            ) : null}
            <div>
              <dt className="font-bold text-navy">Employer contact</dt>
              <dd className="break-words text-slate">
                {request.employer.contactName ?? "Not available"}
              </dd>
            </div>
            <div>
              <dt className="font-bold text-navy">Created</dt>
              <dd className="text-slate">{date(request.created_at)}</dd>
            </div>
            <div>
              <dt className="font-bold text-navy">Submitted</dt>
              <dd className="text-slate">{date(request.submitted_at)}</dd>
            </div>
          </dl>
          <ButtonLink
            className="mt-5"
            href={`/admin/recruitment-requests/${request.id}`}
          >
            {detailed ? "View Details" : "View Request"}
          </ButtonLink>
        </article>
      ))}
    </div>
  );
}

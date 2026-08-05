import type { Metadata } from "next";
import { updateAdminRequestStatus } from "@/app/admin/recruitment-requests/actions";
import { AdminAccessMessage } from "@/components/admin/admin-access-message";
import { StatusActions } from "@/components/admin/status-actions";
import { AccountCard, AccountPage } from "@/components/account/account-page";
import { RequestStatus } from "@/components/account/employer/request-status";
import { ButtonLink } from "@/components/ui/button";
import { getAdminRequest } from "@/lib/admin/recruitment-requests";
import {
  adminTransitions,
  type AdminTargetStatus,
} from "@/lib/admin/status-transitions";

export const metadata: Metadata = {
  title: "Recruitment Request Details | Talvanta Africa",
  robots: { index: false, follow: false },
};

const show = (value: string | number | null) =>
  value === null || value === "" ? "Not provided" : String(value);
const list = (value: string[] | null) =>
  value?.length ? value.join("\n") : "Not provided";
const date = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat("en-NG", {
        dateStyle: "medium",
        timeZone: "Africa/Lagos",
      }).format(new Date(value))
    : "Not available";
const safeWebsite = (value: string | null) => {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getAdminRequest(id);
  if (data.status === "forbidden" || data.status === "error") {
    return <AdminAccessMessage status={data.status} />;
  }
  if (data.status !== "ready" || !data.request) {
    return (
      <AccountPage
        eyebrow="Administration"
        title="Request unavailable"
        intro="This recruitment request could not be found or is unavailable."
      >
        <ButtonLink href="/admin/recruitment-requests" variant="outline">
          Return to Recruitment Requests
        </ButtonLink>
      </AccountPage>
    );
  }

  const { request } = data;
  const employer = request.employer.employer;
  const website = safeWebsite(employer?.organisation_website ?? null);
  const requestRows: [string, string][] = [
    ["Organisation", request.organisation_name],
    ["Job title", request.job_title],
    ["Department", show(request.department)],
    ["Employment type", show(request.employment_type)],
    ["Workplace type", show(request.workplace_type)],
    ["Number of positions", show(request.number_of_positions)],
    ["Job location", show(request.job_location)],
    ["Preferred start date", show(request.preferred_start_date)],
    ["Recruitment timeline", show(request.recruitment_timeline)],
    ["Salary range", show(request.salary_range)],
    ["Role summary", show(request.role_summary)],
    ["Responsibilities", list(request.responsibilities)],
    ["Required skills", list(request.required_skills)],
    ["Required experience", show(request.required_experience)],
    ["Education requirements", show(request.education_requirements)],
    ["Preferred service", show(request.preferred_service)],
    ["Additional information", show(request.additional_information)],
    ["Created", date(request.created_at)],
    ["Updated", date(request.updated_at)],
    ["Submitted", date(request.submitted_at)],
    ["Withdrawn", date(request.withdrawn_at)],
  ];
  const targets = adminTransitions[request.status] as readonly AdminTargetStatus[];
  const actions = targets.map((target) => ({
    target,
    action: updateAdminRequestStatus.bind(null, id, target),
  }));

  return (
    <AccountPage
      eyebrow="Administration"
      title={request.job_title}
      intro="Review the employer context, vacancy details, and current controlled recruitment status."
    >
      <div className="grid gap-6">
        <AccountCard title="Request Status">
          <RequestStatus status={request.status} />
        </AccountCard>
        <AccountCard title="Employer and Organisation Context">
          {data.contextUnavailable ? (
            <p className="mb-4 text-sm text-slate">
              Some employer context is temporarily unavailable.
            </p>
          ) : null}
          <dl className="grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="font-bold text-navy">Contact name</dt>
              <dd className="mt-1 break-words text-slate">
                {request.employer.contactName ?? "Not available"}
              </dd>
            </div>
            <div>
              <dt className="font-bold text-navy">Email</dt>
              <dd className="mt-1 text-slate">Unavailable in the current authorised data source</dd>
            </div>
            <div>
              <dt className="font-bold text-navy">Contact role</dt>
              <dd className="mt-1 break-words text-slate">
                {show(employer?.contact_role ?? null)}
              </dd>
            </div>
            <div>
              <dt className="font-bold text-navy">Organisation location</dt>
              <dd className="mt-1 break-words text-slate">
                {show(employer?.organisation_location ?? null)}
              </dd>
            </div>
            <div>
              <dt className="font-bold text-navy">Industry</dt>
              <dd className="mt-1 break-words text-slate">
                {show(employer?.industry ?? null)}
              </dd>
            </div>
            <div>
              <dt className="font-bold text-navy">Organisation size</dt>
              <dd className="mt-1 break-words text-slate">
                {show(employer?.organisation_size ?? null)}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="font-bold text-navy">Organisation website</dt>
              <dd className="mt-1 break-words text-slate">
                {website ? (
                  <a
                    className="font-bold text-green underline"
                    href={website}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Visit organisation website
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : (
                  "Not provided"
                )}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="font-bold text-navy">Organisation summary</dt>
              <dd className="mt-1 whitespace-pre-wrap break-words leading-7 text-slate">
                {show(employer?.organisation_summary ?? null)}
              </dd>
            </div>
          </dl>
        </AccountCard>
        <AccountCard title="Vacancy Details">
          <dl className="grid gap-5 sm:grid-cols-2">
            {requestRows.map(([term, value]) => (
              <div key={term} className="min-w-0">
                <dt className="font-bold text-navy">{term}</dt>
                <dd className="mt-1 whitespace-pre-wrap break-words leading-7 text-slate">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </AccountCard>
        <AccountCard title="Status Actions">
          <StatusActions actions={actions} />
        </AccountCard>
      </div>
    </AccountPage>
  );
}

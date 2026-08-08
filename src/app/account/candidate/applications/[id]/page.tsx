import type { Metadata } from "next";
import { withdrawApplication } from "@/app/account/candidate/applications/actions";
import { AccountCard, AccountPage } from "@/components/account/account-page";
import { ApplicationStatus } from "@/components/applications/application-status";
import { StatusTimeline } from "@/components/applications/status-timeline";
import { WithdrawApplication } from "@/components/applications/withdraw-application";
import { ButtonLink } from "@/components/ui/button";
import { canCandidateWithdraw } from "@/lib/applications/application-status";
import { getCandidateApplication } from "@/lib/applications/candidate-applications";

export const metadata: Metadata = { title: "Application Details | Talvanta Africa", robots: { index: false, follow: false } };
const date = (value: string | null) => value ? new Intl.DateTimeFormat("en-NG", { dateStyle: "medium", timeZone: "Africa/Lagos" }).format(new Date(value)) : "Not provided";

export default async function Page({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ withdrawn?: string }> }) {
  const { id } = await params;
  const query = await searchParams;
  const { application, vacancy, history } = await getCandidateApplication(id);
  const vacancyPublic = Boolean(vacancy?.published_at && ["published", "closing-soon"].includes(vacancy.status) && (!vacancy.closes_at || new Date(vacancy.closes_at) > new Date()));
  return (
    <AccountPage eyebrow="Candidate Application" title="Application Details" intro={vacancy ? `${vacancy.job_title} · ${vacancy.organisation_name}` : "Review your submitted application and its current status."}>
      <div className="grid gap-6">
        {query.withdrawn === "1" ? <div role="status" className="rounded-[var(--radius)] border border-green bg-white p-5"><h2 className="font-heading text-xl font-extrabold text-navy">Application Withdrawn</h2><p className="mt-2 text-slate">Your application has been withdrawn and will remain available in your account for reference.</p></div> : null}
        <AccountCard title="Application summary">
          <div className="mb-5"><ApplicationStatus status={application.status} /></div>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Detail term="Job title" value={vacancy?.job_title ?? "Vacancy unavailable"} />
            <Detail term="Organisation" value={vacancy?.organisation_name ?? "Unavailable"} />
            <Detail term="Location" value={vacancy?.job_location ?? "Unavailable"} />
            <Detail term="Employment type" value={vacancy?.employment_type ?? "Unavailable"} />
            <Detail term="Workplace type" value={vacancy?.workplace_type ?? "Unavailable"} />
            <Detail term="Submitted" value={date(application.submitted_at)} />
            <Detail term="CV attachment" value={application.candidate_document_id ? "CV attached" : "No CV attached"} />
            <Detail term="Vacancy closing date" value={date(vacancy?.closes_at ?? null)} />
          </dl>
          <h2 className="mt-7 font-heading text-xl font-extrabold text-navy">Cover note</h2>
          <p className="mt-2 whitespace-pre-wrap break-words text-slate">{application.cover_note || "No cover note was provided."}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {vacancyPublic && vacancy ? <ButtonLink href={`/jobs/${vacancy.slug}`}>View Vacancy</ButtonLink> : null}
            <ButtonLink href="/jobs" variant="outline">Browse More Jobs</ButtonLink>
          </div>
          {!vacancyPublic ? <p className="mt-4 text-slate">This vacancy is no longer publicly available.</p> : null}
          {canCandidateWithdraw(application.status) ? <WithdrawApplication action={withdrawApplication.bind(null, application.id)} /> : null}
        </AccountCard>
        <AccountCard title="Application status timeline"><StatusTimeline history={history} currentStatus={application.status} /></AccountCard>
      </div>
    </AccountPage>
  );
}

function Detail({ term, value }: { term: string; value: string }) { return <div className="min-w-0"><dt className="font-bold text-navy">{term}</dt><dd className="break-words text-slate">{value}</dd></div>; }

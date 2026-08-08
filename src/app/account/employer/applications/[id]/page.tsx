import type { Metadata } from "next";
import { updateEmployerApplicationStatus } from "@/app/account/employer/applications/[id]/actions";
import { AccountCard, AccountPage } from "@/components/account/account-page";
import { ApplicationStatus } from "@/components/applications/application-status";
import { EmployerApplicationActions } from "@/components/applications/employer-application-actions";
import { StatusTimeline } from "@/components/applications/status-timeline";
import { ButtonLink } from "@/components/ui/button";
import { applicationStatusLabels } from "@/lib/applications/application-status";
import { getEmployerApplicationById, isEmployerVacancyPublic } from "@/lib/applications/employer-applications";
import { vacancyStatusLabels } from "@/lib/vacancies/vacancy-status";

export const metadata: Metadata = { title: "Application Details | Talvanta Africa Employer Account", robots: { index: false, follow: false } };
const date = (value: string) => new Intl.DateTimeFormat("en-NG", { dateStyle: "medium", timeZone: "Africa/Lagos" }).format(new Date(value));

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { application, vacancy, candidate, history } = await getEmployerApplicationById(id);
  const vacancyPublic = isEmployerVacancyPublic(vacancy);
  return (
    <AccountPage eyebrow="Employer Account" title="Candidate Application" intro={`Application for ${vacancy.job_title} at ${vacancy.organisation_name}.`}>
      <div className="grid gap-6 lg:grid-cols-2">
        <AccountCard title="Candidate professional summary">
          <ApplicationStatus status={application.status} />
          <dl className="mt-5 grid gap-4 sm:grid-cols-2"><Detail term="Full name" value={candidate.full_name} /><Detail term="Professional title" value={candidate.professional_title} /><Detail term="Current location" value={candidate.current_location} /><Detail term="Years of relevant experience" value={candidate.years_of_experience === null ? null : `${candidate.years_of_experience} years`} /><Detail term="Professional summary" value={candidate.professional_summary} /><Detail term="Preferred roles" value={candidate.preferred_roles?.join(", ") ?? null} /></dl>
          <p className="mt-5 text-sm leading-6 text-slate">Candidate contact information is not yet available through this review stage.</p>
        </AccountCard>
        <AccountCard title="Application content">
          <dl className="grid gap-4 sm:grid-cols-2"><Detail term="Submitted" value={date(application.submitted_at)} /><Detail term="Current status" value={applicationStatusLabels[application.status]} /></dl>
          <h2 className="mt-6 font-heading text-xl font-extrabold text-navy">Cover note</h2><p className="mt-2 whitespace-pre-wrap break-words leading-7 text-slate">{application.cover_note || "No cover note was provided."}</p>
        </AccountCard>
        <AccountCard title={application.candidate_document_id ? "CV Attached" : "No CV Attached"}>
          <p className="text-slate">{application.candidate_document_id ? "A CV was attached to this application." : "No CV was attached to this application."}</p>
          {application.candidate_document_id ? <p className="mt-2 text-slate">Document access will be introduced through a separately authorised recruitment stage.</p> : null}
        </AccountCard>
        <AccountCard title="Vacancy Details">
          <dl className="grid gap-4 sm:grid-cols-2"><Detail term="Job title" value={vacancy.job_title} /><Detail term="Location" value={vacancy.job_location} /><Detail term="Employment type" value={vacancy.employment_type} /><Detail term="Workplace type" value={vacancy.workplace_type} /><Detail term="Number of positions" value={String(vacancy.number_of_positions)} /><Detail term="Public vacancy status" value={vacancyStatusLabels[vacancy.status]} /></dl>
          {vacancyPublic ? <ButtonLink className="mt-5" href={`/jobs/${vacancy.slug}`}>View Public Vacancy</ButtonLink> : <p className="mt-5 text-slate">This vacancy is no longer publicly available.</p>}
        </AccountCard>
        <AccountCard title="Application status timeline"><StatusTimeline history={history} currentStatus={application.status} /></AccountCard>
        <AccountCard title="Recruitment Actions"><EmployerApplicationActions action={updateEmployerApplicationStatus.bind(null, application.id)} currentStatus={application.status} /></AccountCard>
      </div>
    </AccountPage>
  );
}

function Detail({ term, value }: { term: string; value: string | null }) { return <div className="min-w-0"><dt className="font-bold text-navy">{term}</dt><dd className="whitespace-pre-wrap break-words text-slate">{value || "Not provided"}</dd></div>; }

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { submitApplication } from "@/app/jobs/[slug]/apply/actions";
import { AccountCard, AccountPage } from "@/components/account/account-page";
import { ApplicationForm } from "@/components/applications/application-form";
import { ButtonLink } from "@/components/ui/button";
import { getCandidateCompletion, getCandidateProfileSummary, getExistingApplication, requireCandidateApplications } from "@/lib/applications/candidate-applications";
import { getCurrentCv } from "@/lib/documents/get-current-cv";
import { getPublicVacancy } from "@/lib/jobs";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const vacancy = await getPublicVacancy(slug);
  return { title: vacancy ? `Apply for ${vacancy.job_title} | Talvanta Africa` : "Apply | Talvanta Africa", robots: { index: false, follow: false } };
}

const readableSize = (bytes: number) => bytes < 1024 ? `${bytes} bytes` : bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
const readableDate = (value: string) => new Intl.DateTimeFormat("en-NG", { dateStyle: "long", timeZone: "Africa/Lagos" }).format(new Date(value));

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const current = await requireCandidateApplications(`/jobs/${slug}/apply`);
  const vacancy = await getPublicVacancy(slug);
  if (!vacancy || !vacancy.applications_open || !vacancy.published_at) notFound();

  if (await getExistingApplication(vacancy.id, current.user.id)) {
    return (
      <AccountPage eyebrow="Candidate Application" title="Application Already Submitted" intro="You have already submitted an application for this opportunity.">
        <ButtonLink href="/account/candidate">View Your Applications</ButtonLink>
      </AccountPage>
    );
  }

  const [profile, cv] = await Promise.all([getCandidateProfileSummary(current.user.id), getCurrentCv(current.user.id)]);
  const completion = getCandidateCompletion(current.profile, profile);
  return (
    <AccountPage eyebrow="Candidate Application" title={`Apply for ${vacancy.job_title}`} intro={`${vacancy.organisation_name} · ${vacancy.job_location} · ${vacancy.employment_type}`}>
      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.65fr)]">
        <AccountCard title="Application">
          <ApplicationForm action={submitApplication.bind(null, slug)} cv={cv ? { id: cv.id, originalFilename: cv.original_filename } : null} />
        </AccountCard>
        <div className="grid min-w-0 content-start gap-6">
          <AccountCard title="Candidate profile">
            <dl className="grid gap-3 sm:grid-cols-2">
              <Summary label="Full name" value={current.profile.full_name} />
              <Summary label="Professional title" value={profile?.professional_title ?? "Not provided"} />
              <Summary label="Current location" value={profile?.current_location ?? "Not provided"} />
              <Summary label="Years of experience" value={profile?.years_of_experience === null || profile?.years_of_experience === undefined ? "Not provided" : String(profile.years_of_experience)} />
              <Summary label="Preferred roles" value={profile?.preferred_roles?.length ? profile.preferred_roles.join(", ") : "Not provided"} />
              <Summary label="Profile completion" value={`${completion}% complete`} />
            </dl>
            <ButtonLink className="mt-5 w-full sm:w-auto" href="/account/candidate/profile" variant="outline">Review Profile</ButtonLink>
          </AccountCard>
          <AccountCard title="Current CV">
            {cv ? (
              <dl className="grid gap-3">
                <Summary label="Filename" value={cv.original_filename} breakAll />
                <Summary label="File size" value={readableSize(cv.file_size_bytes)} />
                <Summary label="Uploaded" value={readableDate(cv.uploaded_at)} />
              </dl>
            ) : (
              <>
                <p className="text-slate">No CV is currently associated with your candidate account.</p>
                <ButtonLink className="mt-4 w-full sm:w-auto" href="/account/candidate/documents" variant="outline">Upload Your CV</ButtonLink>
              </>
            )}
          </AccountCard>
        </div>
      </div>
    </AccountPage>
  );
}

function Summary({ label, value, breakAll = false }: { label: string; value: string; breakAll?: boolean }) {
  return <div className="min-w-0"><dt className="font-bold text-navy">{label}</dt><dd className={`text-slate ${breakAll ? "break-all" : "break-words"}`}>{value}</dd></div>;
}

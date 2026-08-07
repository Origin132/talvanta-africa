import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AccountPage } from "@/components/account/account-page";
import { ButtonLink } from "@/components/ui/button";
import { getExistingApplication, requireCandidateApplications } from "@/lib/applications/candidate-applications";
import { getPublicVacancy } from "@/lib/jobs";

export const metadata: Metadata = { title: "Application Submitted | Talvanta Africa", robots: { index: false, follow: false } };

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const current = await requireCandidateApplications(`/jobs/${slug}/apply/success`);
  const vacancy = await getPublicVacancy(slug);
  if (!vacancy || !await getExistingApplication(vacancy.id, current.user.id)) notFound();
  return (
    <AccountPage eyebrow="Candidate Application" title="Application Submitted" intro="Your application has been recorded successfully. Submission does not guarantee shortlisting, an interview, an offer, or employment.">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <ButtonLink href="/jobs">Return to Jobs</ButtonLink>
        <ButtonLink href="/account/candidate" variant="outline">Go to Candidate Dashboard</ButtonLink>
      </div>
    </AccountPage>
  );
}

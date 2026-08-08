import type { Metadata } from "next";
import { AccountCard, AccountPage } from "@/components/account/account-page";
import { ApplicationList } from "@/components/applications/application-list";
import { ButtonLink } from "@/components/ui/button";
import { applicationStatuses, applicationStatusLabels, isApplicationStatus } from "@/lib/applications/application-status";
import { getCandidateApplications } from "@/lib/applications/candidate-applications";

export const metadata: Metadata = { title: "Your Applications | Talvanta Africa", robots: { index: false, follow: false } };

export default async function Page({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const params = await searchParams;
  const filter = isApplicationStatus(params.status) ? params.status : null;
  const data = await getCandidateApplications(filter);
  return (
    <AccountPage eyebrow="Candidate Account" title="Your Job Applications" intro="Review the opportunities you have applied for and track their current status.">
      <div className="grid gap-6">
        <AccountCard title="Filter applications">
          <nav aria-label="Application status filters">
            <ul className="flex gap-2 overflow-x-auto pb-1" role="list">
              <li className="shrink-0"><ButtonLink href="/account/candidate/applications" variant={!filter ? "primary" : "outline"} ariaCurrent={!filter ? "page" : undefined}>All</ButtonLink></li>
              {applicationStatuses.map((status) => <li key={status} className="shrink-0"><ButtonLink href={`/account/candidate/applications?status=${status}`} variant={filter === status ? "primary" : "outline"} ariaCurrent={filter === status ? "page" : undefined}>{applicationStatusLabels[status]}</ButtonLink></li>)}
            </ul>
          </nav>
        </AccountCard>
        <AccountCard>
          {data.unavailable ? <p role="status" className="mb-4 text-slate">Applications are temporarily unavailable.</p> : null}
          <ApplicationList items={data.items} basePath="/account/candidate/applications" filtered={Boolean(filter)} />
        </AccountCard>
      </div>
    </AccountPage>
  );
}

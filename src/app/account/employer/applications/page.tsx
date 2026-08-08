import type { Metadata } from "next";
import { AccountCard, AccountPage } from "@/components/account/account-page";
import { EmployerApplicationList } from "@/components/applications/employer-application-list";
import { ButtonLink } from "@/components/ui/button";
import { applicationStatuses, applicationStatusLabels, isApplicationStatus } from "@/lib/applications/application-status";
import { getEmployerApplications } from "@/lib/applications/employer-applications";

export const metadata: Metadata = { title: "Applications | Talvanta Africa Employer Account", robots: { index: false, follow: false } };

export default async function Page({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const params = await searchParams;
  const filter = isApplicationStatus(params.status) ? params.status : null;
  const data = await getEmployerApplications(filter);
  return (
    <AccountPage eyebrow="Employer Account" title="Candidate Applications" intro="Review applications submitted to opportunities associated with your organisation.">
      <div className="grid gap-6">
        <AccountCard title="Filter applications">
          <nav aria-label="Application status filters"><ul className="flex gap-2 overflow-x-auto pb-1" role="list"><li className="shrink-0"><ButtonLink href="/account/employer/applications" variant={!filter ? "primary" : "outline"} ariaCurrent={!filter ? "page" : undefined}>All</ButtonLink></li>{applicationStatuses.map((status) => <li key={status} className="shrink-0"><ButtonLink href={`/account/employer/applications?status=${status}`} variant={filter === status ? "primary" : "outline"} ariaCurrent={filter === status ? "page" : undefined}>{applicationStatusLabels[status]}</ButtonLink></li>)}</ul></nav>
        </AccountCard>
        <AccountCard>
          {data.unavailable ? <p role="alert" className="mb-4 text-slate">We could not load applications for your organisation at this time.</p> : null}
          <EmployerApplicationList items={data.items} filtered={Boolean(filter)} />
        </AccountCard>
        <AccountCard title="Read-only application review">
          <p className="font-bold text-navy">Application review is currently read-only in the employer account.</p>
          <p className="mt-2 leading-7 text-slate">Recruitment-stage actions such as shortlisting, interview progression, offer management, and final outcomes will be introduced through the next controlled workflow stage.</p>
        </AccountCard>
      </div>
    </AccountPage>
  );
}

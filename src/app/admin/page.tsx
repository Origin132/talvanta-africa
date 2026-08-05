import type { Metadata } from "next";
import { AdminAccessMessage } from "@/components/admin/admin-access-message";
import { AdminRequestList } from "@/components/admin/admin-request-list";
import { AccountCard, AccountPage } from "@/components/account/account-page";
import { getAdminDashboard } from "@/lib/admin/recruitment-requests";

export const metadata: Metadata = {
  title: "Recruitment Operations | Talvanta Africa",
  robots: { index: false, follow: false },
};

export default async function Page() {
  const data = await getAdminDashboard();
  if (data.status !== "ready") return <AdminAccessMessage status={data.status} />;

  const cards = [
    ["Submitted Requests", data.counts.submitted],
    ["Under Review", data.counts.reviewing],
    ["Clarification Required", data.counts.clarification],
    ["Accepted for Further Discussion", data.counts.accepted],
  ] as const;

  return (
    <AccountPage
      eyebrow="Administration"
      title="Recruitment Operations"
      intro="Review authenticated employer recruitment requests and manage their current review status."
    >
      <div className="grid gap-6">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(([title, count]) => (
            <AccountCard key={title} title={title}>
              <p className="text-3xl font-extrabold text-navy">{count}</p>
            </AccountCard>
          ))}
        </div>
        <AccountCard title="Recent Recruitment Requests">
          {data.contextUnavailable ? (
            <p className="mb-4 text-sm text-slate">
              Some employer contact context is temporarily unavailable.
            </p>
          ) : null}
          <AdminRequestList requests={[...data.requests]} />
        </AccountCard>
      </div>
    </AccountPage>
  );
}

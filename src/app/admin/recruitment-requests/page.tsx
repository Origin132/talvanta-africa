import type { Metadata } from "next";
import Link from "next/link";
import { AdminAccessMessage } from "@/components/admin/admin-access-message";
import { AdminRequestList } from "@/components/admin/admin-request-list";
import { AccountCard, AccountPage } from "@/components/account/account-page";
import { ButtonLink } from "@/components/ui/button";
import {
  ADMIN_PAGE_SIZE,
  adminReviewStatuses,
  getAdminRequests,
  isAdminReviewStatus,
  parseAdminPage,
} from "@/lib/admin/recruitment-requests";
import { statusLabels } from "@/lib/employers/recruitment-request-status";

export const metadata: Metadata = {
  title: "Recruitment Request Review | Talvanta Africa",
  robots: { index: false, follow: false },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const filter = isAdminReviewStatus(params.status) ? params.status : null;
  const requestedPage = parseAdminPage(params.page);
  const data = await getAdminRequests(filter, requestedPage);
  if (data.status !== "ready") return <AdminAccessMessage status={data.status} />;

  const totalPages = Math.max(1, Math.ceil(data.total / ADMIN_PAGE_SIZE));
  const page = Math.min(data.page, totalPages);
  const filterQuery = filter ? `status=${filter}&` : "";

  return (
    <AccountPage
      eyebrow="Administration"
      title="Recruitment Requests"
      intro="Review authenticated employer recruitment requests using controlled status filters and server-side pagination."
    >
      <div className="grid gap-6">
        <AccountCard title="Filter requests">
          <nav aria-label="Recruitment request status filters">
            <ul className="flex flex-wrap gap-2">
              <li>
                <ButtonLink
                  href="/admin/recruitment-requests"
                  variant={!filter ? "primary" : "outline"}
                  ariaCurrent={!filter ? "page" : undefined}
                >
                  All
                </ButtonLink>
              </li>
              {adminReviewStatuses.map((status) => (
                <li key={status}>
                  <ButtonLink
                    href={`/admin/recruitment-requests?status=${status}`}
                    variant={filter === status ? "primary" : "outline"}
                    ariaCurrent={filter === status ? "page" : undefined}
                  >
                    {statusLabels[status]}
                  </ButtonLink>
                </li>
              ))}
            </ul>
          </nav>
        </AccountCard>
        <AccountCard>
          {data.contextUnavailable ? (
            <p className="mb-4 text-sm text-slate">
              Some employer contact context is temporarily unavailable.
            </p>
          ) : null}
          <AdminRequestList requests={[...data.requests]} detailed />
        </AccountCard>
        <nav
          className="flex flex-wrap items-center justify-between gap-3"
          aria-label="Recruitment request pages"
        >
          <p className="text-sm text-slate">
            Page {page} of {totalPages} · {data.total} requests
          </p>
          <div className="flex gap-3">
            {page > 1 ? (
              <Link
                className="inline-flex min-h-11 items-center font-bold text-green underline"
                href={`/admin/recruitment-requests?${filterQuery}page=${page - 1}`}
              >
                Previous page
              </Link>
            ) : null}
            {page < totalPages ? (
              <Link
                className="inline-flex min-h-11 items-center font-bold text-green underline"
                href={`/admin/recruitment-requests?${filterQuery}page=${page + 1}`}
              >
                Next page
              </Link>
            ) : null}
          </div>
        </nav>
      </div>
    </AccountPage>
  );
}

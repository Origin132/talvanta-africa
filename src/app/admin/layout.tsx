import type { Metadata } from "next";
import Link from "next/link";
import { AdminAccessMessage } from "@/components/admin/admin-access-message";
import { AdminNavigation } from "@/components/admin/admin-navigation";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { PageContainer } from "@/components/layout/page-container";
import { requireAdmin } from "@/lib/admin/require-admin";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function Layout({ children }: { children: React.ReactNode }) {
  const access = await requireAdmin("/admin");
  return (
    <div className="min-h-[60vh] bg-soft-grey">
      <div className="bg-navy text-white">
        <PageContainer>
          <div className="py-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-heading text-xl font-extrabold">
                  Talvanta Africa Administration
                </p>
                <p className="mt-1 text-sm text-white/80">
                  Secure recruitment operations
                </p>
              </div>
              {access.status === "ready" ? <SignOutButton /> : null}
            </div>
            {access.status === "ready" ? <AdminNavigation /> : null}
          </div>
        </PageContainer>
      </div>
      <PageContainer>
        {access.status === "ready" ? (
          children
        ) : (
          <AdminAccessMessage status={access.status} />
        )}
        <p className="pb-8 text-sm text-slate">
          <Link className="font-bold text-green underline" href="/">
            Return to the public website
          </Link>
        </p>
      </PageContainer>
    </div>
  );
}

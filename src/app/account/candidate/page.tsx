import type { Metadata } from "next";
import { AccountPage } from "@/components/account/account-page";
import { CandidateDashboardCards } from "@/components/account/candidate-dashboard-cards";
import { DashboardActivityAndActions, DashboardProfileAndPreferences } from "@/components/account/candidate-dashboard-sections";
import { getCandidateDashboardData } from "@/lib/candidates/get-candidate-dashboard";
export const metadata: Metadata = { title: "Candidate Dashboard | Talvanta Africa", robots: { index: false, follow: false } };
export default async function Page() { const data = await getCandidateDashboardData(); const name = data.current.profile.full_name.trim().split(/\s+/)[0]; const heading = name ? `Welcome back, ${name}` : "Welcome to your candidate account"; return <AccountPage eyebrow="Candidate Account" title={heading} intro="Manage your professional profile, CV, career preferences, and account information from one secure place."><div className="grid gap-6"><CandidateDashboardCards data={data} /><DashboardProfileAndPreferences candidate={data.candidate} /><DashboardActivityAndActions data={data} /></div></AccountPage>; }

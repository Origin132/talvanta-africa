import type { Metadata } from "next";
import { AccountPage } from "@/components/account/account-page";
import { CandidateFullProfile } from "@/components/account/candidate-dashboard-sections";
import { getCandidateDashboardData } from "@/lib/candidates/get-candidate-dashboard";
export const metadata: Metadata = { title: "Candidate Profile | Talvanta Africa", robots: { index: false, follow: false } };
export default async function Page() { const data = await getCandidateDashboardData("/account/candidate/profile"); return <AccountPage eyebrow="Candidate Account" title="Your Professional Profile" intro="Review the professional and career information associated with your candidate account."><CandidateFullProfile data={data} /></AccountPage>; }

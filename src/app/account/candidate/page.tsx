import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AccountCard, AccountPage } from "@/components/account/account-page";
import { ButtonLink } from "@/components/ui/button";
import { CandidateDetails, MissingRoleProfile } from "@/components/account/profile-details";
import { ProfileCompletion } from "@/components/account/profile-completion";
import { candidateCompletion } from "@/lib/profiles/profile-completion";
import { getRoleProfile, requireAccountType } from "@/lib/profiles/get-current-profile";
export const metadata: Metadata = { title: "Candidate Profile | Talvanta Africa", robots: { index: false, follow: false } };
export default async function Page() { const current = await requireAccountType("candidate"); if (!current.profile.onboarding_completed) redirect("/account/onboarding/candidate"); const details = await getRoleProfile("candidate", current.user.id); return <AccountPage eyebrow="Candidate Account" title="Your Candidate Profile" intro="Review and maintain the professional information associated with your authenticated account."><div className="grid gap-6"><AccountCard><ProfileCompletion value={candidateCompletion(current.profile, details)} /></AccountCard><AccountCard title="Profile Information">{details ? <CandidateDetails profile={current.profile} details={details} email={current.user.email ?? "Email unavailable"} /> : <MissingRoleProfile />}</AccountCard><AccountCard title="Documents"><p className="leading-7 text-slate">Upload and manage the current PDF CV associated with your candidate account.</p><ButtonLink className="mt-5" href="/account/candidate/documents">Manage Documents</ButtonLink></AccountCard></div></AccountPage>; }

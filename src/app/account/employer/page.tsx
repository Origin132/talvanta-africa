import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AccountCard, AccountPage } from "@/components/account/account-page";
import { EmployerDetails, MissingRoleProfile } from "@/components/account/profile-details";
import { ProfileCompletion } from "@/components/account/profile-completion";
import { employerCompletion } from "@/lib/profiles/profile-completion";
import { getRoleProfile, requireAccountType } from "@/lib/profiles/get-current-profile";
export const metadata: Metadata = { title: "Employer Profile | Talvanta Africa", robots: { index: false, follow: false } };
export default async function Page() { const current = await requireAccountType("employer"); if (!current.profile.onboarding_completed) redirect("/account/onboarding/employer"); const details = await getRoleProfile("employer", current.user.id); return <AccountPage eyebrow="Employer Account" title="Your Employer Profile" intro="Review and maintain the organisation information associated with your authenticated account."><div className="grid gap-6"><AccountCard><ProfileCompletion value={employerCompletion(current.profile, details)} /></AccountCard><AccountCard title="Profile Information">{details ? <EmployerDetails profile={current.profile} details={details} email={current.user.email ?? "Email unavailable"} /> : <MissingRoleProfile />}</AccountCard><AccountCard title="Recruitment Requests"><p className="leading-7 text-slate">Authenticated recruitment-request management will be added in a later development stage.</p></AccountCard></div></AccountPage>; }

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AccountCard, AccountPage } from "@/components/account/account-page";
import { ProfileForm } from "@/components/account/profile-form";
import { getRoleProfile, requireAccountType } from "@/lib/profiles/get-current-profile";
export const metadata: Metadata = { title: "Candidate Onboarding | Talvanta Africa", robots: { index: false, follow: false } };
export default async function Page() { const current = await requireAccountType("candidate"); if (current.profile.onboarding_completed) redirect("/account/candidate"); const details = await getRoleProfile("candidate", current.user.id); return <AccountPage eyebrow="Candidate Account" title="Complete Your Candidate Profile" intro="Provide the professional information needed to establish your Talvanta Africa candidate account. You can update these details later."><AccountCard><ProfileForm type="candidate" profile={current.profile} details={details} /></AccountCard></AccountPage>; }

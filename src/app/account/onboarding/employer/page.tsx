import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AccountCard, AccountPage } from "@/components/account/account-page";
import { ProfileForm } from "@/components/account/profile-form";
import { getRoleProfile, requireAccountType } from "@/lib/profiles/get-current-profile";
export const metadata: Metadata = { title: "Employer Onboarding | Talvanta Africa", robots: { index: false, follow: false } };
export default async function Page() { const current = await requireAccountType("employer"); if (current.profile.onboarding_completed) redirect("/account/employer"); const details = await getRoleProfile("employer", current.user.id); return <AccountPage eyebrow="Employer Account" title="Complete Your Employer Profile" intro="Provide accurate organisation and authorised-contact information to establish your Talvanta Africa employer account."><AccountCard><ProfileForm type="employer" profile={current.profile} details={details} /></AccountCard></AccountPage>; }

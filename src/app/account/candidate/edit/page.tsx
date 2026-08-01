import type { Metadata } from "next";
import { AccountCard, AccountPage } from "@/components/account/account-page";
import { ProfileForm } from "@/components/account/profile-form";
import { getRoleProfile, requireAccountType } from "@/lib/profiles/get-current-profile";
export const metadata: Metadata = { title: "Edit Candidate Profile | Talvanta Africa", robots: { index: false, follow: false } };
export default async function Page() { const current = await requireAccountType("candidate"); const details = await getRoleProfile("candidate", current.user.id); return <AccountPage eyebrow="Candidate Account" title="Edit Your Candidate Profile" intro="Update your professional information and preferences."><AccountCard><ProfileForm type="candidate" profile={current.profile} details={details} /></AccountCard></AccountPage>; }

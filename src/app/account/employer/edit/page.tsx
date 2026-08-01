import type { Metadata } from "next";
import { AccountCard, AccountPage } from "@/components/account/account-page";
import { ProfileForm } from "@/components/account/profile-form";
import { getRoleProfile, requireAccountType } from "@/lib/profiles/get-current-profile";
export const metadata: Metadata = { title: "Edit Employer Profile | Talvanta Africa", robots: { index: false, follow: false } };
export default async function Page() { const current = await requireAccountType("employer"); const details = await getRoleProfile("employer", current.user.id); return <AccountPage eyebrow="Employer Account" title="Edit Your Employer Profile" intro="Update your organisation and authorised-contact information."><AccountCard><ProfileForm type="employer" profile={current.profile} details={details} /></AccountCard></AccountPage>; }

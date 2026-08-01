import { redirect } from "next/navigation";
import { CandidateNavigation } from "@/components/account/candidate-navigation";
import { requireAccountType } from "@/lib/profiles/get-current-profile";
export default async function Layout({ children }: { children: React.ReactNode }) { const current = await requireAccountType("candidate", "/account/candidate"); if (!current.profile.onboarding_completed) redirect("/account/onboarding/candidate"); return <><CandidateNavigation />{children}</>; }

import type { CandidateProfile, EmployerProfile, Profile } from "@/lib/supabase/database.types";

const present = (value: string | null | undefined) => Boolean(value?.trim());
const percentage = (checks: boolean[]) => Math.round((checks.filter(Boolean).length / checks.length) * 100);

export function candidateCompletion(profile: Profile, details: CandidateProfile | null) {
  return percentage([present(profile.full_name), present(details?.phone), present(details?.current_location), present(details?.professional_title), present(details?.professional_summary), Boolean(details?.preferred_roles?.length)]);
}
export function nextCandidateProfileStep(profile: Profile, details: CandidateProfile | null) {
  const steps: readonly [boolean, string][] = [
    [present(profile.full_name), "Add your full name"],
    [present(details?.phone), "Add your phone number"],
    [present(details?.current_location), "Add your current location"],
    [present(details?.professional_title), "Add your professional title"],
    [present(details?.professional_summary), "Add your professional summary"],
    [Boolean(details?.preferred_roles?.length), "Add at least one preferred role"],
  ];
  return steps.find(([complete]) => !complete)?.[1] ?? "Review your profile information";
}
export function employerCompletion(profile: Profile, details: EmployerProfile | null) {
  return percentage([present(profile.full_name), present(details?.organisation_name), present(details?.contact_role), present(details?.phone), present(details?.organisation_location), present(details?.organisation_summary)]);
}
export function nextEmployerProfileStep(profile: Profile, details: EmployerProfile | null) { const steps: readonly [boolean,string][]=[[present(profile.full_name),"Add the authorised contact name"],[present(details?.organisation_name),"Add the organisation name"],[present(details?.contact_role),"Add the contact role"],[present(details?.phone),"Add a telephone number"],[present(details?.organisation_location),"Add the organisation location"],[present(details?.organisation_summary),"Add the organisation summary"]]; return steps.find(([complete])=>!complete)?.[1]??"Review the organisation profile"; }

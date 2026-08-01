import type { CandidateProfile, EmployerProfile, Profile } from "@/lib/supabase/database.types";

const present = (value: string | null | undefined) => Boolean(value?.trim());
const percentage = (checks: boolean[]) => Math.round((checks.filter(Boolean).length / checks.length) * 100);

export function candidateCompletion(profile: Profile, details: CandidateProfile | null) {
  return percentage([present(profile.full_name), present(details?.phone), present(details?.current_location), present(details?.professional_title), present(details?.professional_summary), Boolean(details?.preferred_roles?.length)]);
}
export function employerCompletion(profile: Profile, details: EmployerProfile | null) {
  return percentage([present(profile.full_name), present(details?.organisation_name), present(details?.contact_role), present(details?.phone), present(details?.organisation_location), present(details?.organisation_summary)]);
}

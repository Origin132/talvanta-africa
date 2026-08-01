import "server-only";
import type { CandidateDocument, CandidateProfile } from "@/lib/supabase/database.types";
import { requireAccountType } from "@/lib/profiles/get-current-profile";
import { createClient } from "@/lib/supabase/server";

export type CandidateDashboardData = {
  current: Awaited<ReturnType<typeof requireAccountType>>;
  candidate: CandidateProfile | null;
  candidateUnavailable: boolean;
  cv: CandidateDocument | null;
  cvUnavailable: boolean;
};

export async function getCandidateDashboardData(nextPath = "/account/candidate"): Promise<CandidateDashboardData> {
  const current = await requireAccountType("candidate", nextPath);
  const supabase = await createClient();
  const [candidateResult, documentResult] = await Promise.all([
    supabase.from("candidate_profiles").select("user_id, phone, current_location, professional_title, years_of_experience, professional_summary, linkedin_url, portfolio_url, preferred_roles, preferred_locations, preferred_employment_types, preferred_workplace_types, created_at, updated_at").eq("user_id", current.user.id).maybeSingle(),
    supabase.from("candidate_documents").select("id, user_id, document_type, bucket_name, storage_path, original_filename, stored_filename, mime_type, file_size_bytes, uploaded_at, updated_at").eq("user_id", current.user.id).eq("document_type", "cv").maybeSingle(),
  ]);
  return { current, candidate: candidateResult.data, candidateUnavailable: Boolean(candidateResult.error), cv: documentResult.data, cvUnavailable: Boolean(documentResult.error) };
}

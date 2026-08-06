import "server-only";
import { notFound, redirect } from "next/navigation";
import { applicationIdSchema } from "@/lib/applications/application-validation";
import { getCurrentProfile } from "@/lib/profiles/get-current-profile";
import type { CandidateProfile, JobApplication, JobApplicationStatus, JobApplicationStatusHistory, Vacancy } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";

const applicationColumns = "id, vacancy_id, candidate_user_id, candidate_document_id, cover_note, status, submitted_at, withdrawn_at, created_at, updated_at";
const vacancyColumns = "id, slug, job_title, organisation_name, employment_type, workplace_type, job_location, status, applications_open, closes_at";
const historyColumns = "id, application_id, previous_status, new_status, changed_by_user_id, change_source, public_note, created_at";
export type ApplicationVacancy = Pick<Vacancy, "id" | "slug" | "job_title" | "organisation_name" | "employment_type" | "workplace_type" | "job_location" | "status" | "applications_open" | "closes_at">;
export type CandidateApplicationView = { application: JobApplication; vacancy: ApplicationVacancy; history: JobApplicationStatusHistory[] };

export async function requireCandidateApplications(nextPath: string) {
  const current = await getCurrentProfile();
  if (current.status === "unauthenticated") redirect(`/sign-in?next=${encodeURIComponent(nextPath)}`);
  if (current.status !== "ready" || current.profile.account_type !== "candidate") redirect("/account");
  if (!current.profile.onboarding_completed) redirect("/account/onboarding/candidate");
  return current;
}
export async function getCandidateProfileSummary(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("candidate_profiles").select("user_id, professional_title, current_location, professional_summary, preferred_roles").eq("user_id", userId).maybeSingle();
  return data as Pick<CandidateProfile, "user_id" | "professional_title" | "current_location" | "professional_summary" | "preferred_roles"> | null;
}
export async function getCandidateApplications(status: JobApplicationStatus | null) {
  const current = await requireCandidateApplications("/account/candidate/applications"); const supabase = await createClient();
  let query = supabase.from("job_applications").select(applicationColumns).eq("candidate_user_id", current.user.id).order("submitted_at", { ascending: false }).limit(50);
  if (status) query = query.eq("status", status);
  const { data, error } = await query; const applications = error ? [] : (data as JobApplication[]);
  const vacancyIds = [...new Set(applications.map((item) => item.vacancy_id))];
  const vacancies = vacancyIds.length ? await supabase.from("vacancies").select(vacancyColumns).in("id", vacancyIds) : { data: [], error: null };
  const map = new Map(((vacancies.data ?? []) as ApplicationVacancy[]).map((item) => [item.id, item]));
  return { items: applications.flatMap((application) => { const vacancy = map.get(application.vacancy_id); return vacancy ? [{ application, vacancy }] : []; }), unavailable: Boolean(error || vacancies.error) };
}
export async function getCandidateApplication(id: string): Promise<CandidateApplicationView> {
  const current = await requireCandidateApplications(`/account/candidate/applications/${id}`); const parsed = applicationIdSchema.safeParse(id); if (!parsed.success) notFound(); const supabase = await createClient();
  const { data } = await supabase.from("job_applications").select(applicationColumns).eq("id", id).eq("candidate_user_id", current.user.id).maybeSingle(); if (!data) notFound(); const application = data as JobApplication;
  const [vacancyResult, historyResult] = await Promise.all([supabase.from("vacancies").select(vacancyColumns).eq("id", application.vacancy_id).maybeSingle(), supabase.from("job_application_status_history").select(historyColumns).eq("application_id", application.id).order("created_at", { ascending: true }).limit(100)]);
  if (!vacancyResult.data) notFound(); return { application, vacancy: vacancyResult.data as ApplicationVacancy, history: (historyResult.data ?? []) as JobApplicationStatusHistory[] };
}
export async function getExistingApplication(vacancyId: string, candidateId: string) { const supabase = await createClient(); const { data } = await supabase.from("job_applications").select("id").eq("vacancy_id", vacancyId).eq("candidate_user_id", candidateId).maybeSingle(); return data?.id ?? null; }

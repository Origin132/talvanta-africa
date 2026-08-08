import "server-only";

import { notFound, redirect } from "next/navigation";
import { applicationIdSchema } from "@/lib/applications/application-validation";
import { requireAccountType } from "@/lib/profiles/get-current-profile";
import type { JobApplicationStatus, JobApplicationStatusHistory, VacancyStatus } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";

const applicationListColumns = "id, vacancy_id, candidate_user_id, candidate_document_id, status, submitted_at";
const applicationDetailColumns = `${applicationListColumns}, cover_note`;
const vacancyColumns = "id, slug, job_title, organisation_name, job_location, employment_type, workplace_type, number_of_positions, status, published_at, closes_at, employer_user_id";
const historyColumns = "id, application_id, previous_status, new_status, changed_by_user_id, change_source, public_note, created_at";

type EmployerApplicationRow = { id: string; vacancy_id: string; candidate_user_id: string; candidate_document_id: string | null; status: JobApplicationStatus; submitted_at: string };
type EmployerApplicationDetailRow = EmployerApplicationRow & { cover_note: string | null };
export type EmployerApplicationVacancy = { id: string; slug: string; job_title: string; organisation_name: string; job_location: string; employment_type: string; workplace_type: string; number_of_positions: number; status: VacancyStatus; published_at: string | null; closes_at: string | null; employer_user_id: string | null };
export type EmployerCandidateSummary = { full_name: string; professional_title: string | null; current_location: string | null; years_of_experience: number | null; professional_summary: string | null; preferred_roles: string[] | null };
export type EmployerApplicationListItem = { application: EmployerApplicationRow; vacancy: EmployerApplicationVacancy; candidate: Pick<EmployerCandidateSummary, "full_name" | "professional_title" | "current_location"> };
export type EmployerApplicationDetail = { application: EmployerApplicationDetailRow; vacancy: EmployerApplicationVacancy; candidate: EmployerCandidateSummary; history: JobApplicationStatusHistory[] };

async function requireEmployerApplications(nextPath: string) {
  const current = await requireAccountType("employer", nextPath);
  if (!current.profile.onboarding_completed) redirect("/account/onboarding/employer");
  return current;
}

export async function getEmployerApplications(status: JobApplicationStatus | null) {
  const current = await requireEmployerApplications("/account/employer/applications");
  const supabase = await createClient();
  const vacancyResult = await supabase.from("vacancies").select(vacancyColumns).eq("employer_user_id", current.user.id).limit(1000);
  if (vacancyResult.error) return { items: [], unavailable: true };
  const vacancies = vacancyResult.data as EmployerApplicationVacancy[];
  if (!vacancies.length) return { items: [], unavailable: false };
  const vacancyIds = vacancies.map((vacancy) => vacancy.id);
  let query = supabase.from("job_applications").select(applicationListColumns).in("vacancy_id", vacancyIds).order("submitted_at", { ascending: false }).limit(50);
  if (status) query = query.eq("status", status);
  const applicationResult = await query;
  if (applicationResult.error) return { items: [], unavailable: true };
  const applications = applicationResult.data as EmployerApplicationRow[];
  const candidateIds = [...new Set(applications.map((application) => application.candidate_user_id))];
  const [profileResult, candidateResult] = candidateIds.length ? await Promise.all([
    supabase.from("profiles").select("id, full_name").in("id", candidateIds),
    supabase.from("candidate_profiles").select("user_id, professional_title, current_location").in("user_id", candidateIds),
  ]) : [{ data: [], error: null }, { data: [], error: null }];
  if (profileResult.error || candidateResult.error) return { items: [], unavailable: true };
  const vacancyMap = new Map(vacancies.map((vacancy) => [vacancy.id, vacancy]));
  const profileMap = new Map((profileResult.data ?? []).map((profile) => [profile.id, profile.full_name]));
  const candidateMap = new Map((candidateResult.data ?? []).map((candidate) => [candidate.user_id, candidate]));
  const items = applications.flatMap((application): EmployerApplicationListItem[] => {
    const vacancy = vacancyMap.get(application.vacancy_id);
    const fullName = profileMap.get(application.candidate_user_id);
    if (!vacancy || vacancy.employer_user_id !== current.user.id || !fullName) return [];
    const candidate = candidateMap.get(application.candidate_user_id);
    return [{ application, vacancy, candidate: { full_name: fullName, professional_title: candidate?.professional_title ?? null, current_location: candidate?.current_location ?? null } }];
  });
  return { items, unavailable: false };
}

export async function getEmployerApplicationById(id: string): Promise<EmployerApplicationDetail> {
  const current = await requireEmployerApplications(`/account/employer/applications/${id}`);
  if (!applicationIdSchema.safeParse(id).success) notFound();
  const supabase = await createClient();
  const applicationResult = await supabase.from("job_applications").select(applicationDetailColumns).eq("id", id).maybeSingle();
  if (applicationResult.error || !applicationResult.data) notFound();
  const application = applicationResult.data as EmployerApplicationDetailRow;
  const vacancyResult = await supabase.from("vacancies").select(vacancyColumns).eq("id", application.vacancy_id).eq("employer_user_id", current.user.id).maybeSingle();
  if (vacancyResult.error || !vacancyResult.data) notFound();
  const [profileResult, candidateResult, historyResult] = await Promise.all([
    supabase.from("profiles").select("id, full_name").eq("id", application.candidate_user_id).maybeSingle(),
    supabase.from("candidate_profiles").select("user_id, professional_title, current_location, years_of_experience, professional_summary, preferred_roles").eq("user_id", application.candidate_user_id).maybeSingle(),
    supabase.from("job_application_status_history").select(historyColumns).eq("application_id", application.id).order("created_at", { ascending: true }).limit(100),
  ]);
  if (profileResult.error || !profileResult.data || candidateResult.error) notFound();
  return {
    application,
    vacancy: vacancyResult.data as EmployerApplicationVacancy,
    candidate: { full_name: profileResult.data.full_name, professional_title: candidateResult.data?.professional_title ?? null, current_location: candidateResult.data?.current_location ?? null, years_of_experience: candidateResult.data?.years_of_experience ?? null, professional_summary: candidateResult.data?.professional_summary ?? null, preferred_roles: candidateResult.data?.preferred_roles ?? null },
    history: historyResult.error ? [] : historyResult.data as JobApplicationStatusHistory[],
  };
}

export function isEmployerVacancyPublic(vacancy: EmployerApplicationVacancy) {
  return Boolean(vacancy.published_at && ["published", "closing-soon"].includes(vacancy.status) && (!vacancy.closes_at || new Date(vacancy.closes_at) > new Date()));
}

export async function getEmployerApplicationMutationContext(id: string) {
  const current = await requireEmployerApplications(`/account/employer/applications/${id}`);
  if (!applicationIdSchema.safeParse(id).success) return null;
  const supabase = await createClient();
  const applicationResult = await supabase.from("job_applications").select("id, vacancy_id, status").eq("id", id).maybeSingle();
  if (applicationResult.error || !applicationResult.data) return null;
  const vacancyResult = await supabase.from("vacancies").select("id").eq("id", applicationResult.data.vacancy_id).eq("employer_user_id", current.user.id).maybeSingle();
  if (vacancyResult.error || !vacancyResult.data) return null;
  return { current, application: applicationResult.data };
}

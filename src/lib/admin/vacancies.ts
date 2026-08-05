import "server-only";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/require-admin";
import type { RecruitmentRequest, Vacancy, VacancyStatus } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";
import { isVacancyStatus } from "@/lib/vacancies/vacancy-status";

const columns = "id, recruitment_request_id, employer_user_id, slug, job_title, organisation_name, department, employment_type, workplace_type, job_location, number_of_positions, salary_range, role_summary, responsibilities, required_skills, required_experience, education_requirements, application_instructions, status, applications_open, published_at, closes_at, created_at, updated_at";
export const ADMIN_VACANCY_PAGE_SIZE = 20;
export function parseVacancyPage(value: unknown) { const page = typeof value === "string" && /^\d+$/.test(value) ? Number(value) : 1; return Number.isSafeInteger(page) && page > 0 ? Math.min(page, 10000) : 1; }

export async function getAdminVacancies(status: VacancyStatus | null, page: number) {
  const access = await requireAdmin("/admin/vacancies"); if (access.status !== "ready") return { status: access.status } as const;
  const supabase = await createClient(); const first = (page - 1) * ADMIN_VACANCY_PAGE_SIZE;
  let query = supabase.from("vacancies").select(columns, { count: "exact" }).order("created_at", { ascending: false }).range(first, first + ADMIN_VACANCY_PAGE_SIZE - 1);
  if (status) query = query.eq("status", status);
  const result = await query; if (result.error) return { status: "error" } as const;
  return { status: "ready", vacancies: (result.data ?? []) as Vacancy[], total: result.count ?? 0, page } as const;
}
export async function getAdminVacancy(id: string, next = `/admin/vacancies/${id}`) {
  const access = await requireAdmin(next); if (access.status !== "ready") return { status: access.status } as const;
  const parsed = z.uuid().safeParse(id); if (!parsed.success) return { status: "unavailable" } as const;
  const supabase = await createClient(); const { data, error } = await supabase.from("vacancies").select(columns).eq("id", parsed.data).maybeSingle();
  return error || !data ? { status: "unavailable" } as const : { status: "ready", vacancy: data as Vacancy, adminUserId: access.user.id } as const;
}
export async function getAcceptedRequestPrefill(value: string | undefined) {
  if (!value) return null; const access = await requireAdmin(`/admin/vacancies/new?recruitment_request=${encodeURIComponent(value)}`); if (access.status !== "ready") return null;
  const parsed = z.uuid().safeParse(value); if (!parsed.success) return null;
  const supabase = await createClient(); const { data, error } = await supabase.from("recruitment_requests").select("id, employer_user_id, organisation_name, job_title, department, employment_type, workplace_type, number_of_positions, job_location, salary_range, role_summary, responsibilities, required_skills, required_experience, education_requirements, status").eq("id", parsed.data).eq("status", "accepted").maybeSingle();
  return error || !data ? null : (data as Pick<RecruitmentRequest, "id" | "employer_user_id" | "organisation_name" | "job_title" | "department" | "employment_type" | "workplace_type" | "number_of_positions" | "job_location" | "salary_range" | "role_summary" | "responsibilities" | "required_skills" | "required_experience" | "education_requirements" | "status">);
}
export function validVacancyFilter(value: unknown): VacancyStatus | null { return isVacancyStatus(value) ? value : null; }

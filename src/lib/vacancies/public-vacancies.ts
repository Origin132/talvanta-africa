import "server-only";
import { createClient } from "@/lib/supabase/server";
import { publicVacancyStatuses } from "@/lib/vacancies/vacancy-status";

const publicColumns = "slug, job_title, organisation_name, department, employment_type, workplace_type, job_location, number_of_positions, salary_range, role_summary, responsibilities, required_skills, required_experience, education_requirements, application_instructions, status, applications_open, published_at, closes_at";
export type PublicVacancy = { slug: string; job_title: string; organisation_name: string; department: string | null; employment_type: string; workplace_type: string; job_location: string; number_of_positions: number; salary_range: string | null; role_summary: string; responsibilities: string[] | null; required_skills: string[] | null; required_experience: string | null; education_requirements: string | null; application_instructions: string | null; status: "published" | "closing-soon"; applications_open: boolean; published_at: string | null; closes_at: string | null };
export const publicEmploymentTypes = ["Permanent", "Temporary", "Contract", "Internship", "Graduate role", "Part-time", "Other"] as const;
export const publicWorkplaceTypes = ["On-site", "Hybrid", "Remote", "To be discussed"] as const;

export async function getPublicVacancies(filters?: { employmentType?: string; workplaceType?: string; location?: string; status?: string }) {
  const supabase = await createClient();
  let query = supabase.from("vacancies").select(publicColumns).in("status", publicVacancyStatuses).gt("closes_at", new Date().toISOString()).order("published_at", { ascending: false }).limit(50);
  if (filters?.employmentType && publicEmploymentTypes.includes(filters.employmentType as typeof publicEmploymentTypes[number])) query = query.eq("employment_type", filters.employmentType);
  if (filters?.workplaceType && publicWorkplaceTypes.includes(filters.workplaceType as typeof publicWorkplaceTypes[number])) query = query.eq("workplace_type", filters.workplaceType);
  if (filters?.status && publicVacancyStatuses.includes(filters.status as typeof publicVacancyStatuses[number])) query = query.eq("status", filters.status as typeof publicVacancyStatuses[number]);
  const location = filters?.location?.trim().slice(0, 100);
  if (location) query = query.ilike("job_location", `%${location.replace(/[%_]/g, "\\$&")}%`);
  const { data, error } = await query;
  return { vacancies: error ? [] : (data as PublicVacancy[]), unavailable: Boolean(error) };
}

export async function getPublicVacancy(slug: string) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 220) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.from("vacancies").select(publicColumns).eq("slug", slug).in("status", publicVacancyStatuses).gt("closes_at", new Date().toISOString()).maybeSingle();
  return error || !data ? null : (data as PublicVacancy);
}

export async function getPublicVacancySitemapEntries() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("vacancies").select("slug, updated_at").in("status", publicVacancyStatuses).gt("closes_at", new Date().toISOString()).order("published_at", { ascending: false }).limit(1000);
  return error ? [] : data ?? [];
}

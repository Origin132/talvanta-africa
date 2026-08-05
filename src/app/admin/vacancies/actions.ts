"use server";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/require-admin";
import { getAcceptedRequestPrefill, getAdminVacancy } from "@/lib/admin/vacancies";
import type { VacancyInsert, VacancyStatus, VacancyUpdate } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";
import { canTransitionVacancy, type VacancyTargetStatus } from "@/lib/vacancies/vacancy-status";
import { draftVacancySchema, publishedVacancySchema, vacancyFormFields } from "@/lib/vacancies/vacancy-validation";

export type VacancyActionState = { status: "idle" | "error"; message?: string; errors?: Record<string, string>; values?: Record<string, string> };
export type VacancyMutationState = { status: "idle" | "success" | "error"; message?: string };
const names = vacancyFormFields as readonly string[];
const values = (form: FormData) => Object.fromEntries(names.filter((name) => name !== "intent").map((name) => [name, name === "applicationsOpen" ? form.get(name) === "on" : typeof form.get(name) === "string" ? form.get(name) : ""]));
const fieldErrors = (issues: { path: PropertyKey[]; message: string }[]) => Object.fromEntries(issues.map((issue) => [String(issue.path[0]), issue.message]));
const slugify = (title: string) => `${title.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 180) || "vacancy"}-${randomUUID().slice(0, 8)}`;
const revalidateVacancies = (slug?: string) => { revalidatePath("/admin/vacancies", "layout"); revalidatePath("/jobs"); revalidatePath("/sitemap.xml"); if (slug) revalidatePath(`/jobs/${slug}`); };

export async function saveVacancy(id: string | null, sourceRequestId: string | null, _: VacancyActionState, form: FormData): Promise<VacancyActionState> {
  const retained = Object.fromEntries(Object.entries(values(form)).map(([key, value]) => [key, String(value)]));
  const access = await requireAdmin(id ? `/admin/vacancies/${id}/edit` : "/admin/vacancies/new"); if (access.status !== "ready") return { status: "error", message: "We could not save this vacancy. Please try again.", values: retained };
  const keys = [...form.keys()].filter((key) => !key.startsWith("$ACTION_")); if (keys.some((key) => !names.includes(key))) return { status: "error", message: "We could not save this vacancy. Review the information and try again.", values: retained };
  const intent = form.get("intent"); if (intent !== "save" && intent !== "publish") return { status: "error", message: "Choose Save Draft or Publish Vacancy.", values: retained };
  let existing = null; if (id) { const loaded = await getAdminVacancy(id, `/admin/vacancies/${id}/edit`); if (loaded.status !== "ready" || !loaded.vacancy || !["draft", "published", "closing-soon"].includes(loaded.vacancy.status)) return { status: "error", message: "This vacancy can no longer be edited.", values: retained }; existing = loaded.vacancy; }
  const parsed = (intent === "publish" || (existing && existing.status !== "draft") ? publishedVacancySchema : draftVacancySchema).safeParse(values(form)); if (!parsed.success) return { status: "error", message: "Review the highlighted fields and try again.", errors: fieldErrors(parsed.error.issues), values: retained };
  let source = null; if (!id && sourceRequestId) { source = await getAcceptedRequestPrefill(sourceRequestId); if (!source) return { status: "error", message: "The source recruitment request is unavailable.", values: retained }; }
  const data = parsed.data; const now = new Date().toISOString(); const status: VacancyStatus = intent === "publish" ? "published" : existing?.status ?? "draft";
  const payload: VacancyUpdate = { job_title: data.jobTitle, organisation_name: data.organisationName, department: data.department, employment_type: data.employmentType, workplace_type: data.workplaceType, job_location: data.jobLocation, number_of_positions: data.numberOfPositions, salary_range: data.salaryRange, role_summary: data.roleSummary, responsibilities: data.responsibilities, required_skills: data.requiredSkills, required_experience: data.requiredExperience, education_requirements: data.educationRequirements, application_instructions: data.applicationInstructions, closes_at: data.closingDate ? new Date(data.closingDate).toISOString() : null, status, applications_open: status === "draft" ? false : data.applicationsOpen, published_at: status === "published" ? existing?.published_at ?? now : existing?.published_at ?? null, updated_at: now };
  const supabase = await createClient(); let vacancyId = id; let slug = existing?.slug;
  if (existing && id) { const result = await supabase.from("vacancies").update(payload).eq("id", id).in("status", ["draft", "published", "closing-soon"]).select("id, slug").maybeSingle(); if (result.error || !result.data) return { status: "error", message: "We could not save this vacancy. Please try again.", values: retained }; }
  else { slug = slugify(data.jobTitle); const insert: VacancyInsert = { ...payload, slug, job_title: data.jobTitle, organisation_name: data.organisationName, employment_type: data.employmentType, workplace_type: data.workplaceType, job_location: data.jobLocation, number_of_positions: data.numberOfPositions, role_summary: data.roleSummary, status, applications_open: payload.applications_open ?? false, created_by_admin_user_id: access.user.id, recruitment_request_id: source?.id ?? null, employer_user_id: source?.employer_user_id ?? null, created_at: now }; const result = await supabase.from("vacancies").insert(insert).select("id").single(); if (result.error) return { status: "error", message: "We could not save this vacancy. Please try again.", values: retained }; vacancyId = result.data.id; }
  revalidateVacancies(slug); redirect(`/admin/vacancies/${vacancyId}${intent === "publish" ? "?published=1" : "?saved=1"}`);
}

export async function transitionVacancy(id: string, target: VacancyTargetStatus, _: VacancyMutationState, form: FormData): Promise<VacancyMutationState> {
  const access = await requireAdmin(`/admin/vacancies/${id}`); if (access.status !== "ready" || target === "published" || [...form.keys()].some((key) => !key.startsWith("$ACTION_")) || !z.uuid().safeParse(id).success) return { status: "error", message: "We could not update this vacancy. Please try again." };
  const loaded = await getAdminVacancy(id); if (loaded.status !== "ready" || !loaded.vacancy || !canTransitionVacancy(loaded.vacancy.status, target)) return { status: "error", message: "This vacancy status change is not available." };
  if (target === "closing-soon" && (!loaded.vacancy.closes_at || new Date(loaded.vacancy.closes_at).getTime() <= Date.now())) return { status: "error", message: "A future closing date is required before marking this vacancy Closing Soon." };
  const update: VacancyUpdate = { status: target, updated_at: new Date().toISOString() }; if (target === "closed" || target === "archived") update.applications_open = false;
  const supabase = await createClient(); const result = await supabase.from("vacancies").update(update).eq("id", id).eq("status", loaded.vacancy.status).select("id").maybeSingle(); if (result.error || !result.data) return { status: "error", message: "We could not update this vacancy. Please try again." };
  revalidateVacancies(loaded.vacancy.slug); return { status: "success", message: "Vacancy status updated." };
}
export async function deleteDraftVacancy(id: string, _: VacancyMutationState, form: FormData): Promise<VacancyMutationState> {
  const access = await requireAdmin(`/admin/vacancies/${id}`); if (access.status !== "ready" || [...form.keys()].some((key) => !key.startsWith("$ACTION_"))) return { status: "error", message: "We could not delete this vacancy. Please try again." };
  const loaded = await getAdminVacancy(id); if (loaded.status !== "ready" || loaded.vacancy?.status !== "draft") return { status: "error", message: "Only draft vacancies may be deleted." };
  const supabase = await createClient(); const result = await supabase.from("vacancies").delete().eq("id", id).eq("status", "draft").select("id").maybeSingle(); if (result.error || !result.data) return { status: "error", message: "We could not delete this vacancy. Please try again." };
  revalidateVacancies(); redirect("/admin/vacancies?deleted=1");
}

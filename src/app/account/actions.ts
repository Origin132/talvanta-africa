"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { AccountType } from "@/lib/supabase/database.types";
import { getCurrentProfile } from "@/lib/profiles/get-current-profile";
import { candidateSchema, employerSchema } from "@/lib/profiles/profile-validation";
import { createClient } from "@/lib/supabase/server";

export type ProfileActionState = { status: "idle" | "error"; message?: string; errors?: Record<string, string>; values?: Record<string, string | string[]> };
const actionKeys = (form: FormData) => [...form.keys()].filter((key) => !key.startsWith("$ACTION_"));
const value = (form: FormData, name: string) => { const item = form.get(name); return typeof item === "string" ? item : ""; };
const valuesFor = (form: FormData, names: readonly string[], arrays: readonly string[] = []) => Object.fromEntries(names.map((name) => [name, arrays.includes(name) ? form.getAll(name).filter((item): item is string => typeof item === "string") : value(form, name)]));
const fieldErrors = (issues: { path: PropertyKey[]; message: string }[]) => Object.fromEntries(issues.map((issue) => [String(issue.path[0]), issue.message]));
const genericFailure = "We could not save your profile. Review the information provided and try again.";

async function authorized(type: AccountType) {
  const current = await getCurrentProfile();
  return current.status === "ready" && current.profile.account_type === type ? current : null;
}

export async function saveCandidateProfile(_: ProfileActionState, form: FormData): Promise<ProfileActionState> {
  const names = ["fullName", "phone", "currentLocation", "professionalTitle", "yearsOfExperience", "professionalSummary", "linkedinUrl", "portfolioUrl", "preferredRoles", "preferredLocations", "preferredEmploymentTypes", "preferredWorkplaceTypes"] as const;
  const arrays = ["preferredEmploymentTypes", "preferredWorkplaceTypes"];
  const retained = valuesFor(form, names, arrays);
  if (actionKeys(form).some((key) => !names.includes(key as typeof names[number]))) return { status: "error", message: genericFailure, values: retained };
  const parsed = candidateSchema.safeParse({ ...retained, preferredEmploymentTypes: retained.preferredEmploymentTypes, preferredWorkplaceTypes: retained.preferredWorkplaceTypes });
  if (!parsed.success) return { status: "error", message: "Review the highlighted fields and try again.", errors: fieldErrors(parsed.error.issues), values: retained };
  const current = await authorized("candidate");
  if (!current) return { status: "error", message: "You do not have permission to access this account information.", values: retained };
  const supabase = await createClient();
  const data = parsed.data;
  const { error: roleError } = await supabase.from("candidate_profiles").upsert({ user_id: current.user.id, phone: data.phone, current_location: data.currentLocation, professional_title: data.professionalTitle, years_of_experience: data.yearsOfExperience, professional_summary: data.professionalSummary, linkedin_url: data.linkedinUrl, portfolio_url: data.portfolioUrl, preferred_roles: data.preferredRoles, preferred_locations: data.preferredLocations, preferred_employment_types: data.preferredEmploymentTypes, preferred_workplace_types: data.preferredWorkplaceTypes }, { onConflict: "user_id" });
  if (roleError) return { status: "error", message: roleError.code === "42501" ? "You do not have permission to access this account information." : genericFailure, values: retained };
  const { error: nameError } = await supabase.from("profiles").update({ full_name: data.fullName }).eq("id", current.user.id);
  if (nameError) return { status: "error", message: genericFailure, values: retained };
  const { error: completionError } = await supabase.from("profiles").update({ onboarding_completed: true }).eq("id", current.user.id);
  if (completionError) return { status: "error", message: genericFailure, values: retained };
  revalidatePath("/account", "layout"); redirect("/account/candidate");
}

export async function saveEmployerProfile(_: ProfileActionState, form: FormData): Promise<ProfileActionState> {
  const names = ["fullName", "organisationName", "organisationWebsite", "industry", "organisationSize", "contactRole", "phone", "organisationLocation", "organisationSummary"] as const;
  const retained = valuesFor(form, names);
  if (actionKeys(form).some((key) => !names.includes(key as typeof names[number]))) return { status: "error", message: genericFailure, values: retained };
  const parsed = employerSchema.safeParse(retained);
  if (!parsed.success) return { status: "error", message: "Review the highlighted fields and try again.", errors: fieldErrors(parsed.error.issues), values: retained };
  const current = await authorized("employer");
  if (!current) return { status: "error", message: "You do not have permission to access this account information.", values: retained };
  const supabase = await createClient(); const data = parsed.data;
  const { error: roleError } = await supabase.from("employer_profiles").upsert({ user_id: current.user.id, organisation_name: data.organisationName, organisation_website: data.organisationWebsite, industry: data.industry, organisation_size: data.organisationSize, contact_role: data.contactRole, phone: data.phone, organisation_location: data.organisationLocation, organisation_summary: data.organisationSummary }, { onConflict: "user_id" });
  if (roleError) return { status: "error", message: roleError.code === "42501" ? "You do not have permission to access this account information." : genericFailure, values: retained };
  const { error: nameError } = await supabase.from("profiles").update({ full_name: data.fullName }).eq("id", current.user.id);
  if (nameError) return { status: "error", message: genericFailure, values: retained };
  const { error: completionError } = await supabase.from("profiles").update({ onboarding_completed: true }).eq("id", current.user.id);
  if (completionError) return { status: "error", message: genericFailure, values: retained };
  revalidatePath("/account", "layout"); redirect("/account/employer");
}

export async function recoverProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/account");
  const accountType = user.user_metadata?.account_type;
  const fullName = typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name.trim().slice(0, 100) : "";
  if ((accountType !== "candidate" && accountType !== "employer") || fullName.length < 2) redirect("/contact");
  const { data: existing } = await supabase.from("profiles").select("id").eq("id", user.id).maybeSingle();
  if (!existing) {
    const { error } = await supabase.from("profiles").insert({ id: user.id, full_name: fullName, account_type: accountType });
    if (error) redirect("/contact");
  }
  revalidatePath("/account", "layout"); redirect("/account");
}

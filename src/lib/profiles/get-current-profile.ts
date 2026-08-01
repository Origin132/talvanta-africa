import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import type { AccountType, CandidateProfile, EmployerProfile, Profile } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";

export type CurrentProfileResult =
  | { status: "unauthenticated" }
  | { status: "missing"; user: User }
  | { status: "unsupported"; user: User }
  | { status: "forbidden"; user: User }
  | { status: "error"; user: User }
  | { status: "ready"; user: User; profile: Profile };

export const getCurrentProfile = cache(async (): Promise<CurrentProfileResult> => {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { status: "unauthenticated" };
  const { data, error } = await supabase.from("profiles").select("id, full_name, account_type, onboarding_completed, created_at, updated_at").eq("id", user.id).maybeSingle();
  if (error) return { status: error.code === "42501" ? "forbidden" : "error", user };
  if (!data) return { status: "missing", user };
  if (data.account_type !== "candidate" && data.account_type !== "employer") return { status: "unsupported", user };
  return { status: "ready", user, profile: data };
});

export async function getRoleProfile<T extends AccountType>(accountType: T, userId: string): Promise<(T extends "candidate" ? CandidateProfile : EmployerProfile) | null> {
  const supabase = await createClient();
  const table = accountType === "candidate" ? "candidate_profiles" : "employer_profiles";
  const { data } = await supabase.from(table).select("*").eq("user_id", userId).maybeSingle();
  return data as (T extends "candidate" ? CandidateProfile : EmployerProfile) | null;
}

export async function requireAccountType(accountType: AccountType) {
  const current = await getCurrentProfile();
  if (current.status === "unauthenticated") redirect(`/sign-in?next=/account/${accountType}`);
  if (current.status !== "ready" || current.profile.account_type !== accountType) redirect("/account");
  return current;
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { applicationIdSchema } from "@/lib/applications/application-validation";
import { canCandidateWithdraw } from "@/lib/applications/application-status";
import { requireCandidateApplications } from "@/lib/applications/candidate-applications";
import type { JobApplicationStatusHistoryInsert, JobApplicationUpdate } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";

export type WithdrawalState = { status: "idle" | "success" | "error"; message?: string };

export async function withdrawApplication(id: string, _: WithdrawalState, form: FormData): Promise<WithdrawalState> {
  const current = await requireCandidateApplications(`/account/candidate/applications/${id}`);
  if (!applicationIdSchema.safeParse(id).success || [...form.keys()].some((key) => !key.startsWith("$ACTION_"))) return { status: "error", message: "We could not withdraw this application at this time. Please try again." };
  const supabase = await createClient();
  const loaded = await supabase.from("job_applications").select("id, status").eq("id", id).eq("candidate_user_id", current.user.id).maybeSingle();
  if (loaded.error || !loaded.data || !canCandidateWithdraw(loaded.data.status)) return { status: "error", message: "This application can no longer be withdrawn." };

  const now = new Date().toISOString();
  const update: JobApplicationUpdate = { status: "withdrawn", withdrawn_at: now, updated_at: now };
  const result = await supabase.from("job_applications").update(update).eq("id", id).eq("candidate_user_id", current.user.id).eq("status", loaded.data.status).select("id").maybeSingle();
  if (result.error || !result.data) return { status: "error", message: "We could not withdraw this application at this time. Please try again." };

  const history: JobApplicationStatusHistoryInsert = {
    application_id: id,
    previous_status: loaded.data.status,
    new_status: "withdrawn",
    changed_by_user_id: current.user.id,
    change_source: "candidate",
    public_note: "Application withdrawn by candidate.",
    created_at: now,
  };
  const historyResult = await supabase.from("job_application_status_history").insert(history);
  revalidatePath("/account/candidate/applications");
  if (historyResult.error) return { status: "error", message: "The application was withdrawn, but its status timeline could not be updated. Please contact support." };
  revalidatePath(`/account/candidate/applications/${id}`);
  redirect(`/account/candidate/applications/${id}?withdrawn=1`);
}

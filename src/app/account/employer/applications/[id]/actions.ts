"use server";

import { revalidatePath } from "next/cache";
import { employerApplicationActionSchema } from "@/lib/applications/application-validation";
import { employerApplicationSuccessMessages, getEmployerApplicationTarget } from "@/lib/applications/application-status";
import { getEmployerApplicationMutationContext } from "@/lib/applications/employer-applications";
import type { JobApplicationStatusHistoryInsert, JobApplicationUpdate } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";

export type EmployerApplicationActionState = { status: "idle" | "success" | "error"; message?: string; errors?: { updateNote?: string } };

export async function updateEmployerApplicationStatus(id: string, _: EmployerApplicationActionState, form: FormData): Promise<EmployerApplicationActionState> {
  const allowed = ["actionId", "updateNote"];
  if ([...form.keys()].some((key) => !key.startsWith("$ACTION_") && !allowed.includes(key))) return { status: "error", message: "We could not update this application at this time. Please try again." };
  const parsed = employerApplicationActionSchema.safeParse({ actionId: form.get("actionId"), updateNote: form.get("updateNote") ?? "" });
  if (!parsed.success) return { status: "error", message: "Review the update information and try again.", errors: { updateNote: parsed.error.issues.find((issue) => issue.path[0] === "updateNote")?.message } };
  const context = await getEmployerApplicationMutationContext(id);
  if (!context) return { status: "error", message: "This application could not be found or is not available to your account." };
  const target = getEmployerApplicationTarget(context.application.status, parsed.data.actionId);
  if (!target) return { status: "error", message: "This application can no longer be moved to that stage." };

  const supabase = await createClient();
  const now = new Date().toISOString();
  const update: JobApplicationUpdate = { status: target, updated_at: now };
  const updateResult = await supabase.from("job_applications").update(update).eq("id", context.application.id).eq("vacancy_id", context.application.vacancy_id).eq("status", context.application.status).select("id").maybeSingle();
  if (updateResult.error || !updateResult.data) return { status: "error", message: updateResult.error?.code === "42501" ? "You do not have permission to update this application." : "We could not update this application at this time. Please try again." };

  const history: JobApplicationStatusHistoryInsert = { application_id: context.application.id, previous_status: context.application.status, new_status: target, changed_by_user_id: context.current.user.id, change_source: "employer", public_note: parsed.data.updateNote || null, created_at: now };
  const historyResult = await supabase.from("job_application_status_history").insert(history);
  if (historyResult.error) {
    const rollback: JobApplicationUpdate = { status: context.application.status, updated_at: new Date().toISOString() };
    await supabase.from("job_applications").update(rollback).eq("id", context.application.id).eq("vacancy_id", context.application.vacancy_id).eq("status", target);
    revalidateApplicationPaths(id);
    return { status: "error", message: "We could not complete the application status update safely. Please try again." };
  }
  revalidateApplicationPaths(id);
  return { status: "success", message: employerApplicationSuccessMessages[parsed.data.actionId] };
}

function revalidateApplicationPaths(id: string) {
  revalidatePath("/account/employer/applications");
  revalidatePath(`/account/employer/applications/${id}`);
  revalidatePath("/account/candidate/applications");
  revalidatePath(`/account/candidate/applications/${id}`);
}

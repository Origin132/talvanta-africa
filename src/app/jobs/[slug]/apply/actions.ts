"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { applicationFormSchema } from "@/lib/applications/application-validation";
import { lookupExistingApplication, requireCandidateApplications } from "@/lib/applications/candidate-applications";
import type { JobApplicationInsert, JobApplicationStatusHistoryInsert } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";

export type ApplyState = { status: "idle" | "error"; message?: string; errors?: Record<string, string> };

export async function submitApplication(slug: string, _: ApplyState, form: FormData): Promise<ApplyState> {
  const current = await requireCandidateApplications(`/jobs/${slug}/apply`);

  const allowed = ["coverNote", "candidateDocumentId", "accuracyAcknowledged"];
  if ([...form.keys()].some((key) => !key.startsWith("$ACTION_") && !allowed.includes(key))) return { status: "error", message: "We could not submit your application. Review the information and try again." };
  const parsed = applicationFormSchema.safeParse({ coverNote: form.get("coverNote") ?? "", candidateDocumentId: form.get("candidateDocumentId") ?? "", accuracyAcknowledged: form.get("accuracyAcknowledged") });
  if (!parsed.success) return { status: "error", message: "Review the highlighted information and try again.", errors: Object.fromEntries(parsed.error.issues.map((issue) => [String(issue.path[0]), issue.message])) };

  const supabase = await createClient();
  const now = new Date().toISOString();
  const vacancyResult = await supabase.from("vacancies").select("id, slug, status, applications_open, published_at, closes_at").eq("slug", slug).in("status", ["published", "closing-soon"]).eq("applications_open", true).not("published_at", "is", null).or(`closes_at.is.null,closes_at.gt.${now}`).maybeSingle();
  if (vacancyResult.error || !vacancyResult.data) return { status: "error", message: "This opportunity is no longer available for applications." };
  const vacancy = vacancyResult.data;

  const existingResult = await lookupExistingApplication(vacancy.id, current.user.id);
  if (existingResult.error) return { status: "error", message: "We could not submit your application. Review the information and try again." };
  if (existingResult.data) redirect(`/jobs/${slug}/apply`);

  let documentId: string | null = null;
  if (parsed.data.candidateDocumentId) {
    const cvResult = await supabase.from("candidate_documents").select("id").eq("id", parsed.data.candidateDocumentId).eq("user_id", current.user.id).eq("document_type", "cv").maybeSingle();
    if (cvResult.error || !cvResult.data) return { status: "error", message: "The selected CV is not available to your candidate account." };
    documentId = cvResult.data.id;
  }

  const applicationInsert: JobApplicationInsert = { vacancy_id: vacancy.id, candidate_user_id: current.user.id, candidate_document_id: documentId, cover_note: parsed.data.coverNote || null, status: "submitted", submitted_at: now, created_at: now, updated_at: now };
  const applicationResult = await supabase.from("job_applications").insert(applicationInsert).select("id").single();
  if (applicationResult.error) {
    const duplicateResult = await lookupExistingApplication(vacancy.id, current.user.id);
    if (duplicateResult.data) redirect(`/jobs/${slug}/apply`);
    return { status: "error", message: "We could not submit your application. Review the information and try again." };
  }

  const historyInsert: JobApplicationStatusHistoryInsert = { application_id: applicationResult.data.id, previous_status: null, new_status: "submitted", changed_by_user_id: current.user.id, change_source: "candidate", public_note: "Application submitted.", created_at: now };
  const historyResult = await supabase.from("job_application_status_history").insert(historyInsert);
  if (historyResult.error) {
    return { status: "error", message: "Your application was submitted, but its initial status history could not be recorded. Please contact support before trying again." };
  }

  revalidatePath(`/jobs/${slug}/apply`);
  revalidatePath("/account/candidate/applications");
  redirect(`/jobs/${slug}/apply/success`);
}

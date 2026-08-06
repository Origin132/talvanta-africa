"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { applicationFormSchema } from "@/lib/applications/application-validation";
import { getExistingApplication, requireCandidateApplications } from "@/lib/applications/candidate-applications";
import type { JobApplicationInsert, JobApplicationStatusHistoryInsert } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";

export type ApplyState={status:"idle"|"error";message?:string;errors?:Record<string,string>};
export async function submitApplication(slug:string,_:ApplyState,form:FormData):Promise<ApplyState>{
  const current=await requireCandidateApplications(`/jobs/${slug}/apply`); const allowed=["coverNote","candidateDocumentId"]; if([...form.keys()].some(k=>!k.startsWith("$ACTION_")&&!allowed.includes(k)))return{status:"error",message:"We could not submit your application. Review the information and try again."};
  const parsed=applicationFormSchema.safeParse({coverNote:form.get("coverNote")??"",candidateDocumentId:form.get("candidateDocumentId")??""});if(!parsed.success)return{status:"error",message:"Review the highlighted information and try again.",errors:Object.fromEntries(parsed.error.issues.map(i=>[String(i.path[0]),i.message]))};
  const supabase=await createClient();const now=new Date().toISOString();const vacancyResult=await supabase.from("vacancies").select("id, slug, status, applications_open, closes_at").eq("slug",slug).in("status",["published","closing-soon"]).eq("applications_open",true).gt("closes_at",now).maybeSingle();
  if(vacancyResult.error||!vacancyResult.data)return{status:"error",message:"This opportunity is no longer available for applications."};const vacancy=vacancyResult.data;
  const existing=await getExistingApplication(vacancy.id,current.user.id);if(existing)redirect(`/jobs/${slug}/apply?existing=${existing}`);
  let documentId:string|null=null;if(parsed.data.candidateDocumentId){const owned=await supabase.from("candidate_documents").select("id").eq("id",parsed.data.candidateDocumentId).eq("user_id",current.user.id).eq("document_type","cv").maybeSingle();if(owned.error||!owned.data)return{status:"error",message:"The selected CV is not available to your account."};documentId=owned.data.id;}
  const insert:JobApplicationInsert={vacancy_id:vacancy.id,candidate_user_id:current.user.id,candidate_document_id:documentId,cover_note:parsed.data.coverNote||null,status:"submitted",submitted_at:now,created_at:now,updated_at:now};const result=await supabase.from("job_applications").insert(insert).select("id").single();
  if(result.error){const duplicate=await getExistingApplication(vacancy.id,current.user.id);if(duplicate)redirect(`/jobs/${slug}/apply?existing=${duplicate}`);return{status:"error",message:"We could not submit your application. Review the information and try again."};}
  const history:JobApplicationStatusHistoryInsert={application_id:result.data.id,previous_status:null,new_status:"submitted",changed_by_user_id:current.user.id,change_source:"candidate",public_note:null,created_at:now};await supabase.from("job_application_status_history").insert(history);
  revalidatePath("/account/candidate/applications");redirect(`/jobs/${slug}/apply?submitted=${result.data.id}`);
}

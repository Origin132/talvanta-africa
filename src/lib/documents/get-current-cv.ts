import "server-only";
import type { CandidateDocument } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";

export async function getCurrentCv(userId: string): Promise<CandidateDocument | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("candidate_documents").select("id, user_id, document_type, bucket_name, storage_path, original_filename, stored_filename, mime_type, file_size_bytes, uploaded_at, updated_at").eq("user_id", userId).eq("document_type", "cv").maybeSingle();
  return data;
}

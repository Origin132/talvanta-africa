"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { CV_BUCKET, CV_MAX_BYTES, CV_MIME, finalizeUploadSchema, hasPdfSignature, prepareUploadSchema, sanitiseDisplayFilename } from "@/lib/documents/cv-validation";
import { getCurrentCv } from "@/lib/documents/get-current-cv";
import { requireAccountType } from "@/lib/profiles/get-current-profile";
import { createClient } from "@/lib/supabase/server";

type UploadRequest = { originalFilename: string; mimeType: string; fileSizeBytes: number };
export type UploadPreparation = { ok: true; documentId: string; path: string; token: string } | { ok: false; message: string; fieldError?: string };
export type DocumentActionState = { status: "idle" | "success" | "error"; message?: string };

export async function prepareCvUpload(input: UploadRequest): Promise<UploadPreparation> {
  const parsed = prepareUploadSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "We could not upload this CV. Review the file requirements and try again.", fieldError: parsed.error.issues[0]?.message };
  const current = await requireAccountType("candidate");
  const documentId = randomUUID();
  const path = `${current.user.id}/${documentId}.pdf`;
  const supabase = await createClient();
  const { data, error } = await supabase.storage.from(CV_BUCKET).createSignedUploadUrl(path, { upsert: false });
  if (error || !data.token) return { ok: false, message: "We could not upload this CV. Review the file requirements and try again." };
  return { ok: true, documentId, path: data.path, token: data.token };
}

export async function finalizeCvUpload(input: UploadRequest & { documentId: string }): Promise<DocumentActionState> {
  const parsed = finalizeUploadSchema.safeParse(input);
  if (!parsed.success) return { status: "error", message: "We could not upload this CV. Review the file requirements and try again." };
  const current = await requireAccountType("candidate");
  const supabase = await createClient();
  const storedFilename = `${parsed.data.documentId}.pdf`;
  const path = `${current.user.id}/${storedFilename}`;
  const cleanup = async () => { await supabase.storage.from(CV_BUCKET).remove([path]); };
  const { data: objects, error: listError } = await supabase.storage.from(CV_BUCKET).list(current.user.id, { search: storedFilename, limit: 2 });
  const object = objects?.find((item) => item.name === storedFilename);
  const objectSize = typeof object?.metadata?.size === "number" ? object.metadata.size : null;
  const objectMime = typeof object?.metadata?.mimetype === "string" ? object.metadata.mimetype : null;
  if (listError || !object || objectSize !== parsed.data.fileSizeBytes || objectSize < 1 || objectSize > CV_MAX_BYTES || objectMime !== CV_MIME) { await cleanup(); return { status: "error", message: "The selected file is not a valid supported PDF document." }; }
  const { data: blob, error: downloadError } = await supabase.storage.from(CV_BUCKET).download(path);
  if (downloadError || !blob || blob.size !== objectSize || !hasPdfSignature(new Uint8Array(await blob.slice(0, 5).arrayBuffer()))) { await cleanup(); return { status: "error", message: "The selected file is not a valid supported PDF document." }; }
  const existing = await getCurrentCv(current.user.id);
  const metadata = { document_type: "cv" as const, bucket_name: CV_BUCKET, storage_path: path, original_filename: sanitiseDisplayFilename(parsed.data.originalFilename), stored_filename: storedFilename, mime_type: CV_MIME, file_size_bytes: objectSize, updated_at: new Date().toISOString() };
  if (existing) {
    const { error } = await supabase.from("candidate_documents").update(metadata).eq("id", existing.id).eq("user_id", current.user.id);
    if (error) { await cleanup(); return { status: "error", message: "We could not upload this CV. Review the file requirements and try again." }; }
    if (existing.bucket_name === CV_BUCKET && existing.storage_path.startsWith(`${current.user.id}/`)) await supabase.storage.from(CV_BUCKET).remove([existing.storage_path]);
    revalidatePath("/account/candidate/documents");
    return { status: "success", message: "Your CV has been replaced successfully." };
  }
  const { error } = await supabase.from("candidate_documents").insert({ id: parsed.data.documentId, user_id: current.user.id, ...metadata });
  if (error) { await cleanup(); return { status: "error", message: "We could not upload this CV. Review the file requirements and try again." }; }
  revalidatePath("/account/candidate/documents");
  return { status: "success", message: "Your CV has been uploaded securely." };
}

export async function discardPreparedCv(documentId: string) {
  const parsed = finalizeUploadSchema.shape.documentId.safeParse(documentId);
  if (!parsed.success) return;
  const current = await requireAccountType("candidate");
  const supabase = await createClient();
  await supabase.storage.from(CV_BUCKET).remove([`${current.user.id}/${parsed.data}.pdf`]);
}

export async function deleteCv(_: DocumentActionState, form: FormData): Promise<DocumentActionState> {
  const keys = [...form.keys()].filter((key) => !key.startsWith("$ACTION_"));
  if (keys.length) return { status: "error", message: "You do not have permission to manage this document." };
  const current = await requireAccountType("candidate");
  const existing = await getCurrentCv(current.user.id);
  if (!existing) return { status: "success", message: "Your CV has been deleted." };
  if (existing.bucket_name !== CV_BUCKET || !existing.storage_path.startsWith(`${current.user.id}/`)) return { status: "error", message: "You do not have permission to manage this document." };
  const supabase = await createClient();
  const { error: storageError } = await supabase.storage.from(CV_BUCKET).remove([existing.storage_path]);
  if (storageError && storageError.message.toLowerCase().includes("not found") === false) return { status: "error", message: "We could not delete this CV. Please try again." };
  const { error } = await supabase.from("candidate_documents").delete().eq("id", existing.id).eq("user_id", current.user.id);
  if (error) return { status: "error", message: "We could not delete this CV. Please try again." };
  revalidatePath("/account/candidate/documents");
  return { status: "success", message: "Your CV has been deleted." };
}

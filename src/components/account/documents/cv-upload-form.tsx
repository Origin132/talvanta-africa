"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { discardPreparedCv, finalizeCvUpload, prepareCvUpload, type DocumentActionState } from "@/app/account/candidate/documents/actions";
import { DocumentStatus } from "@/components/account/documents/document-status";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { CV_BUCKET, CV_MAX_BYTES, CV_MIME, hasPdfSignature } from "@/lib/documents/cv-validation";

export function CvUploadForm({ replacing }: { replacing: boolean }) {
  const router = useRouter(); const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(false); const [fieldError, setFieldError] = useState<string>(); const [status, setStatus] = useState<DocumentActionState>({ status: "idle" });
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (pending) return; setFieldError(undefined); setStatus({ status: "idle" });
    const files = new FormData(event.currentTarget).getAll("cv"); const file = files.length === 1 && files[0] instanceof File ? files[0] : null;
    if (!file || !file.size) { setFieldError("Select a non-empty PDF document."); return; }
    if (files.length !== 1 || file.size > CV_MAX_BYTES || file.type !== CV_MIME || !/\.pdf$/i.test(file.name) || /[\\/\u0000-\u001f\u007f]/.test(file.name)) { setFieldError("The selected file is not a valid supported PDF document."); return; }
    if (!hasPdfSignature(new Uint8Array(await file.slice(0, 5).arrayBuffer()))) { setFieldError("The selected file is not a valid supported PDF document."); return; }
    setPending(true);
    try {
      const request = { originalFilename: file.name, mimeType: file.type, fileSizeBytes: file.size };
      const prepared = await prepareCvUpload(request);
      if (!prepared.ok) { setFieldError(prepared.fieldError); setStatus({ status: "error", message: prepared.message }); return; }
      const supabase = createClient();
      const { error } = await supabase.storage.from(CV_BUCKET).uploadToSignedUrl(prepared.path, prepared.token, file, { contentType: CV_MIME, upsert: false });
      if (error) { await discardPreparedCv(prepared.documentId); setStatus({ status: "error", message: "We could not upload this CV. Review the file requirements and try again." }); return; }
      const result = await finalizeCvUpload({ ...request, documentId: prepared.documentId }); setStatus(result);
      if (result.status === "success") { if (inputRef.current) inputRef.current.value = ""; router.refresh(); }
    } finally { setPending(false); }
  }
  return <form onSubmit={submit} noValidate className="space-y-5"><div><label className="block font-bold text-navy" htmlFor="cv">Upload Your CV <span className="text-error-red" aria-hidden="true">*</span><span className="sr-only"> (required)</span></label><input ref={inputRef} id="cv" name="cv" type="file" required accept=".pdf,application/pdf" aria-invalid={Boolean(fieldError)} aria-describedby={`cv-help${fieldError ? " cv-error" : ""}`} className="mt-2 block min-h-12 w-full min-w-0 rounded-lg border border-border-grey bg-white p-3 text-sm text-navy file:mr-3 file:rounded-md file:border-0 file:bg-soft-grey file:px-3 file:py-2 file:font-bold file:text-navy focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-gold" /><p id="cv-help" className="mt-2 text-sm leading-6 text-slate">PDF only. Maximum size 5 MB. The file is uploaded only after you select the button below.</p>{fieldError ? <p id="cv-error" className="mt-2 font-semibold text-error-red" role="alert">Error: {fieldError}</p> : null}</div>{status.message && status.status !== "idle" ? <DocumentStatus status={status.status} message={status.message} /> : null}<Button type="submit" disabled={pending} aria-disabled={pending}>{pending ? replacing ? "Replacing CV..." : "Uploading CV..." : replacing ? "Replace CV" : "Upload CV"}</Button><span className="sr-only" aria-live="polite">{pending ? replacing ? "Replacing CV" : "Uploading CV" : ""}</span></form>;
}

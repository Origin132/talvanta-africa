import { z } from "zod";

export const CV_BUCKET = "candidate-cvs" as const;
export const CV_MIME = "application/pdf" as const;
export const CV_MAX_BYTES = 5_242_880;
export const PDF_SIGNATURE = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]);

const safeFilename = z.string().trim().min(1).max(200).refine((name) => !/[\\/]/.test(name), "The selected filename is not supported.").refine((name) => !/[\u0000-\u001f\u007f]/.test(name), "The selected filename is not supported.").refine((name) => /\.pdf$/i.test(name), "Select a file with a .pdf extension.");
export const prepareUploadSchema = z.strictObject({ originalFilename: safeFilename, mimeType: z.literal(CV_MIME), fileSizeBytes: z.number().int().min(1).max(CV_MAX_BYTES) });
export const finalizeUploadSchema = prepareUploadSchema.extend({ documentId: z.uuid() }).strict();

export function sanitiseDisplayFilename(name: string) {
  const base = name.split(/[\\/]/).pop()?.replace(/[\u0000-\u001f\u007f]/g, "").trim() ?? "";
  const stem = base.replace(/\.pdf$/i, "").trim().slice(0, 190) || "candidate-cv";
  return `${stem}.pdf`;
}

export function hasPdfSignature(bytes: Uint8Array) {
  return PDF_SIGNATURE.every((byte, index) => bytes[index] === byte);
}

export function formatFileSize(bytes: number) {
  return `${(bytes / 1_048_576).toFixed(2)} MB`;
}

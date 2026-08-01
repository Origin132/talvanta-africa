# Private CV storage

Ticket 015 connects candidate accounts to the existing private Supabase Storage bucket `candidate-cvs` and RLS-protected `public.candidate_documents` table. It creates no bucket, table, migration, or policy and uses no service-role key.

## Architecture and file requirements

The initial format is PDF only (`application/pdf`), with a maximum size of 5,242,880 bytes. A file must be non-empty, use a `.pdf` suffix, contain no path separators or control characters in its supplied filename, and begin with `%PDF-`. Extension, declared MIME, size, bucket restrictions, stored-object metadata, and PDF signature are all checked. This does not constitute malware scanning or deep PDF structural validation.

Vercel Functions currently limit request bodies to 4.5 MB, below the product’s 5 MB file limit, and Next.js Server Actions default to 1 MB. File bytes therefore do not pass through the Next.js deployment. A small authenticated Server Action validates the declared metadata, generates `{auth-user-id}/{random-uuid}.pdf`, and requests a Supabase signed upload token. The browser uploads directly to the private bucket. The token and internal path are used only for that transfer and are never stored or logged. Supabase currently defines signed upload tokens as valid for two hours; production should recheck this provider-controlled lifetime after dependency upgrades.

After upload, a second Server Action derives the object path again from the authenticated user and UUID. It lists and downloads the owned object through the authenticated server client, checks actual Storage MIME and size, compares the actual byte length, and verifies the first five bytes before writing metadata. Invalid objects are deleted. The database stores the owner, `cv` type, bucket, generated path and filename, sanitised display filename, fixed PDF MIME, validated byte count, and timestamps. File bytes are never stored in PostgreSQL.

## Upload, replacement, and cleanup

First upload stores the new object, validates it, then inserts metadata. A failed metadata insert triggers removal of the new object. Replacement always uses a new UUID path, validates the new object, updates the existing metadata, and deletes the old object only after the update succeeds. If metadata update fails, the new object is removed and the working CV remains referenced.

Failed direct uploads request best-effort cleanup. A browser closing after a successful direct transfer but before finalization can still leave an unreferenced object; this is an unavoidable two-system consistency window without an upload-intent table or scheduled cleanup. If deletion of an old replacement object fails after metadata succeeds, the new CV remains current and the UI reports that manual cleanup is needed. A future controlled orphan-reconciliation process is recommended.

Deletion first removes the object, then deletes the owned metadata row as required. A missing object is treated idempotently. A metadata deletion failure after object removal can temporarily leave a dangling row and requires controlled retry or support intervention.

## Private download

`/account/candidate/documents/download` authenticates the user, verifies the database role, loads only that user’s `cv` metadata, verifies the fixed bucket and owned path prefix, and creates a 60-second signed URL with a download filename. The URL is neither persisted nor logged. The route redirects to it so the PDF is downloaded from private Storage rather than proxied or rendered inline.

## RLS and Storage verification

Use fictional accounts in a controlled non-production environment. Do not record IDs, tokens, signed URLs, filenames containing personal data, or object paths.

- Candidate A can create an upload token for its folder, upload a valid PDF, read its metadata, download, replace, and delete it.
- Candidate A cannot read Candidate B metadata, sign or download Candidate B objects, update ownership fields, or delete Candidate B objects.
- Candidate B cannot access Candidate A’s record or object.
- An employer cannot access `candidate_documents`, `candidate-cvs`, the Documents page, or any document action.
- An anonymous user cannot access metadata or objects and is redirected before document operations.
- The bucket remains private, restricts MIME to `application/pdf`, limits objects to 5,242,880 bytes, and has no public URL.
- Table policies enforce `user_id = auth.uid()`, the one-current-`cv` rule, and immutable ownership/security columns.
- Storage policies restrict the first path segment to `auth.uid()` and cover the required insert, select, and delete operations.

## Testing and troubleshooting

Test missing, empty, oversized, renamed, wrong-MIME, wrong-extension, invalid-signature, separator, and control-character files. Test near-limit valid PDFs, first upload, replacement, cleanup failures, download and signed-link expiry, deletion and repeated deletion, every account type, cross-candidate attempts, keyboard navigation, dialog focus restoration, and widths from 320 to 1440 pixels.

If upload preparation fails, verify candidate database role and Storage insert/select policies. If finalization fails, verify bucket MIME/size configuration and list/download policies. If metadata fails, verify ownership policies and the unique current-CV constraint. Do not expose raw Supabase errors while diagnosing.

Deferred features include DOCX and other formats, malware scanning, deep parsing, previews, administrator or recruiter access, version history, retention automation, CV parsing, AI analysis, scoring, ranking, application-specific selection, and external processing.

Ticket 016 displays owned CV status and links to the existing Documents route from the candidate dashboard. It does not change the upload, validation, signed-download, replacement, deletion, or Storage security contracts.

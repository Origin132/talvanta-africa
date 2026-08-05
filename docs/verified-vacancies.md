# Verified vacancies and public job publishing

Ticket 019 connects the existing RLS-protected `public.vacancies` table to administrator publishing and the public Jobs experience. It creates no SQL, migrations, application workflow, service-role client, employer publishing, candidate access, matching, ranking, or external synchronization.

## Architecture and database

The typed `vacancies` table contains source and ownership IDs, a server-generated unique slug, public vacancy content, `vacancy_status`, publication/application state, and timestamps. Administrator pages authenticate with `getUser()`, call `public.has_role('admin')`, use the authenticated SSR client, derive `created_by_admin_user_id` from that session, send explicit payloads, and rely on admin RLS. Candidate and employer sessions must have no mutation policy.

Public server queries use the same publishable-key SSR client and public RLS. They explicitly select only slug, vacancy content, status, application state, publication date, and closing date. They never select administrator IDs, employer IDs, recruitment-request IDs, contacts, private documents, metadata, or candidate information.

## Statuses and workflows

Statuses are `draft`, `published`, `closing-soon`, `closed`, and `archived`. Allowed transitions are draft to published; published to closing-soon or closed; closing-soon to closed; and closed to archived. Draft deletion is permanent and requires confirmation. Closed and archived records are read-only. There is no republishing path.

Draft creation requires the table’s non-null content fields, generates the slug on the server, forces applications closed, leaves publication time null, and stores administrator ownership from the session. Publishing applies full validation, requires a future closing date, sets the first publication timestamp, and uses the approved applications-open checkbox. Editing preserves ownership, source IDs, creation time, slug, and status except when the draft is deliberately published.

Closing forces applications closed while preserving publication and closing dates. Closing Soon is manual, requires a future closing date, and may retain the current applications-open setting. Archiving is allowed only after closure and removes the vacancy from public RLS results. Past closing dates are excluded publicly; automatic database status synchronization is deferred.

## Accepted recruitment requests

An accepted recruitment request can prefill `/admin/vacancies/new?recruitment_request=...`. The UUID and accepted status are revalidated through admin RLS. Only approved vacancy fields are copied, and no vacancy is created automatically. The administrator must review and submit the form. From-scratch vacancies have no employer or request source ID.

## Administrator routes

- `/admin/vacancies` — allowlisted filters and 20-record server pagination.
- `/admin/vacancies/new` — reviewed draft creation or publication.
- `/admin/vacancies/[id]` — full authorised details and lifecycle controls.
- `/admin/vacancies/[id]/edit` — draft, published, and closing-soon content editing.

All are `noindex, nofollow`, excluded from public navigation and sitemap, and protected independently of the layout.

## Public Jobs and SEO

`/jobs` loads up to 50 currently public vacancies ordered by `published_at` descending. Employment type, workplace type, location, and public status filters are validated before building Supabase expressions. The established intentional empty state remains when no vacancy is open.

`/jobs/[slug]` validates the slug and loads only published or closing-soon rows with future closing dates. Missing, expired, closed, archived, draft, or RLS-inaccessible records return not found without disclosure. Metadata uses only job title, organisation, location, and employment type with the canonical site URL. Application buttons lead only to sign-in/profile registration and clearly state that account applications are deferred.

The sitemap performs a public-RLS query for at most 1,000 currently visible vacancy slugs. Query failure safely leaves the static sitemap entries intact. Admin, draft, expired, closed, archived, and private routes are never added.

## Accessibility, responsive behavior, and testing

Pages use one `h1`, logical sections, textual statuses, labelled filters, meaningful job links, readable lists, keyboard-accessible native confirmation dialogs, focus restoration, live pending/results, and existing visible focus styles. Cards, forms, filters, lists, dialogs, and action groups are mobile-first and must be verified at 320, 375, 768, 1024, and 1440 pixels.

Test anonymous/candidate/employer public reads, administrator CRUD, accepted-request prefill, draft invisibility/deletion, publish, closing-soon, close, archive, expired dates, invalid IDs/slugs, RLS denial for non-admin mutations, sitemap membership, metadata, keyboard/dialog behavior, mobile layouts, and all existing account/public workflows. Use fictional data only and never record UIDs, private contacts, credentials, tokens, or raw Supabase errors.

## Limitations

Candidate applications, tracking, employer applicant review, CV sharing, matching, ranking, alerts, saved jobs, billing, automatic expiry/status jobs, immutable vacancy history, and external workflow synchronization are deferred.

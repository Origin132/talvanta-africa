# Secure candidate application submission

Ticket 20A implements candidate application creation against the deployed, RLS-protected `job_applications` and `job_application_status_history` tables. It adds no SQL, migration, service-role client, application tracking, withdrawal, staff review, employer access, messaging, scheduling, scoring, matching, or external synchronization.

## Application route and authorisation

`/jobs/[slug]/apply` is server-rendered, marked `noindex, nofollow`, and absent from the sitemap. The route authenticates with `getUser()`, requires the database profile to be a candidate with completed onboarding, redirects anonymous users through a safe relative `next` path, and blocks other account types. Candidate IDs, vacancy IDs, statuses, actor/source values, and timestamps are never accepted from the form.

## Vacancy eligibility and field allowlists

Public vacancy queries select only the server-required record ID plus approved display and publication fields. Reads require `published` or `closing-soon`, a publication timestamp, and either no closing date or a future closing date. Submission also requires `applications_open=true`. Missing, private, draft, closed, archived, expired, or RLS-hidden records are uniformly unavailable.

## Candidate profile and optional CV

The page displays the authenticated candidate's name, title, location, experience, preferred roles, and calculated profile completion. Current CV display is restricted to sanitised filename, readable size, and upload date. Attachment is optional. The Server Action re-queries a selected document by ID, authenticated owner, and `document_type=cv`. It never exposes storage paths, bucket details, signed URLs, bytes, or public URLs.

## Form and server mutation

The client boundary handles pending text, cover-note character guidance, and unchecked CV/accuracy controls. The optional cover note is trimmed, string-validated, and limited to 5,000 characters. The accuracy acknowledgement is required. The Server Action rejects unexpected fields, repeats authorisation, reloads vacancy eligibility, validates the optional CV, and inserts an explicit server-built `submitted` payload through the authenticated client.

## Duplicate prevention

An owned-record pre-check provides the already-submitted state. The deployed unique constraint remains the concurrency authority. After an insert error, an owned-record recheck safely handles duplicate races, repeated clicks, and replay without exposing constraint details or application UUIDs.

## Initial status history and RLS dependency

The authenticated Server Action calls `submit_candidate_job_application`, an invoker-security PostgreSQL function that inserts the application and then appends history with null previous status, `submitted` new status, the authenticated candidate actor, `candidate` source, and `Application submitted.` public note. Both writes run in one database transaction: a history failure rolls back the application insert.

The migration adds a narrowly scoped authenticated-candidate INSERT policy for the initial history row. Its `WITH CHECK` requires the actor to equal `auth.uid()`, the source and status values to describe initial candidate submission, the approved public note, and an owned submitted application. Because the function uses `security invoker`, existing table RLS remains enforced rather than bypassed.

Deploy `supabase/migrations/202608070001_ticket_20a_atomic_application_submission.sql` before deploying the application code. Until the function exists in the target database, submissions fail with the existing controlled generic error and do not create partial application rows.

## Success experience

`/jobs/[slug]/apply/success` repeats candidate authorization and verifies an owned application for the server-resolved vacancy. It exposes no application UUID, is refresh-safe, and states that submission does not guarantee shortlisting, interview, offer, or employment.

## Accessibility and responsive design

The form has semantic labels and fieldsets, linked help/errors, `aria-invalid`, an error summary, a live pending region, keyboard submission, visible focus, and textual actions. Min-width guards, wrapping filenames, responsive grids, and stacking buttons support small screens.

Manually verify 320, 375, 768, 1024, and 1440 pixels, including long content, Talia overlap, cookie-banner overlap, keyboard order, error announcements, and pending state.

## Manual tests

With fictional records, test all account types; incomplete onboarding; open, applications-closed, expired, closed, unpublished, and null-closing-date vacancies; with/without an owned CV; tampered CV ID; overlong note; missing acknowledgement; success; duplicate/replayed submission; refresh; and existing public/CV workflows.

## Troubleshooting and security limitations

Verify RLS, publication/application state, and closing dates for unavailable vacancies; candidate insert/select policies for failures; and owned CV metadata policies for document failures. Preserve an application if history fails and reconcile through an approved process. Rate limiting and atomic application/history insertion remain future hardening. No data is sent to Make.com, Gmail, Talia, OpenAI, or another external service.

## Deferred features

Application lists/details, withdrawal, administrator review, employer visibility, CV sharing, notifications, messaging, interviews, offers, AI scoring/matching, automatic rejection, and ranking are outside Ticket 20A.

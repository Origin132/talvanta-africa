# Candidate job applications and tracking

Ticket 020 connects the deployed RLS-protected `public.job_applications` and append-oriented `public.job_application_status_history` tables to candidate submission and tracking, administrator review, and employer read-only visibility. It creates no SQL, migration, service-role client, public CV access, AI scoring, matching, ranking, messaging, or employer status mutation.

## Architecture and database

All operations use the authenticated `@supabase/ssr` server client. Candidate actions authenticate with `getUser()`, require the database `profiles.account_type` to be `candidate`, require completed onboarding, and derive `candidate_user_id`, status, actor, source, and timestamps on the server. Administrator actions additionally call `public.has_role('admin')`. Employer queries require `account_type=employer` and constrain applications to vacancies whose `employer_user_id` matches the authenticated user. RLS remains defence in depth for every query.

The typed tables match the deployed schema, including the eight-value `job_application_status`, one-candidate-per-vacancy constraint, nullable candidate-document reference, 5,000-character cover note, withdrawal timestamp, and status-history actor/source/public-note fields. No application identity, candidate identity, actor identity, status, ownership, or timestamp supplied by the browser is trusted.

## Submission and duplicate prevention

`/jobs/[slug]/apply` is candidate-only, private metadata, and redirects incomplete candidates to onboarding. Immediately before insert, the Server Action reloads an RLS-visible vacancy and requires `published` or `closing-soon`, `applications_open=true`, and a future `closes_at`. The optional document UUID is accepted only after an owned `candidate_documents` lookup. Storage paths and signed URLs are never selected for application pages.

The application inserts with server-controlled `submitted` state and then appends its initial timeline row where RLS permits. A pre-check provides a friendly duplicate route; the deployed unique constraint remains the concurrency-safe authority and an insert failure is rechecked for the same owned application. Applications do not require a CV.

## Candidate tracking and withdrawal

Candidate list/detail queries include an explicit `candidate_user_id=auth user` predicate and a 50-row list limit. Status filters use the enum allowlist. Details display approved vacancy fields, cover note, attachment presence, and chronological public history only. Withdrawal is permitted only from submitted, under-review, shortlisted, or interview; the action reloads ownership/current status, uses a current-status predicate, sets the server timestamp, preserves the row, and appends history. A deliberate native dialog provides keyboard cancellation, focus restoration, and pending announcements.

## Administrator review

`/admin/applications` and `/admin/applications/[id]` are protected independently and limited to 50 list results. Candidate context is allowlisted to name, professional title, location, professional summary, and preferred roles. The typed transition map permits forward progression from submitted through hired and the approved unsuccessful exits. Withdrawn, unsuccessful, and hired are read-only. Optional public notes are trimmed and limited to 2,000 characters. Every mutation rechecks admin access, reloads status, uses a stale-state predicate, derives the administrator actor from the session, and appends public history.

The current Storage authorization does not approve administrator CV downloads. Where an attachment exists, the UI says that a separately authorised document-access workflow is required. Candidate Storage policies and the private `candidate-cvs` bucket remain unchanged.

## Employer visibility

Employer routes are read-only. The application first loads only owned vacancy IDs, then queries RLS-visible applications and rechecks ownership while hydrating view models. Employers see candidate display name, professional title, location, cover note, submission state, and CV-attached presence. They do not see contact details, document paths, signed URLs, or unrelated candidates, and receive no mutation action.

## Status history and consistency limitation

History displays only new status, public note, and date in chronological order. Actor IDs, change sources, previous status, and internal metadata remain server-only. Application update and history insertion are two authenticated database calls because the supplied schema exposes no transactional RPC. If a history insert fails after a successful status update, the UI reports a neutral partial failure. A future reviewed database RPC is recommended for atomic state-and-history writes; application code must not create or run SQL.

## Metadata, accessibility, and responsive behavior

Apply, candidate, employer, and administrator application routes use `noindex, nofollow` and are absent from the sitemap. Pages use one `h1`, textual statuses, labelled controls, responsive cards, wrapping actions, keyboard navigation, live pending/result text, and native confirmation dialogs. Verify layouts at 320, 375, 768, 1024, and 1440 pixels, including long titles, notes, filters, navigation, timelines, and Talia overlap.

## Security and RLS testing

Use fictional accounts in a controlled environment. Confirm anonymous, employer, and administrator users cannot submit; incomplete candidates redirect; closed/expired vacancies reject; duplicate clicks produce one row; foreign document IDs reject; candidate cross-record IDs return unavailable; invalid withdrawal/status transitions reject; administrators require `has_role('admin')`; employers see only owned-vacancy applications; and no role can access a CV outside existing Storage policy. Never record tokens, IDs, email addresses, application content, database errors, or CV paths.

Deferred work includes atomic mutation/history RPCs, authorised CV sharing, candidate contacts, employer status updates, messaging, scheduling, offers, AI scoring, matching, ranking, and automated decisions.

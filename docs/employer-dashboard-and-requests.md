# Employer dashboard and recruitment requests

Ticket 017 adds an employer-only dashboard and authenticated recruitment-request lifecycle using the existing RLS-protected `public.recruitment_requests` table. It creates no schema, policy, trigger, administrative interface, or external synchronization.

## Architecture and authorization

The shared account layout verifies the Supabase Auth user. The nested employer layout loads the database profile, requires `account_type=employer`, and redirects incomplete employers to onboarding. Each dashboard query and Server Action repeats authorization close to the data source, derives `employer_user_id` exclusively from `auth.getUser()`, adds an ownership predicate, and relies on RLS as defence in depth.

No browser-provided owner, status, submission timestamp, withdrawal timestamp, creation timestamp, or account type is trusted. Dynamic IDs must be UUIDs and inaccessible or cross-employer IDs produce the same not-found result. No candidate table is queried.

## Routes

- `/account/employer` — dashboard
- `/account/employer/profile` — organisation profile
- `/account/employer/profile/edit` — canonical profile edit
- `/account/employer/edit` — permanent compatibility redirect
- `/account/employer/requests` — owned request list and validated filters
- `/account/employer/requests/new` — draft creation or submission
- `/account/employer/requests/[id]` — owned request details and actions
- `/account/employer/requests/[id]/edit` — draft or clarification editing
- `/account/settings` — role-aware account settings

All routes are `noindex, nofollow` and absent from the sitemap. Employer navigation contains Overview, Organisation Profile, Recruitment Requests, and Settings with exact active states.

## Data model and statuses

The typed table contains the Ticket 017 request fields and the statuses `draft`, `submitted`, `under-review`, `clarification-required`, `accepted`, `declined`, `withdrawn`, and `closed`. Human-readable status labels never imply placement, successful hiring, candidate assignment, or organisation verification.

Dashboard counts include submitted, under-review, clarification-required, and accepted as active. Drafts are counted separately. Recent requests are the five newest owned rows. Profile completion reuses the existing employer guidance calculation and is not verification or a score.

## Draft, submission, and editing

Drafts require an organisation and job title. Full submission additionally requires controlled employment/workplace values, 1–1,000 positions, location, a 20–5,000-character role summary, at least one responsibility, and at least one skill. Strings are trimmed, list inputs are normalized, unexpected fields are rejected, and mutations use explicit column maps.

The server assigns `draft` or `submitted`. Submission sets `submitted_at` from server time. Drafts and clarification-required requests are editable; other statuses redirect to details. Resubmission returns a clarification-required request to submitted and refreshes `submitted_at`. Draft saving never silently submits.

Withdrawal is permitted only from submitted, under-review, or clarification-required, requires an accessible confirmation dialog, retains the record, and sets server-controlled `withdrawn_at`. Permanent deletion is restricted to a currently owned draft and also requires confirmation. Every mutation reloads the row and current status immediately before writing.

There is no staff review tool in this ticket. Statuses beyond employer-controlled draft, submitted, and withdrawn are assumed to be maintained through a future controlled operational process.

## Public workflow separation

The public workflow remains unchanged:

`/for-employers` → `/api/hire-talent` → Make.com → Google Sheets → Gmail.

The authenticated workflow is separate:

Employer account → authenticated Server Action → `public.recruitment_requests`.

Authenticated requests are not forwarded to Make.com, synchronized to Sheets, emailed, or assigned a public submission reference. A future ticket must design that integration explicitly.

## Accessibility and responsive design

Forms use labels, field-level errors, a focused error summary, grouped controlled selects, pending announcements, and keyboard submission. Status always includes text. Confirmation uses native accessible dialogs with focus restoration. Request lists use responsive cards rather than wide tables. Navigation and filters wrap or scroll without clipped labels.

Test at 320, 360, 375, 390, 768, 1024, and 1440 pixels. Verify candidate/employer/anonymous access, incomplete onboarding, empty and error states, status filters, every valid and invalid transition, cross-employer IDs, long content, keyboard navigation, dialog focus, and public form regression.

## RLS verification and troubleshooting

Using fictional accounts in a controlled environment, confirm each employer can select, insert, update, and delete only owned rows; cannot set another owner; cannot update protected status/timestamp columns outside intended policy; and cannot access another employer by ID. Candidates and anonymous users must have no table access. Application allowlists do not replace database policies.

If requests are unavailable, verify the authenticated JWT, database account type, ownership predicates, table RLS, and expected column types without logging request contents or IDs. If drafts fail but submissions succeed, compare database nullability constraints with the documented relaxed draft fields. Regenerate official database types in a future approved CLI workflow if the deployed schema differs.

Deferred features include staff/admin review, comments, attachments, Make.com integration, Sheets synchronization, candidate recommendations, vacancy publishing, applications, billing, organisation verification, and a request audit-log table.

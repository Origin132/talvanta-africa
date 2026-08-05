# Administrator recruitment dashboard

Ticket 018 adds a private recruitment-operations interface backed by the existing Supabase administrator role and recruitment-request RLS policies. It creates no database objects, migrations, public administrator registration, role-management UI, service-role client, candidate access, or external workflow integration.

## Administrator role architecture

`public.user_roles` is the only administrator source of truth. Its `role` uses `public.application_role`, whose currently approved value is `admin`. Every administrator layout, page data loader, and Server Action first validates the authenticated user with Supabase Auth `getUser()`, then calls the database function through the authenticated SSR client:

```ts
supabase.rpc("has_role", { requested_role: "admin" })
```

The application never derives administrator access from `profiles.account_type`, Auth metadata, email addresses, URL parameters, hidden fields, local storage, or client state. It uses no service-role key. The browser cannot assign or promote roles.

Administrator assignment is a controlled database-administration operation outside this application. An authorised operator must assign the existing authenticated user the `admin` role through an approved Supabase database-management process. Never place an administrator UID or email in source code, documentation, fixtures, screenshots, or test data.

## Access control and RLS

Unauthenticated `/admin` requests redirect to `/sign-in?next=/admin` and receive the message “Sign in to access this area.” Authenticated users without the role receive “You do not have permission to access recruitment administration.” Role-check or data failures expose only controlled messages.

Every mutation repeats authentication and the database role check even though the admin layout is protected. All reads and writes use the standard authenticated `@supabase/ssr` server client and rely on deployed RLS as defence in depth. Policies must permit authenticated administrators satisfying `public.has_role('admin')` to read authorised employer/profile context and recruitment requests and to update only the approved recruitment-request fields. Candidate profile, candidate document, and Storage policies must remain inaccessible.

Verify in a controlled non-production project that anonymous, candidate, and employer sessions cannot read cross-employer data or perform administrator mutations; administrators can access only the explicitly approved tables and fields. Application checks do not replace RLS.

## Routes and navigation

- `/admin` — Recruitment Operations overview and database counts.
- `/admin/recruitment-requests` — filtered, server-paginated request review list.
- `/admin/recruitment-requests/[id]` — UUID-validated request, employer context, and controlled status actions.

All routes use `noindex, nofollow`, are absent from the sitemap and public navigation, and show Overview, Recruitment Requests, Return to Website, and Sign Out controls. Talia is hidden on administrator routes because it has no approved administrator purpose.

## Dashboard and request review

The overview counts submitted, under-review, clarification-required, and accepted requests directly from the database and shows up to ten recent non-draft requests. The review list excludes drafts, validates its status filter through an allowlist, loads at most 20 records per page, and performs filtering/pagination on the server.

Request details show only approved recruitment-request fields plus the matching employer’s full name and organisation profile. Employer and request ownership identifiers remain server-only and are removed before view models reach client components. The current authenticated client has no approved API for reading another user’s `auth.users.email`; displaying employer email remains pending an approved administrator-safe database projection or function. A service-role workaround is prohibited.

The interface does not edit employer profiles and never queries candidate profiles, candidate documents, candidate CVs, or unrelated employer records.

## Controlled status transitions

The typed transition map permits:

- `submitted` → `under-review`, `clarification-required`, or `declined`;
- `under-review` → `clarification-required`, `accepted`, or `declined`;
- `clarification-required` → `submitted` or `declined`;
- `accepted` → `closed`.

Draft, withdrawn, declined, and closed requests are read-only for administrators. Accepted means “Accepted for Further Discussion”; it does not mean placement, candidate assignment, or completed hiring.

Each action binds a single proposed target, but the server treats it as untrusted. It rechecks administrator access, validates the request UUID, rejects unexpected form fields, reloads current status, validates the current-to-target transition, and updates only `status`, `updated_at`, and—when marking a clarified request resubmitted—`submitted_at`. Ownership and creation fields are never updated. A current-status predicate reduces stale concurrent updates, and RLS remains the final boundary.

## Audit-history foundation

Server-controlled `updated_at` and resubmission timestamps provide current-state timing but are not a complete audit log. No notes box or fake status history is shown because the current schema contains neither administrator notes nor immutable transition events. A later ticket should add a reviewed append-only status-history/audit table recording request, actor, previous status, new status, timestamp, and an optional constrained reason, with dedicated RLS and retention rules.

## Accessibility and responsive behaviour

Pages use one visible `h1`, semantic navigation, `aria-current`, labelled status-filter navigation, textual status badges, keyboard-accessible native confirmation dialogs, focus restoration, disabled pending controls, live pending/result announcements, and visible focus indicators. Request collections use cards rather than wide tables.

Verify at 320, 375, 768, 1024, and 1440 pixels that cards, filters, status labels, dialogs, actions, and navigation do not overflow or clip. Test keyboard-only navigation, dialog cancellation/confirmation, focus return, and reduced-motion behavior.

## Required testing

Using fictional accounts in a controlled environment, test:

- unauthenticated, candidate, employer, and administrator access to every admin URL;
- direct nested-route access and another browser session;
- database role removal during an active session;
- overview counts and recent-request limits;
- every status filter, empty results, invalid filters, and pagination boundaries;
- valid, invalid, stale/concurrent, read-only, inaccessible, and cross-employer transitions;
- malformed and inaccessible request UUIDs;
- employer context success and RLS failure;
- existing candidate and employer dashboards and public workflows for regressions;
- keyboard, focus, status announcements, dialogs, and responsive layouts.

Run `npm run lint` and `npm run build` before deployment. Do not copy credentials, role rows, UIDs, emails, tokens, request contents, or raw provider/database errors into test reports.

## Limitations and deferred work

Deferred features include administrator notes, immutable audit history, administrator role management, employer-profile editing, an approved employer-email projection, candidate search or CV access, matching or ranking, vacancy publication, applications, billing, Make.com/Sheets/Gmail synchronization, and organisation verification. The public employer submission flow and authenticated employer-owned request workflow remain unchanged.

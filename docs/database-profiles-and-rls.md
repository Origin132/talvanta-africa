# Database profiles and Row Level Security

Ticket 014 connects authenticated users to the existing `public.profiles`, `public.candidate_profiles`, and `public.employer_profiles` tables. It does not create or alter database objects. The deployed database trigger is expected to create the base and matching role row after an `auth.users` signup.

## Data and authorization model

`profiles.id` corresponds to the authenticated `auth.users.id`. Candidate and employer role rows use `user_id`. The database `profiles.account_type` value is the application source of truth and may only be `candidate` or `employer`. Auth metadata is onboarding input only and is never allowed to override an existing database role. Role changes require a future controlled administrative process.

The server obtains identity with Supabase `getUser()`, then queries only the row whose key matches that identity. Candidate routes query only `candidate_profiles`; employer routes query only `employer_profiles`. Every mutation repeats authentication and database-role authorization, sends an explicit column allowlist, and relies on RLS as the final database boundary. No browser-provided user ID or role is accepted.

If an authenticated user has no base profile, `/account` offers controlled recovery. The Server Action first rechecks identity and absence of a row, then accepts only validated `candidate` or `employer` Auth metadata and the original full name. Unsupported or incomplete metadata goes to Contact support. This is a backfill safety path, not general role creation.

## Routing and profile flows

`/account` routes incomplete profiles to `/account/onboarding/candidate` or `/account/onboarding/employer`, and completed profiles to `/account/candidate` or `/account/employer`. Dedicated `/edit` routes reuse the same validated forms. All account routes are `noindex` and excluded from the public sitemap.

Candidate completion guidance checks full name, phone, current location, professional title, professional summary, and at least one preferred role. Employer completion checks full name, organisation name, contact role, phone, location, and summary. The calculated percentage is not stored, is not a recruitment score, does not rank users, and must not inform automatic rejection.

On save, the application upserts the owned role row, updates `profiles.full_name`, and only then sets `onboarding_completed=true`. These calls are not a database transaction. If a later call fails, completion remains false where practical and the idempotent form can be retried. A future reviewed database RPC could provide atomicity.

## RLS verification

Run these checks in a controlled non-production project using fictional accounts. Never paste tokens, IDs, or emails into repository files.

Candidate session:

- can select its own `profiles` row and candidate row;
- can update its permitted base and candidate fields;
- cannot select another candidate or any employer role row;
- cannot update `account_type`, IDs, ownership keys, or creation timestamps.

Employer session:

- can select its own `profiles` row and employer row;
- can update its permitted base and employer fields;
- cannot select another employer or any candidate role row;
- cannot update `account_type`, IDs, ownership keys, or creation timestamps.

Anonymous session:

- cannot select, insert, update, or delete rows in any of the three profile tables.

Also verify that inserts/upserts require `id = auth.uid()` or `user_id = auth.uid()`, and that role-specific policies prevent cross-table access. Column restrictions must prevent changing `account_type`; application allowlists alone are not sufficient. Permission failures should produce the application’s controlled message without policy names, SQL, query text, or database details.

## Troubleshooting and limitations

If a new user lacks rows, inspect the deployed signup trigger and its execution logs without copying personal data. If a user sees a permission message, verify the JWT is refreshed and the ownership/RLS policies match `auth.uid()`. If TypeScript differs from the deployed schema, regenerate types through a future approved Supabase CLI workflow and review the diff; the CLI was not installed or run here.

Ticket 015 subsequently connects candidates to the existing private CV bucket and document metadata table; see `private-cv-storage.md`. Public candidate registration, employer enquiries, Contact, Make.com, Google Sheets, Gmail, acknowledgements, and submission references remain separate and unchanged. Dashboards, administrator access, candidate search, employer access to candidates, job applications, vacancy management, organisation verification, role switching, account deletion, and service-role access remain deferred.

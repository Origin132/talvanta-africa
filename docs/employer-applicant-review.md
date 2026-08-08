# Employer applicant review

Ticket 21A adds read-only employer review of applications connected to employer-owned vacancies. It adds no employer mutations, candidate contact details, CV access, messaging, scheduling, notifications, AI matching, ranking, scoring, or service-role access.

## Employer ownership model

Both `/account/employer/applications` and `/account/employer/applications/[id]` are server-rendered, `noindex, nofollow`, and absent from the sitemap. A dedicated server-only data layer authenticates with the Supabase SSR client, loads the database profile, requires `account_type=employer` and completed onboarding, and derives the employer identity from the authenticated session.

List queries first load vacancy IDs where `employer_user_id=auth.uid()`, then constrain applications to those vacancy IDs. Detail queries validate the UUID, load the RLS-visible application, and independently require its vacancy to have `employer_user_id=auth.uid()` before loading candidate context or history. RLS remains defence in depth, and inaccessible records return not found without disclosing existence.

## Application list and filtering

The list orders applications by `submitted_at` descending and limits results to 50. Application selection is restricted to internal IDs needed for links/joins, submission time, status, and CV-reference presence; cover notes are not loaded. Vacancy and candidate hydration use explicit professional-data allowlists.

Status filters reuse `JobApplicationStatus` and accept only the eight approved values. Invalid values fall back to All and are never passed into database expressions.

## Application detail and professional data allowlist

Details show full name, professional title, current location, years of relevant experience, professional summary, and preferred roles. Candidate email, telephone, Auth metadata, LinkedIn, portfolio, UUIDs, document metadata, and Storage information are not selected or rendered. The page states that candidate contact information is not available at this stage.

Application content is limited to submission date, human-readable status, cover note, and whether a CV reference exists. The employer UI provides no mutation form or recruitment-stage action.

## CV status-only behaviour

The page renders `CV Attached` or `No CV Attached`. When attached, it explains that document access requires a separately authorised recruitment stage. It never queries candidate document metadata, creates a signed URL, exposes a path, adds a download control, or changes the private bucket.

## Timeline and vacancy context

After ownership is established, up to 100 history rows are loaded chronologically. The shared timeline renders only human-readable new status, public note, and date; actor IDs, source, previous status, and internal metadata remain server-only. If history is empty, the current application status is shown without inventing events.

Vacancy Details shows job title, location, employment/workplace types, positions, and textual vacancy status. The public link appears only for a published or closing-soon vacancy with a publication timestamp and null or future closing date. Otherwise the page states that the vacancy is no longer publicly available.

## RLS dependency and security

All reads use the authenticated publishable-key client and depend on deployed employer SELECT policies. Explicit employer predicates supplement but do not replace RLS. Query errors return neutral unavailable states or not found. No raw database errors, SQL, policy names, IDs, tokens, cookies, candidate contacts, or private document information are exposed.

## Read-only limitation

Employer application review is deliberately read-only. Shortlisting, interview progression, offer management, final outcomes, messaging, notifications, and candidate-document access are deferred to controlled later tickets. No disabled placeholder actions are displayed.

## Accessibility and responsive behaviour

Pages use one `h1`, logical card headings, semantic filter navigation with `aria-current`, textual statuses, keyboard-native links, visible focus styles, meaningful empty states, and a readable timeline. Navigation and filters scroll horizontally when necessary; cards, names, job titles, details, and action buttons wrap or stack from 320 through 1440 pixels.

## Manual tests

Using fictional controlled accounts, test anonymous/candidate redirects; incomplete employer onboarding; employers with and without applications; all filters; invalid and foreign application UUIDs; candidate professional allowlist; cover-note and CV states; timeline present/empty; public and unavailable vacancies; keyboard navigation; and 320, 375, 768, 1024, and 1440 pixel layouts. Recheck candidate submission, tracking, withdrawal, private CV, recruitment requests, administrator, and public Jobs workflows.

## Deferred Tickets 21B and 21C

Ticket 21B may introduce reviewed employer recruitment-stage actions. Ticket 21C may introduce separately authorised CV access. Neither capability is implemented or assumed here.

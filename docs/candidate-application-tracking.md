# Candidate application tracking

Ticket 20B provides candidate-owned application listing, details, public status history, and controlled withdrawal. It adds no administrator review, employer applicant access, messaging, notifications, interview scheduling, CV sharing, AI matching, ranking, scoring, or service-role access.

## Candidate application list

`/account/candidate/applications` is a private, `noindex, nofollow` route protected by the candidate account layout and its own server loader. Authentication uses `getUser()` through the existing profile loader; `profiles.account_type=candidate` and completed onboarding are required. The query derives ownership from the authenticated user, includes an explicit `candidate_user_id` predicate, relies on RLS, orders by `submitted_at` descending, and limits results to 50.

Each card shows allowlisted vacancy context, submission date, textual status, and whether a CV was attached. It never shows ownership IDs, document paths, URLs, or internal source identifiers. If vacancy context is no longer RLS-visible, the application remains listed with neutral unavailable context.

## Status filters

The `status` query parameter is accepted only through the eight-value `JobApplicationStatus` allowlist. All, Submitted, Under Review, Shortlisted, Interview, Offer, Unsuccessful, Withdrawn, and Hired filters produce server-side equality queries; raw values are never inserted into expressions.

## Application detail and vacancy context

`/account/candidate/applications/[id]` validates the route ID as a UUID, authenticates a candidate, and queries the application by both ID and authenticated owner. Missing, foreign, malformed, or RLS-hidden applications return not found without revealing existence.

Details display public vacancy context where available, submitted date, status, cover note, CV-attached presence, closing date, and actions. A public vacancy link is offered only for a published or closing-soon record with a publication timestamp and a null or future closing date. Otherwise the page states that the vacancy is no longer publicly available.

## Status timeline

History is loaded for the owned application in chronological order with a 100-row limit. The UI displays only the human-readable new status, public note, and event date. Actor IDs, change source, previous status, and internal metadata are not rendered. When no rows are available, the application’s current status is displayed without inventing events.

## Withdrawal eligibility and mutation

Candidates may withdraw only from `submitted`, `under-review`, `shortlisted`, or `interview`. `offer`, `unsuccessful`, `withdrawn`, and `hired` are ineligible. The Server Action accepts only the bound application ID, validates its UUID, rejects unexpected form fields, repeats candidate authorization, reloads the owned row, and uses the database status rather than browser input.

The update sets only `status=withdrawn`, `withdrawn_at`, and `updated_at`, using server timestamps and a current-status predicate to reduce stale concurrent updates. It preserves vacancy, candidate, and submission fields. A successful update appends history with the actual previous status, candidate actor, candidate source, and `Application withdrawn by candidate.` public note. Both writes use the authenticated Supabase client and RLS.

The supplied schema exposes no approved transactional withdrawal RPC. If history insertion fails after the status update, the action reports a controlled partial-history error and does not claim full success. An approved atomic database function remains recommended future hardening.

## Error handling

Errors are neutral and expose no Supabase objects, SQL, policies, IDs, tokens, cookies, or stack traces. Inaccessible applications return not found. Ineligible withdrawals use “This application can no longer be withdrawn.” General failures use “We could not withdraw this application at this time. Please try again.”

## Accessibility and responsive design

Routes use one `h1`, logical card headings, textual status labels, semantic filter navigation with `aria-current`, native links and buttons, and a native modal dialog with deliberate confirmation, keyboard cancellation, pending announcements, and trigger-focus restoration. Timeline events remain readable without colour. Cards, filters, action groups, long titles, and dialog content wrap or scroll safely from 320 through 1440 pixels.

## Manual tests

Using fictional controlled accounts, test anonymous and employer redirects; candidate empty/list/filter states; invalid and foreign UUIDs; inaccessible vacancies; timeline with and without history; each eligible withdrawal status; offer, unsuccessful, repeated-withdrawal, and terminal-status rejection; concurrent withdrawal; partial history failure; keyboard dialog behavior; and widths 320, 375, 768, 1024, and 1440 pixels. Recheck application submission, profile, CV, public vacancy, employer, and administrator workflows.

## Current limitations and deferred review

Lists are limited to the 50 most recent applications and do not yet paginate. Application/status mutation and history append are separate authenticated calls because no approved transactional RPC is supplied. Candidate contact sharing, CV sharing, employer review, administrator review, status-management workflows, notifications, messaging, scheduling, offers, matching, ranking, scoring, and automated decisions are deferred.

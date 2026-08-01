# Candidate dashboard

Ticket 016 provides a candidate-only account dashboard over the existing authenticated profile and private CV foundations. It adds no schema, privileged client, job-matching system, application workflow, or employer access.

## Architecture and authorization

The shared `/account` layout verifies the Supabase Auth user and displays the signed-in email and sign-out control. The nested `/account/candidate` layout performs a database-role check and redirects incomplete candidates to onboarding. Each page also invokes the server data-access helper close to its queries, because layouts alone are not a sufficient authorization boundary under partial rendering.

The helper uses `auth.getUser()`, loads the owned `profiles` row, requires database `account_type=candidate`, derives ownership from that authenticated user, and explicitly selects only the candidate-profile and current-CV columns needed by the dashboard. RLS remains the final database boundary. No browser-supplied ID, Auth metadata role, service-role client, token, UUID, Storage path, or raw provider error reaches the interface.

## Routes and navigation

- `/account/candidate` — overview dashboard
- `/account/candidate/profile` — full professional profile
- `/account/candidate/profile/edit` — canonical validated edit form
- `/account/candidate/edit` — permanent compatibility redirect
- `/account/candidate/documents` — existing private CV management
- `/account/settings` — candidate settings foundation

Candidate navigation contains Overview, Profile, Documents, and Settings. It uses `aria-current`, keyboard-accessible links, visible focus states, and horizontal overflow on narrow screens rather than clipping labels. Employers never receive this navigation. All routes are `noindex, nofollow` and remain absent from the sitemap.

## Dashboard data and presentation

The dashboard loads the authenticated user, base profile, candidate profile, and current CV metadata on the server. It displays:

- the existing transparent profile-completion calculation and next incomplete field;
- CV presence, sanitised filename, readable size, and upload date without a Storage path;
- actual email-confirmation state from Supabase Auth and active onboarding state;
- a neutral link to verified public opportunities without a fabricated count;
- professional and career-preference summaries with controlled empty states;
- recent account information derived only from existing creation/update timestamps; and
- five quick actions to profile editing, CV management, Jobs, candidate support, and Contact.

Profile Completion is guidance only. It is not candidate quality, employability, matching, recruitment, or ranking data. Career preferences organise the profile and are not presented as automatic matching criteria. Recent Account Information is not a complete audit log.

The full profile is grouped into personal/contact information, professional overview, career preferences, and validated HTTPS external links. Settings displays email and candidate account type as read-only values, plus password reset, sign-out, privacy, terms, and support links. Email change, account deletion, and role change are intentionally unavailable.

## Missing-data and security behaviour

Missing or denied base profiles continue through the controlled `/account` recovery/support flow. Candidate-profile and document query failures return controlled unavailable states rather than raw database errors. Missing CV metadata is a legitimate empty state. Employers are redirected away from candidate pages, anonymous visitors go through sign-in, and incomplete candidates return to onboarding.

The dashboard does not change private CV upload, download, replacement, deletion, signature validation, or Storage policies. It never displays document paths or creates signed URLs itself.

## Accessibility and responsive testing

Pages use one H1, semantic sections and definition lists, readable empty states, safe external-link notices, text equivalents for progress, and status wording that is not colour-only. Cards and actions stack from small phones and expand at content-driven breakpoints.

Manually test at 320, 360, 375, 390, 768, 1024, and 1440 pixels with keyboard-only navigation. Verify active navigation, focus visibility, long filenames and URLs, Talia and cookie-banner overlap, candidate/employer/anonymous routing, incomplete onboarding, missing profile/CV states, email confirmation states, old-edit redirect, and every quick action.

## Troubleshooting and limitations

If a candidate is redirected unexpectedly, verify the Auth session, `profiles.account_type`, and `onboarding_completed`. If summaries are unavailable, verify candidate ownership RLS and the trigger-created role row. If CV status differs from Documents, verify `candidate_documents` ownership and the one-current-CV constraint without copying personal data or paths into logs.

Deferred features include applications, saved jobs, job alerts, AI matching, candidate scoring or ranking, employer candidate access, notifications, a complete audit log, CV parsing, email change, account deletion, and multi-factor authentication.

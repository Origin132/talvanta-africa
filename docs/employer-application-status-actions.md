# Employer application status actions

Ticket 21B adds controlled employer recruitment-stage status updates to applications connected to employer-owned vacancies. It adds no CV access, candidate contact details, messaging, notifications, interview scheduling, offer documents, vacancy automation, AI matching, ranking, scoring, service-role access, or administrator workflow changes.

## Employer ownership checks

Every mutation authenticates through the existing Supabase SSR client, loads the database profile, requires `account_type=employer` and completed onboarding, and derives the employer identity from the session. The Server Action validates the bound application UUID, reloads the application’s actual status, loads its linked vacancy, and requires `vacancies.employer_user_id=auth.uid()` before mutation. No candidate or employer ownership value is accepted from the browser.

## Transition map and action mapping

The typed action identifiers are `begin-review`, `shortlist`, `move-to-interview`, `move-to-offer`, `mark-hired`, and `mark-unsuccessful`. The server maps them to approved targets and checks them against the current database status. Submitted may move to Under Review or Unsuccessful; Under Review to Shortlisted or Unsuccessful; Shortlisted to Interview or Unsuccessful; Interview to Offer or Unsuccessful; and Offer to Hired or Unsuccessful. Unsuccessful, Withdrawn, and Hired are final. Backward, skipped, arbitrary, stale, and terminal-state transitions are rejected.

## Public candidate notes

The optional Update Note is submitted as plain text, trimmed with Zod, limited to 2,000 characters, and rendered by React without HTML interpretation. It is stored as `public_note` and appears in the existing candidate and employer timelines. The browser cannot provide history actor, source, previous status, or target status.

## Status history and candidate synchronization

The guarded update changes only `status` and `updated_at`, with predicates for application ID, linked vacancy, and actual previous status. It preserves candidate, vacancy, document, submission, and withdrawal fields. After success, history records the actual previous status, approved target, authenticated employer actor, `employer` source, validated public note, and server timestamp.

Employer list/detail and candidate list/detail paths are revalidated through Next.js Server Action-supported `revalidatePath`, so both accounts read the same application status and timeline row.

## Consequential confirmations

Mark Unsuccessful, Move to Offer Stage, and Mark as Hired use labelled native dialogs with ticket-approved explanatory text and deliberate confirmation. Dialog closure restores focus to the trigger. Other forward actions use direct labelled submissions. All controls expose pending and result announcements.

## RLS dependencies and required manual SQL

This repository has no database-management connection or deployed policy definitions, so employer UPDATE and history INSERT policies could not be verified. **Employer application UPDATE RLS is not currently verifiable as deployed. Employer history INSERT RLS is not currently verifiable as deployed.** No SQL was created or run by Ticket 21B.

A database administrator must review existing policies and deploy equivalent policies if absent. The required policy predicates are:

```sql
create policy "Employers update applications for owned vacancies"
on public.job_applications for update to authenticated
using (exists (
  select 1 from public.vacancies v
  where v.id = job_applications.vacancy_id
    and v.employer_user_id = auth.uid()
))
with check (exists (
  select 1 from public.vacancies v
  where v.id = job_applications.vacancy_id
    and v.employer_user_id = auth.uid()
));

create policy "Employers insert history for owned vacancy applications"
on public.job_application_status_history for insert to authenticated
with check (
  changed_by_user_id = auth.uid()
  and change_source = 'employer'
  and exists (
    select 1
    from public.job_applications a
    join public.vacancies v on v.id = a.vacancy_id
    where a.id = job_application_status_history.application_id
      and v.employer_user_id = auth.uid()
  )
);
```

Policy names must be adjusted if equivalent policies already exist. The database administrator must also confirm authenticated table privileges and ensure these policies do not broaden employer visibility or conflict with candidate withdrawal policies. Do not deploy duplicate permissive policies without review.

## Consistency handling

No approved transactional RPC exists. The action updates status first, then inserts history. If history fails, it attempts a guarded compensating update only when the row still has the target status, then returns a controlled history failure. A concurrent change or rollback-policy failure can still require manual reconciliation. A reviewed atomic RPC is the recommended future hardening; Ticket 21B does not invent one.

## Security, accessibility, and responsive design

All mutation input is treated as untrusted. Errors expose no SQL, policies, constraints, Supabase objects, IDs, tokens, or cookies. The action component receives only current status and a bound server action; it sends an approved action identifier and optional note. CV access and candidate contacts remain unchanged.

The panel uses associated labels, linked helper/error text, native forms/dialogs, keyboard controls, focus restoration, visible focus styles, live pending/results, textual statuses, stacking action groups, viewport-bounded dialogs, and a full-width textarea. Verify at 320, 375, 768, 1024, and 1440 pixels, including Talia overlap.

## Manual tests and current limitations

With fictional controlled accounts, test anonymous/candidate/cross-employer mutation attempts; every approved transition; every prohibited skip/backward/terminal transition; stale concurrent actions; public notes and overlong notes; candidate/employer timeline synchronization; RLS denials; history failure and compensating rollback; keyboard dialogs; mobile layouts; and existing candidate withdrawal.

Current limitations are non-atomic status/history writes, no notifications, and dependency on manually verified RLS. Ticket 21C CV access, messaging, scheduling, offers, automation, and AI features remain deferred.

begin;

drop policy if exists "Candidates can insert initial application history"
  on public.job_application_status_history;

create policy "Candidates can insert initial application history"
on public.job_application_status_history
for insert
to authenticated
with check (
  changed_by_user_id = auth.uid()
  and previous_status is null
  and new_status = 'submitted'::public.job_application_status
  and change_source = 'candidate'
  and public_note = 'Application submitted.'
  and exists (
    select 1
    from public.job_applications application
    where application.id = job_application_status_history.application_id
      and application.candidate_user_id = auth.uid()
      and application.status = 'submitted'::public.job_application_status
  )
);

create or replace function public.submit_candidate_job_application(
  requested_vacancy_id uuid,
  requested_candidate_document_id uuid,
  requested_cover_note text
)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  authenticated_user_id uuid := auth.uid();
  created_application_id uuid;
  submitted_time timestamptz := now();
  normalized_cover_note text := nullif(btrim(requested_cover_note), '');
begin
  if authenticated_user_id is null then
    raise exception using errcode = '42501', message = 'Authentication required';
  end if;

  if char_length(coalesce(normalized_cover_note, '')) > 5000 then
    raise exception using errcode = '22001', message = 'Cover note is too long';
  end if;

  if not exists (
    select 1
    from public.profiles profile
    where profile.id = authenticated_user_id
      and profile.account_type = 'candidate'
      and profile.onboarding_completed = true
  ) then
    raise exception using errcode = '42501', message = 'Candidate account required';
  end if;

  if not exists (
    select 1
    from public.vacancies vacancy
    where vacancy.id = requested_vacancy_id
      and vacancy.status in (
        'published'::public.vacancy_status,
        'closing-soon'::public.vacancy_status
      )
      and vacancy.applications_open = true
      and vacancy.published_at is not null
      and (vacancy.closes_at is null or vacancy.closes_at > submitted_time)
  ) then
    raise exception using errcode = 'P0002', message = 'Vacancy unavailable';
  end if;

  if requested_candidate_document_id is not null and not exists (
    select 1
    from public.candidate_documents document
    where document.id = requested_candidate_document_id
      and document.user_id = authenticated_user_id
      and document.document_type = 'cv'
  ) then
    raise exception using errcode = '42501', message = 'Candidate document unavailable';
  end if;

  insert into public.job_applications (
    vacancy_id,
    candidate_user_id,
    candidate_document_id,
    cover_note,
    status,
    submitted_at,
    created_at,
    updated_at
  ) values (
    requested_vacancy_id,
    authenticated_user_id,
    requested_candidate_document_id,
    normalized_cover_note,
    'submitted'::public.job_application_status,
    submitted_time,
    submitted_time,
    submitted_time
  )
  returning id into created_application_id;

  insert into public.job_application_status_history (
    application_id,
    previous_status,
    new_status,
    changed_by_user_id,
    change_source,
    public_note,
    created_at
  ) values (
    created_application_id,
    null,
    'submitted'::public.job_application_status,
    authenticated_user_id,
    'candidate',
    'Application submitted.',
    submitted_time
  );

  return created_application_id;
end;
$$;

revoke all on function public.submit_candidate_job_application(uuid, uuid, text) from public;
grant execute on function public.submit_candidate_job_application(uuid, uuid, text) to authenticated;

commit;

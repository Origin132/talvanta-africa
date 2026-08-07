"use client";

import { useActionState, useState } from "react";
import type { ApplyState } from "@/app/jobs/[slug]/apply/actions";
import { Button } from "@/components/ui/button";

type Action = (state: ApplyState, form: FormData) => Promise<ApplyState>;

export function ApplicationForm({ action, cv }: { action: Action; cv: { id: string; originalFilename: string } | null }) {
  const [state, formAction, pending] = useActionState(action, { status: "idle" });
  const [coverNoteLength, setCoverNoteLength] = useState(0);
  const errors = Object.entries(state.errors ?? {});

  return (
    <form action={formAction} className="grid gap-6" noValidate>
      {state.message ? (
        <div role="alert" aria-labelledby="application-error-title" className="rounded-lg border border-error-red bg-white p-4 text-error-red">
          <p id="application-error-title" className="font-bold">Application could not be submitted</p>
          <p className="mt-1">{state.message}</p>
          {errors.length ? <ul className="mt-2 list-disc space-y-1 pl-5">{errors.map(([field, message]) => <li key={field}>{message}</li>)}</ul> : null}
        </div>
      ) : null}

      <div>
        <label className="font-bold text-navy" htmlFor="coverNote">Optional Cover Note</label>
        <textarea id="coverNote" name="coverNote" maxLength={5000} rows={8} aria-describedby="cover-note-help coverNote-error" aria-invalid={Boolean(state.errors?.coverNote)} onChange={(event) => setCoverNoteLength(event.currentTarget.value.length)} className="mt-2 w-full rounded-lg border border-border-grey p-3 focus-visible:outline-3 focus-visible:outline-gold" />
        <p id="cover-note-help" className="mt-1 text-sm text-slate">{5_000 - coverNoteLength} characters remaining; maximum 5,000. Line breaks are preserved.</p>
        {state.errors?.coverNote ? <p id="coverNote-error" className="mt-1 text-sm font-semibold text-error-red">{state.errors.coverNote}</p> : null}
      </div>

      {cv ? (
        <fieldset>
          <legend className="font-bold text-navy">Current CV attachment <span className="font-normal text-slate">(optional)</span></legend>
          <label className="mt-2 flex min-h-12 items-start gap-3 rounded-lg border border-border-grey p-3 text-navy focus-within:outline-3 focus-within:outline-gold">
            <input type="checkbox" name="candidateDocumentId" value={cv.id} className="mt-0.5 size-5 shrink-0" />
            <span>Attach my current CV to this application <span className="block break-all text-sm text-slate">{cv.originalFilename}</span></span>
          </label>
        </fieldset>
      ) : null}

      <div>
        <label className="flex min-h-12 items-start gap-3 rounded-lg border border-border-grey p-3 text-navy focus-within:outline-3 focus-within:outline-gold">
          <input type="checkbox" name="accuracyAcknowledged" className="mt-0.5 size-5 shrink-0" aria-describedby="accuracy-help accuracyAcknowledged-error" aria-invalid={Boolean(state.errors?.accuracyAcknowledged)} />
          <span>I confirm that the information associated with my candidate profile and this application is accurate to the best of my knowledge.</span>
        </label>
        <p id="accuracy-help" className="mt-1 text-sm text-slate">Required before submitting your application.</p>
        {state.errors?.accuracyAcknowledged ? <p id="accuracyAcknowledged-error" className="mt-1 text-sm font-semibold text-error-red">{state.errors.accuracyAcknowledged}</p> : null}
      </div>

      <Button className="w-full sm:w-auto" type="submit" disabled={pending} aria-disabled={pending}>{pending ? "Submitting Application..." : "Submit Application"}</Button>
      <span className="sr-only" role="status" aria-live="polite">{pending ? "Application submission in progress" : ""}</span>
    </form>
  );
}

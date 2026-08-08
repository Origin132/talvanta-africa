"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { EmployerApplicationActionState } from "@/app/account/employer/applications/[id]/actions";
import { Button } from "@/components/ui/button";
import { employerApplicationActionLabels, employerApplicationTransitions, type EmployerApplicationActionId } from "@/lib/applications/application-status";
import type { JobApplicationStatus } from "@/lib/supabase/database.types";

type Action = (state: EmployerApplicationActionState, form: FormData) => Promise<EmployerApplicationActionState>;
const confirmations: Partial<Record<EmployerApplicationActionId, { heading: string; text: string; cancel: string }>> = {
  "mark-unsuccessful": { heading: "Mark this application as unsuccessful?", text: "The candidate will see that this application has concluded unsuccessfully in their application history.", cancel: "Keep Current Status" },
  "mark-hired": { heading: "Mark this candidate as hired?", text: "This records the application as hired within Talvanta Africa. Confirm only when the recruitment outcome is accurate.", cancel: "Cancel" },
  "move-to-offer": { heading: "Move this application to the offer stage?", text: "This records that the candidate has progressed to the offer stage. It does not create or issue an employment offer document.", cancel: "Cancel" },
};

export function EmployerApplicationActions({ action, currentStatus }: { action: Action; currentStatus: JobApplicationStatus }) {
  const [state, formAction, pending] = useActionState(action, { status: "idle" });
  const [note, setNote] = useState("");
  const [selected, setSelected] = useState<EmployerApplicationActionId | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const actions = employerApplicationTransitions[currentStatus];
  useEffect(() => { if (state.status === "success") dialog.current?.close(); }, [state.status]);
  if (!actions.length) return <p className="text-slate">No employer recruitment actions are available for this application’s current status.</p>;

  function requestAction(actionId: EmployerApplicationActionId, button: HTMLButtonElement) {
    setSelected(actionId);
    trigger.current = button;
    dialog.current?.showModal();
  }

  return (
    <div>
      <p className="leading-7 text-slate">Update the candidate&apos;s progress through the recruitment process. Changes will be reflected in the candidate&apos;s application history.</p>
      {state.message ? <p role={state.status === "error" ? "alert" : "status"} className={`mt-4 rounded-lg border p-4 font-semibold ${state.status === "error" ? "border-error-red text-error-red" : "border-green text-navy"}`}>{state.message}</p> : null}
      <div className="mt-5">
        <label htmlFor="employer-update-note" className="font-bold text-navy">Update Note <span className="font-normal text-slate">(optional)</span></label>
        <textarea id="employer-update-note" value={note} onChange={(event) => setNote(event.currentTarget.value)} maxLength={2000} rows={5} aria-describedby="employer-update-note-help employer-update-note-error" className="mt-2 w-full rounded-lg border border-border-grey p-3 focus-visible:outline-3 focus-visible:outline-gold" />
        <p id="employer-update-note-help" className="mt-1 text-sm text-slate">This note will appear in the candidate&apos;s application timeline. Maximum 2,000 characters.</p>
        {state.errors?.updateNote ? <p id="employer-update-note-error" className="mt-1 text-sm font-semibold text-error-red">{state.errors.updateNote}</p> : null}
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {actions.map((actionId) => confirmations[actionId] ? <button key={actionId} type="button" disabled={pending} onClick={(event) => requestAction(actionId, event.currentTarget)} className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius)] border border-navy bg-white px-5 py-3 text-sm font-bold text-navy focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-gold disabled:opacity-55">{employerApplicationActionLabels[actionId]}</button> : <form key={actionId} action={formAction}><input type="hidden" name="actionId" value={actionId} /><input type="hidden" name="updateNote" value={note} /><Button className="w-full" type="submit" disabled={pending}>{pending ? "Updating..." : employerApplicationActionLabels[actionId]}</Button></form>)}
      </div>
      <span className="sr-only" role="status" aria-live="polite">{pending ? "Application status update in progress" : ""}</span>

      <dialog ref={dialog} aria-labelledby="employer-action-confirmation-title" onClose={() => trigger.current?.focus()} className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-[var(--radius)] border border-border-grey p-0 backdrop:bg-navy/60">
        {selected && confirmations[selected] ? <div className="max-h-[calc(100vh-2rem)] overflow-y-auto p-6"><h2 id="employer-action-confirmation-title" className="font-heading text-2xl font-extrabold text-navy">{confirmations[selected].heading}</h2><p className="mt-3 leading-7 text-slate">{confirmations[selected].text}</p><form action={formAction} className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><input type="hidden" name="actionId" value={selected} /><input type="hidden" name="updateNote" value={note} /><Button type="button" variant="outline" onClick={() => dialog.current?.close()}>{confirmations[selected].cancel}</Button><Button type="submit" disabled={pending}>{pending ? "Updating..." : employerApplicationActionLabels[selected]}</Button></form></div> : null}
      </dialog>
    </div>
  );
}

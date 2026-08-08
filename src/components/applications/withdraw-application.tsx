"use client";

import { useActionState, useEffect, useRef } from "react";
import type { WithdrawalState } from "@/app/account/candidate/applications/actions";
import { Button } from "@/components/ui/button";

type Action = (state: WithdrawalState, form: FormData) => Promise<WithdrawalState>;

export function WithdrawApplication({ action }: { action: Action }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [state, formAction, pending] = useActionState(action, { status: "idle" });
  useEffect(() => { if (state.status === "success") dialog.current?.close(); }, [state.status]);
  return (
    <div className="mt-6">
      {state.status === "success" ? <div role="status" className="rounded-lg border border-green bg-soft-grey p-4"><h3 className="font-bold text-navy">Application Withdrawn</h3><p className="mt-1 text-slate">{state.message}</p></div> : null}
      {state.status !== "success" ? <button ref={trigger} type="button" onClick={() => dialog.current?.showModal()} className="inline-flex min-h-12 items-center rounded-lg border border-error-red bg-white px-5 font-bold text-error-red focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-gold">Withdraw Application</button> : null}
      <dialog ref={dialog} aria-labelledby="withdraw-application-title" onClose={() => trigger.current?.focus()} className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-[var(--radius)] border border-border-grey p-0 backdrop:bg-navy/60">
        <div className="max-h-[calc(100vh-2rem)] overflow-y-auto p-6">
          <h2 id="withdraw-application-title" className="text-2xl font-extrabold text-navy">Withdraw this application?</h2>
          <p className="mt-3 leading-7 text-slate">The application will remain in your account for reference, but it will no longer remain active in the recruitment process.</p>
          {state.status === "error" ? <p role="alert" className="mt-3 text-error-red">{state.message}</p> : null}
          <form action={formAction} className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => dialog.current?.close()}>Keep Application Active</Button>
            <Button type="submit" disabled={pending}>{pending ? "Withdrawing..." : "Withdraw Application"}</Button>
            <span className="sr-only" role="status" aria-live="polite">{pending ? "Withdrawal in progress" : ""}</span>
          </form>
        </div>
      </dialog>
    </div>
  );
}

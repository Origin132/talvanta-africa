"use client";

import { useActionState, useEffect, useRef } from "react";
import type { AdminStatusActionState } from "@/app/admin/recruitment-requests/actions";
import { Button } from "@/components/ui/button";
import {
  adminTransitionLabels,
  type AdminTargetStatus,
} from "@/lib/admin/status-transitions";

type StatusAction = (
  state: AdminStatusActionState,
  form: FormData,
) => Promise<AdminStatusActionState>;

const initialState: AdminStatusActionState = { status: "idle" };

function StatusActionControl({
  target,
  action,
}: {
  target: AdminTargetStatus;
  action: StatusAction;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [state, formAction, pending] = useActionState(action, initialState);
  const label = adminTransitionLabels[target];

  useEffect(() => {
    if (state.status === "success" && dialog.current?.open) {
      dialog.current.close();
    }
  }, [state.status]);

  return (
    <div>
      {state.message ? (
        <p
          role={state.status === "error" ? "alert" : "status"}
          aria-live="polite"
          className={`mb-3 max-w-md font-semibold ${state.status === "error" ? "text-error-red" : "text-navy"}`}
        >
          {state.message}
        </p>
      ) : null}
      <button
        ref={trigger}
        type="button"
        onClick={() => dialog.current?.showModal()}
        className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius)] border border-navy bg-white px-5 py-3 text-sm font-bold text-navy hover:bg-soft-grey focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-gold"
      >
        {label}
      </button>
      <dialog
        ref={dialog}
        onClose={() => trigger.current?.focus()}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-[var(--radius)] border border-border-grey bg-white p-0 text-navy shadow-xl backdrop:bg-navy/60"
      >
        <div className="p-6">
          <h2 className="font-heading text-2xl font-extrabold">
            Confirm status update
          </h2>
          <p className="mt-3 leading-7 text-slate">
            Update this recruitment request using the controlled action: {label}?
          </p>
          {state.status === "error" && state.message ? (
            <p className="mt-3 font-semibold text-error-red" role="alert">
              {state.message}
            </p>
          ) : null}
          <form
            action={formAction}
            className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => dialog.current?.close()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Updating Request..." : label}
            </Button>
            <span className="sr-only" aria-live="polite">
              {pending ? "Updating recruitment request" : ""}
            </span>
          </form>
        </div>
      </dialog>
    </div>
  );
}

export function StatusActions({
  actions,
}: {
  actions: { target: AdminTargetStatus; action: StatusAction }[];
}) {
  if (!actions.length) {
    return <p className="leading-7 text-slate">No administrator status actions are available.</p>;
  }
  return (
    <div className="flex flex-wrap gap-3">
      {actions.map(({ target, action }) => (
        <StatusActionControl key={target} target={target} action={action} />
      ))}
    </div>
  );
}

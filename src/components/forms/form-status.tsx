import { ButtonLink } from "@/components/ui/button";
import type { SubmissionFeedback, SubmissionState } from "@/types/forms";

type Props = { state: SubmissionState; successHeading: string; successMessage: string; feedback?: SubmissionFeedback; actions: readonly { label: string; href: string }[] };
export function FormStatus({ state, successHeading, successMessage, feedback, actions }: Props) {
  if (state === "idle") return null;
  if (state === "loading") return <p role="status" aria-live="polite" className="font-semibold text-navy">Sending information securely to the Talvanta Africa website server…</p>;
  if (state === "failure") return <div role="alert" className="rounded-[var(--radius)] border-2 border-error-red bg-white p-5"><h2 className="font-heading text-xl font-extrabold text-navy">Submission not completed</h2><p className="mt-2 leading-7 text-slate">{feedback?.message ?? "The submission could not be completed. Please try again."}</p>{feedback?.message.includes("entries are still available") ? null : <p className="mt-2 font-semibold text-navy">Your information remains in the form so you can try again.</p>}</div>;
  return <div role="status" aria-live="polite" className="min-w-0 rounded-[var(--radius)] border-2 border-green bg-white p-5 sm:p-6"><h2 className="font-heading text-xl font-extrabold text-navy">{successHeading}</h2><p className="mt-2 leading-7 text-slate">{successMessage}</p>{feedback?.reference ? <p className="mt-3 break-all font-semibold text-navy">Reference: <span>{feedback.reference}</span></p> : null}<div className="mt-5 flex flex-col gap-3 sm:flex-row">{actions.map((action, index) => <ButtonLink key={action.href} href={action.href} variant={index ? "outline" : "primary"}>{action.label}</ButtonLink>)}</div></div>;
}

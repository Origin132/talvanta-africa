import { ButtonLink } from "@/components/ui/button";
import type { SubmissionState } from "@/types/forms";

type Props = { state: SubmissionState; successHeading: string; successMessage: string; actions: readonly { label: string; href: string }[] };
export function FormStatus({ state, successHeading, successMessage, actions }: Props) {
  if (state === "idle") return null;
  if (state === "loading") return <p role="status" aria-live="polite" className="font-semibold text-navy">Browser validation passed. Preparing the demonstration confirmation…</p>;
  if (state === "failure") return <div role="alert" className="rounded-[var(--radius)] border-2 border-error-red bg-white p-5"><h2 className="font-heading text-xl font-extrabold text-navy">The demonstration could not be completed</h2><p className="mt-2">Your information remains in the form. Please try again.</p></div>;
  return <div role="status" aria-live="polite" className="rounded-[var(--radius)] border-2 border-green bg-white p-5 sm:p-6"><h2 className="font-heading text-xl font-extrabold text-navy">{successHeading}</h2><p className="mt-2 leading-7 text-slate">{successMessage}</p><div className="mt-5 flex flex-col gap-3 sm:flex-row">{actions.map((action, index) => <ButtonLink key={action.href} href={action.href} variant={index ? "outline" : "primary"}>{action.label}</ButtonLink>)}</div></div>;
}

"use client";

import { useEffect, useRef } from "react";
import type { FormErrors } from "@/types/forms";

export function FormErrorSummary({ errors }: { errors: FormErrors }) {
  const ref = useRef<HTMLDivElement>(null);
  const items = Object.entries(errors);
  useEffect(() => { if (items.length) ref.current?.focus(); }, [errors, items.length]);
  if (!items.length) return null;
  return <div id="form-error-summary" ref={ref} tabIndex={-1} role="alert" aria-labelledby="form-errors-heading" className="rounded-[var(--radius)] border-2 border-error-red bg-white p-5 focus:outline-3 focus:outline-offset-3 focus:outline-gold"><h2 id="form-errors-heading" className="font-heading text-xl font-extrabold text-navy">Please correct {items.length === 1 ? "this error" : `these ${items.length} errors`}</h2><ul className="mt-3 list-disc space-y-2 pl-5">{items.map(([fieldId, message]) => <li key={fieldId}><a className="font-semibold text-error-red underline underline-offset-4" href={`#${fieldId}`}>{message}</a></li>)}</ul></div>;
}

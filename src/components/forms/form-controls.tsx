import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const controlStyles = "mt-2 min-h-12 w-full rounded-[var(--radius)] border border-border-grey bg-white px-4 py-3 text-base text-navy shadow-sm outline-none transition focus:border-green focus:ring-3 focus:ring-green/15 disabled:cursor-not-allowed disabled:bg-soft-grey disabled:text-slate";
type SharedProps = { label: string; name: string; error?: string; helperText?: string; required?: boolean };

function Label({ label, name, required }: Pick<SharedProps, "label" | "name" | "required">) {
  return <label className="block font-bold text-navy" htmlFor={name}>{label} {required ? <><span className="text-error-red" aria-hidden="true">*</span><span className="sr-only"> (required)</span></> : null}</label>;
}
function Messages({ name, helperText, error }: Pick<SharedProps, "name" | "helperText" | "error">) {
  return <>{helperText ? <p id={`${name}-help`} className="mt-2 text-sm leading-6 text-slate">{helperText}</p> : null}{error ? <p id={`${name}-error`} className="mt-2 font-semibold text-error-red"><span aria-hidden="true">Error: </span>{error}</p> : null}</>;
}
function describedBy(name: string, helperText?: string, error?: string) {
  return [helperText && `${name}-help`, error && `${name}-error`].filter(Boolean).join(" ") || undefined;
}

type TextFieldProps = SharedProps & Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "required">;
export function TextField({ label, name, error, helperText, required, ...props }: TextFieldProps) {
  return <div><Label label={label} name={name} required={required} /><input id={name} name={name} required={required} aria-invalid={Boolean(error)} aria-describedby={describedBy(name, helperText, error)} className={controlStyles} {...props} /><Messages name={name} helperText={helperText} error={error} /></div>;
}

type TextareaFieldProps = SharedProps & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "name" | "required">;
export function TextareaField({ label, name, error, helperText, required, ...props }: TextareaFieldProps) {
  return <div><Label label={label} name={name} required={required} /><textarea id={name} name={name} required={required} aria-invalid={Boolean(error)} aria-describedby={describedBy(name, helperText, error)} className={`${controlStyles} min-h-32 resize-y`} {...props} /><Messages name={name} helperText={helperText} error={error} /></div>;
}

type SelectFieldProps = SharedProps & SelectHTMLAttributes<HTMLSelectElement> & { options: readonly string[] };
export function SelectField({ label, name, error, helperText, required, options, ...props }: SelectFieldProps) {
  return <div><Label label={label} name={name} required={required} /><select id={name} name={name} required={required} defaultValue="" aria-invalid={Boolean(error)} aria-describedby={describedBy(name, helperText, error)} className={controlStyles} {...props}><option value="" disabled>Select an option</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select><Messages name={name} helperText={helperText} error={error} /></div>;
}

type ChoiceGroupProps = SharedProps & { options: readonly string[]; type: "radio" | "checkbox" };
export function ChoiceGroup({ label, name, error, helperText, required, options, type }: ChoiceGroupProps) {
  return <fieldset id={name} aria-invalid={Boolean(error)} aria-describedby={describedBy(name, helperText, error)}><legend className="font-bold text-navy">{label} {required ? <><span className="text-error-red" aria-hidden="true">*</span><span className="sr-only"> (required)</span></> : null}</legend><div className="mt-3 grid gap-3 sm:grid-cols-2">{options.map((option, index) => <label key={option} className="flex min-h-12 cursor-pointer items-start gap-3 rounded-[var(--radius)] border border-border-grey bg-white px-4 py-3 text-navy shadow-sm focus-within:border-green focus-within:ring-3 focus-within:ring-green/15"><input id={`${name}-${index}`} name={name} value={option} type={type} className="mt-1 size-5 shrink-0 accent-green" /><span>{option}</span></label>)}</div><Messages name={name} helperText={helperText} error={error} /></fieldset>;
}

export function Declaration({ name, children, error, required }: { name: string; children: string; error?: string; required?: boolean }) {
  return <div><label className="flex min-h-12 cursor-pointer items-start gap-3 rounded-[var(--radius)] border border-border-grey bg-white p-4 text-navy shadow-sm focus-within:border-green focus-within:ring-3 focus-within:ring-green/15"><input id={name} name={name} type="checkbox" required={required} className="mt-1 size-5 shrink-0 accent-green" aria-invalid={Boolean(error)} aria-describedby={error ? `${name}-error` : undefined} /><span>{children} {required ? <span className="text-error-red" aria-hidden="true">*</span> : null}<span className="sr-only"> {required ? "(required)" : "(optional)"}</span></span></label>{error ? <p id={`${name}-error`} className="mt-2 font-semibold text-error-red"><span aria-hidden="true">Error: </span>{error}</p> : null}</div>;
}

export function FormSection({ legend, children }: { legend: string; children: ReactNode }) {
  return <fieldset className="rounded-[var(--radius)] border border-border-grey bg-white p-5 shadow-sm sm:p-8"><legend className="px-2 font-heading text-xl font-extrabold text-navy sm:text-2xl">{legend}</legend><div className="mt-4 grid gap-6 md:grid-cols-2">{children}</div></fieldset>;
}

export function FullWidth({ children }: { children: ReactNode }) { return <div className="md:col-span-2">{children}</div>; }

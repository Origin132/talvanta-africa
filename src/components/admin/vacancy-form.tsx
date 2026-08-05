"use client";
import { useActionState } from "react";
import type { VacancyActionState } from "@/app/admin/vacancies/actions";
import { Button } from "@/components/ui/button";
import { employmentTypes, workplaceTypes } from "@/lib/employers/recruitment-request-validation";

type Action = (state: VacancyActionState, form: FormData) => Promise<VacancyActionState>;
const initial: VacancyActionState = { status: "idle" };
const control = "mt-2 min-h-12 w-full rounded-[var(--radius)] border border-border-grey bg-white px-3 py-2 text-slate focus:border-green focus:ring-3 focus:ring-green/15";
export type VacancyFormDefaults = Record<string, string | boolean | null>;

export function VacancyForm({ action, defaults, canPublish = true, saveLabel = "Save Draft" }: { action: Action; defaults: VacancyFormDefaults; canPublish?: boolean; saveLabel?: string }) {
  const [state, formAction, pending] = useActionState(action, initial); const value = (name: string) => state.values?.[name] ?? String(defaults[name] ?? ""); const error = (name: string) => state.errors?.[name];
  return <form action={formAction} noValidate className="space-y-6">{state.message?<div role="alert" className="rounded-lg border border-error-red/40 bg-red-50 p-4 font-semibold text-error-red">{state.message}</div>:null}<div className="grid gap-5 sm:grid-cols-2">
    <Field label="Job Title" name="jobTitle" value={value("jobTitle")} error={error("jobTitle")} required />
    <Field label="Organisation Name" name="organisationName" value={value("organisationName")} error={error("organisationName")} required />
    <Field label="Department" name="department" value={value("department")} error={error("department")} />
    <Select label="Employment Type" name="employmentType" value={value("employmentType")} options={employmentTypes} error={error("employmentType")} />
    <Select label="Workplace Type" name="workplaceType" value={value("workplaceType")} options={workplaceTypes} error={error("workplaceType")} />
    <Field label="Job Location" name="jobLocation" value={value("jobLocation")} error={error("jobLocation")} required />
    <Field label="Number of Positions" name="numberOfPositions" value={value("numberOfPositions")} error={error("numberOfPositions")} type="number" required />
    <Field label="Salary Range" name="salaryRange" value={value("salaryRange")} error={error("salaryRange")} />
    <Field label="Closing Date" name="closingDate" value={value("closingDate")} error={error("closingDate")} type="datetime-local" />
  </div>
  <Area label="Role Summary" name="roleSummary" value={value("roleSummary")} error={error("roleSummary")} required />
  <Area label="Responsibilities" name="responsibilities" value={value("responsibilities")} error={error("responsibilities")} helper="Enter one item per line." />
  <Area label="Required Skills" name="requiredSkills" value={value("requiredSkills")} error={error("requiredSkills")} helper="Enter one item per line." />
  <Area label="Required Experience" name="requiredExperience" value={value("requiredExperience")} error={error("requiredExperience")} />
  <Area label="Education Requirements" name="educationRequirements" value={value("educationRequirements")} error={error("educationRequirements")} />
  <Area label="Application Instructions" name="applicationInstructions" value={value("applicationInstructions")} error={error("applicationInstructions")} />
  <label className="flex min-h-12 items-start gap-3 rounded-lg border border-border-grey p-4 font-bold text-navy"><input className="mt-1 size-5 accent-green" type="checkbox" name="applicationsOpen" defaultChecked={state.values ? state.values.applicationsOpen === "true" : defaults.applicationsOpen === true} />Applications Open</label>
  <div className="flex flex-col gap-3 sm:flex-row"><Button type="submit" name="intent" value="save" variant="outline" disabled={pending}>{pending?"Saving...":saveLabel}</Button>{canPublish?<Button type="submit" name="intent" value="publish" disabled={pending}>{pending?"Publishing...":"Publish Vacancy"}</Button>:null}</div><span className="sr-only" aria-live="polite">{pending?"Processing vacancy":""}</span></form>;
}
function Field({label,name,value,error,type="text",required=false}:{label:string;name:string;value:string;error?:string;type?:string;required?:boolean}){return <label className="font-bold text-navy">{label}{required?<span className="text-error-red"> *</span>:null}<input className={control} name={name} type={type} defaultValue={value} aria-invalid={Boolean(error)} aria-describedby={error?`${name}-error`:undefined}/>{error?<span id={`${name}-error`} className="mt-2 block text-sm text-error-red">Error: {error}</span>:null}</label>}
function Select({label,name,value,options,error}:{label:string;name:string;value:string;options:readonly string[];error?:string}){return <label className="font-bold text-navy">{label}<span className="text-error-red"> *</span><select className={control} name={name} defaultValue={value} aria-invalid={Boolean(error)}><option value="">Select</option>{options.map(option=><option key={option}>{option}</option>)}</select>{error?<span className="mt-2 block text-sm text-error-red">Error: {error}</span>:null}</label>}
function Area({label,name,value,error,helper,required=false}:{label:string;name:string;value:string;error?:string;helper?:string;required?:boolean}){return <label className="block font-bold text-navy">{label}{required?<span className="text-error-red"> *</span>:null}<textarea className={`${control} min-h-32`} name={name} defaultValue={value} aria-invalid={Boolean(error)}/>{helper?<span className="mt-1 block text-sm font-normal text-slate">{helper}</span>:null}{error?<span className="mt-2 block text-sm text-error-red">Error: {error}</span>:null}</label>}

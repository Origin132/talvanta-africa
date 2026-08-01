"use client";

import { useActionState } from "react";
import { saveCandidateProfile, saveEmployerProfile, type ProfileActionState } from "@/app/account/actions";
import { FormErrorSummary } from "@/components/forms/form-error-summary";
import { TextareaField, TextField } from "@/components/forms/form-controls";
import { Button } from "@/components/ui/button";
import type { CandidateProfile, EmployerProfile, Profile } from "@/lib/supabase/database.types";
import { employmentTypes, workplaceTypes } from "@/lib/profiles/profile-validation";

type Props = { type: "candidate"; profile: Profile; details: CandidateProfile | null } | { type: "employer"; profile: Profile; details: EmployerProfile | null };
const joined = (values: string[] | null | undefined) => values?.join(", ") ?? "";

export function ProfileForm(props: Props) {
  const action = props.type === "candidate" ? saveCandidateProfile : saveEmployerProfile;
  const [state, formAction, pending] = useActionState(action, { status: "idle" } satisfies ProfileActionState);
  const errors = state.errors ?? {}; const retained = state.values;
  const initial = (name: string, fallback: string | number | null | undefined) => retained?.[name] ?? (fallback ?? "");
  return <form action={formAction} className="space-y-6" noValidate>
    {Object.keys(errors).length ? <FormErrorSummary errors={errors} /> : null}
    {state.message ? <p role="alert" aria-live="assertive" className="rounded-lg border border-error-red/40 bg-red-50 p-4 font-semibold text-error-red">{state.message}</p> : null}
    <TextField label="Full Name" name="fullName" required maxLength={100} autoComplete="name" defaultValue={initial("fullName", props.profile.full_name)} error={errors.fullName} />
    {props.type === "candidate" ? <>
      <div className="grid gap-6 sm:grid-cols-2"><TextField label="Phone Number" name="phone" type="tel" maxLength={50} autoComplete="tel" defaultValue={initial("phone", props.details?.phone)} error={errors.phone} /><TextField label="Current Location" name="currentLocation" maxLength={200} autoComplete="address-level2" defaultValue={initial("currentLocation", props.details?.current_location)} error={errors.currentLocation} /></div>
      <div className="grid gap-6 sm:grid-cols-2"><TextField label="Professional Title" name="professionalTitle" maxLength={200} defaultValue={initial("professionalTitle", props.details?.professional_title)} error={errors.professionalTitle} /><TextField label="Years of Relevant Experience" name="yearsOfExperience" type="number" min={0} max={80} step={1} inputMode="numeric" defaultValue={initial("yearsOfExperience", props.details?.years_of_experience)} error={errors.yearsOfExperience} /></div>
      <TextareaField label="Professional Summary" name="professionalSummary" maxLength={5000} defaultValue={initial("professionalSummary", props.details?.professional_summary)} error={errors.professionalSummary} helperText="Up to 5,000 characters. Do not include sensitive personal information." />
      <div className="grid gap-6 sm:grid-cols-2"><TextField label="LinkedIn Profile" name="linkedinUrl" type="url" maxLength={500} defaultValue={initial("linkedinUrl", props.details?.linkedin_url)} error={errors.linkedinUrl} helperText="Optional. Use a complete HTTPS URL." /><TextField label="Portfolio or Professional Website" name="portfolioUrl" type="url" maxLength={500} defaultValue={initial("portfolioUrl", props.details?.portfolio_url)} error={errors.portfolioUrl} helperText="Optional. Use a complete HTTPS URL." /></div>
      <TextField label="Preferred Roles" name="preferredRoles" maxLength={1000} defaultValue={initial("preferredRoles", joined(props.details?.preferred_roles))} error={errors.preferredRoles} helperText="Separate multiple roles with commas." />
      <TextField label="Preferred Locations" name="preferredLocations" maxLength={1000} defaultValue={initial("preferredLocations", joined(props.details?.preferred_locations))} error={errors.preferredLocations} helperText="Separate multiple locations with commas." />
      <CheckboxGroup legend="Preferred Employment Types" name="preferredEmploymentTypes" options={employmentTypes} selected={retained?.preferredEmploymentTypes ?? props.details?.preferred_employment_types ?? []} error={errors.preferredEmploymentTypes} />
      <CheckboxGroup legend="Preferred Workplace Types" name="preferredWorkplaceTypes" options={workplaceTypes} selected={retained?.preferredWorkplaceTypes ?? props.details?.preferred_workplace_types ?? []} error={errors.preferredWorkplaceTypes} />
    </> : <>
      <TextField label="Organisation Name" name="organisationName" required maxLength={200} autoComplete="organization" defaultValue={initial("organisationName", props.details?.organisation_name)} error={errors.organisationName} />
      <TextField label="Organisation Website" name="organisationWebsite" type="url" maxLength={500} defaultValue={initial("organisationWebsite", props.details?.organisation_website)} error={errors.organisationWebsite} helperText="Optional. Use a complete HTTPS URL." />
      <div className="grid gap-6 sm:grid-cols-2"><TextField label="Industry" name="industry" maxLength={200} defaultValue={initial("industry", props.details?.industry)} error={errors.industry} /><TextField label="Organisation Size" name="organisationSize" maxLength={100} defaultValue={initial("organisationSize", props.details?.organisation_size)} error={errors.organisationSize} /></div>
      <div className="grid gap-6 sm:grid-cols-2"><TextField label="Contact Role" name="contactRole" maxLength={200} autoComplete="organization-title" defaultValue={initial("contactRole", props.details?.contact_role)} error={errors.contactRole} /><TextField label="Telephone Number" name="phone" type="tel" maxLength={50} autoComplete="tel" defaultValue={initial("phone", props.details?.phone)} error={errors.phone} /></div>
      <TextField label="Organisation Location" name="organisationLocation" maxLength={200} autoComplete="address-level2" defaultValue={initial("organisationLocation", props.details?.organisation_location)} error={errors.organisationLocation} />
      <TextareaField label="Organisation Summary" name="organisationSummary" maxLength={5000} defaultValue={initial("organisationSummary", props.details?.organisation_summary)} error={errors.organisationSummary} helperText="Up to 5,000 characters. Do not include financial or registration-document information." />
    </>}
    <Button className="w-full sm:w-auto" type="submit" disabled={pending} aria-disabled={pending}>{pending ? "Saving Profile..." : props.type === "candidate" ? "Save Candidate Profile" : "Save Employer Profile"}</Button>
    <span className="sr-only" aria-live="polite">{pending ? "Saving profile" : ""}</span>
  </form>;
}

function CheckboxGroup({ legend, name, options, selected, error }: { legend: string; name: string; options: readonly string[]; selected: string | string[]; error?: string }) {
  const values = Array.isArray(selected) ? selected : [selected];
  return <fieldset aria-describedby={error ? `${name}-error` : `${name}-help`}><legend className="font-bold text-navy">{legend}</legend><p id={`${name}-help`} className="mt-1 text-sm text-slate">Select all that apply.</p><div className="mt-3 grid gap-3 sm:grid-cols-2">{options.map((option) => <label key={option} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-border-grey p-3 focus-within:border-green focus-within:ring-3 focus-within:ring-green/15"><input className="size-5 accent-green" type="checkbox" name={name} value={option} defaultChecked={values.includes(option)} /><span>{option}</span></label>)}</div>{error ? <p id={`${name}-error`} className="mt-2 font-semibold text-error-red">Error: {error}</p> : null}</fieldset>;
}

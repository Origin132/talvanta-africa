"use client";

import { useState, type FormEvent } from "react";
import { ChoiceGroup, Declaration, FormSection, FullWidth, SelectField, TextareaField, TextField } from "@/components/forms/form-controls";
import { FormErrorSummary } from "@/components/forms/form-error-summary";
import { FormStatus } from "@/components/forms/form-status";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { addEmail, addNumberRange, addOptionalUrl, addRequiredCheck, addRequiredCheckGroup, addRequiredChoice, addRequiredText, addTelephone } from "@/lib/form-validation";
import type { FormErrors, SubmissionState } from "@/types/forms";

const statuses = ["Employed", "Self-employed", "Unemployed", "Student", "Recent graduate", "Career break", "Other"];
const education = ["Secondary education", "Diploma or certificate", "Bachelor’s degree", "Postgraduate diploma", "Master’s degree", "Doctorate", "Professional qualification", "Other"];
const employmentTypes = ["Permanent", "Temporary", "Contract", "Internship", "Graduate role", "Part-time"];
const workplaceOptions = ["On-site", "Hybrid", "Remote", "Flexible"];
const availability = ["Immediately", "Within 2 weeks", "Within 1 month", "Within 2–3 months", "More than 3 months", "To be discussed"];

function validate(data: FormData) {
  const errors: FormErrors = {};
  addRequiredText(errors, data, "fullName", "Full name", 2);
  addEmail(errors, data, "email");
  addTelephone(errors, data, "telephone");
  addRequiredText(errors, data, "currentLocation", "Current location");
  addRequiredText(errors, data, "preferredLocation", "Preferred work location");
  addOptionalUrl(errors, data, "profileLink");
  addRequiredText(errors, data, "recentJobTitle", "Current or most recent job title", 2);
  addRequiredChoice(errors, data, "employmentStatus", "Select your current employment status.");
  addNumberRange(errors, data, "experienceYears", "Years of professional experience", 0, 60);
  addRequiredChoice(errors, data, "educationLevel", "Select your highest education level.");
  addRequiredText(errors, data, "keySkills", "Key skills", 20);
  addRequiredText(errors, data, "experienceSummary", "Experience summary", 40);
  addRequiredText(errors, data, "industryExperience", "Industry experience");
  addRequiredCheckGroup(errors, data, "preferredEmploymentType", "Select at least one preferred employment type.");
  addRequiredCheckGroup(errors, data, "workplacePreference", "Select at least one workplace preference.");
  addRequiredText(errors, data, "preferredRoles", "Preferred role or job titles", 10);
  addRequiredChoice(errors, data, "availability", "Select your availability.");
  addRequiredCheck(errors, data, "accuracyConsent", "Confirm that the professional information is accurate.");
  addRequiredCheck(errors, data, "outcomesConsent", "Confirm that you understand registration does not guarantee an outcome.");
  addRequiredCheck(errors, data, "matchingConsent", "Consent to future candidate-profile review and potential opportunity matching.");
  addRequiredCheck(errors, data, "humanDecisionsConsent", "Confirm that you understand employment decisions remain human-led.");
  return errors;
}

export function CandidateRegistrationForm() {
  const [errors, setErrors] = useState<FormErrors>({});
  const [state, setState] = useState<SubmissionState>("idle");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(new FormData(event.currentTarget));
    setErrors(nextErrors);
    setState("idle");
    if (Object.keys(nextErrors).length) return;
    setState("loading");
    try { await new Promise<void>((resolve) => window.setTimeout(resolve, 650)); setState("success"); }
    catch { setState("failure"); }
  }
  return <section className="bg-soft-grey" aria-labelledby="candidate-form-heading"><PageContainer className="py-16 sm:py-24"><div className="mx-auto max-w-5xl"><div className="max-w-3xl"><p className="text-sm font-extrabold uppercase tracking-[0.16em] text-green">Candidate registration</p><h2 id="candidate-form-heading" className="mt-3 text-3xl font-extrabold text-navy sm:text-4xl">Prepare your professional profile</h2><p className="mt-4 leading-8 text-slate">Fields marked with an asterisk are required. Your entries remain visible after validation so you can review and correct them.</p></div><form className="mt-10 space-y-8" noValidate onSubmit={submit} aria-busy={state === "loading"}>
    <FormErrorSummary errors={errors} />
    <FormSection legend="A. Personal and contact information"><TextField label="Full name" name="fullName" required minLength={2} maxLength={120} autoComplete="name" error={errors.fullName} /><TextField label="Email address" name="email" type="email" required autoComplete="email" error={errors.email} /><TextField label="Telephone number" name="telephone" type="tel" required minLength={7} maxLength={25} autoComplete="tel" error={errors.telephone} /><TextField label="Current location" name="currentLocation" required maxLength={120} autoComplete="address-level2" error={errors.currentLocation} /><TextField label="Preferred work location" name="preferredLocation" required maxLength={160} helperText="You may list more than one city, state, or country." error={errors.preferredLocation} /><TextField label="Professional profile link" name="profileLink" type="url" maxLength={300} helperText="Optional. You may provide a LinkedIn profile, portfolio, or professional website." error={errors.profileLink} /></FormSection>
    <FormSection legend="B. Professional background"><TextField label="Current or most recent job title" name="recentJobTitle" required minLength={2} maxLength={120} error={errors.recentJobTitle} /><SelectField label="Current employment status" name="employmentStatus" required options={statuses} error={errors.employmentStatus} /><TextField label="Years of professional experience" name="experienceYears" type="number" required min={0} max={60} step={1} inputMode="numeric" error={errors.experienceYears} /><SelectField label="Highest education level" name="educationLevel" required options={education} error={errors.educationLevel} /><TextField label="Area of study" name="areaOfStudy" maxLength={160} /><TextareaField label="Professional qualifications" name="professionalQualifications" maxLength={1000} /></FormSection>
    <FormSection legend="C. Skills and experience"><TextareaField label="Key skills" name="keySkills" required minLength={20} maxLength={1500} helperText="List skills relevant to the types of roles you are seeking." error={errors.keySkills} /><TextareaField label="Experience summary" name="experienceSummary" required minLength={40} maxLength={2500} error={errors.experienceSummary} /><TextField label="Industry experience" name="industryExperience" required maxLength={200} helperText="For example: technology, banking, healthcare, education, retail, or professional services." error={errors.industryExperience} /><TextareaField label="Recent responsibilities or achievements" name="recentAchievements" maxLength={2000} /></FormSection>
    <FormSection legend="D. Career preferences"><FullWidth><ChoiceGroup label="Preferred employment type" name="preferredEmploymentType" type="checkbox" required options={employmentTypes} error={errors.preferredEmploymentType} /></FullWidth><FullWidth><ChoiceGroup label="Workplace preference" name="workplacePreference" type="checkbox" required options={workplaceOptions} error={errors.workplacePreference} /></FullWidth><FullWidth><TextareaField label="Preferred role or job titles" name="preferredRoles" required minLength={10} maxLength={1000} error={errors.preferredRoles} /></FullWidth><TextField label="Salary expectation" name="salaryExpectation" maxLength={120} helperText="Optional. Include currency and whether the amount is monthly or annual where possible." /><SelectField label="Availability" name="availability" required options={availability} error={errors.availability} /><FullWidth><TextareaField label="Career interests" name="careerInterests" maxLength={1500} /></FullWidth></FormSection>
    <FormSection legend="E. Curriculum vitae"><FullWidth><div className="rounded-[var(--radius)] border-l-4 border-gold bg-soft-grey p-5 font-semibold leading-7 text-navy">CV upload will be introduced in a later sprint after secure file handling and storage requirements are defined.</div></FullWidth><FullWidth><TextareaField label="CV summary or selected career history" name="cvSummary" maxLength={3000} helperText="Optional. Do not paste sensitive personal data." /></FullWidth></FormSection>
    <FormSection legend="F. Consent and declarations"><FullWidth><div className="space-y-4"><Declaration name="accuracyConsent" required error={errors.accuracyConsent}>I confirm that the professional information provided is accurate to the best of my knowledge.</Declaration><Declaration name="outcomesConsent" required error={errors.outcomesConsent}>I understand that registration does not guarantee contact, an interview, placement, or employment.</Declaration><Declaration name="matchingConsent" required error={errors.matchingConsent}>I consent to Talvanta Africa using this information for candidate-profile review and potential opportunity matching when integrations are introduced in a later sprint.</Declaration><Declaration name="humanDecisionsConsent" required error={errors.humanDecisionsConsent}>I understand that employers and recruitment professionals remain responsible for shortlisting, interviews, and final employment decisions.</Declaration><Declaration name="marketingConsent">I would like to receive occasional information about relevant Talvanta Africa opportunities and services.</Declaration></div></FullWidth></FormSection>
    <div className="space-y-5 pb-16"><Button type="submit" disabled={state === "loading"} className="w-full sm:w-auto">{state === "loading" ? "Validating..." : "Validate Candidate Registration"}</Button><FormStatus state={state} successHeading="Candidate information validated successfully" successMessage="Your information passed the browser validation checks. Because this page is in demonstration mode, the information was not transmitted, stored, or submitted to an employer." actions={[{ label: "Explore Jobs", href: "/jobs" }, { label: "Return to Job Seeker Guidance", href: "/job-seekers" }]} /></div>
  </form></div></PageContainer></section>;
}

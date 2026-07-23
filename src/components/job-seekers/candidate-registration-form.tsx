"use client";

import { useState, type FormEvent } from "react";
import { ChoiceGroup, Declaration, FormSection, FullWidth, SelectField, TextareaField, TextField } from "@/components/forms/form-controls";
import { FormErrorSummary } from "@/components/forms/form-error-summary";
import { FormStatus } from "@/components/forms/form-status";
import { HoneypotField } from "@/components/forms/honeypot-field";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { addEmail, addNumberRange, addOptionalUrl, addRequiredCheck, addRequiredCheckGroup, addRequiredChoice, addRequiredText, addTelephone, valueOf } from "@/lib/form-validation";
import { submitFormJson } from "@/lib/client/submit-form";
import type { FormErrors, SubmissionFeedback, SubmissionState } from "@/types/forms";

const statuses = ["Employed", "Self-employed", "Unemployed", "Student", "Recent graduate", "Career break", "Other"];
const education = ["Secondary education", "Diploma or certificate", "Bachelor’s degree", "Postgraduate diploma", "Master’s degree", "Doctorate", "Professional qualification", "Other"];
const employmentTypes = ["Permanent", "Temporary", "Contract", "Internship", "Graduate role", "Part-time"];
const workplaceOptions = ["On-site", "Hybrid", "Remote", "Flexible"];
const availability = ["Immediately", "Within 2 weeks", "Within 1 month", "Within 2–3 months", "More than 3 months", "To be discussed"];

function createPayload(data: FormData): Record<string, unknown> {
  const stringFields = ["fullName", "email", "telephone", "currentLocation", "preferredLocation", "profileLink", "recentJobTitle", "employmentStatus", "educationLevel", "areaOfStudy", "professionalQualifications", "keySkills", "experienceSummary", "industryExperience", "recentAchievements", "preferredRoles", "salaryExpectation", "availability", "careerInterests", "cvSummary", "websiteConfirmation"];
  const payload: Record<string, unknown> = {};
  for (const field of stringFields) payload[field] = valueOf(data, field);
  payload.experienceYears = Number(valueOf(data, "experienceYears"));
  payload.preferredEmploymentType = data.getAll("preferredEmploymentType").map(String);
  payload.workplacePreference = data.getAll("workplacePreference").map(String);
  for (const field of ["accuracyConsent", "outcomesConsent", "matchingConsent", "humanDecisionsConsent", "marketingConsent"]) payload[field] = data.has(field);
  return payload;
}

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
  const [feedback, setFeedback] = useState<SubmissionFeedback>();
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "loading") return;
    const formData = new FormData(event.currentTarget);
    const nextErrors = validate(formData);
    setErrors(nextErrors);
    setState("idle");
    setFeedback(undefined);
    if (Object.keys(nextErrors).length) return;
    setState("loading");
    try {
      const result = await submitFormJson("/api/candidate-registration", createPayload(formData));
      if (result.status === 422 && result.response && !result.response.success && "fieldErrors" in result.response) { setErrors(result.response.fieldErrors); setState("idle"); return; }
      if (result.status === 429) { setFeedback({ message: "Too many submission attempts were received. Please wait before trying again." }); setState("failure"); return; }
      if ([400, 413, 415].includes(result.status)) { setFeedback({ message: "The submission could not be read. Review the form and try again." }); setState("failure"); return; }
      if ([502, 503, 504].includes(result.status)) { setFeedback({ message: "Your information could not be submitted to the recruitment workflow. Your form entries are still available, so you can try again." }); setState("failure"); return; }
      if (result.status === 200 && result.response?.success) { setFeedback({ message: result.response.message, reference: result.response.submissionId }); setState("success"); return; }
      setFeedback({ message: "Your information could not be submitted to the recruitment workflow. Your form entries are still available, so you can try again." }); setState("failure");
    } catch { setFeedback({ message: "Your information could not be submitted to the recruitment workflow. Your form entries are still available, so you can try again." }); setState("failure"); }
  }
  return <section className="bg-soft-grey" aria-labelledby="candidate-form-heading"><PageContainer className="py-16 sm:py-24"><div className="mx-auto max-w-5xl"><div className="max-w-3xl"><p className="text-sm font-extrabold uppercase tracking-[0.16em] text-green">Candidate registration</p><h2 id="candidate-form-heading" className="mt-3 text-3xl font-extrabold text-navy sm:text-4xl">Prepare your professional profile</h2><p className="mt-4 leading-8 text-slate">Fields marked with an asterisk are required. Your entries remain visible after validation so you can review and correct them.</p></div><form className="mt-10 space-y-8" noValidate onSubmit={submit} aria-busy={state === "loading"}>
    <FormErrorSummary errors={errors} /><HoneypotField />
    <FormSection legend="A. Personal and contact information"><TextField label="Full name" name="fullName" required minLength={2} maxLength={120} autoComplete="name" error={errors.fullName} /><TextField label="Email address" name="email" type="email" required autoComplete="email" error={errors.email} /><TextField label="Telephone number" name="telephone" type="tel" required minLength={7} maxLength={25} autoComplete="tel" error={errors.telephone} /><TextField label="Current location" name="currentLocation" required maxLength={120} autoComplete="address-level2" error={errors.currentLocation} /><TextField label="Preferred work location" name="preferredLocation" required maxLength={160} helperText="You may list more than one city, state, or country." error={errors.preferredLocation} /><TextField label="Professional profile link" name="profileLink" type="url" maxLength={300} helperText="Optional. You may provide a LinkedIn profile, portfolio, or professional website." error={errors.profileLink} /></FormSection>
    <FormSection legend="B. Professional background"><TextField label="Current or most recent job title" name="recentJobTitle" required minLength={2} maxLength={120} error={errors.recentJobTitle} /><SelectField label="Current employment status" name="employmentStatus" required options={statuses} error={errors.employmentStatus} /><TextField label="Years of professional experience" name="experienceYears" type="number" required min={0} max={60} step={1} inputMode="numeric" error={errors.experienceYears} /><SelectField label="Highest education level" name="educationLevel" required options={education} error={errors.educationLevel} /><TextField label="Area of study" name="areaOfStudy" maxLength={160} /><TextareaField label="Professional qualifications" name="professionalQualifications" maxLength={1000} /></FormSection>
    <FormSection legend="C. Skills and experience"><TextareaField label="Key skills" name="keySkills" required minLength={20} maxLength={1500} helperText="List skills relevant to the types of roles you are seeking." error={errors.keySkills} /><TextareaField label="Experience summary" name="experienceSummary" required minLength={40} maxLength={2500} error={errors.experienceSummary} /><TextField label="Industry experience" name="industryExperience" required maxLength={200} helperText="For example: technology, banking, healthcare, education, retail, or professional services." error={errors.industryExperience} /><TextareaField label="Recent responsibilities or achievements" name="recentAchievements" maxLength={2000} /></FormSection>
    <FormSection legend="D. Career preferences"><FullWidth><ChoiceGroup label="Preferred employment type" name="preferredEmploymentType" type="checkbox" required options={employmentTypes} error={errors.preferredEmploymentType} /></FullWidth><FullWidth><ChoiceGroup label="Workplace preference" name="workplacePreference" type="checkbox" required options={workplaceOptions} error={errors.workplacePreference} /></FullWidth><FullWidth><TextareaField label="Preferred role or job titles" name="preferredRoles" required minLength={10} maxLength={1000} error={errors.preferredRoles} /></FullWidth><TextField label="Salary expectation" name="salaryExpectation" maxLength={120} helperText="Optional. Include currency and whether the amount is monthly or annual where possible." /><SelectField label="Availability" name="availability" required options={availability} error={errors.availability} /><FullWidth><TextareaField label="Career interests" name="careerInterests" maxLength={1500} /></FullWidth></FormSection>
    <FormSection legend="E. Curriculum vitae"><FullWidth><div className="rounded-[var(--radius)] border-l-4 border-gold bg-soft-grey p-5 font-semibold leading-7 text-navy">CV upload will be introduced in a later sprint after secure file handling and storage requirements are defined.</div></FullWidth><FullWidth><TextareaField label="CV summary or selected career history" name="cvSummary" maxLength={3000} helperText="Optional. Do not paste sensitive personal data." /></FullWidth></FormSection>
    <FormSection legend="F. Consent and declarations"><FullWidth><div className="space-y-4"><Declaration name="accuracyConsent" required error={errors.accuracyConsent}>I confirm that the professional information provided is accurate to the best of my knowledge.</Declaration><Declaration name="outcomesConsent" required error={errors.outcomesConsent}>I understand that registration does not guarantee contact, an interview, placement, or employment.</Declaration><Declaration name="matchingConsent" required error={errors.matchingConsent}>I consent to Talvanta Africa using this information for candidate-profile review and potential opportunity matching when integrations are introduced in a later sprint.</Declaration><Declaration name="humanDecisionsConsent" required error={errors.humanDecisionsConsent}>I understand that employers and recruitment professionals remain responsible for shortlisting, interviews, and final employment decisions.</Declaration><Declaration name="marketingConsent">I would like to receive occasional information about relevant Talvanta Africa opportunities and services.</Declaration></div></FullWidth></FormSection>
    <div className="space-y-5 pb-16"><Button type="submit" disabled={state === "loading"} className="w-full sm:w-auto">{state === "loading" ? "Validating..." : "Validate Candidate Registration"}</Button><FormStatus state={state} feedback={feedback} successHeading="Candidate registration submitted" successMessage="Your professional information was validated and forwarded to the Talvanta Africa recruitment workflow. Registration does not guarantee contact, shortlisting, an interview, placement, or employment." actions={[{ label: "Explore Jobs", href: "/jobs" }, { label: "Return to Job Seeker Guidance", href: "/job-seekers" }]} /></div>
  </form></div></PageContainer></section>;
}

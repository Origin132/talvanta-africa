"use client";

import { useState, type FormEvent } from "react";
import { ChoiceGroup, Declaration, FormSection, FullWidth, SelectField, TextareaField, TextField } from "@/components/forms/form-controls";
import { FormErrorSummary } from "@/components/forms/form-error-summary";
import { FormStatus } from "@/components/forms/form-status";
import { HoneypotField } from "@/components/forms/honeypot-field";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { addEmail, addNumberRange, addOptionalUrl, addRequiredCheck, addRequiredChoice, addRequiredText, addTelephone, valueOf } from "@/lib/form-validation";
import { submitFormJson } from "@/lib/client/submit-form";
import type { FormErrors, SubmissionFeedback, SubmissionState } from "@/types/forms";

const employmentTypes = ["Permanent", "Temporary", "Contract", "Internship", "Graduate role", "Part-time", "Other"];
const arrangements = ["On-site", "Hybrid", "Remote", "To be discussed"];
const timelines = ["As soon as possible", "Within 2 weeks", "Within 1 month", "Within 2–3 months", "More than 3 months", "Still planning"];
const services = ["Permanent Recruitment", "Temporary and Contract Staffing", "Executive Search", "Graduate Recruitment", "Candidate Screening", "HR Advisory", "Not sure"];

function createPayload(data: FormData): Record<string, unknown> {
  const stringFields = ["organisationName", "contactPerson", "workEmail", "telephone", "website", "organisationLocation", "jobTitle", "department", "employmentType", "workplaceArrangement", "jobLocation", "preferredStartDate", "recruitmentTimeline", "responsibilities", "requiredSkills", "requiredExperience", "educationRequirements", "salaryRange", "additionalInformation", "preferredService", "recruitedBefore", "websiteConfirmation"];
  const payload: Record<string, unknown> = {};
  for (const field of stringFields) payload[field] = valueOf(data, field);
  payload.positions = Number(valueOf(data, "positions"));
  for (const field of ["accuracyConsent", "outcomesConsent", "reviewConsent", "marketingConsent"]) payload[field] = data.has(field);
  return payload;
}

function validate(data: FormData) {
  const errors: FormErrors = {};
  addRequiredText(errors, data, "organisationName", "Organisation name", 2);
  addRequiredText(errors, data, "contactPerson", "Contact person", 2);
  addEmail(errors, data, "workEmail");
  addTelephone(errors, data, "telephone");
  addOptionalUrl(errors, data, "website");
  addRequiredText(errors, data, "organisationLocation", "Organisation location");
  addRequiredText(errors, data, "jobTitle", "Job title", 2);
  addRequiredChoice(errors, data, "employmentType", "Select an employment type.");
  addNumberRange(errors, data, "positions", "Number of positions", 1, 500);
  addRequiredChoice(errors, data, "workplaceArrangement", "Select a workplace arrangement.");
  addRequiredText(errors, data, "jobLocation", "Job location");
  const date = valueOf(data, "preferredStartDate");
  if (date && date < new Date().toISOString().slice(0, 10)) errors.preferredStartDate = "Preferred start date cannot be in the past.";
  addRequiredChoice(errors, data, "recruitmentTimeline", "Select a recruitment timeline.");
  addRequiredText(errors, data, "responsibilities", "Main responsibilities", 30);
  addRequiredText(errors, data, "requiredSkills", "Required skills", 20);
  addRequiredText(errors, data, "requiredExperience", "Required experience", 20);
  addRequiredChoice(errors, data, "preferredService", "Select a preferred service.");
  addRequiredChoice(errors, data, "recruitedBefore", "Select whether you have recruited for this role before.");
  addRequiredCheck(errors, data, "accuracyConsent", "Confirm that the information is accurate.");
  addRequiredCheck(errors, data, "outcomesConsent", "Confirm that you understand the recruitment outcome statement.");
  addRequiredCheck(errors, data, "reviewConsent", "Consent to future recruitment-enquiry review and follow-up.");
  return errors;
}

export function HiringRequestForm() {
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
      const result = await submitFormJson("/api/hire-talent", createPayload(formData));
      if (result.status === 422 && result.response && !result.response.success && "fieldErrors" in result.response) { setErrors(result.response.fieldErrors); setState("idle"); return; }
      if (result.status === 429) { setFeedback({ message: "Too many submission attempts were received. Please wait before trying again." }); setState("failure"); return; }
      if ([400, 413, 415].includes(result.status)) { setFeedback({ message: "The submission could not be read. Review the form and try again." }); setState("failure"); return; }
      if (result.status === 200 && result.response?.success) { setFeedback({ message: result.response.message, reference: result.response.submissionId }); setState("success"); return; }
      setFeedback({ message: "The submission could not be completed. Please try again." }); setState("failure");
    } catch { setFeedback({ message: "The submission could not be completed. Please try again." }); setState("failure"); }
  }
  return <section className="bg-soft-grey" aria-labelledby="hiring-form-heading"><PageContainer className="py-16 sm:py-24"><div className="mx-auto max-w-5xl"><div className="max-w-3xl"><p className="text-sm font-extrabold uppercase tracking-[0.16em] text-green">Hiring request</p><h2 id="hiring-form-heading" className="mt-3 text-3xl font-extrabold text-navy sm:text-4xl">Share your recruitment requirement</h2><p className="mt-4 leading-8 text-slate">Fields marked with an asterisk are required. Your entries remain visible after validation so you can review and correct them.</p></div><form className="mt-10 space-y-8" noValidate onSubmit={submit} aria-busy={state === "loading"}>
    <FormErrorSummary errors={errors} /><HoneypotField />
    <FormSection legend="A. Organisation and contact details"><TextField label="Organisation name" name="organisationName" required minLength={2} maxLength={120} autoComplete="organization" error={errors.organisationName} /><TextField label="Contact person" name="contactPerson" required minLength={2} maxLength={100} autoComplete="name" error={errors.contactPerson} /><TextField label="Work email" name="workEmail" type="email" required autoComplete="email" error={errors.workEmail} /><TextField label="Telephone number" name="telephone" type="tel" required minLength={7} maxLength={25} autoComplete="tel" error={errors.telephone} /><TextField label="Organisation website" name="website" type="url" maxLength={300} helperText="Optional. Include the full address, such as https://example.com." error={errors.website} /><TextField label="Organisation location" name="organisationLocation" required maxLength={120} autoComplete="address-level2" error={errors.organisationLocation} /></FormSection>
    <FormSection legend="B. Role information"><TextField label="Job title" name="jobTitle" required minLength={2} maxLength={120} error={errors.jobTitle} /><TextField label="Department or function" name="department" maxLength={120} /><SelectField label="Employment type" name="employmentType" required options={employmentTypes} error={errors.employmentType} /><TextField label="Number of positions" name="positions" type="number" required min={1} max={500} step={1} inputMode="numeric" error={errors.positions} /><FullWidth><ChoiceGroup label="Workplace arrangement" name="workplaceArrangement" type="radio" required options={arrangements} error={errors.workplaceArrangement} /></FullWidth><TextField label="Job location" name="jobLocation" required maxLength={120} error={errors.jobLocation} /><TextField label="Preferred start date" name="preferredStartDate" type="date" error={errors.preferredStartDate} /><SelectField label="Recruitment timeline" name="recruitmentTimeline" required options={timelines} error={errors.recruitmentTimeline} /></FormSection>
    <FormSection legend="C. Role requirements"><FullWidth><TextareaField label="Main responsibilities" name="responsibilities" required minLength={30} maxLength={2000} helperText="Summarise the main duties and expected outcomes." error={errors.responsibilities} /></FullWidth><TextareaField label="Required skills" name="requiredSkills" required minLength={20} maxLength={1500} error={errors.requiredSkills} /><TextareaField label="Required experience" name="requiredExperience" required minLength={20} maxLength={1500} error={errors.requiredExperience} /><TextareaField label="Education or professional requirements" name="educationRequirements" maxLength={1200} /><TextField label="Salary range" name="salaryRange" maxLength={120} helperText="Optional. Include currency and whether the amount is monthly or annual where possible." /><FullWidth><TextareaField label="Additional information" name="additionalInformation" maxLength={2000} /></FullWidth></FormSection>
    <FormSection legend="D. Recruitment service"><SelectField label="Preferred service" name="preferredService" required options={services} error={errors.preferredService} /><ChoiceGroup label="Have you recruited for this role before?" name="recruitedBefore" type="radio" required options={["Yes", "No", "Not sure"]} error={errors.recruitedBefore} /></FormSection>
    <FormSection legend="E. Consent and declarations"><FullWidth><div className="space-y-4"><Declaration name="accuracyConsent" required error={errors.accuracyConsent}>I confirm that the information provided is accurate to the best of my knowledge.</Declaration><Declaration name="outcomesConsent" required error={errors.outcomesConsent}>I understand that submitting this enquiry does not create a service agreement or guarantee candidate availability or recruitment success.</Declaration><Declaration name="reviewConsent" required error={errors.reviewConsent}>I consent to Talvanta Africa using the submitted information for recruitment-enquiry review and follow-up when integrations are introduced in a later sprint.</Declaration><Declaration name="marketingConsent">I would like to receive occasional information about Talvanta Africa services.</Declaration></div></FullWidth></FormSection>
    <div className="space-y-5 pb-16"><Button type="submit" disabled={state === "loading"} className="w-full sm:w-auto">{state === "loading" ? "Submitting..." : "Submit Hiring Enquiry"}</Button><FormStatus state={state} feedback={feedback} successHeading="Hiring enquiry received" successMessage="Your information was validated and received by the Talvanta Africa website server. External recruitment processing and permanent storage are not active in this sprint." actions={[{ label: "Return to Employers", href: "/employers" }]} /></div>
  </form></div></PageContainer></section>;
}

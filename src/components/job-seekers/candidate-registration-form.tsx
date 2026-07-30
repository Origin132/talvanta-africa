"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  ChoiceGroup,
  Declaration,
  FormSection,
  FullWidth,
  SelectField,
  TextareaField,
  TextField,
} from "@/components/forms/form-controls";
import { FormErrorSummary } from "@/components/forms/form-error-summary";
import { HoneypotField } from "@/components/forms/honeypot-field";
import { PageContainer } from "@/components/layout/page-container";
import { Button, ButtonLink } from "@/components/ui/button";
import { submitFormJson } from "@/lib/client/submit-form";
import {
  addEmail,
  addNumberRange,
  addOptionalUrl,
  addRequiredCheck,
  addRequiredCheckGroup,
  addRequiredChoice,
  addRequiredText,
  addTelephone,
  valueOf,
} from "@/lib/form-validation";
import type {
  FormErrors,
  SubmissionFeedback,
  SubmissionState,
} from "@/types/forms";

const statuses = [
  "Employed",
  "Self-employed",
  "Unemployed",
  "Student",
  "Recent graduate",
  "Career break",
  "Other",
];

const education = [
  "Secondary education",
  "Diploma or certificate",
  "Bachelor’s degree",
  "Postgraduate diploma",
  "Master’s degree",
  "Doctorate",
  "Professional qualification",
  "Other",
];

const employmentTypes = [
  "Permanent",
  "Temporary",
  "Contract",
  "Internship",
  "Graduate role",
  "Part-time",
];

const workplaceOptions = ["On-site", "Hybrid", "Remote", "Flexible"];

const availability = [
  "Immediately",
  "Within 2 weeks",
  "Within 1 month",
  "Within 2–3 months",
  "More than 3 months",
  "To be discussed",
];

function createPayload(data: FormData): Record<string, unknown> {
  const stringFields = [
    "fullName",
    "email",
    "telephone",
    "currentLocation",
    "preferredLocation",
    "profileLink",
    "recentJobTitle",
    "employmentStatus",
    "educationLevel",
    "areaOfStudy",
    "professionalQualifications",
    "keySkills",
    "experienceSummary",
    "industryExperience",
    "recentAchievements",
    "preferredRoles",
    "salaryExpectation",
    "availability",
    "careerInterests",
    "cvSummary",
    "websiteConfirmation",
  ];
  const payload: Record<string, unknown> = {};
  for (const field of stringFields) payload[field] = valueOf(data, field);
  payload.experienceYears = Number(valueOf(data, "experienceYears"));
  payload.preferredEmploymentType = data
    .getAll("preferredEmploymentType")
    .map(String);
  payload.workplacePreference = data.getAll("workplacePreference").map(String);
  for (const field of [
    "accuracyConsent",
    "outcomesConsent",
    "matchingConsent",
    "humanDecisionsConsent",
    "marketingConsent",
  ]) {
    payload[field] = data.has(field);
  }
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
  addRequiredText(
    errors,
    data,
    "recentJobTitle",
    "Current or most recent job title",
    2,
  );
  addRequiredChoice(
    errors,
    data,
    "employmentStatus",
    "Select your current employment status.",
  );
  addNumberRange(
    errors,
    data,
    "experienceYears",
    "Years of professional experience",
    0,
    60,
  );
  addRequiredChoice(
    errors,
    data,
    "educationLevel",
    "Select your highest education level.",
  );
  addRequiredText(errors, data, "keySkills", "Key skills", 20);
  addRequiredText(errors, data, "experienceSummary", "Experience summary", 40);
  addRequiredText(errors, data, "industryExperience", "Industry experience");
  addRequiredCheckGroup(
    errors,
    data,
    "preferredEmploymentType",
    "Select at least one preferred employment type.",
  );
  addRequiredCheckGroup(
    errors,
    data,
    "workplacePreference",
    "Select at least one workplace preference.",
  );
  addRequiredText(
    errors,
    data,
    "preferredRoles",
    "Preferred role or job titles",
    10,
  );
  addRequiredChoice(
    errors,
    data,
    "availability",
    "Select your availability.",
  );
  addRequiredCheck(
    errors,
    data,
    "accuracyConsent",
    "Confirm that the professional information is accurate.",
  );
  addRequiredCheck(
    errors,
    data,
    "outcomesConsent",
    "Confirm that you understand registration does not guarantee an outcome.",
  );
  addRequiredCheck(
    errors,
    data,
    "matchingConsent",
    "Consent to future candidate-profile review and potential opportunity matching.",
  );
  addRequiredCheck(
    errors,
    data,
    "humanDecisionsConsent",
    "Confirm that you understand employment decisions remain human-led.",
  );
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
      const result = await submitFormJson(
        "/api/candidate-registration",
        createPayload(formData),
      );

      if (
        result.status === 422 &&
        result.response &&
        !result.response.success &&
        "fieldErrors" in result.response
      ) {
        setErrors(result.response.fieldErrors);
        setState("idle");
        return;
      }

      if (result.status === 429) {
        setFeedback({
          message:
            "Too many submission attempts were received. Please wait before trying again.",
        });
        setState("failure");
        return;
      }

      if ([400, 413, 415].includes(result.status)) {
        setFeedback({
          message:
            "Please review the form, confirm your internet connection, and try again.",
        });
        setState("failure");
        return;
      }

      if ([502, 503, 504].includes(result.status)) {
        setFeedback({
          message:
            "Your profile could not be submitted at this time. Please try again later or use the Contact page for assistance.",
        });
        setState("failure");
        return;
      }

      if (result.status === 200 && result.response?.success) {
        setFeedback({
          message: result.response.message,
          reference: result.response.submissionId,
        });
        setState("success");
        return;
      }

      setFeedback({
        message:
          "Your profile could not be submitted at this time. Please try again later or use the Contact page for assistance.",
      });
      setState("failure");
    } catch {
      setFeedback({
        message:
          "Please review the form, confirm your internet connection, and try again.",
      });
      setState("failure");
    }
  }

  if (state === "success") {
    return <CandidateSubmissionSuccess reference={feedback?.reference} />;
  }

  return (
    <section
      id="candidate-registration-form"
      className="bg-soft-grey"
      aria-labelledby="candidate-form-heading"
    >
      <PageContainer className="py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-3xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-green">
              Candidate registration
            </p>
            <h2
              id="candidate-form-heading"
              className="mt-3 text-3xl font-extrabold text-navy sm:text-4xl"
            >
              Register Your Professional Profile
            </h2>
            <p className="mt-4 leading-8 text-slate">
              Complete the fields below as accurately as possible. Required fields
              must be completed before submission.
            </p>
            <p className="mt-3 font-semibold text-navy">
              Fields marked with an asterisk are required.
            </p>
          </div>

          <form
            className="mt-10 space-y-8"
            noValidate
            onSubmit={submit}
            aria-busy={state === "loading"}
          >
            <FormErrorSummary errors={errors} />
            <HoneypotField />

            <FormSection legend="A. Personal and contact information">
              <TextField
                label="Full Name"
                name="fullName"
                required
                minLength={2}
                maxLength={120}
                autoComplete="name"
                error={errors.fullName}
              />
              <TextField
                label="Email Address"
                name="email"
                type="email"
                required
                autoComplete="email"
                error={errors.email}
              />
              <TextField
                label="Phone Number"
                name="telephone"
                type="tel"
                required
                minLength={7}
                maxLength={25}
                autoComplete="tel"
                error={errors.telephone}
              />
              <TextField
                label="Current Location"
                name="currentLocation"
                required
                maxLength={120}
                autoComplete="address-level2"
                error={errors.currentLocation}
              />
              <TextField
                label="Preferred Work Location"
                name="preferredLocation"
                required
                maxLength={160}
                helperText="You may list more than one city, state, or country."
                error={errors.preferredLocation}
              />
              <TextField
                label="LinkedIn Profile, Portfolio, or Professional Website"
                name="profileLink"
                type="url"
                maxLength={300}
                helperText="Optional. Include the full web address."
                error={errors.profileLink}
              />
            </FormSection>

            <FormSection legend="B. Professional background">
              <TextField
                label="Current or Most Recent Role"
                name="recentJobTitle"
                required
                minLength={2}
                maxLength={120}
                error={errors.recentJobTitle}
              />
              <SelectField
                label="Current Employment Status"
                name="employmentStatus"
                required
                options={statuses}
                error={errors.employmentStatus}
              />
              <TextField
                label="Years of Relevant Experience"
                name="experienceYears"
                type="number"
                required
                min={0}
                max={60}
                step={1}
                inputMode="numeric"
                error={errors.experienceYears}
              />
              <SelectField
                label="Highest Qualification"
                name="educationLevel"
                required
                options={education}
                error={errors.educationLevel}
              />
              <TextField
                label="Area of Study"
                name="areaOfStudy"
                maxLength={160}
              />
              <TextareaField
                label="Professional Qualifications"
                name="professionalQualifications"
                maxLength={1000}
              />
            </FormSection>

            <FormSection legend="C. Skills and experience">
              <TextareaField
                label="Core Skills"
                name="keySkills"
                required
                minLength={20}
                maxLength={1500}
                helperText="List your most relevant professional or technical skills."
                error={errors.keySkills}
              />
              <TextareaField
                label="Professional Summary"
                name="experienceSummary"
                required
                minLength={40}
                maxLength={2500}
                helperText="Briefly describe your experience, strengths, and the type of opportunity you are seeking."
                error={errors.experienceSummary}
              />
              <TextField
                label="Industry Experience"
                name="industryExperience"
                required
                maxLength={200}
                helperText="For example: technology, banking, healthcare, education, retail, or professional services."
                error={errors.industryExperience}
              />
              <TextareaField
                label="Recent Responsibilities or Achievements"
                name="recentAchievements"
                maxLength={2000}
              />
            </FormSection>

            <FormSection legend="D. Career preferences">
              <FullWidth>
                <ChoiceGroup
                  label="Employment Preference"
                  name="preferredEmploymentType"
                  type="checkbox"
                  required
                  options={employmentTypes}
                  error={errors.preferredEmploymentType}
                />
              </FullWidth>
              <FullWidth>
                <ChoiceGroup
                  label="Workplace Preference"
                  name="workplacePreference"
                  type="checkbox"
                  required
                  options={workplaceOptions}
                  error={errors.workplacePreference}
                />
              </FullWidth>
              <FullWidth>
                <TextareaField
                  label="Preferred Roles or Job Titles"
                  name="preferredRoles"
                  required
                  minLength={10}
                  maxLength={1000}
                  error={errors.preferredRoles}
                />
              </FullWidth>
              <TextField
                label="Salary Expectation"
                name="salaryExpectation"
                maxLength={120}
                helperText="Optional. Include currency and whether the amount is monthly or annual where possible."
              />
              <SelectField
                label="Availability"
                name="availability"
                required
                options={availability}
                error={errors.availability}
              />
              <FullWidth>
                <TextareaField
                  label="Industry or Career Interest"
                  name="careerInterests"
                  maxLength={1500}
                />
              </FullWidth>
            </FormSection>

            <FormSection legend="E. Curriculum vitae">
              <FullWidth>
                <div className="rounded-[var(--radius)] border-l-4 border-gold bg-soft-grey p-5 font-semibold leading-7 text-navy">
                  CV upload is not available on this form. You may provide an
                  optional career-history summary below without including
                  sensitive personal data.
                </div>
              </FullWidth>
              <FullWidth>
                <TextareaField
                  label="Curriculum Vitae Summary or Selected Career History"
                  name="cvSummary"
                  maxLength={3000}
                  helperText="Optional. Summarise relevant roles, responsibilities, qualifications, and achievements."
                />
              </FullWidth>
            </FormSection>

            <FormSection legend="F. Consent and declarations">
              <FullWidth>
                <div className="rounded-[var(--radius)] border border-border-grey bg-soft-grey p-5 leading-7 text-slate">
                  <p>
                    Your information will be processed for recruitment-related
                    administration and communication in accordance with Talvanta
                    Africa&apos;s published privacy information.
                  </p>
                  <Link
                    href="/privacy"
                    className="mt-3 inline-flex min-h-11 items-center font-bold text-green underline underline-offset-4"
                  >
                    Read Our Privacy Information
                  </Link>
                </div>
              </FullWidth>
              <FullWidth>
                <div className="space-y-4">
                  <Declaration
                    name="accuracyConsent"
                    required
                    error={errors.accuracyConsent}
                  >
                    I confirm that the professional information provided is accurate to the best of my knowledge.
                  </Declaration>
                  <Declaration
                    name="outcomesConsent"
                    required
                    error={errors.outcomesConsent}
                  >
                    I understand that registration does not guarantee contact, an interview, placement, or employment.
                  </Declaration>
                  <Declaration
                    name="matchingConsent"
                    required
                    error={errors.matchingConsent}
                  >
                    I consent to Talvanta Africa using this information for candidate-profile review, potential opportunity matching, and recruitment follow-up.
                  </Declaration>
                  <Declaration
                    name="humanDecisionsConsent"
                    required
                    error={errors.humanDecisionsConsent}
                  >
                    I understand that employers and recruitment professionals remain responsible for shortlisting, interviews, and final employment decisions.
                  </Declaration>
                  <Declaration name="marketingConsent">
                    I would like to receive occasional information about relevant Talvanta Africa opportunities and services.
                  </Declaration>
                </div>
              </FullWidth>
            </FormSection>

            <div className="space-y-4 pb-8">
              <Button
                type="submit"
                disabled={state === "loading"}
                className="w-full sm:w-auto"
              >
                {state === "loading"
                  ? "Submitting Profile..."
                  : "Submit Candidate Profile"}
              </Button>
              {state === "loading" ? (
                <p role="status" aria-live="polite" className="font-semibold text-navy">
                  Submitting your professional profile securely...
                </p>
              ) : null}
              {state === "failure" ? (
                <CandidateSubmissionError message={feedback?.message} />
              ) : null}
            </div>
          </form>
        </div>
      </PageContainer>
    </section>
  );
}

function CandidateSubmissionError({ message }: { message?: string }) {
  return (
    <div
      role="alert"
      className="rounded-[var(--radius)] border-2 border-error-red bg-white p-5 sm:p-6"
    >
      <h2 className="font-heading text-xl font-extrabold text-navy">
        We could not submit your profile
      </h2>
      <p className="mt-2 leading-7 text-slate">
        {message ??
          "Please review the form, confirm your internet connection, and try again."}
      </p>
      <p className="mt-3 leading-7 text-slate">
        Your information remains in the form so you can review it and try again.
      </p>
      <Link
        href="/contact"
        className="mt-4 inline-flex min-h-11 items-center font-bold text-green underline underline-offset-4"
      >
        Contact Talvanta Africa
      </Link>
    </div>
  );
}

function CandidateSubmissionSuccess({ reference }: { reference?: string }) {
  const nextSteps = [
    {
      heading: "Profile Review",
      text: "Your submission may be reviewed for completeness and relevance to future recruitment needs.",
    },
    {
      heading: "Opportunity Matching",
      text: "Your information may be considered when a suitable and verified opportunity becomes available.",
    },
    {
      heading: "Direct Communication",
      text: "Talvanta Africa may contact you using the details you provided if further information or participation is required.",
    },
  ] as const;

  return (
    <section
      id="candidate-registration-form"
      className="bg-soft-grey"
      aria-labelledby="candidate-success-heading"
    >
      <PageContainer className="py-16 sm:py-24">
        <div
          role="status"
          aria-live="polite"
          className="mx-auto max-w-5xl rounded-[calc(var(--radius)+0.5rem)] border-2 border-green bg-white p-6 shadow-[var(--shadow-subtle)] sm:p-10"
        >
          <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-green">
            Profile Submitted
          </p>
          <h2
            id="candidate-success-heading"
            className="mt-3 text-3xl font-extrabold leading-tight text-navy sm:text-4xl"
          >
            Your candidate profile has been received
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate">
            Thank you for registering with Talvanta Africa. Your information will be reviewed and maintained for recruitment-related administration and possible consideration when relevant opportunities become available.
          </p>

          {reference ? (
            <div className="mt-8 rounded-[var(--radius)] bg-soft-grey p-5 sm:p-6">
              <p className="font-heading text-sm font-extrabold uppercase tracking-wide text-green">
                Submission Reference
              </p>
              <p className="mt-2 break-all font-heading text-xl font-extrabold text-navy sm:text-2xl">
                {reference}
              </p>
              <p className="mt-3 leading-7 text-slate">
                Keep this reference for your records if you need to contact Talvanta Africa about your submission.
              </p>
            </div>
          ) : null}

          <section className="mt-10" aria-labelledby="candidate-next-steps-heading">
            <h3
              id="candidate-next-steps-heading"
              className="text-2xl font-extrabold text-navy"
            >
              What Happens Next?
            </h3>
            <ol className="mt-6 grid gap-5 md:grid-cols-3">
              {nextSteps.map((step, index) => (
                <li
                  key={step.heading}
                  className="rounded-[var(--radius)] border border-border-grey bg-white p-5"
                >
                  <span className="grid size-9 place-items-center rounded-full bg-green font-heading text-sm font-extrabold text-white">
                    <span className="sr-only">Step </span>
                    {index + 1}
                  </span>
                  <h4 className="mt-4 text-lg font-extrabold text-navy">
                    {step.heading}
                  </h4>
                  <p className="mt-2 leading-7 text-slate">{step.text}</p>
                </li>
              ))}
            </ol>
          </section>

          <p className="mt-8 border-l-4 border-gold pl-4 font-semibold leading-7 text-navy">
            Registration does not guarantee consideration, shortlisting, an interview, placement, or employment.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink href="/jobs">Explore Career Opportunities</ButtonLink>
            <ButtonLink href="/" variant="outline">Return Home</ButtonLink>
            <ButtonLink href="/job-seekers" variant="outline">Candidate Support</ButtonLink>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}

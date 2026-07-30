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

const employmentTypes = [
  "Permanent",
  "Temporary",
  "Contract",
  "Internship",
  "Graduate role",
  "Part-time",
  "Other",
];

const arrangements = ["On-site", "Hybrid", "Remote", "To be discussed"];

const timelines = [
  "As soon as possible",
  "Within 2 weeks",
  "Within 1 month",
  "Within 2–3 months",
  "More than 3 months",
  "Still planning",
];

const services = [
  "Permanent Recruitment",
  "Temporary and Contract Staffing",
  "Executive Search",
  "Graduate Recruitment",
  "Candidate Screening",
  "HR Advisory",
  "Not sure",
];

function createPayload(data: FormData): Record<string, unknown> {
  const stringFields = [
    "organisationName",
    "contactPerson",
    "workEmail",
    "telephone",
    "website",
    "organisationLocation",
    "jobTitle",
    "department",
    "employmentType",
    "workplaceArrangement",
    "jobLocation",
    "preferredStartDate",
    "recruitmentTimeline",
    "responsibilities",
    "requiredSkills",
    "requiredExperience",
    "educationRequirements",
    "salaryRange",
    "additionalInformation",
    "preferredService",
    "recruitedBefore",
    "websiteConfirmation",
  ];
  const payload: Record<string, unknown> = {};
  for (const field of stringFields) payload[field] = valueOf(data, field);
  payload.positions = Number(valueOf(data, "positions"));
  for (const field of [
    "accuracyConsent",
    "outcomesConsent",
    "reviewConsent",
    "marketingConsent",
  ]) {
    payload[field] = data.has(field);
  }
  return payload;
}

function validate(data: FormData) {
  const errors: FormErrors = {};
  addRequiredText(errors, data, "organisationName", "Organisation name", 2);
  addRequiredText(errors, data, "contactPerson", "Contact person", 2);
  addEmail(errors, data, "workEmail");
  addTelephone(errors, data, "telephone");
  addOptionalUrl(errors, data, "website");
  addRequiredText(
    errors,
    data,
    "organisationLocation",
    "Organisation location",
  );
  addRequiredText(errors, data, "jobTitle", "Job title", 2);
  addRequiredChoice(
    errors,
    data,
    "employmentType",
    "Select an employment type.",
  );
  addNumberRange(errors, data, "positions", "Number of positions", 1, 500);
  addRequiredChoice(
    errors,
    data,
    "workplaceArrangement",
    "Select a workplace arrangement.",
  );
  addRequiredText(errors, data, "jobLocation", "Job location");
  const date = valueOf(data, "preferredStartDate");
  if (date && date < new Date().toISOString().slice(0, 10)) {
    errors.preferredStartDate = "Preferred start date cannot be in the past.";
  }
  addRequiredChoice(
    errors,
    data,
    "recruitmentTimeline",
    "Select a recruitment timeline.",
  );
  addRequiredText(
    errors,
    data,
    "responsibilities",
    "Main responsibilities",
    30,
  );
  addRequiredText(errors, data, "requiredSkills", "Required skills", 20);
  addRequiredText(
    errors,
    data,
    "requiredExperience",
    "Required experience",
    20,
  );
  addRequiredChoice(
    errors,
    data,
    "preferredService",
    "Select a preferred service.",
  );
  addRequiredChoice(
    errors,
    data,
    "recruitedBefore",
    "Select whether you have recruited for this role before.",
  );
  addRequiredCheck(
    errors,
    data,
    "accuracyConsent",
    "Confirm that the information is accurate.",
  );
  addRequiredCheck(
    errors,
    data,
    "outcomesConsent",
    "Confirm that you understand the recruitment outcome statement.",
  );
  addRequiredCheck(
    errors,
    data,
    "reviewConsent",
    "Consent to recruitment-enquiry review and follow-up.",
  );
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
      const result = await submitFormJson(
        "/api/hire-talent",
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
            "Your recruitment request could not be submitted at this time. Please try again later or use the Contact page for assistance.",
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
          "Your recruitment request could not be submitted at this time. Please try again later or use the Contact page for assistance.",
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
    return <EmployerSubmissionSuccess reference={feedback?.reference} />;
  }

  return (
    <section
      id="employer-recruitment-form"
      className="bg-white"
      aria-labelledby="hiring-form-heading"
    >
      <PageContainer className="py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-3xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-green">
              Employer request
            </p>
            <h2
              id="hiring-form-heading"
              className="mt-3 text-3xl font-extrabold text-navy sm:text-4xl"
            >
              Request Recruitment Support
            </h2>
            <p className="mt-4 leading-8 text-slate">
              Complete the form below with clear and accurate information about
              your organisation and hiring requirement.
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

            <FormSection legend="1. Organisation Information">
              <TextField
                label="Organisation Name"
                name="organisationName"
                required
                minLength={2}
                maxLength={120}
                autoComplete="organization"
                error={errors.organisationName}
              />
              <TextField
                label="Organisation Website"
                name="website"
                type="url"
                maxLength={300}
                helperText="Optional. Include the full address, such as https://example.com."
                error={errors.website}
              />
              <TextField
                label="Organisation Location"
                name="organisationLocation"
                required
                maxLength={120}
                autoComplete="address-level2"
                error={errors.organisationLocation}
              />
            </FormSection>

            <FormSection legend="2. Authorised Contact">
              <TextField
                label="Contact Person"
                name="contactPerson"
                required
                minLength={2}
                maxLength={100}
                autoComplete="name"
                error={errors.contactPerson}
              />
              <TextField
                label="Business Email Address"
                name="workEmail"
                type="email"
                required
                autoComplete="email"
                error={errors.workEmail}
              />
              <TextField
                label="Telephone Number"
                name="telephone"
                type="tel"
                required
                minLength={7}
                maxLength={25}
                autoComplete="tel"
                error={errors.telephone}
              />
            </FormSection>

            <FormSection legend="3. Vacancy Details">
              <TextField
                label="Vacancy Title"
                name="jobTitle"
                required
                minLength={2}
                maxLength={120}
                error={errors.jobTitle}
              />
              <TextField
                label="Department or Function"
                name="department"
                maxLength={120}
                helperText="Optional."
              />
              <SelectField
                label="Employment Type"
                name="employmentType"
                required
                options={employmentTypes}
                error={errors.employmentType}
              />
              <TextField
                label="Number of Positions"
                name="positions"
                type="number"
                required
                min={1}
                max={500}
                step={1}
                inputMode="numeric"
                error={errors.positions}
              />
              <FullWidth>
                <ChoiceGroup
                  label="Workplace Type"
                  name="workplaceArrangement"
                  type="radio"
                  required
                  options={arrangements}
                  error={errors.workplaceArrangement}
                />
              </FullWidth>
              <TextField
                label="Hiring Location"
                name="jobLocation"
                required
                maxLength={120}
                error={errors.jobLocation}
              />
              <TextField
                label="Preferred Start Date"
                name="preferredStartDate"
                type="date"
                error={errors.preferredStartDate}
              />
              <SelectField
                label="Proposed Recruitment Timeline"
                name="recruitmentTimeline"
                required
                options={timelines}
                error={errors.recruitmentTimeline}
              />
            </FormSection>

            <FormSection legend="4. Candidate Requirements">
              <FullWidth>
                <TextareaField
                  label="Key Responsibilities"
                  name="responsibilities"
                  required
                  minLength={30}
                  maxLength={2000}
                  helperText="List the main duties the successful candidate would be expected to perform."
                  error={errors.responsibilities}
                />
              </FullWidth>
              <TextareaField
                label="Required Skills"
                name="requiredSkills"
                required
                minLength={20}
                maxLength={1500}
                helperText="Include the essential technical, professional, or interpersonal skills needed for the role."
                error={errors.requiredSkills}
              />
              <TextareaField
                label="Relevant Experience"
                name="requiredExperience"
                required
                minLength={20}
                maxLength={1500}
                error={errors.requiredExperience}
              />
              <TextareaField
                label="Minimum Qualification or Professional Requirements"
                name="educationRequirements"
                maxLength={1200}
              />
            </FormSection>

            <FormSection legend="5. Recruitment Preferences">
              <TextField
                label="Proposed Salary Range"
                name="salaryRange"
                maxLength={120}
                helperText="Optional. Include currency and whether the amount is monthly or annual where possible."
              />
              <SelectField
                label="Recruitment Support Required"
                name="preferredService"
                required
                options={services}
                error={errors.preferredService}
              />
              <ChoiceGroup
                label="Have you recruited for this role before?"
                name="recruitedBefore"
                type="radio"
                required
                options={["Yes", "No", "Not sure"]}
                error={errors.recruitedBefore}
              />
              <FullWidth>
                <TextareaField
                  label="Additional Information"
                  name="additionalInformation"
                  maxLength={2000}
                  helperText="Provide any relevant context that has not been covered elsewhere. Do not include confidential or unnecessary personal information."
                />
              </FullWidth>
            </FormSection>

            <FormSection legend="6. Consent and Confirmation">
              <FullWidth>
                <div className="rounded-[var(--radius)] border border-border-grey bg-soft-grey p-5 leading-7 text-slate">
                  <p className="font-semibold text-navy">
                    By submitting this request, you confirm that you are authorised to provide recruitment information on behalf of the organisation and that the information supplied is accurate to the best of your knowledge.
                  </p>
                  <p className="mt-3">
                    Information submitted through this form will be processed for recruitment-related administration and communication in accordance with Talvanta Africa&apos;s published privacy information.
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
                    I confirm that the information provided is accurate to the best of my knowledge.
                  </Declaration>
                  <Declaration
                    name="outcomesConsent"
                    required
                    error={errors.outcomesConsent}
                  >
                    I understand that submitting this enquiry does not create a service agreement or guarantee candidate availability or recruitment success.
                  </Declaration>
                  <Declaration
                    name="reviewConsent"
                    required
                    error={errors.reviewConsent}
                  >
                    I consent to Talvanta Africa using the submitted information for recruitment-enquiry review and follow-up.
                  </Declaration>
                  <Declaration name="marketingConsent">
                    I would like to receive occasional information about Talvanta Africa services.
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
                  ? "Submitting Request..."
                  : "Submit Recruitment Request"}
              </Button>
              {state === "loading" ? (
                <p
                  role="status"
                  aria-live="polite"
                  className="font-semibold text-navy"
                >
                  Submitting your recruitment request securely...
                </p>
              ) : null}
              {state === "failure" ? (
                <EmployerSubmissionError message={feedback?.message} />
              ) : null}
            </div>
          </form>
        </div>
      </PageContainer>
    </section>
  );
}

function EmployerSubmissionError({ message }: { message?: string }) {
  return (
    <div
      role="alert"
      className="rounded-[var(--radius)] border-2 border-error-red bg-white p-5 sm:p-6"
    >
      <h2 className="font-heading text-xl font-extrabold text-navy">
        We could not submit your request
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

function EmployerSubmissionSuccess({ reference }: { reference?: string }) {
  const nextSteps = [
    {
      heading: "Initial Review",
      text: "The request may be reviewed for completeness, clarity, and relevance to the services available.",
    },
    {
      heading: "Clarification",
      text: "The authorised contact may be asked to provide additional role or organisation information.",
    },
    {
      heading: "Recruitment Discussion",
      text: "If appropriate, Talvanta Africa may discuss a suitable next step or recruitment pathway.",
    },
    {
      heading: "Employer Decision",
      text: "The employer remains responsible for assessment, interviews, selection, employment terms, and the final hiring decision.",
    },
  ] as const;

  return (
    <section
      id="employer-recruitment-form"
      className="bg-white"
      aria-labelledby="employer-success-heading"
    >
      <PageContainer className="py-16 sm:py-24">
        <div
          role="status"
          aria-live="polite"
          className="mx-auto max-w-5xl rounded-[calc(var(--radius)+0.5rem)] border-2 border-green bg-white p-6 shadow-[var(--shadow-subtle)] sm:p-10"
        >
          <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-green">
            Request Submitted
          </p>
          <h2
            id="employer-success-heading"
            className="mt-3 text-3xl font-extrabold leading-tight text-navy sm:text-4xl"
          >
            Your recruitment request has been received
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate">
            Thank you for contacting Talvanta Africa. Your organisation&apos;s request will be reviewed during business hours, and the authorised contact may be approached if clarification or further information is required.
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
                Keep this reference for your records if you need to contact Talvanta Africa about the request.
              </p>
            </div>
          ) : null}

          <section className="mt-10" aria-labelledby="employer-next-steps-heading">
            <h3
              id="employer-next-steps-heading"
              className="text-2xl font-extrabold text-navy"
            >
              What Happens Next?
            </h3>
            <ol className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
            Submission does not guarantee candidate availability, shortlisting, placement, recruitment fulfilment, or a particular hiring outcome.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink href="/for-employers">Return to Employer Services</ButtonLink>
            <ButtonLink href="/" variant="outline">Explore Talvanta Africa</ButtonLink>
            <ButtonLink href="/contact" variant="outline">Contact Support</ButtonLink>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}

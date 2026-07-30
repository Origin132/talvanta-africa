"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import {
  Declaration,
  FormSection,
  FullWidth,
  SelectField,
  TextareaField,
  TextField,
} from "@/components/forms/form-controls";
import { FormErrorSummary } from "@/components/forms/form-error-summary";
import { FormStatus } from "@/components/forms/form-status";
import { HoneypotField } from "@/components/forms/honeypot-field";
import { submitFormJson } from "@/lib/client/submit-form";
import {
  addEmail,
  addOptionalTelephone,
  addRequiredCheck,
  addRequiredChoice,
  addRequiredText,
  valueOf,
} from "@/lib/form-validation";
import type {
  FormErrors,
  SubmissionFeedback,
  SubmissionState,
} from "@/types/forms";

const enquiryTypes = [
  "General enquiry",
  "Employer support",
  "Candidate support",
  "Recruitment services",
  "Partnership",
  "Privacy request",
  "Other",
] as const;

function validate(data: FormData) {
  const errors: FormErrors = {};
  addRequiredText(errors, data, "fullName", "Full name", 2);
  addEmail(errors, data, "email");
  addOptionalTelephone(errors, data, "telephone");
  addRequiredChoice(errors, data, "enquiryType", "Select an enquiry type.");
  addRequiredText(errors, data, "subject", "Subject", 3);
  addRequiredText(errors, data, "message", "Message", 20);
  addRequiredCheck(
    errors,
    data,
    "consent",
    "Consent to enquiry processing and follow-up.",
  );
  return errors;
}

function payload(data: FormData): Record<string, unknown> {
  return {
    fullName: valueOf(data, "fullName"),
    organisation: valueOf(data, "organisation"),
    email: valueOf(data, "email"),
    telephone: valueOf(data, "telephone"),
    enquiryType: valueOf(data, "enquiryType"),
    subject: valueOf(data, "subject"),
    message: valueOf(data, "message"),
    consent: data.has("consent"),
    websiteConfirmation: valueOf(data, "websiteConfirmation"),
  };
}

export function ContactForm() {
  const [errors, setErrors] = useState<FormErrors>({});
  const [state, setState] = useState<SubmissionState>("idle");
  const [feedback, setFeedback] = useState<SubmissionFeedback>();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "loading") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const clientErrors = validate(data);
    setErrors(clientErrors);
    setFeedback(undefined);
    if (Object.keys(clientErrors).length) {
      setState("idle");
      return;
    }

    setState("loading");
    try {
      const result = await submitFormJson("/api/contact", payload(data));
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
          message: "We could not submit your enquiry. Please review the form and try again.",
        });
        setState("failure");
        return;
      }
      if ([502, 503, 504].includes(result.status)) {
        setFeedback({
          message: "We could not submit your enquiry. Please review the form and try again.",
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
        form.reset();
        return;
      }
      throw new Error("Unexpected response");
    } catch {
      setFeedback({
        message: "We could not submit your enquiry. Please review the form and try again.",
      });
      setState("failure");
    }
  }

  return (
    <section id="contact-form" className="bg-soft-grey" aria-labelledby="contact-form-heading">
      <PageContainer className="py-16 sm:py-24">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-green">
            Contact form
          </p>
          <h2 id="contact-form-heading" className="mt-3 text-3xl font-extrabold text-navy sm:text-4xl">
            Send a General Enquiry
          </h2>
          <p className="mt-4 max-w-2xl leading-8 text-slate">
            Provide clear and accurate information so your enquiry can be reviewed and directed appropriately.
          </p>

          <div className="mt-10 grid gap-8 lg:grid-cols-[2fr_1fr] lg:items-start">
            <form className="space-y-8" noValidate onSubmit={submit} aria-busy={state === "loading"}>
              <FormErrorSummary errors={errors} />
              <HoneypotField />
              <FormSection legend="Your enquiry">
                <TextField label="Full Name" name="fullName" required minLength={2} maxLength={120} autoComplete="name" error={errors.fullName} />
                <TextField label="Organisation" name="organisation" maxLength={120} autoComplete="organization" helperText="Optional." error={errors.organisation} />
                <TextField label="Email Address" name="email" type="email" required maxLength={254} autoComplete="email" error={errors.email} />
                <TextField label="Telephone" name="telephone" type="tel" minLength={7} maxLength={25} autoComplete="tel" helperText="Optional." error={errors.telephone} />
                <SelectField label="Enquiry type" name="enquiryType" required options={enquiryTypes} error={errors.enquiryType} />
                <TextField label="Subject" name="subject" required minLength={3} maxLength={160} error={errors.subject} />
                <FullWidth>
                  <TextareaField
                    label="How can we help?"
                    name="message"
                    required
                    minLength={20}
                    maxLength={3000}
                    rows={7}
                    helperText="Do not include passwords, financial information, identity-document numbers, or other unnecessary sensitive information."
                    error={errors.message}
                  />
                </FullWidth>
                <FullWidth>
                  <Declaration name="consent" required error={errors.consent}>
                    I consent to Talvanta Africa using this information to review my enquiry and contact me about it.
                  </Declaration>
                </FullWidth>
              </FormSection>

              <div className="space-y-5 pb-8">
                <Button type="submit" disabled={state === "loading"} className="w-full sm:w-auto">
                  {state === "loading" ? "Submitting..." : "Send Enquiry"}
                </Button>
                <FormStatus
                  state={state}
                  feedback={feedback}
                  successHeading="Your enquiry has been received"
                  successMessage="Thank you for contacting Talvanta Africa. Your enquiry will be reviewed during business hours. Please keep any submission reference displayed below for your records."
                  actions={[{ label: "Return home", href: "/" }, { label: "View FAQs", href: "/faqs" }]}
                />
              </div>
            </form>

            <aside className="rounded-[var(--radius)] border border-border-grey bg-white p-6 shadow-sm sm:p-7" aria-labelledby="before-contact-heading">
              <h2 id="before-contact-heading" className="text-2xl font-extrabold text-navy">
                Before You Contact Us
              </h2>
              <div className="mt-6 space-y-6">
                <GuidanceItem heading="Use the Correct Pathway">
                  Employers and professionals receive clearer support when they use the relevant registration pathway.
                </GuidanceItem>
                <GuidanceItem heading="Provide Clear Information">
                  Include enough detail for the enquiry to be understood without including unnecessary sensitive information.
                </GuidanceItem>
                <GuidanceItem heading="Recruitment Decisions">
                  Submitting an enquiry does not guarantee candidate consideration, shortlisting, placement, or employment.
                </GuidanceItem>
                <GuidanceItem heading="Privacy">
                  Personal information is handled according to the platform&apos;s published privacy information and consent process.
                </GuidanceItem>
              </div>
              <Link href="/privacy" className="mt-7 inline-flex min-h-11 items-center font-bold text-green underline underline-offset-4">
                Read Our Privacy Information
              </Link>
            </aside>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}

function GuidanceItem({ heading, children }: { heading: string; children: string }) {
  return (
    <section>
      <h3 className="font-heading text-lg font-extrabold text-navy">{heading}</h3>
      <p className="mt-2 leading-7 text-slate">{children}</p>
    </section>
  );
}

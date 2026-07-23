"use client";

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
          message:
            "The enquiry could not be read. Review the form and try again.",
        });
        setState("failure");
        return;
      }
      if ([502, 503, 504].includes(result.status)) {
        setFeedback({
          message:
            "Your enquiry could not be forwarded for review. Your form entries are still available, so you can try again.",
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
        message:
          "Your enquiry could not be submitted. Your form entries are still available, so you can try again.",
      });
      setState("failure");
    }
  }

  return (
    <section id="contact-form" className="bg-soft-grey" aria-labelledby="contact-form-heading">
      <PageContainer className="py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-green">
            Contact form
          </p>
          <h2 id="contact-form-heading" className="mt-3 text-3xl font-extrabold text-navy sm:text-4xl">
            Send an enquiry
          </h2>
          <p className="mt-4 max-w-2xl leading-8 text-slate">
            Fields marked with an asterisk are required. Do not include passwords,
            banking details, government identification numbers, medical
            information, or other sensitive personal information.
          </p>

          <form className="mt-10 space-y-8" noValidate onSubmit={submit} aria-busy={state === "loading"}>
            <FormErrorSummary errors={errors} />
            <HoneypotField />
            <FormSection legend="Your enquiry">
              <TextField label="Full name" name="fullName" required minLength={2} maxLength={120} autoComplete="name" error={errors.fullName} />
              <TextField label="Organisation" name="organisation" maxLength={120} autoComplete="organization" helperText="Optional." error={errors.organisation} />
              <TextField label="Email" name="email" type="email" required maxLength={254} autoComplete="email" error={errors.email} />
              <TextField label="Telephone" name="telephone" type="tel" minLength={7} maxLength={25} autoComplete="tel" helperText="Optional." error={errors.telephone} />
              <SelectField label="Enquiry type" name="enquiryType" required options={enquiryTypes} error={errors.enquiryType} />
              <TextField label="Subject" name="subject" required minLength={3} maxLength={160} error={errors.subject} />
              <FullWidth>
                <TextareaField label="Message" name="message" required minLength={20} maxLength={3000} rows={7} error={errors.message} />
              </FullWidth>
              <FullWidth>
                <Declaration name="consent" required error={errors.consent}>
                  I consent to Talvanta Africa using this information to review my enquiry and contact me about it.
                </Declaration>
              </FullWidth>
            </FormSection>

            <div className="space-y-5 pb-16">
              <Button type="submit" disabled={state === "loading"} className="w-full sm:w-auto">
                {state === "loading" ? "Submitting..." : "Submit Enquiry"}
              </Button>
              <FormStatus
                state={state}
                feedback={feedback}
                successHeading="Enquiry submitted"
                successMessage="Your enquiry was validated and forwarded for review. Keep the submission reference for future communication."
                actions={[{ label: "Return home", href: "/" }, { label: "View FAQs", href: "/faqs" }]}
              />
            </div>
          </form>
        </div>
      </PageContainer>
    </section>
  );
}

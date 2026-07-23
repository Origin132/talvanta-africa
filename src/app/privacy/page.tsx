import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { PageHero } from "@/components/ui/page-hero";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How the Talvanta Africa demonstration website handles information submitted through its public forms and Talia.",
};

const sections = [
  ["Information collected", "The employer, candidate, and contact forms collect the fields shown on each form, together with consent choices and a submission reference. Talia processes only the messages entered during the current page session. Avoid submitting unnecessary sensitive information."],
  ["How information is used", "Submitted information is used to review the stated recruitment or contact purpose, support relevant human follow-up, operate the configured workflow, and protect forms from misuse. Information should not be reused for an unrelated purpose without an appropriate basis."],
  ["Make.com, Google Sheets, and recruiter emails", "When webhook configuration is active, validated form submissions are forwarded from the website server to a dedicated Make.com workflow. The workflow may add a row to an approved Google Sheet and notify a recruiter by email. These external resources must be configured and protected separately. Talia chat messages are not included."],
  ["Cookies and local preferences", "Essential website functionality does not depend on advertising or analytics cookies. The cookie-preference banner stores the selected preference locally in the browser so the banner does not need to appear on every visit. Rejecting non-essential storage does not block core website features."],
  ["Retention and security limitations", "Retention periods, access controls, deletion procedures, and external-service settings depend on the configured operational environment and must be reviewed before production use. No website can guarantee absolute security."],
  ["Your choices and requests", "You may use the contact form to ask about information you submitted, request a correction, or raise a privacy concern. Any request may require proportionate identity verification before information is disclosed or changed. Applicable rights depend on the relevant circumstances and law."],
] as const;

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Information notice"
        title="Privacy policy"
        supportingText="A plain-language explanation of information handling on the Talvanta Africa demonstration website."
        variation="dark"
      />
      <PageContainer className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-[var(--radius)] border border-gold bg-soft-grey p-5 text-sm leading-6 text-slate">
            This operational notice is not a claim of certification or legal compliance and should receive qualified review before production use. Approved policy source documents remain pending import.
          </div>
          <div className="mt-10 space-y-10">
            {sections.map(([heading, content]) => (
              <section key={heading}>
                <h2 className="text-2xl font-extrabold text-navy">{heading}</h2>
                <p className="mt-3 leading-8 text-slate">{content}</p>
              </section>
            ))}
            <section>
              <h2 className="text-2xl font-extrabold text-navy">Contact</h2>
              <p className="mt-3 leading-8 text-slate">
                Use the <Link href="/contact" className="font-bold text-green underline underline-offset-4">contact form</Link> and select “Privacy request”. Do not include identification documents or other sensitive information in the initial message.
              </p>
            </section>
          </div>
        </div>
      </PageContainer>
    </>
  );
}

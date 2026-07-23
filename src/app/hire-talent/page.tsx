import type { Metadata } from "next";
import { HiringRequestForm } from "@/components/employers/hiring-request-form";
import { FormNotice } from "@/components/forms/form-notice";
import { FutureProcess } from "@/components/forms/future-process";
import { PageContainer } from "@/components/layout/page-container";
import { CTASection } from "@/components/ui/cta-section";
import { PageHero } from "@/components/ui/page-hero";

export const metadata: Metadata = {
  title: { absolute: "Hire Talent | Talvanta Africa" },
  description: "Submit a structured recruitment enquiry to Talvanta Africa and provide the information needed to begin a conversation about your organisation’s hiring requirements.",
};

const steps = [
  { title: "Enquiry review", text: "The submitted requirement will be checked for completeness and clarity." },
  { title: "Follow-up", text: "A recruitment professional may contact the organisation to clarify the role and discuss the required service." },
  { title: "Scope confirmation", text: "Recruitment scope, responsibilities, terms, and any commercial arrangements will need to be agreed separately." },
  { title: "Human-led recruitment", text: "Search, screening, shortlisting, communication, interviews, and final decisions will remain human-led." },
];

export default function HireTalentPage() {
  return <>
    <PageHero eyebrow="Hire Talent" title="Tell us about your hiring requirement" supportingText="Provide the information currently available about your vacancy or staffing need. Talvanta Africa will use the details in a later sprint to support structured recruitment follow-up." variation="dark" />
    <div className="border-b border-border-grey bg-white"><PageContainer className="py-5"><p className="border-l-2 border-gold pl-4 text-sm font-semibold text-navy">Submitting this form does not create a service agreement or guarantee candidate availability.</p></PageContainer></div>
    <FormNotice processingText="This form sends information to the Talvanta Africa website server for validation and then forwards valid enquiries to the recruitment workflow." caution="Do not enter confidential business information, passwords, financial details, or unnecessary personal data." />
    <HiringRequestForm />
    <FutureProcess heading="What will happen when live processing is introduced?" note="These steps describe a planned future workflow. They are not active processing during this sprint." steps={steps} disclaimer="Talvanta Africa does not guarantee candidate availability, successful placement, recruitment timelines, or employment outcomes. Employers remain responsible for their recruitment criteria, interviews, selection decisions, employment checks, and final hiring decisions." />
    <CTASection heading="Not ready to complete the full enquiry?" supportingText="Review the employer guidance or use the contact page for a general enquiry." primaryAction={{ label: "Employer Guidance", href: "/employers" }} secondaryAction={{ label: "Contact Us", href: "/contact" }} />
  </>;
}

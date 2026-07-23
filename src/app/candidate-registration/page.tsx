import type { Metadata } from "next";
import { FormNotice } from "@/components/forms/form-notice";
import { FutureProcess } from "@/components/forms/future-process";
import { CandidateRegistrationForm } from "@/components/job-seekers/candidate-registration-form";
import { PageContainer } from "@/components/layout/page-container";
import { CTASection } from "@/components/ui/cta-section";
import { PageHero } from "@/components/ui/page-hero";

export const metadata: Metadata = {
  title: { absolute: "Candidate Registration | Talvanta Africa" },
  description: "Register your professional information with Talvanta Africa in preparation for future opportunity matching and recruitment support.",
};

const steps = [
  { title: "Profile organisation", text: "Candidate information may be structured into a clearer professional profile." },
  { title: "Opportunity review", text: "The profile may be considered in relation to relevant available vacancies." },
  { title: "Candidate confirmation", text: "Candidates may need to confirm interest before being associated with a specific opportunity." },
  { title: "Human-led decisions", text: "Application review, shortlisting, interviews, selection, and employment decisions will remain human-led." },
];

export default function CandidateRegistrationPage() {
  return <>
    <PageHero eyebrow="Candidate Registration" title="Organise your professional information" supportingText="Provide accurate career information to prepare a structured candidate profile for future recruitment workflows." variation="dark" />
    <div className="border-b border-border-grey bg-white"><PageContainer className="py-5"><p className="border-l-2 border-gold pl-4 text-sm font-semibold text-navy">Registration does not guarantee contact, shortlisting, interviews, placement, or employment.</p></PageContainer></div>
    <FormNotice processingText="This form sends information to the Talvanta Africa website server for validation and then forwards valid registrations to the recruitment workflow." caution="Do not enter passwords, bank details, national identification numbers, medical information, or other unnecessary sensitive personal data." />
    <CandidateRegistrationForm />
    <FutureProcess heading="What will registration mean when live processing is introduced?" note="These are planned future capabilities and are not active during this sprint." steps={steps} disclaimer="Talvanta Africa does not guarantee that a suitable vacancy will be available, that every candidate will be contacted, or that registration will result in an interview, placement, or employment." extraDisclaimer="Candidates should never provide unofficial recruitment payments merely to submit an application or register professional information." />
    <CTASection heading="Prefer to explore before registering?" supportingText="Review available opportunity guidance or return to the job-seeker information page." primaryAction={{ label: "Explore Jobs", href: "/jobs" }} secondaryAction={{ label: "Job Seeker Guidance", href: "/job-seekers" }} />
  </>;
}

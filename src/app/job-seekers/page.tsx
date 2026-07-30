import type { Metadata } from "next";
import { CandidateExpectations } from "@/components/job-seekers/candidate-expectations";
import { CandidateFaqs } from "@/components/job-seekers/candidate-faqs";
import { CandidateJourney } from "@/components/job-seekers/candidate-journey";
import { CandidatePreparation } from "@/components/job-seekers/candidate-preparation";
import { CandidateSupport } from "@/components/job-seekers/candidate-support";
import { ResponsibleMatching } from "@/components/job-seekers/responsible-matching";
import { PageContainer } from "@/components/layout/page-container";
import { CTASection } from "@/components/ui/cta-section";
import { PageHero } from "@/components/ui/page-hero";
import { createPageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Job Seeker Support | Talvanta Africa",
    description: "Learn how professionals can register their profiles, review verified career opportunities, and navigate Talvanta Africa’s human-led recruitment process.",
    path: "/job-seekers",
  }),
  keywords: [
    "job seeker support",
    "candidate registration",
    "verified career opportunities",
    "professional profile registration",
    "human-led recruitment",
  ],
};

export default function JobSeekersPage() {
  return (
    <>
      <PageHero
        eyebrow="For Job Seekers"
        title="Build a clear pathway towards future opportunities"
        supportingText="Talvanta Africa provides professionals with structured ways to register their information, review verified opportunities, and understand what to expect from a human-led recruitment process."
        primaryAction={{ label: "Register Your Profile", href: "/candidate-registration" }}
        secondaryAction={{ label: "View Career Opportunities", href: "/jobs" }}
        variation="dark"
      />
      <div className="border-b border-border-grey bg-white">
        <PageContainer className="py-5">
          <p className="border-l-2 border-gold pl-4 text-sm font-semibold leading-6 text-navy">
            Registering a profile does not guarantee consideration, shortlisting, an interview, placement, or employment.
          </p>
        </PageContainer>
      </div>
      <CandidateSupport />
      <CandidatePreparation />
      <CandidateJourney />
      <ResponsibleMatching />
      <CandidateExpectations />
      <CandidateFaqs />
      <CTASection
        heading="Take the next step in your professional journey"
        supportingText="Register your professional profile, review verified opportunities, or contact Talvanta Africa if you need general guidance."
        primaryAction={{ label: "Register Your Profile", href: "/candidate-registration" }}
        secondaryAction={{ label: "View Opportunities", href: "/jobs" }}
      />
    </>
  );
}

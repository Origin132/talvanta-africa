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

export const metadata: Metadata = createPageMetadata({
  title: "Career Support for Job Seekers",
  description: "Learn how Talvanta Africa supports professionals, graduates, and job seekers with career information and responsible recruitment guidance.",
  path: "/job-seekers",
});

export default function JobSeekersPage() {
  return <>
    <PageHero eyebrow="For Job Seekers" title="Explore opportunities with clear and responsible guidance" supportingText="Talvanta Africa supports professionals and early-career candidates in exploring relevant opportunities, organising career information, and understanding recruitment next steps." primaryAction={{ label: "Explore Jobs", href: "/jobs" }} secondaryAction={{ label: "Register Your Interest", href: "/candidate-registration" }} variation="dark" />
    <div className="border-b border-border-grey bg-white"><PageContainer className="py-5"><p className="border-l-2 border-gold pl-4 text-sm font-semibold text-navy">Talvanta Africa does not guarantee interviews, placement, or employment.</p></PageContainer></div>
    <CandidateSupport /><CandidateJourney /><CandidatePreparation /><ResponsibleMatching /><CandidateExpectations /><CandidateFaqs />
    <CTASection heading="Take the next step in your career journey" supportingText="Explore current opportunities or prepare to register your professional information for responsible consideration when relevant roles become available." primaryAction={{ label: "Explore Jobs", href: "/jobs" }} secondaryAction={{ label: "Register Your Interest", href: "/candidate-registration" }} />
  </>;
}

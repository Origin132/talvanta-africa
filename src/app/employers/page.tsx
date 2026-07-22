import type { Metadata } from "next";
import { EmployerChallenges } from "@/components/employers/employer-challenges";
import { EmployerFaqs } from "@/components/employers/employer-faqs";
import { EmployerJourney } from "@/components/employers/employer-journey";
import { EmployerPreparation } from "@/components/employers/employer-preparation";
import { EmployerServices } from "@/components/employers/employer-services";
import { EmployerTechnology } from "@/components/employers/employer-technology";
import { PageContainer } from "@/components/layout/page-container";
import { CTASection } from "@/components/ui/cta-section";
import { PageHero } from "@/components/ui/page-hero";

export const metadata: Metadata = {
  title: { absolute: "Recruitment Support for Employers | Talvanta Africa" },
  description: "Discover how Talvanta Africa supports growing organisations with permanent recruitment, contract staffing, executive search, graduate recruitment, candidate screening, and structured hiring support.",
};

export default function EmployersPage() {
  return <>
    <PageHero eyebrow="For Employers" title="Build stronger teams with structured recruitment support" supportingText="Talvanta Africa helps organisations clarify their hiring needs, organise recruitment information, and identify suitable professionals through technology-supported and human-led processes." primaryAction={{ label: "Hire Talent", href: "/hire-talent" }} secondaryAction={{ label: "Explore Services", href: "/services" }} variation="dark" />
    <div className="border-b border-border-grey bg-white"><PageContainer className="py-5"><p className="border-l-2 border-gold pl-4 text-sm font-semibold text-navy">Technology supports the process. Employers and recruitment professionals make the decisions.</p></PageContainer></div>
    <EmployerChallenges /><EmployerServices /><EmployerJourney /><EmployerPreparation /><EmployerTechnology /><EmployerFaqs />
    <CTASection heading="Ready to discuss your hiring requirement?" supportingText="Share the information available about your vacancy and begin a structured conversation about the recruitment support your organisation may need." primaryAction={{ label: "Hire Talent", href: "/hire-talent" }} secondaryAction={{ label: "Contact Talvanta Africa", href: "/contact" }} />
  </>;
}

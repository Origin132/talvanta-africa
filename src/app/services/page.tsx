import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { ResponsibleTechnology } from "@/components/services/responsible-technology";
import { ServiceDetails } from "@/components/services/service-details";
import { ServiceProcess } from "@/components/services/service-process";
import { ServicesGrid } from "@/components/services/services-grid";
import { CTASection } from "@/components/ui/cta-section";
import { PageHero } from "@/components/ui/page-hero";
import { createPageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Recruitment Services | Talvanta Africa",
    description: "Explore Talvanta Africa’s structured recruitment services for employers and professionals, supported by digital workflows and responsible human oversight.",
    path: "/services",
  }),
  keywords: [
    "recruitment services",
    "employer recruitment support",
    "professional profile registration",
    "recruitment workflows",
    "human-led recruitment",
  ],
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Recruitment Services"
        title="Structured recruitment support for employers and professionals"
        supportingText="Talvanta Africa combines clear information, digital workflows, and responsible human review to support organisations with hiring needs and professionals exploring career opportunities."
        primaryAction={{ label: "Request Recruitment Support", href: "/for-employers" }}
        secondaryAction={{ label: "Register Your Profile", href: "/candidate-registration" }}
        variation="dark"
      />
      <div className="border-b border-border-grey bg-white">
        <PageContainer className="py-5">
          <p className="border-l-2 border-gold pl-4 text-sm font-semibold leading-6 text-navy">
            Service availability and recruitment outcomes depend on the nature of each request, verified opportunities, and human review.
          </p>
        </PageContainer>
      </div>
      <ServicesGrid />
      <ServiceDetails />
      <ServiceProcess />
      <ResponsibleTechnology />
      <CTASection
        heading="Choose the recruitment pathway that fits your needs"
        supportingText="Submit a structured employer request, register your professional profile, or contact Talvanta Africa for a general enquiry."
        primaryAction={{ label: "Hire Talent", href: "/for-employers" }}
        secondaryAction={{ label: "Register Your Profile", href: "/candidate-registration" }}
      />
    </>
  );
}

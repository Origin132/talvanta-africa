import type { Metadata } from "next";
import { BeforeYouSubmit } from "@/components/employers/before-you-submit";
import { EmployerRequestProcess } from "@/components/employers/employer-request-process";
import { HiringRequestForm } from "@/components/employers/hiring-request-form";
import { PageContainer } from "@/components/layout/page-container";
import { PageHero } from "@/components/ui/page-hero";
import { createPageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Employer Recruitment Support | Talvanta Africa",
  description: "Submit your organisation’s recruitment requirements to Talvanta Africa for structured review, communication, and possible recruitment support.",
  path: "/for-employers",
});

export default function ForEmployersPage() {
  return (
    <>
      <PageHero
        eyebrow="Employer Recruitment Support"
        title="Tell us about your hiring needs"
        supportingText="Share clear information about your organisation, vacancy requirements, and preferred recruitment support so Talvanta Africa can review your request and determine an appropriate next step."
        primaryAction={{ label: "Start Your Request", href: "#employer-recruitment-form" }}
        variation="dark"
      />
      <div className="border-b border-border-grey bg-white">
        <PageContainer className="py-5">
          <p className="border-l-2 border-gold pl-4 text-sm font-semibold leading-6 text-navy">
            Submitting a request does not guarantee candidate availability, shortlisting, placement, or recruitment fulfilment.
          </p>
        </PageContainer>
      </div>
      <BeforeYouSubmit />
      <EmployerRequestProcess />
      <HiringRequestForm />
    </>
  );
}

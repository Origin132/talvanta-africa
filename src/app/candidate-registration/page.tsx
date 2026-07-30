import type { Metadata } from "next";
import { BeforeYouRegister } from "@/components/job-seekers/before-you-register";
import { CandidateRegistrationForm } from "@/components/job-seekers/candidate-registration-form";
import { PageContainer } from "@/components/layout/page-container";
import { PageHero } from "@/components/ui/page-hero";
import { createPageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Candidate Registration | Talvanta Africa",
  description: "Register your professional profile with Talvanta Africa for recruitment-related administration and possible consideration when relevant opportunities become available.",
  path: "/candidate-registration",
});

export default function CandidateRegistrationPage() {
  return (
    <>
      <PageHero
        eyebrow="Candidate Registration"
        title="Build your professional profile"
        supportingText="Share clear and accurate information about your experience, skills, and career interests so Talvanta Africa can maintain a structured professional profile for possible consideration when relevant opportunities become available."
        primaryAction={{ label: "Begin Registration", href: "#candidate-registration-form" }}
        variation="dark"
      />
      <div className="border-b border-border-grey bg-white">
        <PageContainer className="py-5">
          <p className="border-l-2 border-gold pl-4 text-sm font-semibold leading-6 text-navy">
            Registration does not guarantee consideration, shortlisting, an interview, placement, or employment.
          </p>
        </PageContainer>
      </div>
      <BeforeYouRegister />
      <CandidateRegistrationForm />
    </>
  );
}

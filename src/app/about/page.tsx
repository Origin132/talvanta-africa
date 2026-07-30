import type { Metadata } from "next";
import { CompanyStory } from "@/components/about/company-story";
import { FounderSection } from "@/components/about/founder-section";
import { MissionVision } from "@/components/about/mission-vision";
import { ValuesGrid } from "@/components/about/values-grid";
import { WhyTalvanta } from "@/components/about/why-talvanta";
import { CTASection } from "@/components/ui/cta-section";
import { PageHero } from "@/components/ui/page-hero";
import { createPageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "About Talvanta Africa | Human-Led Recruitment Technology",
  description: "Learn about Talvanta Africa, its founder, mission, values, and approach to technology-enabled, human-led recruitment across Africa.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About Talvanta Africa" title="Technology-enabled recruitment with people at the centre" supportingText="Talvanta Africa was created to simplify recruitment by combining structured digital workflows with responsible human decision-making. Our goal is to help employers connect with talent while providing professionals with a clear and organised recruitment experience." primaryAction={{ label: "Explore Our Services", href: "/services" }} secondaryAction={{ label: "Contact Us", href: "/contact" }} variation="dark" />
      <CompanyStory />
      <FounderSection />
      <MissionVision />
      <ValuesGrid />
      <WhyTalvanta />
      <CTASection heading="Start your journey with Talvanta Africa" supportingText="Whether you are seeking talent or exploring career opportunities, Talvanta Africa provides a structured pathway to begin." primaryAction={{ label: "Hire Talent", href: "/for-employers" }} secondaryAction={{ label: "Register Your Profile", href: "/candidate-registration" }} />
    </>
  );
}

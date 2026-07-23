import type { Metadata } from "next";
import { AboutIntroduction } from "@/components/about/about-introduction";
import { AboutAudiences } from "@/components/about/audiences-section";
import { HumanCentredTechnology } from "@/components/about/human-centred-technology";
import { MissionVision } from "@/components/about/mission-vision";
import { ValuesGrid } from "@/components/about/values-grid";
import { CTASection } from "@/components/ui/cta-section";
import { PageHero } from "@/components/ui/page-hero";
import { createPageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "About Talvanta Africa",
  description: "Learn about Talvanta Africa’s human-centred approach to recruitment technology, professional talent, and growing organisations.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About Talvanta Africa" title="Recruitment technology designed around people" supportingText="Talvanta Africa combines organised recruitment processes, intelligent tools, and human oversight to support employers and professionals across Nigeria and Africa." primaryAction={{ label: "Explore Our Services", href: "/services" }} secondaryAction={{ label: "Contact Us", href: "/contact" }} variation="dark" />
      <AboutIntroduction />
      <MissionVision />
      <ValuesGrid />
      <HumanCentredTechnology />
      <AboutAudiences />
      <CTASection heading="Explore a clearer approach to recruitment" supportingText="Discover how Talvanta Africa supports employers and professionals through structured services, intelligent tools, and human-centred guidance." primaryAction={{ label: "Explore Services", href: "/services" }} secondaryAction={{ label: "Contact Talvanta Africa", href: "/contact" }} />
    </>
  );
}

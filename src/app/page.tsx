import { AudienceCards } from "@/components/home/audience-cards";
import { HomeHero } from "@/components/home/home-hero";
import { HomepageCTA } from "@/components/home/homepage-cta";
import { IndustriesSection } from "@/components/home/industries-section";
import { RecruitmentProcess } from "@/components/home/recruitment-process";
import { ServicesOverview } from "@/components/home/services-overview";
import { TaliaSection } from "@/components/home/talia-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { createPageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Talvanta Africa | Recruitment and Workforce Solutions",
  description: "Talvanta Africa connects employers with professional talent through permanent recruitment, contract staffing, executive search, graduate recruitment, candidate screening, and HR advisory.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <HomeHero />
      <AudienceCards />
      <ServicesOverview />
      <RecruitmentProcess />
      <WhyChooseUs />
      <IndustriesSection />
      <TestimonialsSection />
      <TaliaSection />
      <HomepageCTA />
    </>
  );
}
import type { Metadata } from "next";

import { AudienceCards } from "@/components/home/audience-cards";
import { HomeHero } from "@/components/home/home-hero";
import { HomepageCTA } from "@/components/home/homepage-cta";
import { PlatformStandards } from "@/components/home/platform-standards";
import { RecruitmentProcess } from "@/components/home/recruitment-process";
import { ServicesOverview } from "@/components/home/services-overview";
import { TaliaSection } from "@/components/home/talia-section";
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
      <RecruitmentProcess />
      <ServicesOverview />
      <PlatformStandards />
      <TaliaSection />
      <HomepageCTA />
    </>
  );
}
import type { Metadata } from "next";

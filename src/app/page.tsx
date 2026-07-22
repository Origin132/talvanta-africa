import { AudienceCards } from "@/components/home/audience-cards";
import { HomeHero } from "@/components/home/home-hero";
import { HomepageCTA } from "@/components/home/homepage-cta";
import { IndustriesSection } from "@/components/home/industries-section";
import { RecruitmentProcess } from "@/components/home/recruitment-process";
import { ServicesOverview } from "@/components/home/services-overview";
import { TaliaSection } from "@/components/home/talia-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { WhyChooseUs } from "@/components/home/why-choose-us";

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

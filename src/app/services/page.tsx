import type { Metadata } from "next";
import { ResponsibleTechnology } from "@/components/services/responsible-technology";
import { ServiceDetails } from "@/components/services/service-details";
import { ServiceProcess } from "@/components/services/service-process";
import { ServicesGrid } from "@/components/services/services-grid";
import { CTASection } from "@/components/ui/cta-section";
import { PageHero } from "@/components/ui/page-hero";

export const metadata: Metadata = {
  title: { absolute: "Recruitment Services | Talvanta Africa" },
  description: "Explore Talvanta Africa recruitment services for employers, candidates, graduate talent, temporary staffing, executive search, screening, and HR advisory.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero eyebrow="Recruitment Services" title="Flexible recruitment support for growing organisations" supportingText="Talvanta Africa provides structured recruitment services designed to help employers clarify their hiring needs, identify suitable professionals, and manage recruitment activities with human oversight." primaryAction={{ label: "Hire Talent", href: "/hire-talent" }} secondaryAction={{ label: "Contact Us", href: "/contact" }} variation="dark" />
      <ServicesGrid />
      <ServiceDetails />
      <ServiceProcess />
      <ResponsibleTechnology />
      <CTASection heading="Tell us what your organisation needs" supportingText="Share your recruitment requirement or contact Talvanta Africa to discuss the type of support most appropriate for your organisation." primaryAction={{ label: "Hire Talent", href: "/hire-talent" }} secondaryAction={{ label: "Contact Us", href: "/contact" }} />
    </>
  );
}

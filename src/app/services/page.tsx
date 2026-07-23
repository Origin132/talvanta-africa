import type { Metadata } from "next";
import { ResponsibleTechnology } from "@/components/services/responsible-technology";
import { ServiceDetails } from "@/components/services/service-details";
import { ServiceProcess } from "@/components/services/service-process";
import { ServicesGrid } from "@/components/services/services-grid";
import { CTASection } from "@/components/ui/cta-section";
import { PageHero } from "@/components/ui/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { services } from "@/components/services/services-data";
import { createPageMetadata } from "@/lib/seo-metadata";
import { serviceStructuredData } from "@/lib/structured-data";

export const metadata: Metadata = createPageMetadata({
  title: "Recruitment Services",
  description: "Explore permanent recruitment, contract staffing, executive search, graduate recruitment, candidate screening, and HR advisory from Talvanta Africa.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      {services.map((service) => <JsonLd key={service.id} data={serviceStructuredData(service.title, service.summary)} />)}
      <PageHero eyebrow="Recruitment Services" title="Flexible recruitment support for growing organisations" supportingText="Talvanta Africa provides structured recruitment services designed to help employers clarify their hiring needs, identify suitable professionals, and manage recruitment activities with human oversight." primaryAction={{ label: "Hire Talent", href: "/hire-talent" }} secondaryAction={{ label: "Contact Us", href: "/contact" }} variation="dark" />
      <ServicesGrid />
      <ServiceDetails />
      <ServiceProcess />
      <ResponsibleTechnology />
      <CTASection heading="Tell us what your organisation needs" supportingText="Share your recruitment requirement or contact Talvanta Africa to discuss the type of support most appropriate for your organisation." primaryAction={{ label: "Hire Talent", href: "/hire-talent" }} secondaryAction={{ label: "Contact Us", href: "/contact" }} />
    </>
  );
}

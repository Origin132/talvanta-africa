import type { Metadata } from "next";
import { BusinessInformation } from "@/components/contact/business-information";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactPathways } from "@/components/contact/contact-pathways";
import { PageHero } from "@/components/ui/page-hero";
import { createPageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Contact Talvanta Africa | Recruitment and Platform Enquiries",
  description: "Contact Talvanta Africa for employer recruitment support, candidate guidance, platform enquiries, partnerships, and general assistance.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact Talvanta Africa"
        title="Start a conversation with our team"
        supportingText="Whether you are seeking recruitment support, exploring career opportunities, or asking about the platform, use the appropriate contact pathway below and provide enough information for a clear follow-up."
        variation="dark"
      />
      <ContactPathways />
      <BusinessInformation />
      <ContactForm />
    </>
  );
}

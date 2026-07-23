import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactFaqs } from "@/components/contact/contact-faqs";
import { PageContainer } from "@/components/layout/page-container";
import { CTASection } from "@/components/ui/cta-section";
import { PageHero } from "@/components/ui/page-hero";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Talvanta Africa about recruitment services, candidate support, partnerships, privacy, or general enquiries.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact centre"
        title="Contact Talvanta Africa"
        supportingText="Choose the most relevant website journey or send a consent-based enquiry for human review."
        primaryAction={{ label: "Send an enquiry", href: "#contact-form" }}
        secondaryAction={{ label: "View FAQs", href: "/faqs" }}
        variation="dark"
      />

      <section className="bg-white">
        <PageContainer className="py-16 sm:py-24">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-3">
              <h2 className="text-3xl font-extrabold text-navy sm:text-4xl">Find the right contact route</h2>
              <p className="mt-4 max-w-3xl leading-8 text-slate">Using the appropriate form helps the team understand the purpose of your enquiry. Do not send sensitive personal information.</p>
            </div>
            {[
              ["Employers", "Submit a structured recruitment requirement.", "/hire-talent", "Hire talent"],
              ["Job seekers", "Register professional information for possible human review.", "/candidate-registration", "Register as a candidate"],
              ["General enquiries", "Ask about services, partnerships, privacy, or website support.", "#contact-form", "Use contact form"],
            ].map(([title, description, href, label]) => (
              <article key={title} className="rounded-[var(--radius)] border border-border-grey bg-soft-grey p-6">
                <h3 className="text-xl font-extrabold text-navy">{title}</h3>
                <p className="mt-3 leading-7 text-slate">{description}</p>
                <a className="mt-5 inline-flex min-h-11 items-center font-bold text-green underline underline-offset-4" href={href}>{label}</a>
              </article>
            ))}
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <section className="rounded-[var(--radius)] border border-border-grey p-6" aria-labelledby="hours-heading">
              <h2 id="hours-heading" className="text-2xl font-extrabold text-navy">Business hours</h2>
              <p className="mt-3 leading-7 text-slate">Verified operating hours have not yet been published. Website forms may be submitted at any time and are reviewed during the team’s operating periods. No response time is guaranteed.</p>
            </section>
            <section className="rounded-[var(--radius)] border border-border-grey p-6" aria-labelledby="location-heading">
              <h2 id="location-heading" className="text-2xl font-extrabold text-navy">Location map</h2>
              <div className="mt-3 grid min-h-40 place-items-center rounded-lg border border-dashed border-border-grey bg-soft-grey p-5 text-center text-slate">
                Map pending publication of a verified business address.
              </div>
            </section>
          </div>
        </PageContainer>
      </section>

      <ContactForm />
      <ContactFaqs />
      <CTASection
        heading="Need recruitment support?"
        supportingText="Choose the employer or candidate journey that best matches your needs."
        primaryAction={{ label: "Hire Talent", href: "/hire-talent" }}
        secondaryAction={{ label: "Candidate Registration", href: "/candidate-registration" }}
      />
    </>
  );
}

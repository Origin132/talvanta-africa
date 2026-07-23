import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { JsonLd } from "@/components/seo/json-ld";
import { CTASection } from "@/components/ui/cta-section";
import { PageHero } from "@/components/ui/page-hero";
import { faqCategories, faqItems } from "@/lib/faq-data";
import { createPageMetadata } from "@/lib/seo-metadata";
import { faqStructuredData } from "@/lib/structured-data";

export const metadata: Metadata = createPageMetadata({
  title: "Recruitment FAQs",
  description: "Answers about Talvanta Africa’s recruitment services, employer and candidate journeys, Talia, and privacy.",
  path: "/faqs",
});

export default function FaqsPage() {
  return (
    <>
      <JsonLd data={faqStructuredData(faqItems)} />
      <PageHero
        eyebrow="Help centre"
        title="Frequently asked questions"
        supportingText="Clear answers about Talvanta Africa’s services, recruitment journeys, automated assistant, and information handling."
        primaryAction={{ label: "Contact the team", href: "/contact" }}
        variation="dark"
      />
      <PageContainer className="py-16 sm:py-24">
        <div className="space-y-14">
          {faqCategories.map((category) => (
            <section key={category.name} aria-labelledby={`faq-${category.name.toLowerCase().replaceAll(" ", "-")}`}>
              <h2 id={`faq-${category.name.toLowerCase().replaceAll(" ", "-")}`} className="text-3xl font-extrabold text-navy">
                {category.name}
              </h2>
              <div className="mt-6 divide-y divide-border-grey border-y border-border-grey">
                {category.items.map(({ question, answer }) => (
                  <details key={question} className="group py-2">
                    <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 font-heading font-extrabold text-navy">
                      {question}
                      <span aria-hidden="true" className="text-2xl text-green group-open:rotate-45">+</span>
                    </summary>
                    <p className="max-w-3xl pb-5 leading-7 text-slate">{answer}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      </PageContainer>
      <CTASection
        heading="Still need help?"
        supportingText="Send a general enquiry or choose a dedicated recruitment form."
        primaryAction={{ label: "Contact Talvanta Africa", href: "/contact" }}
        secondaryAction={{ label: "Explore Services", href: "/services" }}
      />
    </>
  );
}

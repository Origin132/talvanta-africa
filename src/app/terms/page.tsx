import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { PageHero } from "@/components/ui/page-hero";
import { createPageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Terms of Use",
  description: "Website-use terms, recruitment disclaimers, human-led decision boundaries, and important limitations for Talvanta Africa’s demonstration website.",
  path: "/terms",
});

const sections = [
  ["Website use", "Use this website lawfully and do not attempt to disrupt it, bypass safeguards, submit malicious material, impersonate another person, or provide information you are not authorised to share."],
  ["Demonstration status", "This is a demonstration project. Features, integrations, availability, and content may change. Placeholder or demonstration content must not be treated as a live vacancy, employer relationship, testimonial, or service commitment."],
  ["Recruitment disclaimer", "Information on this website is general recruitment information. A form submission does not create an employment, agency, consultancy, or recruitment-services agreement."],
  ["No employment or hiring guarantee", "Candidate registration does not guarantee contact, shortlisting, an interview, placement, or employment. An employer enquiry does not guarantee candidate availability, service acceptance, a successful hire, or any particular outcome."],
  ["Human-led recruitment", "Recruitment and employment decisions remain human-led. Talvanta Africa’s website and Talia do not automatically score, rank, shortlist, reject, select, or hire candidates."],
  ["Talia disclaimer", "Talia is currently a deterministic, rule-based automated assistant. It is not a human recruiter, hiring manager, legal adviser, or immigration adviser. Do not submit sensitive personal information through chat."],
  ["Information and availability", "Reasonable care is taken when presenting website information, but completeness, continued availability, and suitability for a particular purpose cannot be guaranteed. Verify consequential information with an appropriately qualified person."],
  ["Limitation of responsibility", "To the extent permitted in the relevant circumstances, users remain responsible for decisions made using general website information. Nothing here excludes responsibilities that cannot lawfully be excluded. Qualified legal review is required before production publication."],
] as const;

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Website terms"
        title="Terms of use"
        supportingText="Important conditions, recruitment disclaimers, and responsible-use boundaries for this demonstration website."
        variation="dark"
      />
      <PageContainer className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-[var(--radius)] border border-gold bg-soft-grey p-5 text-sm leading-6 text-slate">
            These terms are an implementation draft, not a substitute for qualified legal review. Approved legal source content remains pending import.
          </div>
          <div className="mt-10 space-y-10">
            {sections.map(([heading, content]) => (
              <section key={heading}>
                <h2 className="text-2xl font-extrabold text-navy">{heading}</h2>
                <p className="mt-3 leading-8 text-slate">{content}</p>
              </section>
            ))}
          </div>
        </div>
      </PageContainer>
    </>
  );
}

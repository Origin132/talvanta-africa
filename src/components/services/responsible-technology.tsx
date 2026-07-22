import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";

export function ResponsibleTechnology() {
  return (
    <section className="bg-white">
      <PageContainer className="py-16 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-start lg:gap-16">
          <div>
            <SectionHeading eyebrow="Technology and Human Oversight" heading="Intelligent support without automated final decisions" />
            <div className="mt-6 max-w-3xl space-y-4 text-lg leading-8 text-slate">
              <p>Talvanta Africa may use automation and artificial intelligence to organise information, prepare summaries, assist with lead classification, and suggest potential matches.</p>
              <p>These tools support recruitment administration. They do not replace employer judgement, professional review, interviews, or final hiring decisions.</p>
            </div>
          </div>
          <aside className="rounded-[var(--radius)] border-l-4 border-gold bg-soft-grey p-6 shadow-sm sm:p-8" aria-label="Service enquiry notice">
            <p className="font-heading text-lg font-extrabold text-navy">Important service note</p>
            <p className="mt-3 leading-7 text-slate">Submitting a recruitment enquiry does not create a formal service agreement. Scope, terms, responsibilities, and any commercial arrangements must be confirmed separately.</p>
          </aside>
        </div>
      </PageContainer>
    </section>
  );
}

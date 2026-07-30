import { PageContainer } from "@/components/layout/page-container";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

const guidance = [
  {
    heading: "Read the Full Role Information",
    text: "Review the location, work arrangement, employment type, responsibilities, requirements, and application guidance carefully.",
  },
  {
    heading: "Check the Opportunity Status",
    text: "Confirm whether the role is open, closing soon, or closed before taking action.",
  },
  {
    heading: "Use the Correct Application Pathway",
    text: "Follow the application or registration instructions shown for the verified opportunity.",
  },
] as const;

export function ResponsibleMatching() {
  return (
    <section className="bg-white">
      <PageContainer className="py-16 sm:py-24">
        <SectionHeading
          eyebrow="Career Opportunities"
          heading="Review verified roles through the Jobs page"
          supportingText="Talvanta Africa publishes career opportunities only when the role information and application pathway have been reviewed. The Jobs page may display an intentional empty state when no verified vacancies are currently open."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {guidance.map((item) => (
            <article
              key={item.heading}
              className="rounded-[var(--radius)] border border-border-grey bg-soft-grey p-6 shadow-sm"
            >
              <div aria-hidden="true" className="h-1 w-12 rounded-full bg-gold" />
              <h3 className="mt-5 text-xl font-extrabold text-navy">{item.heading}</h3>
              <p className="mt-3 leading-7 text-slate">{item.text}</p>
            </article>
          ))}
        </div>
        <div className="mt-8">
          <ButtonLink href="/jobs">Explore Career Opportunities</ButtonLink>
        </div>
      </PageContainer>
    </section>
  );
}

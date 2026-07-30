import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";

const preparationItems = [
  {
    heading: "Contact Information",
    text: "Use an email address and telephone number that you can access reliably.",
  },
  {
    heading: "Employment History",
    text: "Prepare accurate information about your current or previous roles, responsibilities, and relevant experience.",
  },
  {
    heading: "Education and Qualifications",
    text: "Provide truthful information about qualifications, training, and professional development relevant to your career interests.",
  },
  {
    heading: "Core Skills",
    text: "Identify the technical, professional, and interpersonal skills that best represent your experience.",
  },
  {
    heading: "Career Preferences",
    text: "Consider the industries, locations, employment arrangements, and types of opportunities you are interested in.",
  },
] as const;

export function CandidatePreparation() {
  return (
    <section className="bg-soft-grey">
      <PageContainer className="py-16 sm:py-24">
        <SectionHeading
          eyebrow="Prepare Your Information"
          heading="What to have ready before registration"
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {preparationItems.map((item, index) => (
            <article
              key={item.heading}
              className="rounded-[var(--radius)] border border-border-grey bg-white p-6 shadow-sm"
            >
              <span className="font-heading text-sm font-extrabold text-green" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-xl font-extrabold text-navy">{item.heading}</h3>
              <p className="mt-3 leading-7 text-slate">{item.text}</p>
            </article>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}

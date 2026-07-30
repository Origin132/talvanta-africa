import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";

const supportItems = [
  {
    heading: "Professional Profile Registration",
    text: "Submit accurate information about your experience, qualifications, skills, location, and career interests through a structured registration form.",
  },
  {
    heading: "Verified Opportunity Access",
    text: "Review genuine opportunities through the Jobs page when approved roles and clear application pathways are available.",
  },
  {
    heading: "Recruitment-Related Communication",
    text: "Talvanta Africa may contact you using the details provided when clarification, further information, or participation in a relevant recruitment process is required.",
  },
  {
    heading: "Human-Led Review",
    text: "Technology supports organisation and communication, while people remain responsible for review, shortlisting, interviews, assessment, and hiring decisions.",
  },
] as const;

export function CandidateSupport() {
  return (
    <section className="bg-white">
      <PageContainer className="py-16 sm:py-24">
        <SectionHeading
          eyebrow="Candidate Support"
          heading="A structured experience for presenting your professional information"
          supportingText="Talvanta Africa helps professionals organise and submit relevant career information through clear digital pathways while preserving human responsibility for recruitment review and communication."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {supportItems.map((item, index) => (
            <article
              key={item.heading}
              className="rounded-[var(--radius)] border border-border-grey bg-white p-6 shadow-sm sm:p-7"
            >
              <span
                aria-hidden="true"
                className="grid size-10 place-items-center rounded-xl bg-soft-grey font-heading text-sm font-extrabold text-green"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-xl font-extrabold leading-snug text-navy">
                {item.heading}
              </h3>
              <p className="mt-3 leading-7 text-slate">{item.text}</p>
            </article>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}

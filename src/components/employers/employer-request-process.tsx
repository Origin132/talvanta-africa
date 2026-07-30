import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";

const steps = [
  {
    heading: "Requirement Submission",
    text: "Your organisation provides information about its hiring need and preferred recruitment support.",
  },
  {
    heading: "Request Review",
    text: "The submitted information may be reviewed for clarity, completeness, and suitability for follow-up.",
  },
  {
    heading: "Requirement Clarification",
    text: "Talvanta Africa may contact the authorised representative if additional information is needed.",
  },
  {
    heading: "Recruitment Pathway",
    text: "If appropriate, a suitable recruitment pathway may be discussed, including vacancy presentation or candidate-search support.",
  },
  {
    heading: "Human Decision-Making",
    text: "Employer representatives remain responsible for interviews, assessment, selection, and final hiring decisions.",
  },
] as const;

export function EmployerRequestProcess() {
  return (
    <section className="bg-soft-grey">
      <PageContainer className="py-16 sm:py-24">
        <SectionHeading
          heading="How Employer Requests Work"
          supportingText="Talvanta Africa uses structured digital workflows to support administration and communication while keeping recruitment review and hiring decisions human-led."
        />
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, index) => (
            <li
              key={step.heading}
              className="rounded-[var(--radius)] border border-border-grey bg-white p-6 shadow-sm"
            >
              <span className="grid size-10 place-items-center rounded-full bg-green font-heading text-sm font-extrabold text-white">
                <span className="sr-only">Step </span>
                {index + 1}
              </span>
              <h3 className="mt-5 text-lg font-extrabold leading-snug text-navy">
                {step.heading}
              </h3>
              <p className="mt-3 leading-7 text-slate">{step.text}</p>
            </li>
          ))}
        </ol>
      </PageContainer>
    </section>
  );
}

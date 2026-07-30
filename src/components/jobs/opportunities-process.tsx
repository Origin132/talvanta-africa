import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";

const opportunitySteps = [
  { title: "Employer Requirement", text: "An organisation submits information about a genuine hiring need." },
  { title: "Requirement Review", text: "The role information and proposed application route are reviewed before publication." },
  { title: "Opportunity Publication", text: "Approved opportunities are presented with clear role and application details." },
  { title: "Candidate Interest", text: "Professionals apply or register interest through the appropriate process." },
  { title: "Human Review", text: "Shortlisting, communication, interviews, and hiring decisions remain human-led." },
] as const;

export function OpportunitiesProcess() {
  return (
    <section className="bg-soft-grey">
      <PageContainer className="py-16 sm:py-24">
        <SectionHeading
          eyebrow="How Opportunities Work"
          heading="A clear and human-led recruitment process"
          supportingText="Talvanta Africa uses structured information and technology-enabled workflows to support recruitment while keeping people responsible for review, communication, and hiring decisions."
        />
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {opportunitySteps.map((step, index) => (
            <li key={step.title} className="rounded-[var(--radius)] border border-border-grey bg-white p-6 shadow-sm">
              <span className="grid size-10 place-items-center rounded-full bg-green font-heading text-sm font-extrabold text-white">
                <span className="sr-only">Step </span>{index + 1}
              </span>
              <h3 className="mt-5 text-lg font-extrabold leading-snug text-navy">{step.title}</h3>
              <p className="mt-3 leading-7 text-slate">{step.text}</p>
            </li>
          ))}
        </ol>
      </PageContainer>
    </section>
  );
}

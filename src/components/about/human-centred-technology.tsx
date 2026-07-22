import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";

const technologySupport = [
  "Organising employer hiring requests",
  "Structuring candidate information",
  "Summarising recruitment leads",
  "Identifying potential job matches",
  "Answering common website questions",
  "Supporting timely follow-up",
] as const;

const humanResponsibilities = [
  "Reviewing recruitment requirements",
  "Assessing candidate suitability",
  "Communicating with employers and candidates",
  "Conducting interviews",
  "Making shortlisting decisions",
  "Making final hiring decisions",
] as const;

type ResponsibilityGroupProps = {
  heading: string;
  marker: string;
  items: readonly string[];
  variation: "support" | "responsibility";
};

function ResponsibilityGroup({ heading, marker, items, variation }: ResponsibilityGroupProps) {
  const isResponsibility = variation === "responsibility";
  return (
    <article className={`rounded-[var(--radius)] p-6 sm:p-8 ${isResponsibility ? "bg-navy text-white" : "border border-border-grey bg-white text-slate"}`}>
      <div className="flex items-center gap-4">
        <span aria-hidden="true" className={`grid size-11 place-items-center rounded-xl font-heading font-extrabold ${isResponsibility ? "bg-gold text-navy" : "bg-green text-white"}`}>{marker}</span>
        <h3 className={`text-xl font-extrabold ${isResponsibility ? "text-white" : "text-navy"}`}>{heading}</h3>
      </div>
      <ul className="mt-6 space-y-3">
        {items.map((item) => (
          <li key={item} className={`flex gap-3 leading-7 ${isResponsibility ? "text-white/85" : "text-slate"}`}>
            <span aria-hidden="true" className={`mt-2 size-2 shrink-0 rounded-full ${isResponsibility ? "bg-gold" : "bg-green"}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function HumanCentredTechnology() {
  return (
    <section className="bg-soft-grey">
      <PageContainer className="py-16 sm:py-24">
        <SectionHeading eyebrow="Our Approach" heading="AI supports the process. People make the decisions." />
        <div className="mt-6 max-w-4xl space-y-4 text-lg leading-8 text-slate">
          <p>Talvanta Africa uses artificial intelligence and automation to assist with routine recruitment administration, information organisation, lead summaries, candidate matching guidance, and website support.</p>
          <p>These tools are intended to improve efficiency and clarity. They do not replace professional judgement, automatically reject candidates, or make final hiring decisions.</p>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <ResponsibilityGroup heading="Technology may support" marker="T" items={technologySupport} variation="support" />
          <ResponsibilityGroup heading="Human oversight remains responsible for" marker="H" items={humanResponsibilities} variation="responsibility" />
        </div>
      </PageContainer>
    </section>
  );
}

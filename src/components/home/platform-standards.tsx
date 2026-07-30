import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";

type PlatformStandard = {
  title: string;
  description: string;
};

const platformStandards: readonly PlatformStandard[] = [
  {
    title: "Structured Hiring Requirements",
    description: "Helping employers communicate recruitment needs clearly.",
  },
  {
    title: "Candidate-Focused Experience",
    description: "Providing professionals with a structured registration journey.",
  },
  {
    title: "Human Oversight",
    description: "Technology supports recruitment while people make decisions.",
  },
  {
    title: "Secure Information Handling",
    description: "Form submissions are validated before processing.",
  },
  {
    title: "Workflow Automation",
    description: "Administrative tasks are streamlined through secure automation.",
  },
  {
    title: "Responsible Technology",
    description: "Digital tools support efficiency without replacing human judgement.",
  },
];

export function PlatformStandards() {
  return (
    <section className="bg-soft-grey">
      <PageContainer className="py-16 sm:py-24">
        <SectionHeading heading="Platform Standards" supportingText="Built for clear, transparent, and responsible recruitment." />
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {platformStandards.map((standard) => (
            <article key={standard.title} className="flex flex-col rounded-[var(--radius)] border border-border-grey bg-white p-6 shadow-sm sm:p-7">
              <h3 className="font-heading text-lg font-bold leading-8 text-navy">{standard.title}</h3>
              <p className="mt-3 flex-1 leading-7 text-slate">{standard.description}</p>
            </article>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}

import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";

export type ProcessStep = { title: string; text: string };

type ProcessStepsProps = {
  eyebrow: string;
  heading: string;
  steps: readonly ProcessStep[];
  note: string;
};

export function ProcessSteps({ eyebrow, heading, steps, note }: ProcessStepsProps) {
  return (
    <section className="bg-soft-grey">
      <PageContainer className="py-16 sm:py-24">
        <SectionHeading eyebrow={eyebrow} heading={heading} />
        <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, index) => (
            <li key={step.title} className={`rounded-[var(--radius)] border border-border-grey bg-white p-6 shadow-sm ${index === steps.length - 1 ? "md:col-span-2 lg:col-span-1" : ""}`}>
              <span className="grid size-10 place-items-center rounded-xl bg-green font-heading text-sm font-extrabold text-white">{index + 1}</span>
              <h3 className="mt-5 text-lg font-extrabold leading-snug text-navy">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate">{step.text}</p>
            </li>
          ))}
        </ol>
        <aside className="mt-8 rounded-[var(--radius)] border-l-4 border-gold bg-white p-5 shadow-sm sm:p-6" aria-label="Important process note">
          <p className="font-heading font-extrabold text-navy">Important</p>
          <p className="mt-2 leading-7 text-slate">{note}</p>
        </aside>
      </PageContainer>
    </section>
  );
}

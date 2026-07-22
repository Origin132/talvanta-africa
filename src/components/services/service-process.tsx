import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";

const steps = [
  { title: "Share Your Requirement", text: "Provide information about the organisation, vacancy, required skills, location, employment type, and expected timeline." },
  { title: "Requirement Review", text: "The recruitment team reviews the information, identifies missing details, and clarifies the type of support required." },
  { title: "Agreed Recruitment Approach", text: "The appropriate recruitment process and next steps are discussed before work proceeds." },
  { title: "Human-Led Follow-Up", text: "Communication, screening, shortlisting, and hiring decisions continue with professional human involvement." },
] as const;

export function ServiceProcess() {
  return (
    <section className="bg-navy text-white">
      <PageContainer className="py-16 sm:py-24">
        <div className="[&_h2]:text-white [&_p]:text-white/80">
          <SectionHeading eyebrow="Working With Talvanta Africa" heading="A clear starting point for recruitment support" />
        </div>
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="rounded-[var(--radius)] border border-white/20 bg-white/10 p-6">
              <span className="grid size-10 place-items-center rounded-xl bg-gold font-heading text-sm font-extrabold text-navy">{index + 1}</span>
              <h3 className="mt-5 text-lg font-extrabold leading-snug text-white">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/80">{step.text}</p>
            </li>
          ))}
        </ol>
      </PageContainer>
    </section>
  );
}

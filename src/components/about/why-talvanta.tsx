import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";

const features = [
  "Structured Recruitment",
  "Technology-Enabled Workflows",
  "Responsible Human Review",
  "Candidate-Focused Experience",
] as const;

export function WhyTalvanta() {
  return (
    <section className="bg-soft-grey">
      <PageContainer className="py-16 sm:py-24">
        <SectionHeading heading="Why Talvanta Africa" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <article
              key={feature}
              className="rounded-[var(--radius)] border border-border-grey bg-white p-6 shadow-sm"
            >
              <span
                aria-hidden="true"
                className="grid size-11 place-items-center rounded-xl bg-green font-heading text-sm font-extrabold text-white"
              >
                {index + 1}
              </span>
              <h3 className="mt-5 text-xl font-extrabold leading-snug text-navy">
                {feature}
              </h3>
            </article>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}

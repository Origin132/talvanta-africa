import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";

const values = [
  { initial: "H", title: "Human-Centred", text: "Technology supports people rather than replacing them." },
  { initial: "T", title: "Transparency", text: "Clear and responsible communication throughout recruitment." },
  { initial: "P", title: "Professionalism", text: "Structured processes designed to support dependable service." },
  { initial: "C", title: "Continuous Improvement", text: "Learning from each stage of the platform and improving the experience over time." },
] as const;

export function ValuesGrid() {
  return (
    <section className="bg-white">
      <PageContainer className="py-16 sm:py-24">
        <SectionHeading eyebrow="Our Values" heading="Principles guiding the Talvanta Africa experience" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <article key={value.title} className="rounded-[var(--radius)] border border-border-grey bg-white p-6 shadow-sm">
              <span aria-hidden="true" className="grid size-11 place-items-center rounded-xl bg-soft-grey font-heading font-extrabold text-green">{value.initial}</span>
              <h3 className="mt-5 text-xl font-extrabold text-navy">{value.title}</h3>
              <p className="mt-3 leading-7 text-slate">{value.text}</p>
            </article>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}

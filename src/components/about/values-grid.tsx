import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";

const values = [
  { initial: "I", title: "Integrity", text: "We communicate honestly, protect user trust, and avoid making promises that recruitment outcomes cannot guarantee." },
  { initial: "F", title: "Fairness", text: "We aim to support recruitment processes that treat employers and candidates with consistency, respect, and professionalism." },
  { initial: "I", title: "Innovation", text: "We use technology to improve organisation, communication, and recruitment support without replacing human judgement." },
  { initial: "P", title: "Professionalism", text: "We value clear processes, responsible communication, and dependable service standards." },
  { initial: "H", title: "Human-Centred Service", text: "People remain at the centre of recruitment decisions, relationships, and career outcomes." },
] as const;

export function ValuesGrid() {
  return (
    <section className="bg-white">
      <PageContainer className="py-16 sm:py-24">
        <SectionHeading eyebrow="Our Values" heading="Principles guiding the Talvanta Africa experience" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value, index) => (
            <article key={value.title} className={`rounded-[var(--radius)] border border-border-grey bg-white p-6 shadow-sm ${index === values.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""}`}>
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

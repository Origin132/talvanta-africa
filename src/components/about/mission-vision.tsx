import { PageContainer } from "@/components/layout/page-container";

const statements = [
  { label: "Mission", heading: "Our Mission", text: "To support organisations and professionals through structured recruitment processes that combine digital efficiency with responsible human oversight.", style: "bg-navy text-white", labelStyle: "text-gold" },
  { label: "Vision", heading: "Our Vision", text: "To become a trusted recruitment technology platform that helps organisations discover talent and enables professionals to access meaningful career opportunities across Africa.", style: "border border-border-grey bg-white text-slate", labelStyle: "text-green" },
] as const;

export function MissionVision() {
  return (
    <section className="bg-soft-grey" aria-label="Mission and vision">
      <PageContainer className="grid gap-5 py-16 sm:py-24 lg:grid-cols-2">
        {statements.map((statement) => (
          <article key={statement.heading} className={`rounded-[var(--radius)] p-7 shadow-sm sm:p-9 ${statement.style}`}>
            <p className={`text-sm font-extrabold uppercase tracking-[0.16em] ${statement.labelStyle}`}>{statement.label}</p>
            <h2 className={`mt-4 text-3xl font-extrabold ${statement.label === "Mission" ? "text-white" : "text-navy"}`}>{statement.heading}</h2>
            <p className={`mt-5 text-lg leading-8 ${statement.label === "Mission" ? "text-white/85" : "text-slate"}`}>{statement.text}</p>
          </article>
        ))}
      </PageContainer>
    </section>
  );
}

import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";

const connections = ["Growing organisations", "Qualified professionals", "Human recruitment teams"] as const;

export function AboutIntroduction() {
  return (
    <section className="bg-white">
      <PageContainer className="grid gap-10 py-16 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
        <div>
          <SectionHeading eyebrow="Who We Are" heading="Connecting people, opportunity, and business growth" />
          <div className="mt-6 max-w-3xl space-y-4 leading-8 text-slate">
            <p>Talvanta Africa is an AI-powered recruitment and talent-solutions company created to help growing organisations connect with qualified professionals.</p>
            <p>The platform is designed to make recruitment information clearer, lead management more organised, and communication more efficient for employers, candidates, and recruitment teams.</p>
            <p>Technology supports the process, but recruitment judgement and final decisions remain human responsibilities.</p>
          </div>
        </div>
        <div className="relative rounded-[calc(var(--radius)+0.5rem)] bg-soft-grey p-6 shadow-[var(--shadow-subtle)] sm:p-8" aria-hidden="true">
          <div className="absolute bottom-8 left-[3.15rem] top-8 w-px bg-border-grey" />
          <ul className="relative space-y-4">
            {connections.map((connection, index) => (
              <li key={connection} className="flex items-center gap-4 rounded-[var(--radius)] border border-border-grey bg-white p-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-green font-heading text-sm font-extrabold text-white">{index + 1}</span>
                <span className="font-heading font-extrabold text-navy">{connection}</span>
              </li>
            ))}
          </ul>
          <p className="relative mt-5 rounded-[var(--radius)] bg-navy px-5 py-4 text-center font-heading font-bold text-white">Connected through structured support</p>
        </div>
      </PageContainer>
    </section>
  );
}

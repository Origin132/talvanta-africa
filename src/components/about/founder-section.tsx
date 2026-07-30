import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";

export function FounderSection() {
  return (
    <section className="bg-white">
      <PageContainer className="grid gap-10 py-16 sm:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
        <div
          className="grid min-h-72 place-items-center rounded-[calc(var(--radius)+0.5rem)] border border-border-grey bg-soft-grey shadow-[var(--shadow-subtle)] sm:min-h-96"
          aria-hidden="true"
        >
          <span className="grid size-24 place-items-center rounded-full bg-navy font-heading text-4xl font-extrabold text-gold">
            B
          </span>
        </div>
        <div>
          <SectionHeading eyebrow="Founder Story" heading="Meet the Founder" />
          <h3 className="mt-7 text-2xl font-extrabold text-navy">Bashir</h3>
          <p className="mt-2 font-heading font-bold text-green">
            Founder and Recruitment Technology Developer
          </p>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate">
            Talvanta Africa was founded by Bashir as an initiative to explore how modern technology can improve recruitment processes while preserving the importance of human judgement. The platform focuses on creating structured, transparent, and accessible recruitment experiences for employers and professionals across Africa.
          </p>
        </div>
      </PageContainer>
    </section>
  );
}

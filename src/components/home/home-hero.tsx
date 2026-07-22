import { PageContainer } from "@/components/layout/page-container";
import { ButtonLink } from "@/components/ui/button";

const journeyItems = [
  { number: "01", label: "Understand the need" },
  { number: "02", label: "Structure the search" },
  { number: "03", label: "Support human decisions" },
] as const;

export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div className="pointer-events-none absolute inset-0 opacity-30" aria-hidden="true">
        <div className="absolute -right-28 -top-32 size-80 rounded-full border border-gold/40" />
        <div className="absolute -right-10 top-8 size-52 rounded-full border border-white/15" />
      </div>
      <PageContainer className="relative grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16 lg:py-24">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-gold">
            AI-Powered Recruitment and Talent Solutions
          </p>
          <h1 className="mt-5 max-w-[18ch] text-balance text-[2.125rem] font-extrabold leading-[1.12] tracking-tight min-[360px]:text-4xl sm:text-5xl lg:text-6xl">
            Connecting exceptional talent with growing businesses.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-white/85 sm:text-xl">
            Talvanta Africa helps organisations find suitable professionals while supporting job seekers in discovering relevant career opportunities across Nigeria and Africa.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-3">
            <ButtonLink href="/hire-talent" variant="secondary">Hire Talent</ButtonLink>
            <ButtonLink href="/jobs" variant="light">Find a Job</ButtonLink>
          </div>
          <p className="mt-7 border-l-2 border-gold pl-4 text-sm font-semibold text-white/85">
            Intelligent recruitment support. Human-centred decisions.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-lg" aria-hidden="true">
          <div className="absolute -inset-3 rounded-[calc(var(--radius)+0.75rem)] border border-white/15" />
          <div className="relative rounded-[var(--radius)] border border-white/20 bg-white/10 p-5 shadow-[var(--shadow-subtle)] backdrop-blur-sm sm:p-7">
            <div className="flex items-center justify-between border-b border-white/15 pb-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold">Recruitment journey</p>
                <p className="mt-1 font-heading text-lg font-extrabold">People, process, progress</p>
              </div>
              <span className="grid size-11 place-items-center rounded-full bg-green font-heading font-extrabold">TA</span>
            </div>
            <ol className="mt-5 space-y-3">
              {journeyItems.map((item) => (
                <li key={item.number} className="flex items-center gap-4 rounded-xl border border-white/15 bg-navy/40 p-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-gold font-heading text-sm font-extrabold text-navy">{item.number}</span>
                  <span className="font-semibold text-white">{item.label}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}

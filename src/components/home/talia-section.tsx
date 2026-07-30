import { PageContainer } from "@/components/layout/page-container";
import { ButtonLink } from "@/components/ui/button";

const taliaSupport = [
  "Exploring job opportunities",
  "Starting a hiring request",
  "Learning about recruitment services",
  "Answering common questions",
  "Collecting structured information with consent",
  "Requesting human support",
] as const;

export function TaliaSection() {
  return (
    <section className="bg-white">
      <PageContainer className="py-16 sm:py-24">
        <div className="relative overflow-hidden rounded-[calc(var(--radius)+0.5rem)] bg-navy p-6 text-white shadow-[var(--shadow-subtle)] sm:p-10 lg:p-12">
          <div className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full border border-gold/30" aria-hidden="true" />
          <div className="relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
            <div>
              <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">Meet Talia</h2>
              <p className="mt-5 text-lg leading-8 text-white/85">Talia is Talvanta Africa&apos;s digital recruitment assistant. She helps employers and professionals navigate our services, answer common questions, and find the right recruitment pathway. Talia supports your journey while all recruitment decisions remain under human oversight.</p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-3">
                <ButtonLink href="/contact" variant="secondary">Learn About Talia</ButtonLink>
                <ButtonLink href="/services" variant="light">Explore Services</ButtonLink>
              </div>
            </div>

            <div className="rounded-[var(--radius)] border border-white/20 bg-white/10 p-5 sm:p-7">
              <h3 className="text-xl font-extrabold text-white">How Talia supports you</h3>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {taliaSupport.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-white/90">
                    <span aria-hidden="true" className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-green text-xs font-extrabold text-white">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-7 border-t border-white/20 pt-6 text-sm leading-7 text-white/80"><strong className="text-white">Human oversight:</strong> Talia supports recruitment administration and guidance. It does not make final hiring decisions, reject candidates automatically, or guarantee employment or placement.</p>
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}

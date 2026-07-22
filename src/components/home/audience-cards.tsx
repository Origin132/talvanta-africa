import { PageContainer } from "@/components/layout/page-container";
import { ButtonLink } from "@/components/ui/button";

const audiences = [
  {
    symbol: "E",
    heading: "For Employers",
    text: "Find qualified professionals for permanent, temporary, contract, graduate, and specialist roles with structured recruitment support.",
    action: "Hire Talent",
    href: "/hire-talent",
    accent: "bg-navy text-white",
    symbolStyle: "bg-gold text-navy",
    buttonVariant: "secondary" as const,
  },
  {
    symbol: "J",
    heading: "For Job Seekers",
    text: "Explore career opportunities, register your professional profile, and receive guidance based on your skills, experience, and preferences.",
    action: "Explore Opportunities",
    href: "/jobs",
    accent: "border border-border-grey bg-white text-slate",
    symbolStyle: "bg-green text-white",
    buttonVariant: "primary" as const,
  },
] as const;

export function AudienceCards() {
  return (
    <section className="bg-soft-grey" aria-labelledby="audience-heading">
      <PageContainer className="py-14 sm:py-20">
        <h2 id="audience-heading" className="sr-only">Recruitment support by audience</h2>
        <div className="grid gap-5 lg:grid-cols-2">
          {audiences.map((audience) => (
            <article key={audience.heading} className={`flex flex-col rounded-[var(--radius)] p-6 shadow-[var(--shadow-subtle)] sm:p-8 ${audience.accent}`}>
              <span aria-hidden="true" className={`grid size-12 place-items-center rounded-xl font-heading text-lg font-extrabold ${audience.symbolStyle}`}>{audience.symbol}</span>
              <h3 className={`mt-6 text-2xl font-extrabold sm:text-3xl ${audience.heading === "For Employers" ? "text-white" : "text-navy"}`}>{audience.heading}</h3>
              <p className={`mt-4 flex-1 leading-7 ${audience.heading === "For Employers" ? "text-white/85" : "text-slate"}`}>{audience.text}</p>
              <div className="mt-7 sm:self-start">
                <ButtonLink className="w-full sm:w-auto" href={audience.href} variant={audience.buttonVariant}>{audience.action}</ButtonLink>
              </div>
            </article>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}

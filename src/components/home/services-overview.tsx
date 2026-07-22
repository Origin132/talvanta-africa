import { PageContainer } from "@/components/layout/page-container";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

type Service = {
  number: string;
  title: string;
  description: string;
};

const services: readonly Service[] = [
  { number: "01", title: "Permanent Recruitment", description: "Support for organisations seeking qualified professionals for long-term roles." },
  { number: "02", title: "Temporary and Contract Staffing", description: "Flexible recruitment support for temporary assignments, projects, and contract positions." },
  { number: "03", title: "Executive Search", description: "Focused support for identifying experienced professionals for senior and specialist responsibilities." },
  { number: "04", title: "Graduate Recruitment", description: "Structured recruitment support for graduate, internship, and early-career opportunities." },
  { number: "05", title: "Candidate Screening", description: "Organised review of candidate information against clearly defined role requirements." },
  { number: "06", title: "HR Advisory", description: "Practical support for improving recruitment planning and people-related processes." },
];

export function ServicesOverview() {
  return (
    <section className="bg-white">
      <PageContainer className="py-16 sm:py-24">
        <SectionHeading eyebrow="Our Services" heading="Recruitment support designed around people and business needs" supportingText="Talvanta Africa combines organised recruitment processes, technology, and human oversight to support employers and professionals." />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article key={service.title} className="group rounded-[var(--radius)] border border-border-grey bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-green/40 hover:shadow-[var(--shadow-subtle)] focus-within:border-green sm:p-7">
              <span aria-hidden="true" className="font-heading text-sm font-extrabold text-green">{service.number}</span>
              <h3 className="mt-4 text-xl font-extrabold leading-snug text-navy">{service.title}</h3>
              <p className="mt-3 leading-7 text-slate">{service.description}</p>
            </article>
          ))}
        </div>
        <div className="mt-9">
          <ButtonLink href="/services" variant="outline">Explore All Services</ButtonLink>
        </div>
      </PageContainer>
    </section>
  );
}

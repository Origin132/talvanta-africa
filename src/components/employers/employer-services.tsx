import { PageContainer } from "@/components/layout/page-container";
import { services } from "@/components/services/services-data";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

export function EmployerServices() {
  return <section className="bg-soft-grey"><PageContainer className="py-16 sm:py-24"><SectionHeading eyebrow="Employer Services" heading="Support for different recruitment requirements" supportingText="Talvanta Africa is designed to support organisations across permanent hiring, flexible staffing, specialist search, early-career recruitment, candidate review, and recruitment planning." /><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{services.map((service) => <article key={service.id} className="rounded-[var(--radius)] border border-border-grey bg-white p-6 shadow-sm"><h3 className="text-xl font-extrabold text-navy">{service.title}</h3><p className="mt-3 leading-7 text-slate">{service.summary}</p></article>)}</div><div className="mt-8"><ButtonLink href="/services" variant="outline">View Recruitment Services</ButtonLink></div></PageContainer></section>;
}

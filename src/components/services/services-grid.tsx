import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { services } from "./services-data";

export function ServicesGrid() {
  return (
    <section className="bg-white">
      <PageContainer className="py-16 sm:py-24">
        <SectionHeading eyebrow="What We Offer" heading="Recruitment services designed around different hiring needs" supportingText="Organisations have different recruitment priorities. Talvanta Africa is designed to support permanent hiring, flexible staffing, specialist search, graduate recruitment, candidate screening, and practical HR needs." />
        <nav className="mt-10" aria-label="Services on this page">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <li key={service.id}>
                <Link href={`#${service.id}`} className="group flex min-h-28 h-full items-center gap-4 rounded-[var(--radius)] border border-border-grey bg-white p-5 shadow-sm hover:-translate-y-0.5 hover:border-green/50 hover:shadow-[var(--shadow-subtle)]">
                  <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-xl bg-soft-grey font-heading text-sm font-extrabold text-green">{String(index + 1).padStart(2, "0")}</span>
                  <span className="font-heading font-extrabold leading-snug text-navy group-hover:text-green">{service.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </PageContainer>
    </section>
  );
}

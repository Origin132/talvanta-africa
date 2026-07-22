import { PageContainer } from "@/components/layout/page-container";
import { ButtonLink } from "@/components/ui/button";
import { services } from "./services-data";

export function ServiceDetails() {
  return (
    <div aria-label="Detailed recruitment services">
      {services.map((service, index) => (
        <section id={service.id} key={service.id} className={`scroll-mt-24 ${index % 2 === 0 ? "bg-soft-grey" : "bg-white"}`}>
          <PageContainer className="grid gap-8 py-16 sm:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-green">Service {String(index + 1).padStart(2, "0")}</p>
              <h2 className="mt-3 text-3xl font-extrabold leading-tight text-navy sm:text-4xl">{service.title}</h2>
              <p className="mt-5 text-lg leading-8 text-slate">{service.summary}</p>
              <div className="mt-7"><ButtonLink href={service.href}>{service.action}</ButtonLink></div>
            </div>
            <div className="rounded-[var(--radius)] border border-border-grey bg-white p-6 shadow-sm sm:p-8">
              <h3 className="text-lg font-extrabold text-navy">This service may include</h3>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {service.inclusions.map((item) => (
                  <li key={item} className="flex gap-3 leading-7 text-slate">
                    <span aria-hidden="true" className="mt-2 grid size-5 shrink-0 place-items-center rounded-full bg-green text-xs font-extrabold text-white">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </PageContainer>
        </section>
      ))}
    </div>
  );
}

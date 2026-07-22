import { PageContainer } from "@/components/layout/page-container";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

const audiences = [
  { marker: "E", title: "Employers", text: "Organisations seeking structured support for permanent, temporary, contract, graduate, executive, or specialist recruitment needs.", action: "For Employers", href: "/employers" },
  { marker: "J", title: "Job Seekers", text: "Professionals and early-career candidates exploring relevant opportunities, career guidance, and structured registration.", action: "For Job Seekers", href: "/job-seekers" },
  { marker: "R", title: "Recruitment Teams", text: "Recruitment professionals seeking clearer lead information, organised workflows, and technology-supported administration." },
] as const;

export function AboutAudiences() {
  return (
    <section className="bg-white">
      <PageContainer className="py-16 sm:py-24">
        <SectionHeading eyebrow="Who We Support" heading="Designed for employers, professionals, and growing teams" />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {audiences.map((audience) => (
            <article key={audience.title} className="flex flex-col rounded-[var(--radius)] border border-border-grey p-6 shadow-sm sm:p-7">
              <span aria-hidden="true" className="grid size-11 place-items-center rounded-full bg-green font-heading font-extrabold text-white">{audience.marker}</span>
              <h3 className="mt-5 text-xl font-extrabold text-navy">{audience.title}</h3>
              <p className="mt-3 flex-1 leading-7 text-slate">{audience.text}</p>
              {"href" in audience ? <div className="mt-6"><ButtonLink href={audience.href} variant="outline" className="w-full sm:w-auto">{audience.action}</ButtonLink></div> : null}
            </article>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}

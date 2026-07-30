import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";

const features = [
  {
    heading: "Structured Information",
    text: "Consistent forms help employers and professionals provide relevant information in an organised format.",
  },
  {
    heading: "Server-Side Validation",
    text: "Submissions are checked before they are accepted for processing.",
  },
  {
    heading: "Workflow Automation",
    text: "Administrative routing and notifications can be organised through secure connected workflows.",
  },
  {
    heading: "Human Decision-Making",
    text: "Recruitment review, interviews, assessment, selection, and employment decisions remain human-led.",
  },
] as const;

export function ServiceProcess() {
  return (
    <section className="bg-navy text-white">
      <PageContainer className="py-16 sm:py-24">
        <div className="[&_h2]:text-white [&_p]:text-white/80">
          <SectionHeading
            eyebrow="Technology and Human Oversight"
            heading="Digital efficiency without removing human responsibility"
            supportingText="Talvanta Africa uses structured forms, server-side validation, workflow automation, and organised communication to reduce administrative friction. Technology supports the process, while people remain responsible for review, communication, assessment, and hiring decisions."
          />
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {features.map((feature, index) => (
            <article
              key={feature.heading}
              className="rounded-[var(--radius)] border border-white/20 bg-white/10 p-6 sm:p-7"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-gold font-heading text-sm font-extrabold text-navy">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-xl font-extrabold text-white">{feature.heading}</h3>
              <p className="mt-3 leading-7 text-white/80">{feature.text}</p>
            </article>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}

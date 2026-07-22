import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";

const benefits = [
  { title: "Human-Centred Recruitment", text: "Technology supports efficiency, but people remain responsible for recruitment judgement and decisions." },
  { title: "Structured Lead Management", text: "Employer and candidate information is organised to improve clarity, follow-up, and communication." },
  { title: "Employer-Focused Support", text: "Hiring requirements are collected carefully to help the recruitment team understand each organisation’s needs." },
  { title: "Candidate Support", text: "Job seekers receive clear guidance without promises of interviews, placement, or employment." },
  { title: "African Business Context", text: "The platform is designed around organisations and professionals operating across Nigeria and the wider African market." },
] as const;

export function WhyChooseUs() {
  return (
    <section className="bg-white">
      <PageContainer className="py-16 sm:py-24">
        <SectionHeading eyebrow="Why Talvanta Africa" heading="Professional recruitment supported by intelligent processes" />
        <div className="mt-10 grid gap-x-8 gap-y-5 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <article key={benefit.title} className={`rounded-[var(--radius)] border border-border-grey p-6 ${index === benefits.length - 1 ? "md:col-span-2 lg:col-span-1" : ""}`}>
              <div aria-hidden="true" className="mb-5 h-1 w-12 rounded-full bg-gold" />
              <h3 className="text-xl font-extrabold text-navy">{benefit.title}</h3>
              <p className="mt-3 leading-7 text-slate">{benefit.text}</p>
            </article>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}

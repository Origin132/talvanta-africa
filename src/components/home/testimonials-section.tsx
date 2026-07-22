import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";

type Testimonial = {
  quote: string;
  attribution: string;
  label: string;
};

const testimonials: readonly Testimonial[] = [
  {
    quote: "The hiring-request process was clear and helped organise the information required before recruitment support could begin.",
    attribution: "Sample Employer Representative",
    label: "Demonstration testimonial",
  },
  {
    quote: "The candidate journey explained what information was needed without making unrealistic promises about employment.",
    attribution: "Sample Job Seeker",
    label: "Demonstration testimonial",
  },
  {
    quote: "The platform presents recruitment technology as a support tool while keeping human judgement at the centre of the process.",
    attribution: "Sample HR Professional",
    label: "Demonstration testimonial",
  },
];

export function TestimonialsSection() {
  return (
    <section className="bg-soft-grey">
      <PageContainer className="py-16 sm:py-24">
        <SectionHeading eyebrow="Demonstration Feedback" heading="Examples of the experience Talvanta Africa aims to provide" />
        <aside className="mt-8 max-w-4xl rounded-[var(--radius)] border-l-4 border-gold bg-white p-5 shadow-sm sm:p-6" aria-label="Demonstration testimonial notice">
          <p className="font-heading font-extrabold text-navy">Demonstration content notice</p>
          <p className="mt-2 leading-7 text-slate">The statements below are sample testimonials created for the Talvanta Africa capstone demonstration. They are not genuine customer reviews.</p>
        </aside>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure key={testimonial.attribution} className="flex flex-col rounded-[var(--radius)] border border-border-grey bg-white p-6 shadow-sm sm:p-7">
              <span className="self-start rounded-full bg-soft-grey px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-green">{testimonial.label}</span>
              <blockquote className="mt-6 flex-1">
                <p className="font-heading text-lg font-bold leading-8 text-navy">“{testimonial.quote}”</p>
              </blockquote>
              <figcaption className="mt-6 border-t border-border-grey pt-4 text-sm font-semibold text-slate">{testimonial.attribution}</figcaption>
            </figure>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}

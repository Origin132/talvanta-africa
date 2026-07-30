import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";

const guidance = [
  {
    heading: "Use Accurate Information",
    text: "Provide information that truthfully reflects your experience, skills, education, and career interests.",
  },
  {
    heading: "Prepare Your Details",
    text: "Have your employment history, qualifications, core skills, and preferred work information available before you begin.",
  },
  {
    heading: "Protect Sensitive Information",
    text: "Do not submit passwords, bank details, national identity numbers, passport numbers, or unnecessary medical information.",
  },
  {
    heading: "Understand the Process",
    text: "Registration creates a professional profile. It is not an application to a specific vacancy unless the page clearly identifies a verified role and application route.",
  },
] as const;

export function BeforeYouRegister() {
  return (
    <section className="bg-white">
      <PageContainer className="py-16 sm:py-24">
        <SectionHeading heading="Before You Register" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {guidance.map((item, index) => (
            <article
              key={item.heading}
              className="rounded-[var(--radius)] border border-border-grey bg-white p-6 shadow-sm"
            >
              <span
                aria-hidden="true"
                className="grid size-11 place-items-center rounded-xl bg-green font-heading font-extrabold text-white"
              >
                {index + 1}
              </span>
              <h3 className="mt-5 text-xl font-extrabold leading-snug text-navy">
                {item.heading}
              </h3>
              <p className="mt-3 leading-7 text-slate">{item.text}</p>
            </article>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}

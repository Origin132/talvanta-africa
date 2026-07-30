import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";

const guidance = [
  {
    heading: "Describe a Genuine Hiring Need",
    text: "Provide information about an active or planned vacancy that your organisation is authorised to recruit for.",
  },
  {
    heading: "Prepare Role Details",
    text: "Have the job title, responsibilities, required skills, work location, employment type, and proposed recruitment timeline available.",
  },
  {
    heading: "Use Accurate Organisation Information",
    text: "Provide truthful and current information about the organisation and the person responsible for the enquiry.",
  },
  {
    heading: "Protect Sensitive Information",
    text: "Do not include passwords, bank details, identity-document numbers, confidential employee records, or unnecessary personal information.",
  },
] as const;

export function BeforeYouSubmit() {
  return (
    <section className="bg-white">
      <PageContainer className="py-16 sm:py-24">
        <SectionHeading heading="Before You Submit" />
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

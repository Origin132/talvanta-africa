import { PageContainer } from "@/components/layout/page-container";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

const pathways = [
  {
    marker: "E",
    heading: "Employers",
    text: "Tell us about your organisation, hiring needs, and the type of recruitment support you require.",
    actions: [{ label: "Request Recruitment Support", href: "/for-employers" }],
  },
  {
    marker: "P",
    heading: "Professionals",
    text: "Register your professional profile or learn how Talvanta Africa supports people exploring career opportunities.",
    actions: [
      { label: "Register Your Profile", href: "/candidate-registration" },
      { label: "Candidate Support", href: "/job-seekers" },
    ],
  },
  {
    marker: "G",
    heading: "General Enquiries",
    text: "Use the contact form for questions about Talvanta Africa, platform access, partnerships, privacy, or general support.",
    actions: [{ label: "Send an Enquiry", href: "#contact-form" }],
  },
] as const;

export function ContactPathways() {
  return (
    <section className="bg-white">
      <PageContainer className="py-16 sm:py-24">
        <SectionHeading eyebrow="Contact Pathways" heading="Choose the right starting point" />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {pathways.map((pathway) => (
            <article key={pathway.heading} className="flex flex-col rounded-[var(--radius)] border border-border-grey bg-white p-6 shadow-sm sm:p-7">
              <span aria-hidden="true" className="grid size-11 place-items-center rounded-xl bg-green font-heading font-extrabold text-white">{pathway.marker}</span>
              <h3 className="mt-5 text-2xl font-extrabold text-navy">{pathway.heading}</h3>
              <p className="mt-3 flex-1 leading-7 text-slate">{pathway.text}</p>
              <div className="mt-7 flex flex-col gap-3 sm:items-start">
                {pathway.actions.map((action, index) => (
                  <ButtonLink key={action.href} href={action.href} variant={index === 0 ? "primary" : "outline"} className="w-full sm:w-auto">
                    {action.label}
                  </ButtonLink>
                ))}
              </div>
            </article>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}

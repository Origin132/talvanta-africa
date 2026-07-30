import { PageContainer } from "@/components/layout/page-container";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

const pathways = [
  {
    heading: "I Represent an Organisation",
    text: "Use the employer pathway to describe a genuine hiring requirement and request recruitment-related support.",
    actions: [
      {
        label: "Request Recruitment Support",
        href: "/for-employers",
        variant: "primary" as const,
      },
    ],
  },
  {
    heading: "I Am Exploring Opportunities",
    text: "Use the professional pathway to register your profile, review verified opportunities, and understand the candidate process.",
    actions: [
      {
        label: "Register Your Profile",
        href: "/candidate-registration",
        variant: "primary" as const,
      },
      {
        label: "View Opportunities",
        href: "/jobs",
        variant: "outline" as const,
      },
    ],
  },
  {
    heading: "I Have a General Question",
    text: "Use the Contact page for platform questions, partnerships, privacy enquiries, or support that does not belong in an employer or candidate form.",
    actions: [
      {
        label: "Contact Talvanta Africa",
        href: "/contact",
        variant: "primary" as const,
      },
    ],
  },
] as const;

const limitations = [
  "Submitting an employer request does not guarantee candidate availability, vacancy publication, placement, recruitment fulfilment, or a particular hiring outcome.",
  "Registering a professional profile does not guarantee consideration, shortlisting, an interview, placement, or employment.",
  "Talvanta Africa does not make employment decisions on behalf of employers.",
  "Employers remain responsible for lawful recruitment practices, assessment, employment terms, and final hiring decisions.",
  "Service availability may depend on the nature of the request, verified opportunities, operational capacity, and human review.",
] as const;

export function ResponsibleTechnology() {
  return (
    <>
      <section className="bg-soft-grey">
        <PageContainer className="py-16 sm:py-24">
          <SectionHeading eyebrow="Choose Your Pathway" heading="Start in the right place" />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {pathways.map((pathway) => (
              <article
                key={pathway.heading}
                className="flex h-full flex-col rounded-[var(--radius)] border border-border-grey bg-white p-6 shadow-sm sm:p-7"
              >
                <h3 className="text-xl font-extrabold leading-snug text-navy">
                  {pathway.heading}
                </h3>
                <p className="mt-3 flex-1 leading-7 text-slate">{pathway.text}</p>
                <div className="mt-7 flex flex-col gap-3">
                  {pathway.actions.map((action) => (
                    <ButtonLink
                      key={action.href}
                      href={action.href}
                      variant={action.variant}
                      className="w-full"
                    >
                      {action.label}
                    </ButtonLink>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </PageContainer>
      </section>

      <section className="bg-white">
        <PageContainer className="py-16 sm:py-24">
          <div className="rounded-[var(--radius)] border border-border-grey bg-soft-grey p-6 shadow-sm sm:p-8 lg:p-10">
            <SectionHeading
              eyebrow="Important Information"
              heading="What our services do not guarantee"
            />
            <ul className="mt-8 grid gap-4 lg:grid-cols-2">
              {limitations.map((limitation) => (
                <li
                  key={limitation}
                  className="flex gap-3 rounded-[var(--radius)] bg-white p-5 leading-7 text-slate"
                >
                  <span aria-hidden="true" className="mt-2 size-2 shrink-0 rounded-full bg-gold" />
                  <span>{limitation}</span>
                </li>
              ))}
            </ul>
          </div>
        </PageContainer>
      </section>
    </>
  );
}

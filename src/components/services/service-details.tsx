import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";

const employerServices = [
  {
    heading: "Hiring Requirement Collection",
    text: "Employers provide structured information about the organisation, vacancy, responsibilities, candidate requirements, work arrangement, and recruitment timeline.",
  },
  {
    heading: "Requirement Review and Clarification",
    text: "Submitted information may be reviewed for completeness and clarity before an appropriate recruitment pathway is discussed or a verified opportunity is prepared for publication.",
  },
  {
    heading: "Vacancy Presentation",
    text: "Where appropriate, verified opportunities may be presented with clear role information, application guidance, and relevant status details.",
  },
  {
    heading: "Recruitment Communication Support",
    text: "Technology-enabled workflows help organise recruitment-related communication while employers remain responsible for interviews, assessment, selection, employment terms, and final hiring decisions.",
  },
] as const;

const professionalServices = [
  {
    heading: "Professional Profile Registration",
    text: "Professionals can submit accurate information about their experience, qualifications, skills, location, and career interests through a structured registration process.",
  },
  {
    heading: "Career Opportunity Access",
    text: "Verified opportunities are presented through the Jobs page when suitable roles and application pathways are available.",
  },
  {
    heading: "Profile Consideration",
    text: "Registered information may be reviewed when relevant recruitment needs arise, but registration does not guarantee consideration, shortlisting, an interview, placement, or employment.",
  },
  {
    heading: "Candidate Communication",
    text: "Talvanta Africa may use the contact details supplied by a professional when clarification, further information, or participation in a recruitment process is required.",
  },
] as const;

export function ServiceDetails() {
  return (
    <>
      <ServiceSection
        eyebrow="Employer Services"
        heading="Support for structured hiring requirements"
        supportingText="Talvanta Africa helps organisations communicate recruitment needs clearly and organise the early stages of the recruitment process through structured digital workflows."
        services={employerServices}
        background="soft"
      />
      <ServiceSection
        eyebrow="Professional Support"
        heading="A clearer way to present your professional information"
        supportingText="Talvanta Africa provides professionals with structured pathways to register their information, understand available opportunities, and receive recruitment-related communication where relevant."
        services={professionalServices}
        background="white"
      />
    </>
  );
}

type ServiceSectionProps = {
  eyebrow: string;
  heading: string;
  supportingText: string;
  services: readonly { heading: string; text: string }[];
  background: "soft" | "white";
};

function ServiceSection({
  eyebrow,
  heading,
  supportingText,
  services,
  background,
}: ServiceSectionProps) {
  return (
    <section className={background === "soft" ? "bg-soft-grey" : "bg-white"}>
      <PageContainer className="py-16 sm:py-24">
        <SectionHeading
          eyebrow={eyebrow}
          heading={heading}
          supportingText={supportingText}
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {services.map((service, index) => (
            <article
              key={service.heading}
              className="rounded-[var(--radius)] border border-border-grey bg-white p-6 shadow-sm sm:p-7"
            >
              <span
                aria-hidden="true"
                className="grid size-10 place-items-center rounded-xl bg-soft-grey font-heading text-sm font-extrabold text-green"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-xl font-extrabold leading-snug text-navy">
                {service.heading}
              </h3>
              <p className="mt-3 leading-7 text-slate">{service.text}</p>
            </article>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}

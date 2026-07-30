import { PageContainer } from "@/components/layout/page-container";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

const employerPoints = [
  "Structured hiring-requirement submission",
  "Vacancy and role-information review",
  "Recruitment-related communication",
  "Human-led candidate and hiring decisions",
] as const;

const professionalPoints = [
  "Professional profile registration",
  "Career-interest information",
  "Access to verified opportunities",
  "Human-led consideration and communication",
] as const;

export function ServicesGrid() {
  return (
    <section className="bg-white" aria-label="Who we support">
      <PageContainer className="py-16 sm:py-24">
        <SectionHeading
          eyebrow="Who We Support"
          heading="Clear pathways for both sides of recruitment"
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <PathwayCard
            heading="For Employers"
            text="Talvanta Africa helps organisations submit structured information about genuine hiring requirements so recruitment needs can be reviewed, clarified, and supported through an appropriate pathway."
            points={employerPoints}
            primaryAction={{ label: "Explore Employer Services", href: "/for-employers" }}
            secondaryAction={{
              label: "Submit a Recruitment Request",
              href: "/for-employers#employer-recruitment-form",
            }}
          />
          <PathwayCard
            heading="For Professionals"
            text="Professionals can register structured information about their experience, skills, and career interests for recruitment-related administration and possible consideration when suitable opportunities become available."
            points={professionalPoints}
            primaryAction={{ label: "Explore Candidate Support", href: "/job-seekers" }}
            secondaryAction={{ label: "Register Your Profile", href: "/candidate-registration" }}
          />
        </div>
      </PageContainer>
    </section>
  );
}

type PathwayCardProps = {
  heading: string;
  text: string;
  points: readonly string[];
  primaryAction: { label: string; href: string };
  secondaryAction: { label: string; href: string };
};

function PathwayCard({
  heading,
  text,
  points,
  primaryAction,
  secondaryAction,
}: PathwayCardProps) {
  return (
    <article className="flex h-full flex-col rounded-[var(--radius)] border border-border-grey bg-soft-grey p-6 shadow-sm sm:p-8">
      <h3 className="text-2xl font-extrabold text-navy sm:text-3xl">{heading}</h3>
      <p className="mt-4 leading-8 text-slate">{text}</p>
      <ul className="mt-6 grid gap-3">
        {points.map((point) => (
          <li key={point} className="flex gap-3 leading-7 text-slate">
            <span aria-hidden="true" className="mt-2 size-2 shrink-0 rounded-full bg-green" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <ButtonLink href={primaryAction.href}>{primaryAction.label}</ButtonLink>
        <ButtonLink href={secondaryAction.href} variant="outline">
          {secondaryAction.label}
        </ButtonLink>
      </div>
    </article>
  );
}

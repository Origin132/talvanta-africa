import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";

type ProcessStep = {
  title: string;
  text: string;
};

type ProcessGroup = {
  audience: string;
  marker: string;
  steps: readonly ProcessStep[];
};

const processGroups: readonly ProcessGroup[] = [
  {
    audience: "For Employers",
    marker: "E",
    steps: [
      { title: "Share Your Hiring Requirements", text: "Tell Talvanta Africa about the role, required experience, skills, location, employment type, and expected timeline." },
      { title: "Requirements Are Reviewed", text: "The recruitment team reviews the information and identifies the appropriate recruitment support." },
      { title: "Suitable Candidates Are Identified", text: "Technology and structured screening support the search while human judgement remains central." },
      { title: "Recruitment Support Continues", text: "The team supports communication, shortlisting, and agreed next steps with the employer." },
    ],
  },
  {
    audience: "For Job Seekers",
    marker: "J",
    steps: [
      { title: "Explore or Register", text: "Browse available opportunities or provide information about your skills, experience, and preferences." },
      { title: "Profile Information Is Organised", text: "Candidate information is structured to support appropriate opportunity matching." },
      { title: "Relevant Opportunities May Be Suggested", text: "Potential matches may be identified based on role requirements and candidate preferences." },
      { title: "Human Review Supports Progress", text: "Recruitment decisions, interviews, and appointments remain the responsibility of people." },
    ],
  },
];

export function RecruitmentProcess() {
  return (
    <section className="bg-soft-grey">
      <PageContainer className="py-16 sm:py-24">
        <SectionHeading eyebrow="How It Works" heading="Clear recruitment journeys for employers and job seekers" />
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {processGroups.map((group) => (
            <article key={group.audience} className="rounded-[var(--radius)] border border-border-grey bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-4">
                <span aria-hidden="true" className="grid size-11 place-items-center rounded-xl bg-green font-heading font-extrabold text-white">{group.marker}</span>
                <h3 className="text-2xl font-extrabold text-navy">{group.audience}</h3>
              </div>
              <ol className="mt-8 space-y-7">
                {group.steps.map((step, index) => (
                  <li key={step.title} className="relative grid grid-cols-[2.5rem_1fr] gap-4">
                    {index < group.steps.length - 1 ? <span aria-hidden="true" className="absolute bottom-[-1.75rem] left-[1.22rem] top-10 w-px bg-border-grey" /> : null}
                    <span className="relative grid size-10 place-items-center rounded-full border-2 border-green bg-white font-heading text-sm font-extrabold text-green">{index + 1}</span>
                    <div>
                      <h4 className="font-heading text-lg font-extrabold leading-snug text-navy">{step.title}</h4>
                      <p className="mt-2 leading-7 text-slate">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}

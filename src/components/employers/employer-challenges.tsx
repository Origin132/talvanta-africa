import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";

const challenges = [
  ["Unclear Role Requirements", "Hiring becomes more difficult when responsibilities, required skills, experience, location, and employment terms are not clearly defined."],
  ["Time-Consuming Candidate Review", "Reviewing applications and organising candidate information can require significant administrative effort."],
  ["Inconsistent Recruitment Communication", "Employers and candidates need timely, clear, and professional updates throughout the recruitment process."],
  ["Specialist Hiring Needs", "Senior, technical, and specialist vacancies may require a more focused recruitment approach."],
  ["Flexible Staffing Requirements", "Temporary, project-based, and contract roles may require different sourcing and communication processes."],
  ["Graduate and Early-Career Recruitment", "Internship, trainee, and graduate opportunities require clear expectations and suitable assessment processes."],
] as const;

export function EmployerChallenges() {
  return <section className="bg-white"><PageContainer className="py-16 sm:py-24"><SectionHeading eyebrow="Hiring Challenges" heading="Recruitment can become difficult when information and expectations are unclear" supportingText="Growing organisations may need to recruit quickly while still maintaining clear requirements, professional communication, and responsible decision-making." /><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{challenges.map(([title, text], index) => <article key={title} className="rounded-[var(--radius)] border border-border-grey p-6 shadow-sm"><span aria-hidden="true" className="font-heading text-sm font-extrabold text-green">{String(index + 1).padStart(2, "0")}</span><h3 className="mt-4 text-xl font-extrabold text-navy">{title}</h3><p className="mt-3 leading-7 text-slate">{text}</p></article>)}</div></PageContainer></section>;
}

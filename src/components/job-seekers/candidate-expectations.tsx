import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";

const expectations = [
  ["Accurate Information", "Candidates should provide truthful, current, and relevant professional information."],
  ["Relevant Applications", "Candidates should review role requirements carefully before expressing interest in an opportunity."],
  ["Professional Communication", "Candidates should communicate respectfully and respond to recruitment messages within a reasonable period where possible."],
  ["No Employment Guarantee", "Registration, matching guidance, or communication from Talvanta Africa does not guarantee an interview, placement, or employment."],
  ["Employer Decisions", "Employers remain responsible for their recruitment criteria, interviews, selection processes, and final employment decisions."],
  ["Data Responsibility", "Candidates should avoid submitting unnecessary sensitive information and should review future privacy notices before providing personal data."],
] as const;

export function CandidateExpectations() { return <section className="bg-white"><PageContainer className="py-16 sm:py-24"><SectionHeading eyebrow="What Candidates Should Know" heading="Clear expectations support a more professional experience" /><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{expectations.map(([title, text]) => <article key={title} className="rounded-[var(--radius)] border border-border-grey p-6 shadow-sm"><div aria-hidden="true" className="h-1 w-12 rounded-full bg-gold" /><h3 className="mt-5 text-xl font-extrabold text-navy">{title}</h3><p className="mt-3 leading-7 text-slate">{text}</p></article>)}</div></PageContainer></section>; }

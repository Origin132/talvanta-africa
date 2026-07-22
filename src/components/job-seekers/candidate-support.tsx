import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";

const items = [
  ["Opportunity Discovery", "Explore available roles and learn about the skills, experience, location, and employment terms associated with each opportunity."],
  ["Candidate Registration", "Provide structured information about your experience, qualifications, skills, location, and career preferences."],
  ["Profile Organisation", "Candidate information may be organised into a clearer format to support responsible opportunity review."],
  ["Potential Matching Guidance", "Technology may help identify roles that appear relevant, but potential matches still require human review."],
  ["Recruitment Communication", "Candidates may receive information about relevant next steps when an appropriate opportunity and recruitment process are available."],
  ["Human Support", "Candidates can request clarification or human assistance where additional guidance is needed."],
] as const;

export function CandidateSupport() { return <section className="bg-white"><PageContainer className="py-16 sm:py-24"><SectionHeading eyebrow="Candidate Support" heading="Practical support throughout the opportunity journey" /><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map(([title, text], index) => <article key={title} className="rounded-[var(--radius)] border border-border-grey p-6 shadow-sm"><span aria-hidden="true" className="font-heading text-sm font-extrabold text-green">{String(index + 1).padStart(2, "0")}</span><h3 className="mt-4 text-xl font-extrabold text-navy">{title}</h3><p className="mt-3 leading-7 text-slate">{text}</p></article>)}</div></PageContainer></section>; }

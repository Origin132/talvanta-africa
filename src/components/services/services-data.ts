export type Service = {
  id: string;
  title: string;
  summary: string;
  inclusions: readonly string[];
  action: string;
  href: string;
};

export const services: readonly Service[] = [
  {
    id: "permanent-recruitment",
    title: "Permanent Recruitment",
    summary: "Support for organisations seeking qualified professionals for long-term roles.",
    inclusions: ["Clarifying role requirements", "Organising vacancy information", "Supporting candidate sourcing", "Reviewing potential matches", "Supporting shortlisting and communication", "Maintaining human oversight throughout the process"],
    action: "Discuss a Permanent Role",
    href: "/hire-talent",
  },
  {
    id: "temporary-contract-staffing",
    title: "Temporary and Contract Staffing",
    summary: "Flexible recruitment support for temporary assignments, project work, and contract positions.",
    inclusions: ["Short-term staffing needs", "Project-based recruitment", "Contract role support", "Availability and location considerations", "Structured candidate information", "Clear communication of assignment expectations"],
    action: "Submit a Staffing Requirement",
    href: "/hire-talent",
  },
  {
    id: "executive-search",
    title: "Executive Search",
    summary: "Focused recruitment support for senior, leadership, and specialist responsibilities.",
    inclusions: ["Detailed role briefing", "Leadership and specialist requirements", "Structured search support", "Confidential and professional communication", "Candidate information review", "Human-led assessment and selection"],
    action: "Discuss an Executive Requirement",
    href: "/contact",
  },
  {
    id: "graduate-recruitment",
    title: "Graduate Recruitment",
    summary: "Structured support for internships, graduate schemes, trainee roles, and early-career opportunities.",
    inclusions: ["Graduate and internship role planning", "Entry-level requirement clarification", "Candidate registration support", "Early-career skills review", "Organised application information", "Human-led interview and selection decisions"],
    action: "Plan a Graduate Recruitment Campaign",
    href: "/hire-talent",
  },
  {
    id: "candidate-screening",
    title: "Candidate Screening",
    summary: "Organised review of candidate information against clearly defined role requirements.",
    inclusions: ["Reviewing submitted candidate information", "Comparing skills and experience with stated requirements", "Identifying missing information", "Preparing structured candidate summaries", "Supporting human shortlisting", "Avoiding automatic rejection decisions"],
    action: "Explore Screening Support",
    href: "/contact",
  },
  {
    id: "hr-advisory",
    title: "HR Advisory",
    summary: "Practical support for improving recruitment planning and people-related processes.",
    inclusions: ["Recruitment-process planning", "Job-description structure", "Candidate communication", "Interview-process guidance", "Hiring-workflow organisation", "Responsible use of recruitment technology"],
    action: "Discuss Your HR Needs",
    href: "/contact",
  },
];

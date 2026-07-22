import { FAQSection, type FAQ } from "@/components/audiences/faq-section";

const faqs: readonly FAQ[] = [
  { question: "What types of roles can Talvanta Africa support?", answer: "Talvanta Africa is designed to support permanent, temporary, contract, graduate, executive, specialist, and professional recruitment requirements. The appropriate approach depends on the role and information provided." },
  { question: "Does submitting a hiring request create a contract?", answer: "No. A submitted enquiry begins a review and follow-up process. Scope, responsibilities, terms, fees, and any formal service agreement must be confirmed separately." },
  { question: "Does Talvanta Africa guarantee that candidates will be available?", answer: "No. Candidate availability depends on the role, location, requirements, timing, and labour-market conditions. Talvanta Africa does not guarantee candidate supply or successful placement." },
  { question: "Does artificial intelligence make hiring decisions?", answer: "No. AI may support information organisation, summaries, and possible matching guidance. Employers and recruitment professionals remain responsible for recruitment decisions." },
  { question: "Can Talvanta Africa support confidential recruitment?", answer: "Employers may explain that a requirement is sensitive during the enquiry process. The handling arrangements and scope should then be discussed and agreed before recruitment activity begins." },
  { question: "Can Talvanta Africa recruit across Africa?", answer: "The platform is designed to support employers across Nigeria and the wider African market. Actual support depends on the role, location, requirements, and agreed recruitment scope." },
];

export function EmployerFaqs() { return <FAQSection eyebrow="Employer FAQs" heading="Common questions about recruitment support" items={faqs} />; }

import { FAQSection, type FAQ } from "@/components/audiences/faq-section";

const faqs: readonly FAQ[] = [
  { question: "Does registering guarantee that I will find a job?", answer: "No. Registration allows Talvanta Africa to organise your professional information and consider it in relation to relevant opportunities. It does not guarantee interviews, placement, or employment." },
  { question: "Does registration count as applying for every available job?", answer: "No. Candidate registration creates a professional profile or expression of interest. Specific vacancies may require a separate application or confirmation of interest." },
  { question: "Will every registered candidate be contacted?", answer: "Not necessarily. Communication depends on available opportunities, candidate relevance, employer requirements, and recruitment activity." },
  { question: "Can artificial intelligence reject my application?", answer: "Talvanta Africa does not intend Talia or another AI tool to make final candidate-rejection or hiring decisions. Technology may support information organisation and matching guidance, while recruitment decisions remain human-led." },
  { question: "Should I pay to apply for a job?", answer: "The website must not request candidate payment merely to submit an application or register professional information. Candidates should be cautious about any communication requesting unofficial recruitment payments." },
  { question: "Can I register without seeing a suitable vacancy?", answer: "The future candidate-registration process may allow professionals to express interest and provide career information even when a suitable vacancy is not currently displayed. Registration still does not guarantee future contact." },
  { question: "Can Talvanta Africa help me rewrite my CV?", answer: "The current platform scope focuses on recruitment guidance, registration, and opportunity support. Do not present CV-writing as an available service unless it is added and approved in a future sprint." },
];

export function CandidateFaqs() { return <FAQSection eyebrow="Job Seeker FAQs" heading="Common questions about opportunities and registration" items={faqs} />; }

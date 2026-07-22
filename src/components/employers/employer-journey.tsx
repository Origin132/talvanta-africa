import { ProcessSteps, type ProcessStep } from "@/components/audiences/process-steps";

const steps: readonly ProcessStep[] = [
  { title: "Share Your Hiring Requirement", text: "Provide information about the organisation, role, responsibilities, required skills, experience, location, employment type, and expected timeline." },
  { title: "Requirement Review", text: "The Talvanta Africa recruitment team reviews the information and identifies any details requiring clarification." },
  { title: "Recruitment Approach Is Discussed", text: "The appropriate service, process, responsibilities, and next steps are discussed before recruitment activity proceeds." },
  { title: "Potential Candidates Are Reviewed", text: "Technology may help organise information and identify possible matches, while professional human judgement remains central." },
  { title: "Communication and Selection Continue", text: "Shortlisting, interviews, feedback, and final hiring decisions remain human-led processes involving the employer and recruitment professionals." },
];

export function EmployerJourney() { return <ProcessSteps eyebrow="How It Works" heading="A clear path from hiring need to recruitment follow-up" steps={steps} note="Submitting an enquiry does not automatically create a service agreement or guarantee that suitable candidates will be available." />; }

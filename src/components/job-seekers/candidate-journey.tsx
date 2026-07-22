import { ProcessSteps, type ProcessStep } from "@/components/audiences/process-steps";

const steps: readonly ProcessStep[] = [
  { title: "Explore Opportunities", text: "Review available roles and consider whether the responsibilities, requirements, location, and employment terms are suitable." },
  { title: "Register Your Information", text: "Provide relevant professional information, including experience, skills, qualifications, location, and career preferences." },
  { title: "Information Is Organised", text: "Talvanta Africa may structure submitted information to support opportunity review and recruitment administration." },
  { title: "Potential Relevance May Be Reviewed", text: "Technology and recruitment professionals may assess whether your information appears relevant to an available opportunity." },
  { title: "Recruitment Next Steps Remain Human-Led", text: "Applications, shortlisting, interviews, feedback, selection, and employment decisions remain the responsibility of people." },
];

export function CandidateJourney() { return <ProcessSteps eyebrow="How It Works" heading="A clear candidate journey without unrealistic promises" steps={steps} note="Registering with Talvanta Africa does not guarantee that a suitable vacancy will be available or that an employer will invite you to interview." />; }

import { ProcessSteps, type ProcessStep } from "@/components/audiences/process-steps";

const steps: readonly ProcessStep[] = [
  {
    title: "Profile Submission",
    text: "You provide accurate professional information through the candidate-registration form.",
  },
  {
    title: "Submission Confirmation",
    text: "The platform confirms that your profile has been received and may provide a submission reference for your records.",
  },
  {
    title: "Profile Administration",
    text: "Your information may be reviewed for completeness and maintained for recruitment-related administration.",
  },
  {
    title: "Relevant Opportunity Consideration",
    text: "Your information may be considered when a suitable and verified recruitment requirement becomes available.",
  },
  {
    title: "Direct Communication",
    text: "Talvanta Africa may contact you if clarification, additional information, or participation in a recruitment process is required.",
  },
];

export function CandidateJourney() {
  return (
    <ProcessSteps
      eyebrow="Candidate Journey"
      heading="What happens after you register"
      steps={steps}
      note="The candidate journey depends on the information submitted, verified opportunities, employer requirements, and human review."
    />
  );
}

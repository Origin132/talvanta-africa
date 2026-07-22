import { ChecklistSection } from "@/components/audiences/checklist-section";

const items = ["Full name", "Email address", "Telephone number", "Current location", "Preferred work location", "Current or most recent job title", "Employment history", "Education", "Professional qualifications", "Key skills", "Industry experience", "Preferred employment type", "Workplace preference", "Salary expectations, where appropriate", "Availability", "Career interests", "Curriculum vitae", "Relevant portfolio or professional profile, where applicable"] as const;

export function CandidatePreparation() { return <ChecklistSection eyebrow="Before You Register" heading="Information that can help organise your professional profile" items={items} privacyNote="Candidates should submit only accurate and relevant professional information. Sensitive personal data should not be included unless it is genuinely required and collected through an appropriate process." />; }

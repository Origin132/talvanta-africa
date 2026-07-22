import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/pages/placeholder-page";

export const metadata: Metadata = { title: "For Employers" };

export default function EmployersPage() {
  return <PlaceholderPage title="Recruitment support for employers" description="Talvanta Africa plans to help growing organisations connect with qualified professionals through efficient, human-centred recruitment solutions." futureContent="Employer service details and consent-based recruitment enquiry journeys will be developed after their approved requirements are available." primaryAction={{ label: "Hire Talent", href: "/hire-talent" }} secondaryAction={{ label: "View Services", href: "/services" }} />;
}

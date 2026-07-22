import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/pages/placeholder-page";

export const metadata: Metadata = { title: "Hire Talent" };

export default function HireTalentPage() {
  return <PlaceholderPage title="Find the right talent for your organisation" description="Talvanta Africa is preparing a recruitment-support journey for growing organisations seeking qualified professionals." futureContent="The employer enquiry form, validation, consent record, and secure automation handoff will be implemented in a future sprint." primaryAction={{ label: "View Services", href: "/services" }} />;
}

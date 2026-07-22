import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/pages/placeholder-page";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return <PlaceholderPage title="Contact Talvanta Africa" description="A consent-based contact journey is planned for organisations, professionals, and general enquiries." futureContent="No contact details or working contact form are published during Sprint 1. The approved contact experience will be added later." />;
}

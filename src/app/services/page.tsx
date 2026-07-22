import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/pages/placeholder-page";

export const metadata: Metadata = { title: "Services" };

export default function ServicesPage() {
  return <PlaceholderPage title="Recruitment and talent solutions" description="Talvanta Africa is preparing human-centred recruitment support for growing organisations and qualified professionals." futureContent="Detailed service descriptions and engagement journeys will be added in a later sprint using approved website content." primaryAction={{ label: "For Employers", href: "/employers" }} />;
}

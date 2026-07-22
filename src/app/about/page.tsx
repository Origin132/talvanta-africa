import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/pages/placeholder-page";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return <PlaceholderPage title="About Talvanta Africa" description="Talvanta Africa is an AI-powered HR recruitment and talent-solutions company connecting qualified professionals with growing businesses across Nigeria and Africa." futureContent="The approved company profile, values, and detailed story will be added after the source planning documents are imported and reviewed." />;
}

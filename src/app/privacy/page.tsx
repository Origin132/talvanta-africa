import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/pages/placeholder-page";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return <PlaceholderPage title="Privacy" description="Talvanta Africa is committed to handling personal information carefully and only for clear, consented purposes." futureContent="An approved privacy notice has not yet been imported. This placeholder is not a substitute for the final reviewed policy." />;
}

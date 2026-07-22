import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/pages/placeholder-page";

export const metadata: Metadata = { title: "For Job Seekers" };

export default function JobSeekersPage() {
  return <PlaceholderPage title="Support for job seekers" description="Talvanta Africa is preparing a clear and inclusive experience for professionals exploring career opportunities." futureContent="Career guidance, job discovery, and application journeys will be developed in later sprints. Employment or placement is never guaranteed." primaryAction={{ label: "Explore Jobs", href: "/jobs" }} />;
}

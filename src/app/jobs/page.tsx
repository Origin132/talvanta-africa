import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/pages/placeholder-page";

export const metadata: Metadata = { title: "Jobs" };

export default function JobsPage() {
  return <PlaceholderPage title="Explore career opportunities" description="The Talvanta Africa jobs experience will help job seekers explore suitable career opportunities when approved job data and workflows are ready." futureContent="Job listings, search, filters, individual job pages, and applications are outside Sprint 1 and are not yet available." primaryAction={{ label: "For Job Seekers", href: "/job-seekers" }} />;
}

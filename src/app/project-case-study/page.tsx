import type { Metadata } from "next";
import { CaseStudyContent } from "@/components/case-study/case-study-content";
import { createPageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Talvanta Africa Project Case Study | Full-Stack Recruitment Platform",
  description:
    "Explore the design, development, architecture, automation workflows, responsible technology approach, and deployment of the Talvanta Africa recruitment platform.",
  path: "/project-case-study",
});

export default function ProjectCaseStudyPage() {
  return <CaseStudyContent />;
}

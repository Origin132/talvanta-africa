import type { Metadata } from "next";
import { JobsBrowser } from "@/components/jobs/jobs-browser";
import { JobsEmptyState } from "@/components/jobs/jobs-empty-state";
import { OpportunitiesProcess } from "@/components/jobs/opportunities-process";
import { PageHero } from "@/components/ui/page-hero";
import { getVerifiedJobs } from "@/lib/jobs";
import { createPageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Career Opportunities | Talvanta Africa",
  description: "Explore verified career opportunities through Talvanta Africa or register your professional profile for possible consideration when suitable roles become available.",
  path: "/jobs",
});

export default function JobsPage() {
  const verifiedJobs = getVerifiedJobs();

  return (
    <>
      <PageHero
        eyebrow="Career Opportunities"
        title="Find your next opportunity"
        supportingText="Explore verified career opportunities published through Talvanta Africa, or register your professional profile for possible consideration when suitable roles become available."
        primaryAction={{ label: "Register Your Profile", href: "/candidate-registration" }}
        secondaryAction={{ label: "Candidate Support", href: "/job-seekers" }}
        variation="dark"
      />
      {verifiedJobs.length === 0 ? <JobsEmptyState /> : <JobsBrowser jobs={verifiedJobs} />}
      <OpportunitiesProcess />
    </>
  );
}

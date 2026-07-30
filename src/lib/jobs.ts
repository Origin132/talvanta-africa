export type JobStatus = "open" | "closing-soon" | "closed";

export type EmploymentType =
  | "Permanent"
  | "Temporary"
  | "Contract"
  | "Internship"
  | "Graduate";

export type WorkplaceType = "On-site" | "Hybrid" | "Remote";

export interface Job {
  id: string;
  slug: string;
  title: string;
  organisationDisplayName: string;
  location: string;
  workplaceType: WorkplaceType;
  employmentType: EmploymentType;
  industry: string;
  salary?: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  closingDate?: string;
  publishedAt: string;
  status: JobStatus;
  verified: boolean;
}

export const jobs: Job[] = [];

export function getVerifiedJobs(): Job[] {
  return jobs.filter((job) => job.verified);
}

export function getVerifiedJobBySlug(slug: string): Job | undefined {
  return jobs.find((job) => job.slug === slug && job.verified);
}

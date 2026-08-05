import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site-url";
import { getPublicVacancySitemapEntries } from "@/lib/vacancies/public-vacancies";

const routes = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" },
  { path: "/jobs", priority: 0.5, changeFrequency: "weekly" },
  { path: "/for-employers", priority: 0.8, changeFrequency: "monthly" },
  { path: "/job-seekers", priority: 0.8, changeFrequency: "monthly" },
  { path: "/candidate-registration", priority: 0.8, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
  { path: "/faqs", priority: 0.6, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  { path: "/project-case-study", priority: 0.4, changeFrequency: "monthly" },
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const vacancies = await getPublicVacancySitemapEntries();
  return [...routes.map(({ path, priority, changeFrequency }) => ({
    url: absoluteUrl(path),
    priority,
    changeFrequency,
  })), ...vacancies.map((vacancy) => ({ url: absoluteUrl(`/jobs/${vacancy.slug}`), lastModified: vacancy.updated_at ?? undefined, changeFrequency: "daily" as const, priority: 0.6 }))];
}

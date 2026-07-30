import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { ButtonLink } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { getVerifiedJobBySlug, type JobStatus } from "@/lib/jobs";
import { createPageMetadata } from "@/lib/seo-metadata";

const statusLabels: Record<JobStatus, string> = {
  open: "Open",
  "closing-soon": "Closing soon",
  closed: "Closed",
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-NG", { dateStyle: "long", timeZone: "UTC" }).format(new Date(value));
}

export async function generateMetadata(props: PageProps<"/jobs/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const job = getVerifiedJobBySlug(slug);

  if (!job) {
    return createPageMetadata({
      title: "Opportunity Not Found",
      description: "The requested Talvanta Africa career opportunity could not be found.",
      path: `/jobs/${slug}`,
    });
  }

  return createPageMetadata({
    title: `${job.title} | Talvanta Africa`,
    description: job.summary,
    path: `/jobs/${job.slug}`,
  });
}

export default async function JobDetailsPage(props: PageProps<"/jobs/[slug]">) {
  const { slug } = await props.params;
  const job = getVerifiedJobBySlug(slug);

  if (!job) {
    notFound();
  }

  const isClosed = job.status === "closed";

  return (
    <>
      <PageHero
        eyebrow={`Career Opportunity · Status: ${statusLabels[job.status]}`}
        title={job.title}
        supportingText={job.summary}
        primaryAction={isClosed ? undefined : { label: "Apply or Register Interest", href: "/candidate-registration" }}
        secondaryAction={{ label: "View All Opportunities", href: "/jobs" }}
        variation="dark"
      />
      <section className="bg-white">
        <PageContainer className="py-16 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
            <aside>
              <h2 className="text-2xl font-extrabold text-navy">Opportunity details</h2>
              <dl className="mt-6 space-y-5 rounded-[var(--radius)] border border-border-grey bg-soft-grey p-6">
                <Detail label="Organisation" value={job.organisationDisplayName} />
                <Detail label="Location" value={job.location} />
                <Detail label="Employment type" value={job.employmentType} />
                <Detail label="Workplace type" value={job.workplaceType} />
                <Detail label="Industry" value={job.industry} />
                {job.salary ? <Detail label="Salary" value={job.salary} /> : null}
                <Detail label="Published" value={formatDate(job.publishedAt)} />
                {job.closingDate ? <Detail label="Closing date" value={formatDate(job.closingDate)} /> : null}
                <Detail label="Status" value={statusLabels[job.status]} />
              </dl>
            </aside>
            <div className="space-y-10">
              <JobList heading="Responsibilities" items={job.responsibilities} />
              <JobList heading="Requirements" items={job.requirements} />
              <div className="rounded-[var(--radius)] border-l-4 border-gold bg-soft-grey p-6">
                <h2 className="text-xl font-extrabold text-navy">
                  {isClosed ? "This opportunity is closed" : "Register your interest"}
                </h2>
                <p className="mt-3 leading-7 text-slate">
                  Registering your profile does not guarantee consideration, shortlisting, an interview, placement, or employment.
                </p>
                {!isClosed ? <div className="mt-6"><ButtonLink href="/candidate-registration">Apply or Register Interest</ButtonLink></div> : null}
              </div>
            </div>
          </div>
        </PageContainer>
      </section>
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div><dt className="font-bold text-navy">{label}</dt><dd className="mt-1 text-slate">{value}</dd></div>;
}

function JobList({ heading, items }: { heading: string; items: string[] }) {
  return (
    <section>
      <h2 className="text-2xl font-extrabold text-navy">{heading}</h2>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 leading-7 text-slate">
            <span aria-hidden="true" className="mt-2 size-2 shrink-0 rounded-full bg-green" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

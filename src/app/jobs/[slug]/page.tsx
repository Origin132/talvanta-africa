import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { ButtonLink } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { getApplicationViewer } from "@/lib/applications/application-viewer";
import { getPublicVacancy } from "@/lib/jobs";
import { createPageMetadata } from "@/lib/seo-metadata";
import { vacancyStatusLabels } from "@/lib/vacancies/vacancy-status";

const date = (value: string | null) => value
  ? new Intl.DateTimeFormat("en-NG", { dateStyle: "long", timeZone: "Africa/Lagos" }).format(new Date(value))
  : "Not available";
const show = (value: string | number | null) => value === null || value === "" ? "Not provided" : String(value);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const vacancy = await getPublicVacancy(slug);
  if (!vacancy) return { title: "Opportunity Not Found", robots: { index: false, follow: false } };
  return createPageMetadata({
    title: `${vacancy.job_title} | Talvanta Africa`,
    description: `${vacancy.job_title} with ${vacancy.organisation_name} in ${vacancy.job_location}. ${vacancy.employment_type}.`,
    path: `/jobs/${vacancy.slug}`,
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [vacancy, viewer] = await Promise.all([getPublicVacancy(slug), getApplicationViewer()]);
  if (!vacancy) notFound();

  const applyPath = `/jobs/${vacancy.slug}/apply`;
  const primaryAction = vacancy.applications_open
    ? viewer === "candidate"
      ? { label: "Apply for This Role", href: applyPath }
      : viewer === "anonymous"
        ? { label: "Sign In to Apply", href: `/sign-in?next=${encodeURIComponent(applyPath)}` }
        : undefined
    : undefined;

  return (
    <>
      <PageHero eyebrow={`Career Opportunity · Status: ${vacancyStatusLabels[vacancy.status]}`} title={vacancy.job_title} supportingText={vacancy.role_summary} primaryAction={primaryAction} secondaryAction={{ label: "View All Opportunities", href: "/jobs" }} variation="dark" />
      <section className="bg-white">
        <PageContainer className="py-16 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
            <aside>
              <h2 className="text-2xl font-extrabold text-navy">Opportunity details</h2>
              <dl className="mt-6 space-y-5 rounded-[var(--radius)] border border-border-grey bg-soft-grey p-6">
                <Detail term="Organisation" value={vacancy.organisation_name} />
                <Detail term="Location" value={vacancy.job_location} />
                <Detail term="Employment type" value={vacancy.employment_type} />
                <Detail term="Workplace type" value={vacancy.workplace_type} />
                <Detail term="Positions" value={String(vacancy.number_of_positions)} />
                {vacancy.salary_range ? <Detail term="Salary range" value={vacancy.salary_range} /> : null}
                <Detail term="Published" value={date(vacancy.published_at)} />
                <Detail term="Closing date" value={date(vacancy.closes_at)} />
                <Detail term="Status" value={vacancyStatusLabels[vacancy.status]} />
                <Detail term="Applications" value={vacancy.applications_open ? "Open" : "Not open"} />
              </dl>
            </aside>
            <div className="space-y-10">
              <ItemList heading="Responsibilities" items={vacancy.responsibilities} />
              <ItemList heading="Required Skills" items={vacancy.required_skills} />
              <section>
                <h2 className="text-2xl font-extrabold text-navy">Requirements</h2>
                <dl className="mt-5 grid gap-5">
                  <Detail term="Experience" value={show(vacancy.required_experience)} />
                  <Detail term="Education" value={show(vacancy.education_requirements)} />
                </dl>
              </section>
              <section className="rounded-[var(--radius)] border-l-4 border-gold bg-soft-grey p-6">
                <h2 className="text-xl font-extrabold text-navy">Application</h2>
                <p className="mt-3 whitespace-pre-wrap leading-7 text-slate">{show(vacancy.application_instructions)}</p>
                {!vacancy.applications_open ? (
                  <p className="mt-3 font-bold text-navy">Applications Closed</p>
                ) : viewer === "candidate" ? (
                  <ButtonLink className="mt-5" href={applyPath}>Apply for This Role</ButtonLink>
                ) : viewer === "anonymous" ? (
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <ButtonLink href={`/sign-in?next=${encodeURIComponent(applyPath)}`}>Sign In to Apply</ButtonLink>
                    <ButtonLink href="/sign-up" variant="outline">Create Candidate Account</ButtonLink>
                  </div>
                ) : (
                  <p className="mt-3 text-slate">Applications require a candidate account.</p>
                )}
              </section>
            </div>
          </div>
        </PageContainer>
      </section>
    </>
  );
}

function Detail({ term, value }: { term: string; value: string }) {
  return <div><dt className="font-bold text-navy">{term}</dt><dd className="mt-1 whitespace-pre-wrap break-words text-slate">{value}</dd></div>;
}

function ItemList({ heading, items }: { heading: string; items: string[] | null }) {
  return (
    <section>
      <h2 className="text-2xl font-extrabold text-navy">{heading}</h2>
      {items?.length ? (
        <ul className="mt-5 space-y-3">{items.map((item) => <li key={item} className="flex gap-3 leading-7 text-slate"><span aria-hidden className="mt-2 size-2 shrink-0 rounded-full bg-green" /><span className="break-words">{item}</span></li>)}</ul>
      ) : <p className="mt-3 text-slate">Not provided</p>}
    </section>
  );
}

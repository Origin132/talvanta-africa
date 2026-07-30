import { PageContainer } from "@/components/layout/page-container";
import { ButtonLink } from "@/components/ui/button";

export function JobsEmptyState() {
  return (
    <section className="bg-white" aria-labelledby="jobs-empty-heading">
      <PageContainer className="py-16 sm:py-24">
        <div className="mx-auto max-w-4xl rounded-[calc(var(--radius)+0.5rem)] border border-border-grey bg-soft-grey p-6 text-center shadow-[var(--shadow-subtle)] sm:p-10 lg:p-12">
          <span aria-hidden="true" className="mx-auto grid size-14 place-items-center rounded-2xl bg-navy font-heading text-xl font-extrabold text-gold">TA</span>
          <h2 id="jobs-empty-heading" className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-navy sm:text-4xl">
            No verified vacancies are currently open
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate sm:text-lg">
            Talvanta Africa publishes opportunities only after the role and application pathway have been reviewed. You can register your professional profile for possible consideration when relevant opportunities become available.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row sm:gap-3">
            <ButtonLink href="/candidate-registration">Register Your Profile</ButtonLink>
            <ButtonLink href="/job-seekers" variant="outline">Learn About Candidate Support</ButtonLink>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}

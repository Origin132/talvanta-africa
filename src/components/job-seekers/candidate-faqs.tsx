import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";

const questions = [
  {
    question: "Does registration mean I have applied for a job?",
    answer: "No. Candidate registration creates a professional profile unless a verified vacancy and application pathway are specifically identified.",
  },
  {
    question: "Will I be contacted after registration?",
    answer: "Talvanta Africa may contact you when clarification, further information, or participation in a relevant recruitment process is required. Contact is not guaranteed.",
  },
  {
    question: "Can I register when no vacancies are open?",
    answer: "Yes. You may register your professional profile for recruitment-related administration and possible consideration when relevant opportunities become available.",
  },
  {
    question: "Does Talvanta Africa make hiring decisions?",
    answer: "No. Employers remain responsible for interviews, assessment, selection, employment terms, and final hiring decisions.",
  },
  {
    question: "Should I send sensitive personal information?",
    answer: "No. Submit only information relevant to recruitment and follow the guidance provided on the registration form and Privacy page.",
  },
  {
    question: "Where can I view current opportunities?",
    answer: "Verified opportunities are published on the Jobs page when available.",
    href: "/jobs",
  },
] as const;

export function CandidateFaqs() {
  return (
    <section className="bg-soft-grey">
      <PageContainer className="py-16 sm:py-24">
        <SectionHeading
          eyebrow="Common Questions"
          heading="Questions professionals often ask"
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {questions.map((item) => (
            <article
              key={item.question}
              className="rounded-[var(--radius)] border border-border-grey bg-white p-6 shadow-sm"
            >
              <h3 className="text-xl font-extrabold leading-snug text-navy">
                {item.question}
              </h3>
              <p className="mt-3 leading-7 text-slate">{item.answer}</p>
              {"href" in item ? (
                <Link
                  href={item.href}
                  className="mt-4 inline-flex min-h-11 items-center font-bold text-green underline underline-offset-4 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-gold"
                >
                  View Career Opportunities
                </Link>
              ) : null}
            </article>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}

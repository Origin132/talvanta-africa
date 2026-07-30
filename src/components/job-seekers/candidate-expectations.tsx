import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";

const privacyGuidance = [
  "Do not submit passwords.",
  "Do not submit bank details.",
  "Do not submit national identity numbers unless a secure and clearly explained lawful process specifically requires them.",
  "Do not submit passport numbers through a general registration form.",
  "Do not submit unnecessary medical or health information.",
  "Do not provide false qualifications, employment history, or professional claims.",
  "Keep your contact information current.",
] as const;

const limitations = [
  "Registration does not guarantee consideration for a particular role.",
  "Registration does not guarantee shortlisting.",
  "Registration does not guarantee an interview.",
  "Registration does not guarantee placement or employment.",
  "Talvanta Africa does not make final hiring decisions on behalf of employers.",
  "Employers remain responsible for interviews, assessment, employment terms, selection, and final hiring decisions.",
  "Communication depends on relevant recruitment needs, verified opportunities, and human review.",
] as const;

export function CandidateExpectations() {
  return (
    <>
      <section className="bg-soft-grey">
        <PageContainer className="py-16 sm:py-24">
          <SectionHeading
            eyebrow="Privacy and Responsible Registration"
            heading="Share only information relevant to recruitment"
            supportingText="Provide accurate career information while avoiding unnecessary sensitive personal data."
          />
          <div className="mt-10 rounded-[var(--radius)] border border-border-grey bg-white p-6 shadow-sm sm:p-8">
            <ul className="grid gap-4 sm:grid-cols-2">
              {privacyGuidance.map((item) => (
                <li key={item} className="flex gap-3 leading-7 text-slate">
                  <span aria-hidden="true" className="mt-2 size-2 shrink-0 rounded-full bg-green" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/privacy"
              className="mt-8 inline-flex min-h-11 items-center font-bold text-green underline underline-offset-4 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-gold"
            >
              Read Our Privacy Information
            </Link>
          </div>
        </PageContainer>
      </section>

      <section className="bg-white">
        <PageContainer className="py-16 sm:py-24">
          <div className="rounded-[var(--radius)] border border-border-grey bg-soft-grey p-6 shadow-sm sm:p-8 lg:p-10">
            <SectionHeading
              eyebrow="Important Information"
              heading="What registration does not guarantee"
            />
            <ul className="mt-8 grid gap-4 lg:grid-cols-2">
              {limitations.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 rounded-[var(--radius)] bg-white p-5 leading-7 text-slate"
                >
                  <span aria-hidden="true" className="mt-2 size-2 shrink-0 rounded-full bg-gold" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </PageContainer>
      </section>
    </>
  );
}

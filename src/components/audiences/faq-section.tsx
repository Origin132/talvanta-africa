import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";

export type FAQ = { question: string; answer: string };

type FAQSectionProps = { eyebrow: string; heading: string; items: readonly FAQ[] };

export function FAQSection({ eyebrow, heading, items }: FAQSectionProps) {
  return (
    <section className="bg-white">
      <PageContainer className="py-16 sm:py-24">
        <SectionHeading eyebrow={eyebrow} heading={heading} />
        <div className="mt-10 max-w-4xl space-y-3">
          {items.map((item) => (
            <details key={item.question} className="group rounded-[var(--radius)] border border-border-grey bg-white shadow-sm open:border-green/40 open:shadow-[var(--shadow-subtle)]">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-[var(--radius)] px-5 py-4 font-heading font-extrabold text-navy marker:hidden hover:bg-soft-grey sm:px-6">
                <span>{item.question}</span><span aria-hidden="true" className="text-xl text-green transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="border-t border-border-grey px-5 py-5 leading-7 text-slate sm:px-6"><p>{item.answer}</p></div>
            </details>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}

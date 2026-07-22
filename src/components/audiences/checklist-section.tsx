import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";

type ChecklistSectionProps = {
  eyebrow: string;
  heading: string;
  supportingText?: string;
  items: readonly string[];
  privacyNote: string;
};

export function ChecklistSection({ eyebrow, heading, supportingText, items, privacyNote }: ChecklistSectionProps) {
  return (
    <section className="bg-white">
      <PageContainer className="py-16 sm:py-24">
        <SectionHeading eyebrow={eyebrow} heading={heading} supportingText={supportingText} />
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <li key={item} className="flex min-h-16 items-center gap-3 rounded-[var(--radius)] border border-border-grey bg-soft-grey px-4 py-3 text-sm font-semibold text-navy">
              <span aria-hidden="true" className="grid size-6 shrink-0 place-items-center rounded-full bg-green text-xs font-extrabold text-white">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <aside className="mt-8 rounded-[var(--radius)] border-l-4 border-gold bg-soft-grey p-5 sm:p-6" aria-label="Privacy note">
          <p className="font-heading font-extrabold text-navy">Privacy reminder</p>
          <p className="mt-2 leading-7 text-slate">{privacyNote}</p>
        </aside>
      </PageContainer>
    </section>
  );
}

import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";

type ResponsibilityGroupsProps = {
  eyebrow: string;
  heading: string;
  paragraphs: readonly string[];
  supportHeading: string;
  supportItems: readonly string[];
  responsibilityHeading: string;
  responsibilityItems: readonly string[];
};

export function ResponsibilityGroups({ eyebrow, heading, paragraphs, supportHeading, supportItems, responsibilityHeading, responsibilityItems }: ResponsibilityGroupsProps) {
  const groups = [
    { heading: supportHeading, marker: "T", items: supportItems, dark: false },
    { heading: responsibilityHeading, marker: "H", items: responsibilityItems, dark: true },
  ] as const;
  return (
    <section className="bg-soft-grey">
      <PageContainer className="py-16 sm:py-24">
        <SectionHeading eyebrow={eyebrow} heading={heading} />
        <div className="mt-6 max-w-4xl space-y-4 text-lg leading-8 text-slate">{paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {groups.map((group) => (
            <article key={group.heading} className={`rounded-[var(--radius)] p-6 sm:p-8 ${group.dark ? "bg-navy text-white" : "border border-border-grey bg-white text-slate"}`}>
              <div className="flex items-center gap-4"><span aria-hidden="true" className={`grid size-11 shrink-0 place-items-center rounded-xl font-heading font-extrabold ${group.dark ? "bg-gold text-navy" : "bg-green text-white"}`}>{group.marker}</span><h3 className={`text-xl font-extrabold ${group.dark ? "text-white" : "text-navy"}`}>{group.heading}</h3></div>
              <ul className="mt-6 space-y-3">{group.items.map((item) => <li key={item} className={`flex gap-3 leading-7 ${group.dark ? "text-white/85" : "text-slate"}`}><span aria-hidden="true" className={`mt-2 size-2 shrink-0 rounded-full ${group.dark ? "bg-gold" : "bg-green"}`} /><span>{item}</span></li>)}</ul>
            </article>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}

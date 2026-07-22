import { PageContainer } from "@/components/layout/page-container";
import { PageHero, type ActionLink } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";

type PlaceholderPageProps = {
  title: string;
  description: string;
  futureContent: string;
  eyebrow?: string;
  primaryAction?: ActionLink;
  secondaryAction?: ActionLink;
};

export function PlaceholderPage({
  title,
  description,
  futureContent,
  eyebrow = "Sprint 1 placeholder",
  primaryAction,
  secondaryAction,
}: PlaceholderPageProps) {
  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        supportingText={description}
        primaryAction={primaryAction}
        secondaryAction={secondaryAction}
      />
      <section className="bg-white">
        <PageContainer className="py-14 sm:py-16">
          <SectionHeading
            eyebrow="Content status"
            heading="Detailed content is coming in a later sprint"
            supportingText={futureContent}
          />
        </PageContainer>
      </section>
    </>
  );
}

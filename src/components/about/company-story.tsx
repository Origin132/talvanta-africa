import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";

export function CompanyStory() {
  return (
    <section className="bg-white">
      <PageContainer className="py-16 sm:py-24">
        <SectionHeading heading="Why Talvanta Africa Exists" />
        <div className="mt-6 max-w-4xl space-y-4 text-lg leading-8 text-slate">
          <p>
            Recruitment can become difficult when communication, candidate information, and employer requirements are handled through disconnected processes. Talvanta Africa brings these activities into a more structured digital experience.
          </p>
          <p>
            The platform is designed to help employers communicate genuine hiring needs clearly and to help professionals present their information through an organised registration process. Technology supports administration and communication, while people remain responsible for review, shortlisting, interviews, and hiring decisions.
          </p>
        </div>
      </PageContainer>
    </section>
  );
}

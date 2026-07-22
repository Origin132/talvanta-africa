import { PageContainer } from "@/components/layout/page-container";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";

export default function Home() {
  return (
    <>
      <PageHero
        eyebrow="Talvanta Africa"
        title="Connecting exceptional talent with growing businesses."
        supportingText="Talvanta Africa is building an intelligent, efficient, and human-centred recruitment experience for organisations and professionals across Nigeria and Africa."
        primaryAction={{ label: "For Employers", href: "/employers" }}
        secondaryAction={{ label: "For Job Seekers", href: "/job-seekers" }}
        variation="dark"
      />
      <section className="bg-white">
        <PageContainer className="py-14 sm:py-20">
          <SectionHeading
            eyebrow="Website foundation"
            heading="Recruitment support designed around people"
            supportingText="This Sprint 1 foundation introduces Talvanta Africa’s shared design system and public page structure. Future sprints will add approved content and carefully governed recruitment experiences for employers and job seekers."
          />
          <aside className="mt-10 max-w-3xl rounded-[var(--radius)] border border-border-grey bg-soft-grey p-5 text-slate sm:p-6" aria-label="Development notice">
            <p className="font-heading font-extrabold text-navy">Sprint 1 demonstration notice</p>
            <p className="mt-2">
              The full Talvanta Africa homepage will be developed in Sprint 2 after the approved source content is available. Current routes are non-functional placeholders.
            </p>
          </aside>
        </PageContainer>
      </section>
    </>
  );
}

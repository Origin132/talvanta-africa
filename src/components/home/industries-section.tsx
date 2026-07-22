import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";

const industries = [
  "Technology and Digital",
  "Financial Services",
  "Professional Services",
  "Sales and Marketing",
  "Customer Service",
  "Education",
  "Healthcare",
  "Retail and E-commerce",
  "Administration",
  "Human Resources",
] as const;

export function IndustriesSection() {
  return (
    <section className="bg-navy text-white">
      <PageContainer className="py-16 sm:py-24">
        <div className="[&_h2]:text-white [&_p]:text-white/80">
          <SectionHeading eyebrow="Industries" heading="Supporting talent needs across growing sectors" supportingText="Talvanta Africa is designed to support recruitment needs across a range of professional and service-based industries." />
        </div>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {industries.map((industry) => (
            <li key={industry} className="flex min-h-20 items-center rounded-[var(--radius)] border border-white/20 bg-white/10 px-5 py-4 font-heading font-bold text-white">{industry}</li>
          ))}
        </ul>
      </PageContainer>
    </section>
  );
}

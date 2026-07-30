import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";

const businessInformation = [
  { label: "Service model", value: "Remote-first recruitment technology platform" },
  { label: "Service coverage", value: "Nigeria and wider African markets" },
  { label: "Business hours", value: "Monday to Friday, 9:00 a.m. to 5:00 p.m. West Africa Time" },
  { label: "Response information", value: "Enquiries are reviewed during business hours. Response times may vary depending on the nature of the request." },
] as const;

export function BusinessInformation() {
  return (
    <section className="bg-soft-grey">
      <PageContainer className="py-16 sm:py-24">
        <SectionHeading heading="Business Information" />
        <dl className="mt-10 grid gap-5 sm:grid-cols-2">
          {businessInformation.map((item) => (
            <div key={item.label} className="rounded-[var(--radius)] border border-border-grey bg-white p-6 shadow-sm">
              <dt className="font-heading text-sm font-extrabold uppercase tracking-wide text-green">{item.label}</dt>
              <dd className="mt-3 text-lg font-semibold leading-8 text-navy">{item.value}</dd>
            </div>
          ))}
        </dl>
      </PageContainer>
    </section>
  );
}
